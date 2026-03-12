import { useState, useMemo } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { FaMapMarkerAlt, FaPlus, FaTrash, FaInfoCircle, FaWallet, FaSearch, FaCalendarAlt, FaUsers, FaCompass, FaChevronRight, FaTimes, FaMapSigns, FaEdit } from 'react-icons/fa'
import { destinations } from '../data/destinations'
import toast from 'react-hot-toast'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { TRIP_API_URL } from '../config'
import './PlanTrip.css'

interface TripStep {
    id: string
    placeId: string
    place: string
    date: string
    activity: string
    image: string
    cost: number
    howToReach: string
    lat?: number
    lng?: number
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1596402184320-417d7178b2cd?auto=format&fit=crop&q=80&w=1000"

export default function PlanTrip() {
    const [tripName, setTripName] = useState('My Awesome Trip')
    const [steps, setSteps] = useState<TripStep[]>([])
    const [selectedRegion, setSelectedRegion] = useState('')
    const [selectedPlace, setSelectedPlace] = useState<any>(null)
    const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [newActivity, setNewActivity] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [groupSize, setGroupSize] = useState<number>(1)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const regions = useMemo(() => {
        const unique = Array.from(new Set(destinations.map(d => d.region)))
        return unique.sort()
    }, [])

    const filteredPlaces = useMemo(() => {
        let filtered = destinations;

        if (selectedRegion) {
            filtered = filtered.filter(d => d.region === selectedRegion)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(d =>
                d.title.toLowerCase().includes(query) ||
                (d.category && d.category.toLowerCase().includes(query)) ||
                d.region.toLowerCase().includes(query)
            )
        }

        return filtered.sort((a, b) => a.title.localeCompare(b.title))
    }, [selectedRegion, searchQuery])

    // SMART CALCULATIONS & SUGGESTIONS
    const tripStats = useMemo(() => {
        if (steps.length === 0) return null

        const totalBudget = steps.reduce((sum, s) => sum + (s.cost || 1000), 0)
        const costPerPerson = Math.round(totalBudget / groupSize)
        
        const regionsUsed = Array.from(new Set(steps.map(s => {
            const dest = destinations.find(d => d.id === s.placeId)
            return dest?.region || ''
        })))

        let travelAdvice = "Private vehicle or tourist cab recommended."
        if (regionsUsed.includes('Mumbai') || regionsUsed.includes('Pune')) {
            travelAdvice = "Train or ST bus for better connectivity."
        }

        return {
            totalBudget,
            costPerPerson,
            travelAdvice,
            placesCount: steps.length
        }
    }, [steps, groupSize])

    // Group steps by date
    const groupedSteps = useMemo(() => {
        const groups: { [key: string]: TripStep[] } = {}
        steps.forEach(step => {
            if (!groups[step.date]) {
                groups[step.date] = []
            }
            groups[step.date].push(step)
        })
        
        // Sort dates
        return Object.keys(groups).sort().reduce((acc, date) => {
            acc[date] = groups[date]
            return acc
        }, {} as { [key: string]: TripStep[] })
    }, [steps])

    const addStep = () => {
        if (!selectedPlace || !currentDate) {
            toast.error('Please select a destination and date')
            return
        }

        const step: TripStep = {
            id: Date.now().toString(),
            placeId: selectedPlace.id,
            place: selectedPlace.title,
            date: currentDate,
            activity: newActivity || 'Explore ' + selectedPlace.title,
            image: selectedPlace.image,
            cost: selectedPlace.cost,
            howToReach: selectedPlace.howToReach,
            lat: selectedPlace.lat,
            lng: selectedPlace.lng
        }

        setSteps([...steps, step])
        setSelectedPlace(null)
        setNewActivity('')
        toast.success(`Added to your itinerary!`)
        setIsSidebarOpen(true) // Open sidebar to show addition
    }

    const removeStep = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setSteps(steps.filter(s => s.id !== id))
        toast.success('Removed from itinerary')
    }

