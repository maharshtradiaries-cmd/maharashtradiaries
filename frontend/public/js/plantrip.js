// Professional Trip Planner JavaScript
const API_BASE_URL = "http://localhost:5000/api";
let selectedPlaces = [];
let tripData = {};

// Sample places data (comprehensive list)
const allPlaces = [
  // Hill Stations
  { id: 1, name: 'Lonavala', category: 'hills', region: 'pune', image: 'images/lonavala.jpg', cost: 1200, days: '2-3', desc: 'The jewel of Sahyadri, famous for Bhushi Dam and Tiger Point.' },
  { id: 2, name: 'Khandala', category: 'hills', region: 'pune', image: 'images/khandala.jpg', cost: 1000, days: '1-2', desc: 'Scenic mountain passes and deep valleys near Mumbai.' },
  { id: 3, name: 'Matheran', category: 'hills', region: 'raigad', image: 'images/matheran.jpg', cost: 1500, days: '2-3', desc: 'Automobile-free hill station with 38 viewpoints.' },
  { id: 4, name: 'Mahabaleshwar', category: 'hills', region: 'satara', image: 'images/mahabaleshwar.jpeg', cost: 1300, days: '2-3', desc: 'The strawberry capital with ancient temples and lakes.' },
  { id: 5, name: 'Panchgani', category: 'hills', region: 'satara', image: 'images/panchgani.jpg', cost: 1200, days: '2-3', desc: 'Famous for Table Land and Parsi Point views.' },
  { id: 51, name: 'Igatpuri', category: 'hills', region: 'nashik', image: 'images/igatpuri.jpg', cost: 1100, days: '2', desc: 'Vipassana International Academy and fog-covered peaks.' },
  { id: 52, name: 'Bhandardara', category: 'nature', region: 'ahmednagar', image: 'images/bhandardara.jpg', cost: 900, days: '2', desc: 'Home to Wilson Dam and Arthur Lake.' },
  
  // Beaches
  { id: 6, name: 'Alibaug Beach', category: 'beaches', region: 'konkan', image: 'images/alibaug.jpg', cost: 1500, days: '1-2', desc: 'Popular weekend getaway with ferry rides and water sports.' },
  { id: 7, name: 'Kashid Beach', category: 'beaches', region: 'konkan', image: 'images/kashid.jpg', cost: 1200, days: '2-3', desc: 'Half-moon shaped white sand beach.' },
  { id: 8, name: 'Murud Beach', category: 'beaches', region: 'konkan', image: 'images/murud.jpg', cost: 1000, days: '1-2', desc: 'Calm waters near the historic Janjira Fort.' },
  { id: 9, name: 'Ganpatipule Beach', category: 'beaches', region: 'konkan', image: 'images/ganpati.png', cost: 1100, days: '2-3', desc: 'Serene beach with a 400-year-old self-manifested Ganesha temple.' },
  { id: 10, name: 'Juhu Beach', category: 'beaches', region: 'mumbai', image: 'images/juhu.jpg', cost: 400, days: '1', desc: 'Mumbai\'s most famous beach known for its street food.' },
  { id: 91, name: 'Tarkarli Beach', category: 'beaches', region: 'konkan', image: 'images/tarkarli.jpg', cost: 1800, days: '3', desc: 'Crystal clear water, famous for scuba diving and snorkeling.' },
  
  // Temples
  { id: 11, name: 'Grishneshwar Temple', category: 'temples', region: 'aurangabad', image: 'images/grishneshwar.jpg', cost: 600, days: '1', desc: 'The 12th Jyotirlinga, built from red rocks.' },
  { id: 12, name: 'Shirdi Sai Baba Temple', category: 'temples', region: 'ahmednagar', image: 'images/shirdi.jpg', cost: 800, days: '1-2', desc: 'World-renowned spiritual center of Sai Baba.' },
  { id: 13, name: 'Siddhivinayak Temple', category: 'temples', region: 'mumbai', image: 'images/sidhhivinayak.jpg', cost: 500, days: '1', desc: 'Iconic Ganpati temple visited by millions.' },
  { id: 14, name: 'Trimbakeshwar Temple', category: 'temples', region: 'nashik', image: 'images/trimbakeshwar.jpg', cost: 800, days: '1-2', desc: 'One of the 12 Jyotirlingas, source of Godavari river.' },
  { id: 141, name: 'Mahalaxmi Temple', category: 'temples', region: 'kolhapur', image: 'images/mahalaxmi-kolhapur.png', cost: 700, days: '1', desc: 'Historic temple with exquisite Hemadpanthi style architecture.' },
  
  // Forts
  { id: 15, name: 'Daulatabad Fort', category: 'forts', region: 'aurangabad', image: 'images/daulatabad.webp', cost: 900, days: '1-2', desc: 'Unconquerable 12th-century fort on a conical hill.' },
  { id: 16, name: 'Panhala Fort', category: 'forts', region: 'kolhapur', image: 'images/panhala.jpeg', cost: 800, days: '1-2', desc: 'The largest fort in Deccan plateau.' },
  { id: 17, name: 'Rajgad Fort', category: 'forts', region: 'pune', image: 'images/rajgad.webp', cost: 1000, days: '2-3', desc: 'The first capital of Maratha Empire.' },
  { id: 18, name: 'Raigad Fort', category: 'forts', region: 'konkan', image: 'images/raigad.jpg', cost: 1000, days: '2-3', desc: 'The Gibraltar of the East, coronation site of Shivaji Maharaj.' },
  { id: 181, name: 'Pratapgad Fort', category: 'forts', region: 'satara', image: 'images/pratapgad.jpg', cost: 900, days: '1-2', desc: 'Site of the historic battle between Shivaji and Afzal Khan.' },
  
  // Caves & Heritage
  { id: 201, name: 'Ajanta Caves', category: 'heritage', region: 'aurangabad', image: 'images/ajanta-caves.jpeg', cost: 1200, days: '1-2', desc: '30 rock-cut Buddhist cave monuments from 2nd century BC.' },
  { id: 202, name: 'Ellora Caves', category: 'heritage', region: 'aurangabad', image: 'images/ellora.jpg', cost: 1000, days: '1-2', desc: 'UNESCO site featuring Kailasa temple - the largest monolithic structure.' },
  { id: 203, name: 'Elephanta Caves', category: 'heritage', region: 'mumbai', image: 'images/elephanta.jpg', cost: 600, days: '1', desc: 'Sculptural temples dedicated to Lord Shiva on an island.' },
  
  // Nature & Wildlife
  { id: 19, name: 'Powai Lake', category: 'nature', region: 'mumbai', image: 'images/powai-lake.jpeg', cost: 400, days: '1', desc: 'Artificial lake offering peaceful sunset views.' },
  { id: 21, name: 'Pawna Lake', category: 'nature', region: 'pune', image: 'images/pawna.jpg', cost: 1200, days: '1-2', desc: 'Popular camping spot with lake-side tents.' },
  { id: 301, name: 'Tadoba National Park', category: 'wildlife', region: 'vidarbha', image: 'images/tadoba.jpg', cost: 2500, days: '2-3', desc: 'The "Jewel of Vidarbha", oldest and largest tiger reserve in MH.' },
  
  // Entertainment
  { id: 23, name: 'Imagicaa', category: 'theme', region: 'mumbai', image: 'images/imagicaa.jpg', cost: 2000, days: '1', desc: 'India\'s premier theme park and water park destination.' }
];

