// =============================================
const API_BASE_URL = "http://localhost:5000/api";
// ✅ WELCOME vs WELCOME BACK Logic
// =============================================
const username = localStorage.getItem("username");
const fullName = localStorage.getItem("fullName");
const welcomeType = localStorage.getItem("welcomeType");
const welcomeText = document.getElementById("welcome-text");

if (welcomeText) {
  const displayName = fullName || username || "User";
  
  if (welcomeType === "new") {
    // First time login after signup
    welcomeText.textContent = `Welcome, ${displayName}! 👋`;
  } else {
    // Returning user
    welcomeText.textContent = `Welcome back, ${displayName}! 👋`;
  }
}

// =============================================
// ✅ LOGOUT LOGIC
// =============================================
const logoutBtn = document.getElementById("logout-btn");
const navLogoutBtn = document.getElementById("nav-logout-btn");

function handleLogout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("welcomeType");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  alert("You have been logged out!");
  window.location.href = "index.html";
}

if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
if (navLogoutBtn) navLogoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleLogout();
});

// =============================================
// ✅ CAROUSEL / FEATURED DESTINATIONS DATA
// =============================================
const allPlaces = [
  { title: "Gateway of India", image: "images/gateway.jpg", description: "Iconic Mumbai monument with Arabian Sea views and colonial architecture" },
  { title: "Raigad Fort", image: "images/raigad.jpg", description: "Historic Maratha capital fort with ropeway, panoramic mountain views" },
  { title: "Kashid Beach", image: "images/kashid.jpg", description: "White sand beach perfect for swimming and water sports" },
  { title: "Mahabaleshwar", image: "images/mahabaleshwar.jpeg", description: "Hill station famous for strawberry farms and scenic viewpoints" },
  { title: "Ajanta Caves", image: "images/ajanta-caves.jpeg", description: "UNESCO World Heritage Site with ancient Buddhist rock-cut caves" },
  { title: "Ganpatipule Beach", image: "images/ganpati.png", description: "Sacred beach with 400-year-old Ganesh temple and red sand" },
  { title: "Lonavala", image: "images/lonavala.jpg", description: "Popular hill station near Pune with waterfalls and monsoon trails" },
  { title: "Khandala", image: "images/khandala.jpg", description: "Scenic hill station with Duke's Nose viewpoint and valley views" },
  { title: "Aurangabad", image: "images/bibi-ka-maqbara.jpeg", description: "Historic city with Bibi Ka Maqbara and gateway to Ellora Caves" },
  { title: "Kolhapur", image: "images/mahalaxmi-kolhapur.png", description: "Cultural hub known for Mahalaxmi Temple and Kolhapuri cuisine" },
];