    const saveTrip = async () => {
        if (!tripName) {
            toast.error('Please name your trip')
            return
        }
        if (steps.length === 0) {
            toast.error('Add destinations first')
            return
        }

        try {
            const token = localStorage.getItem('md_token')
            if(!token) {
                 toast.error('Please login to save your trip.')
                 return;
            }
            await axios.post(TRIP_API_URL,
                { 
                    title: tripName, 
                    steps,
                    splitCost: {
                        groupSize,
                        totalCost: tripStats?.totalBudget || 0,
                        costPerPerson: tripStats?.costPerPerson || 0
                    }
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success(`Trip "${tripName}" saved successfully!`)
            setSteps([])
            setSelectedRegion('')
            setGroupSize(1)
            setTripName('My Awesome Trip')
        } catch (error) {
            console.error(error)
            toast.error('Failed to save trip. Are you logged in?')
        }
    }

    const downloadPdf = () => {
        if (steps.length === 0) {
            toast.error('Add destinations first')
            return
        }

        const doc = new jsPDF()

        // Add Title
        doc.setFontSize(22)
        doc.setTextColor(255, 107, 0)
        doc.text(tripName, 14, 20)

        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Generated exactly as planned on Maharashtra Diaries.`, 14, 30)

        // Trip Stats
        let startY = 40;
        doc.setFontSize(11)
        doc.setTextColor(50)
        doc.text(`Total Budget: Rs. ${tripStats?.totalBudget} | Group Size: ${groupSize} | Cost/Person: Rs. ${tripStats?.costPerPerson}`, 14, startY)
        startY += 8
        doc.text(`Pro Tip: ${tripStats?.travelAdvice}`, 14, startY)
        startY += 10

        // Itinerary Table
        const tableData = steps.map((step) => [
            new Date(step.date).toLocaleDateString(),
            step.place,
            step.activity,
            `Rs. ${step.cost}`
        ])

        autoTable(doc, {
            startY: startY,
            head: [['Date', 'Destination', 'Activity', 'Est. Cost']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [255, 107, 0] }
        })

        doc.save(`${tripName.replace(/\s+/g, '_')}_itinerary.pdf`)
        toast.success('Itinerary PDF Downloaded!')
    }

    return (
        <div className="planner-layout">
            <Navbar />

            <div className="planner-container">
                
                {/* LEFT SIDEBAR: ITINERARY BUILDER */}
                <div className={`planner-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <div className="sidebar-header">
                        <div className="trip-name-section">
                            <label className="sidebar-label">Trip Title</label>
                            <div className="trip-name-input-wrapper">
                                <input
                                    type="text"
                                    className="trip-name-input"
                                    value={tripName}
                                    onChange={(e) => setTripName(e.target.value)}
                                    placeholder="e.g., Konkan Summer Trip"
                                />
                                <FaEdit className="edit-icon" />
                            </div>
                        </div>
                        <div className="trip-config">
                            <div className="config-item">
                                <span className="config-label">Group Size</span>
                                <FaUsers className="config-icon" />
                                <input 
                                    type="number" 
                                    min="1" 
                                    className="people-input"
                                    value={groupSize}
                                    onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-stats">
                        <div className="stat-box">
                            <span className="stat-label">Total Est.</span>
                            <span className="stat-value">₹{tripStats?.totalBudget || 0}</span>
                        </div>
                        <div className="stat-box highlight">
                            <span className="stat-label">Per Person ({groupSize})</span>
                            <span className="stat-value">₹{tripStats?.costPerPerson || 0}</span>
                        </div>
                    </div>

                    <div className="itinerary-list">
                        {steps.length === 0 ? (
                            <div className="empty-itinerary-state">
                                <div className="pulse-circle"></div>
                                <FaMapSigns className="empty-icon" />
                                <h4>Your trip is empty</h4>
                                <p>Click on places from the explore panel to build your itinerary.</p>
                            </div>
                        ) : (
                            Object.keys(groupedSteps).map((date, index) => (
                                <div key={date} className="itinerary-day-group">
                                    <div className="day-header">
                                        <div className="day-badge">Day {index + 1}</div>
                                        <div className="day-date">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                    </div>
                                    <div className="day-steps">
                                        {groupedSteps[date].map((step, sIdx) => (
                                            <div key={step.id} className="itinerary-step-card animate-fadeIn">
                                                <img src={step.image} alt={step.place} onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)} />
                                                <div className="step-info">
                                                    <h5>{step.place}</h5>
                                                    <p>{step.activity}</p>
                                                    <span className="step-cost">₹{step.cost}</span>
                                                </div>
                                                <button className="del-step-btn" onClick={(e) => removeStep(step.id, e)}><FaTimes /></button>
                                                {sIdx !== groupedSteps[date].length - 1 && <div className="step-connector"></div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="sidebar-footer">
                        {tripStats?.travelAdvice && steps.length > 0 && (
                            <div className="ai-advice">
                                <FaInfoCircle /> {tripStats.travelAdvice}
                            </div>
                        )}
                        <div className="sidebar-actions">
                            <button className="btn-save btn-full" onClick={saveTrip}>Save Trip Profile</button>
                            <button className="btn-outline btn-full" onClick={downloadPdf}>Export PDF</button>
                        </div>
                    </div>
                </div>

                {/* MOBILE TOGGLE FOR SIDEBAR */}
                <button 
                    className="mobile-sidebar-toggle" 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <FaChevronRight /> : <FaCompass />}
                </button>

                {/* RIGHT PANEL: EXPLORE */}
                <div className="planner-main">
                    <div className="explore-header-sticky">
                        <div className="explore-title">
                            <h2>Discover Places</h2>
                            <p>Find destinations and add them to your itinerary.</p>
                        </div>
                        <div className="global-search-container">
                            <FaSearch className="global-search-icon" />
                            <input
                                type="text"
                                className="global-search-input"
                                placeholder="Search by name, category, region..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="pill-filters">
                            <button
                                className={`filter-pill ${selectedRegion === '' ? 'active' : ''}`}
                                onClick={() => setSelectedRegion('')}
                            >
                                All Regions
                            </button>
                            {regions.map(r => (
                                <button
                                    key={r}
                                    className={`filter-pill ${selectedRegion === r ? 'active' : ''}`}
                                    onClick={() => setSelectedRegion(r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="places-masonry-grid">
                        {filteredPlaces.length > 0 ? (
                            filteredPlaces.map(place => (
                                <div key={place.id} className="place-discover-card">
                                    <div className="pd-image-box">
                                        <img src={place.image} alt={place.title} onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)} />
                                        <div className="pd-overlay">
                                            <button className="pd-add-btn" onClick={() => setSelectedPlace(place)}>
                                                <FaPlus /> Add to Trip
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pd-info">
                                        <div className="pd-row">
                                            <h3>{place.title}</h3>
                                            <span className="pd-price">₹{place.cost}</span>
                                        </div>
                                        <p className="pd-category">{place.category} • {place.region}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="pd-empty">
                                <p>No destinations found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* QUICK ADD MODAL */}
                {selectedPlace && (
                    <div className="quick-add-modal animate-fadeIn">
                        <div className="qam-content">
                            <button className="qam-close" onClick={() => setSelectedPlace(null)}><FaTimes /></button>
                            
                            <div className="qam-header">
                                <img src={selectedPlace.image} alt={selectedPlace.title} onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)} />
                                <div>
                                    <h3>{selectedPlace.title}</h3>
                                    <p>{selectedPlace.region}</p>
                                </div>
                            </div>
                            
                            <div className="qam-body">
                                <div className="qam-form-group">
                                    <label><FaCalendarAlt /> When are you going?</label>
                                    <input
                                        type="date"
                                        className="qam-input"
                                        value={currentDate}
                                        onChange={(e) => setCurrentDate(e.target.value)}
                                    />
                                </div>
                                <div className="qam-form-group">
                                    <label><FaInfoCircle /> What's the plan?</label>
                                    <input
                                        type="text"
                                        className="qam-input"
                                        placeholder="e.g., Morning trek, Sunset views"
                                        value={newActivity}
                                        onChange={(e) => setNewActivity(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="qam-footer">
                                <div className="qam-cost">
                                    <span>Est. Cost:</span> <strong>₹{selectedPlace.cost}</strong>
                                </div>
                                <button className="qam-confirm-btn" onClick={addStep}>
                                    Save to Itinerary
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