// Initialize the planner
document.addEventListener('DOMContentLoaded', function() {
  loadPlaces();
  setupEventListeners();
});

// Load and display places
function loadPlaces() {
  const placesGrid = document.getElementById('places-grid');
  if (!placesGrid) return;
  
  placesGrid.innerHTML = '';
  
  allPlaces.forEach(place => {
    const placeCard = document.createElement('div');
    placeCard.className = 'place-item';
    placeCard.innerHTML = `
      <img src="${place.image}" alt="${place.name}" class="place-img" onerror="this.src='images/placeholder.jpg'">
      <div class="place-info">
        <div class="place-name">${place.name}</div>
        <div class="place-category">${place.category.charAt(0).toUpperCase() + place.category.slice(1)}</div>
        <div class="place-price">₹${place.cost}/day</div>
      </div>
    `;
    
    placeCard.addEventListener('click', () => togglePlace(place, placeCard));
    placesGrid.appendChild(placeCard);
  });
}

// Toggle place selection
function togglePlace(place, element) {
  const index = selectedPlaces.findIndex(p => p.id === place.id);
  
  if (index > -1) {
    selectedPlaces.splice(index, 1);
    element.classList.remove('selected');
  } else {
    selectedPlaces.push(place);
    element.classList.add('selected');
  }
  
  updateSelectedPlaces();
  updateSummary();
}

// Update selected places list
function updateSelectedPlaces() {
  const selectedContainer = document.getElementById('selected-places');
  if (!selectedContainer) return;
  
  if (selectedPlaces.length === 0) {
    selectedContainer.innerHTML = '<p style="color: #999; text-align: center;">No places selected yet</p>';
    return;
  }
  
  let html = '';
  selectedPlaces.forEach((place, index) => {
    html += `
      <div class="selected-item">
        <span class="name">${index + 1}. ${place.name}</span>
        <span class="cost">₹${place.cost}</span>
        <button class="remove-btn" onclick="removePlace(${place.id})">Remove</button>
      </div>
    `;
  });
  
  selectedContainer.innerHTML = html;
}