// =============================================
// ✅ FEATURED CARDS
// =============================================
function loadRandomFeaturedCards() {
  const shuffled = [...allPlaces].sort(() => Math.random() - 0.5);
  const featured = shuffled.slice(0, 3);

  const container = document.getElementById('featured-cards-container');
  if (!container) return;
  
  container.innerHTML = '';
  featured.forEach(place => {
    const card = document.createElement('div');
    card.className = 'plan-card';
    card.innerHTML = `
      <img src="${place.image}" alt="${place.title}" onerror="this.src='images/default.jpg'">
      <div class="card-details">
        <h3>${place.title}</h3>
        <p>${place.description}</p>
        <a href="plantrip.html">
          <button class="plan-btn">Plan Now</button>
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

// =============================================
// ✅ WISHLIST FUNCTIONALITY
// =============================================
function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist') || '[]');
}

function saveWishlist(wishlist) {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function renderWishlist() {
  const container = document.getElementById('wishlist-container');
  const emptyMsg = document.getElementById('empty-wishlist');
  if (!container) return;

  const wishlist = getWishlist();
  
  // Clear all except empty message
  container.innerHTML = '';
  
  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-wishlist">
        <i class="fas fa-heart-circle-plus" style="font-size:3rem;color:rgba(255,107,0,0.3);margin-bottom:15px;display:block;"></i>
        <p>No destinations in your wishlist yet. Explore places and add them!</p>
        <a href="explore.html" style="color:#FF8C00;text-decoration:none;font-weight:700;">Browse Destinations →</a>
      </div>
    `;
    return;
  }

  wishlist.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'wishlist-card';
    card.innerHTML = `
      <button class="wishlist-remove-btn" onclick="removeFromWishlist(${index})">
        <i class="fas fa-times"></i>
      </button>
      <img src="${item.image}" alt="${item.title}" onerror="this.src='images/default.jpg'">
      <div class="card-details">
        <h3>${item.title}</h3>
        <p>${item.description || ''}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function removeFromWishlist(index) {
  const wishlist = getWishlist();
  wishlist.splice(index, 1);
  saveWishlist(wishlist);
  renderWishlist();
}

// Make it globally accessible
window.removeFromWishlist = removeFromWishlist;

// =============================================
// ✅ MONEY SPLIT FUNCTIONALITY
// =============================================
let splitMembers = [];

const addMemberBtn = document.getElementById('add-member-btn');
const memberNameInput = document.getElementById('member-name');
const splitTotalInput = document.getElementById('split-total');
const splitTypeSelect = document.getElementById('split-type');
const splitMembersList = document.getElementById('split-members-list');
const splitSummary = document.getElementById('split-summary');

function renderSplitMembers() {
  if (!splitMembersList) return;
  
  if (splitMembers.length === 0) {
    splitMembersList.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:15px;">Add members to split costs</p>';
    if (splitSummary) splitSummary.style.display = 'none';
    return;
  }

  const total = parseFloat(splitTotalInput?.value) || 0;
  const splitType = splitTypeSelect?.value || 'equal';
  const perPerson = splitMembers.length > 0 ? (total / splitMembers.length) : 0;

  let html = '';
  splitMembers.forEach((member, index) => {
    const share = splitType === 'equal' ? perPerson : (member.customAmount || 0);
    html += `
      <div class="split-member-item">
        <span class="member-name"><i class="fas fa-user-circle" style="margin-right:8px;color:#FF8C00;"></i>${member.name}</span>
        <span class="member-share">₹${Math.round(share).toLocaleString()}</span>
        <button class="remove-member" onclick="removeSplitMember(${index})">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  });
  splitMembersList.innerHTML = html;

  // Update summary
  if (splitSummary && total > 0 && splitMembers.length > 0) {
    splitSummary.style.display = 'block';
    document.getElementById('per-person-amount').textContent = `₹${Math.round(perPerson).toLocaleString()}`;
    document.getElementById('split-count-label').textContent = `${splitMembers.length} member${splitMembers.length > 1 ? 's' : ''} • Total: ₹${Math.round(total).toLocaleString()}`;
  } else {
    if (splitSummary) splitSummary.style.display = 'none';
  }
}

function removeSplitMember(index) {
  splitMembers.splice(index, 1);
  renderSplitMembers();
}

window.removeSplitMember = removeSplitMember;

if (addMemberBtn) {
  addMemberBtn.addEventListener('click', () => {
    const name = memberNameInput?.value.trim();
    if (!name) {
      alert('Please enter a member name');
      return;
    }
    
    // Check for duplicates
    if (splitMembers.some(m => m.name.toLowerCase() === name.toLowerCase())) {
      alert('This member is already added!');
      return;
    }
    
    splitMembers.push({ name, customAmount: 0 });
    if (memberNameInput) memberNameInput.value = '';
    renderSplitMembers();
  });
}

// Update split when total changes
if (splitTotalInput) {
  splitTotalInput.addEventListener('input', renderSplitMembers);
}

if (splitTypeSelect) {
  splitTypeSelect.addEventListener('change', renderSplitMembers);
}

// Enter key to add member
if (memberNameInput) {
  memberNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMemberBtn?.click();
    }
  });
}

// =============================================
// ✅ FETCH BACKEND DATA
// =============================================
async function syncWithBackend() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // 1. Fetch Profile/Favorites
    const profileRes = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (profileRes.ok) {
      const data = await profileRes.json();
      if (data.user) {
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        // Sync favorites if needed
      }
    }

    // 2. Fetch Trips
    const tripsRes = await fetch(`${API_BASE_URL}/trips`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (tripsRes.ok) {
      const backendTrips = await tripsRes.json();
      if (backendTrips.length > 0) {
        // Merge or replace local trips with backend trips
        localStorage.setItem('maharashtraTrips', JSON.stringify(backendTrips));
      }
    }
  } catch (error) {
    console.warn("Offline: Using cached localStorage data");
  }
}

// =============================================
// ✅ INITIALIZE ON PAGE LOAD
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
  await syncWithBackend();
  loadRandomFeaturedCards();
  renderWishlist();
  renderSplitMembers();
});
