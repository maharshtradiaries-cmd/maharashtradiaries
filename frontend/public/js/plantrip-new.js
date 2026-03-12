// Professional Trip Planner JavaScript
let selectedPlaces = [];
let tripData = {};

// Sample places data (comprehensive list)
const allPlaces = [
  // Hill Stations
  { id: 1, name: 'Lonavala', category: 'hillstation', region: 'pune', image: 'images/lonavala.jpg', cost: 1200, days: '2-3' },
  { id: 2, name: 'Khandala', category: 'hillstation', region: 'pune', image: 'images/khandala.jpg', cost: 1000, days: '1-2' },
  { id: 3, name: 'Matheran', category: 'hillstation', region: 'raigad', image: 'images/matheran.jpg', cost: 1500, days: '2-3' },
  { id: 4, name: 'Mahabaleshwar', category: 'hillstation', region: 'satara', image: 'images/mahabaleshwar.jpeg', cost: 1300, days: '2-3' },
  { id: 5, name: 'Panchgani', category: 'hillstation', region: 'satara', image: 'images/panchgani.jpg', cost: 1200, days: '2-3' },
  
  // Beaches
  { id: 6, name: 'Alibaug Beach', category: 'beaches', region: 'konkan', image: 'images/alibaug.jpg', cost: 1500, days: '1-2' },
  { id: 7, name: 'Kashid Beach', category: 'beaches', region: 'konkan', image: 'images/kashid.jpg', cost: 1200, days: '2-3' },
  { id: 8, name: 'Murud Beach', category: 'beaches', region: 'konkan', image: 'images/murud.jpg', cost: 1000, days: '1-2' },
  { id: 9, name: 'Ganpatipule Beach', category: 'beaches', region: 'konkan', image: 'images/ganpati.png', cost: 1100, days: '2-3' },
  { id: 10, name: 'Juhu Beach', category: 'beaches', region: 'mumbai', image: 'images/juhu.jpg', cost: 400, days: '1' },
  
  // Temples
  { id: 11, name: 'Grishneshwar Temple', category: 'temples', region: 'aurangabad', image: 'images/grishneshwar.jpg', cost: 600, days: '1' },
  { id: 12, name: 'Shirdi Sai Baba Temple', category: 'temples', region: 'ahmednagar', image: 'images/shirdi.jpg', cost: 800, days: '1-2' },
  { id: 13, name: 'Siddhivinayak Temple', category: 'temples', region: 'mumbai', image: 'images/sidhhivinayak.jpg', cost: 500, days: '1' },
  { id: 14, name: 'Trimbakeshwar Jyotirlinga', category: 'temples', region: 'nashik', image: 'images/trimbakeshwar.jpg', cost: 800, days: '1-2' },
  
  // Forts
  { id: 15, name: 'Daulatabad Fort', category: 'forts', region: 'aurangabad', image: 'images/daulatabad.webp', cost: 900, days: '1-2' },
  { id: 16, name: 'Panhala Fort', category: 'forts', region: 'kolhapur', image: 'images/panhala.jpeg', cost: 800, days: '1-2' },
  { id: 17, name: 'Rajgad Fort', category: 'forts', region: 'pune', image: 'images/rajgad.webp', cost: 1000, days: '2-3' },
  { id: 18, name: 'Raigad Fort', category: 'forts', region: 'konkan', image: 'images/raigad.jpg', cost: 1000, days: '2-3' },
  
  // Lakes
  { id: 19, name: 'Powai Lake', category: 'nature', region: 'mumbai', image: 'images/powai-lake.jpeg', cost: 400, days: '1' },
  { id: 20, name: 'Venna Lake', category: 'nature', region: 'satara', image: 'images/venna-lake.jpeg', cost: 900, days: '1' },
  { id: 21, name: 'Pawna Lake', category: 'nature', region: 'pune', image: 'images/pawna.jpg', cost: 1200, days: '1-2' },
];

// Initialize the planner
document.addEventListener('DOMContentLoaded', function() {
  loadPlaces();
  setupEventListeners();
});