// Remove place from selection
function removePlace(placeId) {
  selectedPlaces = selectedPlaces.filter(p => p.id !== placeId);
  
  // Update UI
  document.querySelectorAll('.place-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  selectedPlaces.forEach(place => {
    document.querySelectorAll('.place-item').forEach(item => {
      if (item.textContent.includes(place.name)) {
        item.classList.add('selected');
      }
    });
  });
  
  updateSelectedPlaces();
  updateSummary();
}

// Update trip summary
function updateSummary() {
  const startDate = document.getElementById('start-date')?.value;
  const endDate = document.getElementById('end-date')?.value;
  const itineraryGrid = document.getElementById('itinerary-grid');
  
  let days = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  }
  
  const totalCost = selectedPlaces.reduce((sum, place) => sum + (place.cost || 0), 0);
  
  if (document.getElementById('summary-days')) document.getElementById('summary-days').textContent = days || 0;
  if (document.getElementById('summary-places')) document.getElementById('summary-places').textContent = selectedPlaces.length;
  if (document.getElementById('summary-cost')) document.getElementById('summary-cost').textContent = totalCost;
  if (document.getElementById('summary-type')) document.getElementById('summary-type').textContent = document.getElementById('travel-type')?.value || '-';
  
  // Update display fields
  if (document.getElementById('display-name')) document.getElementById('display-name').textContent = document.getElementById('trip-name')?.value || '-';
  if (document.getElementById('display-start')) document.getElementById('display-start').textContent = startDate || '-';
  if (document.getElementById('display-end')) document.getElementById('display-end').textContent = endDate || '-';
  if (document.getElementById('display-budget')) document.getElementById('display-budget').textContent = document.getElementById('budget')?.value || '0';
  if (document.getElementById('display-region')) document.getElementById('display-region').textContent = document.getElementById('region')?.value || '-';
  if (document.getElementById('display-travel')) document.getElementById('display-travel').textContent = document.getElementById('travel-type')?.value || '-';

  // Generate Day-by-Day Itinerary
  if (itineraryGrid) {
    if (days > 0 && selectedPlaces.length > 0) {
      let html = '';
      const placesPerDay = Math.ceil(selectedPlaces.length / days);
      
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        const dayPlaces = selectedPlaces.slice(i * placesPerDay, (i + 1) * placesPerDay);
        
        html += `
          <div class="itinerary-day">
            <div class="day-header">
              <span class="day-num">Day ${i + 1}</span>
              <span class="day-date">${currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div class="day-content">
              ${dayPlaces.length > 0 ? dayPlaces.map(p => `
                <div class="itinerary-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <div class="item-info">
                    <strong>${p.name}</strong>
                    <p>${p.desc || 'Explore the beauty of ' + p.name}</p>
                  </div>
                </div>
              `).join('') : '<p class="text-muted">No activities planned for this day.</p>'}
            </div>
          </div>
        `;
      }
      itineraryGrid.innerHTML = html;
    } else {
      itineraryGrid.innerHTML = '<p class="text-center" style="color:rgba(255,255,255,0.5); padding: 20px;">Complete steps 1 & 2 to see your itinerary</p>';
    }
  }
}

// Switch between steps
function switchStep(step) {
  // Hide all steps
  document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.step-btn').forEach(el => el.classList.remove('active'));
  
  // Show selected step
  const stepContent = document.getElementById('step-' + step);
  if (stepContent) stepContent.classList.add('active');
  document.querySelectorAll('.step-btn')[step - 1]?.classList.add('active');
  
  // Update summary when going to review
  if (step === 3) {
    updateSummary();
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Save trip
async function saveTrip() {
  const tripName = document.getElementById('trip-name')?.value;
  const token = localStorage.getItem("token");
  
  if (!tripName) {
    alert('Please enter a trip name');
    return;
  }
  
  if (selectedPlaces.length === 0) {
    alert('Please select at least one place');
    return;
  }
  
  const tripData = {
    title: tripName,
    startDate: document.getElementById('start-date')?.value,
    endDate: document.getElementById('end-date')?.value,
    budget: document.getElementById('budget')?.value,
    region: document.getElementById('region')?.value,
    travelType: document.getElementById('travel-type')?.value,
    places: selectedPlaces.map(p => ({ 
      name: p.name, 
      cost: p.cost,
      category: p.category 
    })),
    notes: document.getElementById('notes')?.value
  };

  // 1. Always save to localStorage as backup
  let trips = JSON.parse(localStorage.getItem('maharashtraTrips')) || [];
  trips.push({ ...tripData, savedAt: new Date().toLocaleDateString() });
  localStorage.setItem('maharashtraTrips', JSON.stringify(trips));
  
  // 2. Save to backend if logged in
  if (token) {
    try {
      const saveBtn = document.querySelector('button[onclick="saveTrip()"]');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerText = "Saving...";
      }

      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
      });

      if (response.ok) {
        alert("Trip saved to your account! 🚀");
      } else {
        const error = await response.json();
        console.warn("Backend save failed:", error.message);
        alert("Saved to device only. Login required for cloud sync.");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Saved to device only. Backend connection failed.");
    } finally {
      const saveBtn = document.querySelector('button[onclick="saveTrip()"]');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerText = "Save Trip";
      }
    }
  } else {
    alert("Trip saved to this device! Login to sync with your account.");
  }
  
  // Show success message
  const successMsg = document.getElementById('success-msg');
  if (successMsg) {
    successMsg.style.display = 'block';
    setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
  }
}

