const API_BASE_URL = "http://localhost:5000/api";
let selectedCategory = "all";
let selectedRegion = "all";
let searchQuery = "";
let isSearching = false;

// =============================================
// ✅ WISHLIST FUNCTIONS
// =============================================
function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist') || '[]');
}

function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function isInWishlist(title) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.title === title);
}

async function toggleWishlist(title, image, description) {
  let wishlist = getWishlist();
  const token = localStorage.getItem("token");
  const exists = wishlist.findIndex(item => item.title === title);
  
  if (exists > -1) {
    wishlist.splice(exists, 1);
  } else {
    wishlist.push({ title, image, description });
  }
  
  saveWishlist(wishlist);
  updateWishlistButtons();

  // Sync with backend if logged in
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/favorites`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ destinationId: title }) // Using title as ID for now
      });
    } catch (error) {
      console.warn("Backend wishlist sync failed:", error);
    }
  }
}

function updateWishlistButtons() {
  document.querySelectorAll('.wishlist-card-btn').forEach(btn => {
    const title = btn.getAttribute('data-title');
    if (isInWishlist(title)) {
      btn.classList.add('active');
      btn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '<i class="far fa-heart"></i>';
    }
  });
}

// =============================================
// ✅ ADD WISHLIST BUTTONS TO CARDS
// =============================================
function addWishlistButtonsToCards() {
  const cards = document.querySelectorAll(".place-card");
  
  cards.forEach(card => {
    const cardBody = card.querySelector('.card-body');
    if (!cardBody) return;
    
    const title = card.getAttribute('data-title') || card.querySelector('h5')?.innerText || '';
    const image = card.getAttribute('data-image') || card.querySelector('img')?.src || '';
    const description = card.querySelector('.card-text')?.innerText || '';
    
    // Check if button already exists
    if (cardBody.querySelector('.card-actions')) return;
    
    // Find existing button
    const existingBtn = cardBody.querySelector('.view-btn, .btn');
    
    // Create card actions container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'card-actions';
    
    // Create view button
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-sm btn-primary view-btn';
    viewBtn.textContent = 'View Info';
    
    // Create wishlist button
    const wishBtn = document.createElement('button');
    wishBtn.className = 'wishlist-card-btn';
    wishBtn.setAttribute('data-title', title);
    wishBtn.innerHTML = isInWishlist(title) ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    if (isInWishlist(title)) wishBtn.classList.add('active');
    
    wishBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(title, image, description);
    });
    
    actionsDiv.appendChild(viewBtn);
    actionsDiv.appendChild(wishBtn);
    
    // Remove old button
    if (existingBtn) existingBtn.remove();
    
    cardBody.appendChild(actionsDiv);
  });
}

// =============================================
// ✅ MAIN INITIALIZATION
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-chip, .filter-btn");
  const regionButtons = document.querySelectorAll(".region-chip, .region-btn");
  const cards = document.querySelectorAll(".place-card");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  // Add wishlist buttons
  addWishlistButtonsToCards();

  // Filter cards based on all criteria
  function filterCards() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;
    isSearching = searchTerm !== "" || selectedCategory !== "all" || selectedRegion !== "all";

    cards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const cardRegion = card.getAttribute("data-region");
      const cardTitle = card.querySelector("h5").innerText.toLowerCase();
      const cardText = card.querySelector(".card-text").innerText.toLowerCase();

      const matchCategory = selectedCategory === "all" || cardCategory === selectedCategory;
      const matchRegion = selectedRegion === "all" || cardRegion.toLowerCase() === selectedRegion.toLowerCase();
      const matchSearch = searchTerm === "" || cardTitle.includes(searchTerm) || cardText.includes(searchTerm);

      const shouldShow = matchCategory && matchRegion && matchSearch;

      if (shouldShow) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Show/hide no results message
    let noResultsMsg = document.getElementById("noResults");
    if (visibleCount === 0 && !noResultsMsg) {
      noResultsMsg = document.createElement("div");
      noResultsMsg.id = "noResults";
      noResultsMsg.className = "alert text-center mt-4";
      noResultsMsg.innerText = "No places found. Try different filters!";
      document.getElementById("places-list").parentElement.appendChild(noResultsMsg);
    } else if (visibleCount > 0 && noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  // Category buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      selectedCategory = button.getAttribute("data-filter");
      searchInput.value = "";
      searchQuery = "";

      filterCards();
    });
  });

  // Region buttons
  regionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const region = button.getAttribute("data-region").toLowerCase();
      selectedRegion = region;
      filterCards();
    });
  });

  // Search input with real-time filtering
  searchInput.addEventListener("input", () => {
    filterCards();
  });

  // Search button click
  searchButton.addEventListener("click", () => {
    filterCards();
  });

  // Enter key in search input
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      filterCards();
    }
  });

  // Modal handler for View Info buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-btn") || e.target.closest(".view-btn")) {
      const card = e.target.closest(".place-card");
      if (!card) return;
      
      // Get data from card attributes
      const title = card.getAttribute("data-title");
      const image = card.getAttribute("data-image");
      const howToReach = card.getAttribute("data-how-to-reach");
      const travelTime = card.getAttribute("data-travel-time");
      const activities = card.getAttribute("data-activities");
      const cost = card.getAttribute("data-cost");
      const duration = card.getAttribute("data-duration");
      const mapLink = card.getAttribute("data-map-link");
      const category = card.getAttribute("data-category");
      const region = card.getAttribute("data-region");

      // Populate modal with data
      document.getElementById("placeModalLabel").innerText = title;
      document.getElementById("placeImage").src = image;
      document.getElementById("placeDescription").innerText = card.querySelector(".card-text").innerText;
      document.getElementById("placeCategory").innerText = category.charAt(0).toUpperCase() + category.slice(1);
      document.getElementById("placeRegion").innerText = region;
      document.getElementById("placeHowToReach").innerText = howToReach;
      document.getElementById("placeTravelTime").innerText = travelTime;
      document.getElementById("placeActivities").innerText = activities;
      document.getElementById("placeDailyCost").innerText = cost;
      document.getElementById("placeDuration").innerText = duration;
      document.getElementById("placeMapLink").href = mapLink;

      // Show modal
      $("#placeModal").modal("show");
    }
  });

  // Initial load - show only featured cards
  cards.forEach((card) => {
    if (card.classList.contains("featured")) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
});
