import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { destinations } from '../data/destinations'
import { FaUser, FaHeart, FaPlane, FaTrash, FaCalendarAlt, FaDownload, FaWallet, FaUsers, FaArrowRight, FaCheckCircle, FaStar, FaPen } from 'react-icons/fa'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import toast from 'react-hot-toast'
import { TRIP_API_URL } from '../config'
import './Profile.css'

interface SavedTrip {
    _id: string
    title: string
    steps: {
        place: string
        date: string
        activity: string
        image?: string
        cost?: number
    }[]
    splitCost?: {
        groupSize: number
        totalCost: number
        costPerPerson: number
    }
    createdAt: string
    isCompleted?: boolean
    rating?: number
    review?: string
}

export default function Profile() {
    const { user, toggleFavorite } = useAuth()
    const [trips, setTrips] = useState<SavedTrip[]>([])
    const [loading, setLoading] = useState(true)

    // Review Modal State
    const [reviewModalTrip, setReviewModalTrip] = useState<SavedTrip | null>(null)
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewText, setReviewText] = useState('')

    useEffect(() => {
        fetchTrips()
    }, [])

    const fetchTrips = async () => {
        try {
            const token = localStorage.getItem('md_token')
            const res = await axios.get(TRIP_API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTrips(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const deleteTrip = async (id: string) => {
        try {
            const token = localStorage.getItem('md_token')
            await axios.delete(`${TRIP_API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTrips(trips.filter(t => t._id !== id))
            toast.success('Trip removed')
        } catch {
            toast.error('Failed to delete trip')
        }
    }

    const markAsCompleted = (trip: SavedTrip) => {
        setReviewModalTrip(trip)
        setReviewRating(5)
        setReviewText('')
    }

    const submitReview = async () => {
        if (!reviewModalTrip) return
        try {
            const token = localStorage.getItem('md_token')
            const res = await axios.put(`${TRIP_API_URL}/${reviewModalTrip._id}`, {
                isCompleted: true,
                rating: reviewRating,
                review: reviewText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            // Update UI
            setTrips(trips.map(t => t._id === reviewModalTrip._id ? res.data : t))
            toast.success('Trip marked as completed and reviewed!')
            setReviewModalTrip(null)
        } catch (e) {
            toast.error('Failed to submit review')
        }
    }


    const downloadTrip = (trip: SavedTrip) => {
        const doc = new jsPDF()

        doc.setFontSize(22)
        doc.setTextColor(255, 107, 0) 
        doc.text('Maharashtra Diaries', 14, 20)

        doc.setFontSize(16)
        doc.setTextColor(0, 0, 0)
        doc.text(`Itinerary: ${trip.title}`, 14, 30)

        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Planned by: ${user?.username} | Date: ${new Date().toLocaleDateString()}`, 14, 38)
        
        let startY = 45;
        if (trip.isCompleted) {
             doc.setTextColor(16, 185, 129) // Green
             doc.text(`Trip Status: Completed | Rating: ${trip.rating}/5`, 14, startY)
             startY += 8;
        }

        if (trip.splitCost && trip.splitCost.totalCost > 0) {
            doc.setTextColor(100)
            doc.text(`Total Budget: Rs. ${trip.splitCost.totalCost}`, 14, startY)
            if (trip.splitCost.groupSize > 1) {
                doc.text(`Group Size: ${trip.splitCost.groupSize} People | Cost per person: Rs. ${trip.splitCost.costPerPerson}`, 14, startY + 6)
            }
            startY += 15;
        }


        // Table
        const tableColumn = ["Date", "Destination", "Activity"]
        const tableRows = trip.steps ? trip.steps.map(step => [
            new Date(step.date).toLocaleDateString(),
            step.place,
            step.activity
        ]) : []

        // @ts-expect-error
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: startY,
            theme: 'striped',
            headStyles: { fillColor: [255, 107, 0] }
        })

        doc.save(`${trip.title.replace(/\s+/g, '_')}_itinerary.pdf`)
        toast.success('Itinerary downloaded!')
    }

    const favoriteDestinations = destinations.filter(d => user?.favorites?.includes(d.id))
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1596402184320-417d7178b2cd?auto=format&fit=crop&q=80&w=1000"

    return (
        <div className="profile-page">
            <Navbar />

            <div className="profile-hero animate-slideInDown">
                <div className="profile-hero-content">
                    <div className="user-avatar-premium">
                        <FaUser />
                    </div>
                    <div className="user-hero-info">
                        <h1>{user?.username}</h1>
                        <p>{user?.email}</p>
                        <span className="explorer-badge">Explorer since {new Date(user?.createdAt || '').getFullYear()}</span>
                    </div>
                </div>
            </div>

            <main className="profile-main">
                <div className="profile-content">
                    {/* Left Column - Fixed Favorites */}
                    <div className="profile-sidebar">
                        <section className="profile-card premium-glass animate-slideInLeft">
                            <div className="card-header">
                                <h3><FaHeart className="icon-pulse heart-color" /> Saved Destinations</h3>
                            </div>
                            
                            <div className="sidebar-fav-grid">
                                {favoriteDestinations.length > 0 ? (
                                    favoriteDestinations.map(dest => (
                                        <div key={dest.id} className="mini-fav-card">
                                            <img
                                                src={dest.image}
                                                alt={dest.title}
                                                onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
                                            />
                                            <div className="mini-fav-info">
                                                <h4>{dest.title}</h4>
                                                <button className="text-btn-danger" onClick={() => toggleFavorite(dest.id)}>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state-card">
                                        <div className="empty-icon-wrap"><FaHeart /></div>
                                        <p>No favorites yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Trips */}
                    <div className="profile-feed">
                        <section className="profile-header-title animate-fadeIn">
                            <h2><FaPlane className="icon-pulse primary-color" /> Flight Path</h2>
                            <p>Manage and review your planned journeys</p>
                        </section>

                        <div className="trips-showcase">
                            {loading ? (
                                <div className="loading-skeleton">
                                    <div className="skeleton-card"></div>
                                    <div className="skeleton-card"></div>
                                </div>
                            ) : trips.length > 0 ? (
                                trips.map(trip => (
                                    <div key={trip._id} className={`premium-trip-card animate-slideUp ${trip.isCompleted ? 'completed-trip' : ''}`}>
                                        <div className="trip-card-banner">
                                            <div className="banner-overlay"></div>
                                            <div className="banner-content">
                                                <div className="banner-title" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <h3>{trip.title}</h3>
                                                    {trip.isCompleted && <span style={{ background: '#10b981', color: 'black', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}><FaCheckCircle /> COMPLETED</span>}
                                                </div>
                                                <div className="banner-actions">
                                                    {!trip.isCompleted && (
                                                        <button className="icon-btn success" title="Mark as Completed & Review" onClick={() => markAsCompleted(trip)}>
                                                            <FaCheckCircle />
                                                        </button>
                                                    )}
                                                    <button className="icon-btn download" title="Download PDF" onClick={() => downloadTrip(trip)}>
                                                        <FaDownload />
                                                    </button>
                                                    <button className="icon-btn danger" title="Delete Trip" onClick={() => deleteTrip(trip._id)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="trip-card-body">
                                            {/* Review Section if Completed */}
                                            {trip.isCompleted && trip.review && (
                                                 <div className="trip-review-box glass-card" style={{ padding: '20px', marginBottom: '20px', borderRadius: '15px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid #10b981' }}>
                                                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                         <strong style={{ color: '#10b981', display: 'flex', gap: '8px', alignItems: 'center' }}><FaPen /> My Review</strong>
                                                         <div style={{ color: '#FFD700', fontSize: '1.2rem' }}>
                                                             {[...Array(5)].map((_, i) => (
                                                                 <FaStar key={i} color={i < (trip.rating || 5) ? "#FFD700" : "rgba(255,255,255,0.2)"} />
                                                             ))}
                                                         </div>
                                                     </div>
                                                     <p style={{ color: 'var(--gray-300)', fontSize: '0.95rem', fontStyle: 'italic' }}>"{trip.review}"</p>
                                                 </div>
                                            )}

                                            {/* Split Cost Section */}
                                            {trip.splitCost && trip.splitCost.totalCost > 0 && (
                                                <div className="trip-finance-dashboard">
                                                    <div className="finance-metric total">
                                                        <FaWallet className="finance-icon" />
                                                        <div className="finance-data">
                                                            <span className="finance-label">Total Est. Cost</span>
                                                            <span className="finance-value">₹{trip.splitCost.totalCost}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {trip.splitCost.groupSize > 1 && (
                                                        <>
                                                            <div className="finance-divider"></div>
                                                            <div className="finance-metric group">
                                                                <FaUsers className="finance-icon" />
                                                                <div className="finance-data">
                                                                    <span className="finance-label">Party Size</span>
                                                                    <span className="finance-value">{trip.splitCost.groupSize} Travellers</span>
                                                                </div>
                                                            </div>
                                                            <div className="finance-divider"></div>
                                                            <div className="finance-metric split">
                                                                <div className="split-badge">SPLIT</div>
                                                                <div className="finance-data">
                                                                    <span className="finance-label">Cost / Person</span>
                                                                    <span className="finance-value highlight">₹{trip.splitCost.costPerPerson}</span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Itinerary Timeline */}
                                            <div className="trip-itinerary-preview">
                                                <h4 className="preview-label">Itinerary Highlights</h4>
                                                <div className="modern-timeline">
                                                    {trip.steps && trip.steps.length > 0 ? (
                                                        trip.steps.map((step, i) => (
                                                            <div key={i} className="timeline-node">
                                                                <div className="node-marker"></div>
                                                                <div className="node-details">
                                                                    <strong className="node-place">{step.place}</strong>
                                                                    <span className="node-activity">{step.activity}</span>
                                                                    <span className="node-date">{new Date(step.date).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="empty-itinerary">No specific steps added to this trip.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-jumbo premium-glass animate-fadeIn">
                                    <div className="empty-icon-jumbo"><FaPlane /></div>
                                    <h3>No Adventures Planned</h3>
                                    <p>Your itinerary is currently empty. Head over to the Plan Trip section to design your next Maharashtra experience.</p>
                                    <a href="/plan-trip" className="btn-primary-gradient">Start Planning <FaArrowRight /></a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Completion & Review Modal */}
            {reviewModalTrip && (
                <div className="modal-overlay" onClick={() => setReviewModalTrip(null)}>
                    <div className="hero-modal animate-scaleIn" style={{ maxWidth: '500px', background: 'var(--bg-dark)', padding: '30px', borderRadius: '25px', border: '1px solid rgba(255,107,0,0.3)' }} onClick={e => e.stopPropagation()}>
                        <button className="hero-close" onClick={() => setReviewModalTrip(null)}>&times;</button>
                        
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <FaCheckCircle style={{ fontSize: '3rem', color: '#10b981', marginBottom: '10px' }} />
                            <h2 style={{ color: 'white' }}>Trip Completed!</h2>
                            <p style={{ color: 'var(--gray-400)' }}>How was your journey on "{reviewModalTrip.title}"?</p>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
                             {[1, 2, 3, 4, 5].map(num => (
                                 <FaStar
                                     key={num}
                                     onClick={() => setReviewRating(num)}
                                     style={{ 
                                         fontSize: '2rem', 
                                         cursor: 'pointer', 
                                         color: num <= reviewRating ? '#FFD700' : 'rgba(255,255,255,0.1)',
                                         transition: 'color 0.2s'
                                     }}
                                 />
                             ))}
                        </div>
                        
                        <textarea 
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write a short review about your trip experience... (Optional)"
                            style={{ 
                                width: '100%', 
                                minHeight: '120px', 
                                background: 'rgba(0,0,0,0.5)', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '15px',
                                padding: '15px',
                                color: 'white',
                                outline: 'none',
                                marginBottom: '20px',
                                resize: 'none'
                            }}
                        />
                        
                        <button 
                            onClick={submitReview}
                            style={{
                                width: '100%',
                                padding: '15px',
                                background: 'var(--primary-500)',
                                color: 'black',
                                borderRadius: '15px',
                                fontWeight: '800',
                                fontSize: '1.1rem',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }}
                        >
                            Save Review & Complete
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