// Download itinerary
function downloadItinerary() {
  if (selectedPlaces.length === 0) {
    alert('Please select places first');
    return;
  }
  
  let content = `MAHARASHTRA TRIP ITINERARY\n`;
  content += `================================\n\n`;
  content += `Trip Name: ${document.getElementById('trip-name')?.value || 'My Trip'}\n`;
  content += `Start Date: ${document.getElementById('start-date')?.value || 'Not specified'}\n`;
  content += `End Date: ${document.getElementById('end-date')?.value || 'Not specified'}\n`;
  content += `Budget: ₹${document.getElementById('budget')?.value || '0'}\n`;
  content += `Traveling With: ${document.getElementById('travel-type')?.value || 'Not specified'}\n\n`;
  
  content += `SELECTED PLACES:\n`;
  content += `================\n`;
  selectedPlaces.forEach((place, index) => {
    content += `${index + 1}. ${place.name} (${place.category})\n   Cost: ₹${place.cost}/day\n   Duration: ${place.days}\n\n`;
  });
  
  content += `\nNOTES:\n`;
  content += `${document.getElementById('notes')?.value || 'No notes added'}\n\n`;
  
  content += `Total Places: ${selectedPlaces.length}\n`;
  content += `Generated on: ${new Date().toLocaleString()}\n`;
  
  // Create blob and download
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', 'maharashtra-trip-itinerary.txt');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('trip-name')?.addEventListener('change', updateSummary);
  document.getElementById('start-date')?.addEventListener('change', updateSummary);
  document.getElementById('end-date')?.addEventListener('change', updateSummary);
  document.getElementById('budget')?.addEventListener('change', updateSummary);
  document.getElementById('travel-type')?.addEventListener('change', updateSummary);
  document.getElementById('region')?.addEventListener('change', updateSummary);
  
  // Search functionality
  document.getElementById('search-places')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.place-item').forEach(item => {
      const placeName = item.textContent.toLowerCase();
      item.style.display = placeName.includes(searchTerm) ? 'block' : 'none';
    });
  });
}

// Initialize interest chip functionality
document.addEventListener('DOMContentLoaded', function() {
  const interestChips = document.querySelectorAll('.interest-chip');
  const nextBtn = document.getElementById('next-step1');
  
  interestChips.forEach(chip => {
    chip.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.toggle('active');
      validateStep1();
    });
  });

  // Trip duration calculation
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  const durationDisplay = document.getElementById('trip-duration');
  const durationDays = document.getElementById('duration-days');

  function calculateDuration() {
    if (startDate.value && endDate.value) {
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      if (days > 0) {
        durationDays.textContent = days;
        durationDisplay.style.display = 'block';
      } else {
        durationDisplay.style.display = 'none';
      }
    }
  }

  if (startDate) {
    startDate.addEventListener('change', calculateDuration);
  }
  if (endDate) {
    endDate.addEventListener('change', calculateDuration);
  }

  // Validate step 1 and enable next button
  function validateStep1() {
    const tripName = document.getElementById('trip-name').value.trim();
    const travelType = document.getElementById('travel-type').value;
    const startDateVal = document.getElementById('start-date').value;
    const endDateVal = document.getElementById('end-date').value;
    const budget = document.getElementById('budget').value;
    const region = document.getElementById('region').value;
    const activeChips = document.querySelectorAll('.interest-chip.active').length;

    // All fields must be filled and at least one interest selected
    const isValid = tripName && travelType && startDateVal && endDateVal && budget && region && activeChips > 0;
    
    if (nextBtn) {
      nextBtn.disabled = !isValid;
    }
  }

  // Validate on input change
  const inputs = document.querySelectorAll('.trip-card input, .trip-card select');
  inputs.forEach(input => {
    input.addEventListener('change', validateStep1);
    input.addEventListener('input', validateStep1);
  });

  // Initial validation
  validateStep1();
});