// Load and display places
function loadPlaces() {
  const placesGrid = document.getElementById('places-grid');
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
  const days = parseInt(document.getElementById('start-date').value) && parseInt(document.getElementById('end-date').value) 
    ? Math.ceil((new Date(document.getElementById('end-date').value) - new Date(document.getElementById('start-date').value)) / (1000 * 60 * 60 * 24)) 
    : selectedPlaces.length;
  
  const totalCost = selectedPlaces.reduce((sum, place) => sum + (place.cost || 0), 0) * (days || 1);
  
  document.getElementById('summary-days').textContent = days || 0;
  document.getElementById('summary-places').textContent = selectedPlaces.length;
  document.getElementById('summary-cost').textContent = totalCost;
  document.getElementById('summary-type').textContent = document.getElementById('travel-type').value || '-';
  
  // Update display fields
  document.getElementById('display-name').textContent = document.getElementById('trip-name').value || '-';
  document.getElementById('display-start').textContent = document.getElementById('start-date').value || '-';
  document.getElementById('display-end').textContent = document.getElementById('end-date').value || '-';
  document.getElementById('display-budget').textContent = document.getElementById('budget').value || '0';
  document.getElementById('display-region').textContent = document.getElementById('region').value || '-';
  document.getElementById('display-travel').textContent = document.getElementById('travel-type').value || '-';
}

// Switch between steps
function switchStep(step) {
  // Hide all steps
  document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.step-btn').forEach(el => el.classList.remove('active'));
  
  // Show selected step
  document.getElementById('step-' + step).classList.add('active');
  document.querySelectorAll('.step-btn')[step - 1].classList.add('active');
  
  // Update summary when going to review
  if (step === 3) {
    updateSummary();
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Save trip
function saveTrip() {
  const tripName = document.getElementById('trip-name').value;
  
  if (!tripName) {
    alert('Please enter a trip name');
    return;
  }
  
  if (selectedPlaces.length === 0) {
    alert('Please select at least one place');
    return;
  }
  
  const trip = {
    name: tripName,
    startDate: document.getElementById('start-date').value,
    endDate: document.getElementById('end-date').value,
    budget: document.getElementById('budget').value,
    region: document.getElementById('region').value,
    travelType: document.getElementById('travel-type').value,
    places: selectedPlaces.map(p => ({ name: p.name, cost: p.cost })),
    notes: document.getElementById('notes').value,
    savedAt: new Date().toLocaleDateString()
  };
  
  // Save to localStorage
  let trips = JSON.parse(localStorage.getItem('maharashtraTrips')) || [];
  trips.push(trip);
  localStorage.setItem('maharashtraTrips', JSON.stringify(trips));
  
  // Show success message
  const successMsg = document.getElementById('success-msg');
  successMsg.style.display = 'block';
  
  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 3000);
}

// Download itinerary
function downloadItinerary() {
  if (selectedPlaces.length === 0) {
    alert('Please select places first');
    return;
  }
  
  let content = `MAHARASHTRA TRIP ITINERARY\n`;
  content += `================================\n\n`;
  content += `Trip Name: ${document.getElementById('trip-name').value || 'My Trip'}\n`;
  content += `Start Date: ${document.getElementById('start-date').value || 'Not specified'}\n`;
  content += `End Date: ${document.getElementById('end-date').value || 'Not specified'}\n`;
  content += `Budget: ₹${document.getElementById('budget').value || '0'}\n`;
  content += `Traveling With: ${document.getElementById('travel-type').value || 'Not specified'}\n\n`;
  
  content += `SELECTED PLACES:\n`;
  content += `================\n`;
  selectedPlaces.forEach((place, index) => {
    content += `${index + 1}. ${place.name} (${place.category})\n   Cost: ₹${place.cost}/day\n   Duration: ${place.days}\n\n`;
  });
  
  content += `\nNOTES:\n`;
  content += `${document.getElementById('notes').value || 'No notes added'}\n\n`;
  
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
