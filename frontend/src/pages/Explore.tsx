import { useState, useMemo, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { FaSearch, FaMapMarkerAlt, FaClock, FaRupeeSign, FaCompass, FaHeart, FaCloudSun, FaShareAlt, FaStar, FaArrowRight } from 'react-icons/fa'
import { destinations as staticDestinations, type Destination } from '../data/destinations'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import axios from 'axios'
import './Explore.css'

interface Review {
    user: { username: string }
    rating: number
    comment: string
    date: string
}

interface FullDestination extends Destination {
    reviews: Review[]
    rating: number
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1596402184320-417d7178b2cd?auto=format&fit=crop&q=80&w=1000"

const CATEGORIES = ['All', 'Hill Stations', 'Beaches', 'Temples', 'Forts', 'Lakes', 'Heritage', 'Zoos', 'Theme Parks', 'Shopping']

export default function Explore() {
    const { user, toggleFavorite } = useAuth()
    const [allDestinations, setAllDestinations] = useState<Destination[]>(staticDestinations)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedDestination, setSelectedDestination] = useState<FullDestination | null>(null)
    const [reviewText, setReviewText] = useState('')
    const [selectedRating, setSelectedRating] = useState(5)
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
    const [calculatedDistance, setCalculatedDistance] = useState<string | null>(null)

    useEffect(() => {
        fetchDestinations()

        // Try getting user location for smart distance calculation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                (error) => console.log('Geolocation not granted or failed:', error)
            )
        }
    }, [])

    const fetchDestinations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/destinations')
            setAllDestinations(res.data)
        } catch {
            console.error('Failed to fetch destinations, using static data')
        }
    }

    // Haversine formula
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return Math.round(d);
    }

    const openDetails = async (dest: Destination) => {
        setCalculatedDistance(null)
        try {
            const res = await axios.get(`http://localhost:5000/api/destinations/${dest.id}`)
            setSelectedDestination(res.data)
        } catch {
            setSelectedDestination({ ...dest, reviews: [], rating: 4.5 })
        }

        // Calculate distance if we have both coordinates
        if (userLocation && dest.lat && dest.lng) {
            const dist = calculateDistance(userLocation.lat, userLocation.lng, dest.lat, dest.lng)
            setCalculatedDistance(`${dist} km away`)
        } else if (userLocation) {
            setCalculatedDistance("Location unavailable")
        }
    }

    const handlePostReview = async () => {
        if (!selectedDestination || !reviewText) {
            toast.error('Please write a comment')
            return
        }
        try {
            const token = localStorage.getItem('md_token')
            const res = await axios.post(`http://localhost:5000/api/destinations/${selectedDestination.id}/reviews`,
                { rating: selectedRating, comment: reviewText },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setSelectedDestination(res.data)
            setReviewText('')
            toast.success('Review posted!')
        } catch {
            toast.error('Failed to post review. Are you logged in?')
        }
    }

    const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        try {
            await toggleFavorite(id)
            const isNowFav = user?.favorites?.includes(id)
            toast.success(!isNowFav ? 'Added to favorites' : 'Removed from favorites')
        } catch {
            toast.error('Failed to update favorites')
        }
    }

    const filteredDestinations = useMemo(() => {
        return allDestinations.filter(dest => {
            const matchesSearch = dest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dest.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dest.activities.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dest.category.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [searchTerm, selectedCategory, allDestinations])

    return (
        <div className="explore-page">
            <Navbar />

            <main className="explore-main">
                <header className="explore-header animate-slideInDown">
                    <h1><FaCompass /> Explore Maharashtra</h1>
                    <p>Discover hidden gems across the land of warriors</p>

                    <div className="search-container glass-card">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by destination, region or experience..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="category-filter">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                <section className="destinations-grid">
                    {filteredDestinations.map((dest, idx) => (
                        <div
                            key={dest.id}
                            className="dest-card glass-card animate-scaleIn"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                            onClick={() => openDetails(dest)}
                        >
                            <div className="dest-image">
                                <img
                                    src={dest.image}
                                    alt={dest.title}
                                    onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
                                />
                                <span className="dest-tag">{dest.category}</span>
                                <button
                                    className={`fav-btn ${user?.favorites?.includes(dest.id) ? 'active' : ''}`}
                                    onClick={(e) => handleToggleFavorite(e, dest.id)}
                                >
                                    <FaHeart />
                                </button>
                            </div>
                            <div className="dest-info">
                                <div className="dest-title-row">
                                    <h3>{dest.title}</h3>
                                    <div className="dest-rating">
                                        <FaStar /> {dest.rating?.toFixed(1) || '4.5'}
                                    </div>
                                </div>
                                <p className="dest-location"><FaMapMarkerAlt /> {dest.region}</p>
                                <p className="dest-desc">{dest.description}</p>
                                <div className="dest-meta">
                                    <span><FaClock /> {dest.travelTime.split(' ')[0]}h</span>
                                    <span><FaRupeeSign /> {dest.cost}</span>
                                    <button className="view-btn">Explore <FaArrowRight /></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredDestinations.length === 0 && (
                        <div className="no-results">
                            <h3>No destinations found matching your criteria.</h3>
                            <p>Try searching for something else!</p>
                        </div>
                    )}
                </section>
            </main>

            {selectedDestination && (
                <div className="modal-overlay" onClick={() => setSelectedDestination(null)}>
                    <div className="hero-modal animate-scaleIn" onClick={e => e.stopPropagation()}>
                        <button className="hero-close" onClick={() => setSelectedDestination(null)}>&times;</button>

                        <div className="hero-header">
                            <img
                                src={selectedDestination.image}
                                alt={selectedDestination.title}
                                onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
                            />
                            <div className="hero-gradient"></div>
                            <div className="hero-title-area">
                                <span className="hero-badge">{selectedDestination.category}</span>
                                <h2>{selectedDestination.title}</h2>
                                <p className="hero-region"><FaMapMarkerAlt /> {selectedDestination.region}</p>
                            </div>
                        </div>

                        <div className="hero-body">
                            <div className="hero-quick-stats">
                                <div className="hq-stat">
                                    <FaStar className="hq-icon yellow" />
                                    <div>
                                        <span className="hq-val">{selectedDestination.rating?.toFixed(1) || '4.5'}</span>
                                        <span className="hq-lbl">Rating</span>
                                    </div>
                                </div>
                                <div className="hq-stat">
                                    <FaRupeeSign className="hq-icon green" />
                                    <div>
                                        <span className="hq-val">{selectedDestination.cost}</span>
                                        <span className="hq-lbl">Est. Cost</span>
                                    </div>
                                </div>
                                <div className="hq-stat">
                                    <FaClock className="hq-icon blue" />
                                    <div>
                                        <span className="hq-val">{selectedDestination.duration}</span>
                                        <span className="hq-lbl">Duration</span>
                                    </div>
                                </div>
                                <div className="hq-stat">
                                    <FaCloudSun className="hq-icon orange" />
                                    <div>
                                        <span className="hq-val">28°C</span>
                                        <span className="hq-lbl">Weather</span>
                                    </div>
                                </div>
                                {calculatedDistance && (
                                    <div className="hq-stat" style={{ background: 'rgba(255, 87, 34, 0.1)' }}>
                                        <FaMapMarkerAlt className="hq-icon" style={{ color: '#ff5722' }} />
                                        <div>
                                            <span className="hq-val">{calculatedDistance}</span>
                                            <span className="hq-lbl">From You</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="hero-content-split">
                                <div className="hero-main-details">
                                    <section className="hero-section">
                                        <h3>The Experience</h3>
                                        <p>{selectedDestination.description}</p>
                                    </section>

                                    <section className="hero-section reviews-section">
                                        <h3>Traveler Reviews</h3>
                                        <div className="review-input glass-card">
                                            <div className="rating-select">
                                                {[1, 2, 3, 4, 5].map(num => (
                                                    <FaStar
                                                        key={num}
                                                        className={num <= selectedRating ? 'star-active' : 'star-inactive'}
                                                        onClick={() => setSelectedRating(num)}
                                                    />
                                                ))}
                                            </div>
                                            <div className="input-row">
                                                <input
                                                    type="text"
                                                    placeholder="Share your thoughts..."
                                                    value={reviewText}
                                                    onChange={(e) => setReviewText(e.target.value)}
                                                />
                                                <button onClick={handlePostReview}>Post</button>
                                            </div>
                                        </div>
                                        <div className="reviews-list">
                                            {selectedDestination.reviews.length > 0 ? (
                                                selectedDestination.reviews.map((rev, i) => (
                                                    <div key={i} className="review-item">
                                                        <div className="review-meta">
                                                            <strong>{rev.user.username}</strong>
                                                            <div className="stars">
                                                                {Array(rev.rating).fill('⭐').join('')}
                                                            </div>
                                                        </div>
                                                        <p>{rev.comment}</p>
                                                        <small>{new Date(rev.date).toLocaleDateString()}</small>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>
                                            )}
                                        </div>
                                    </section>
                                </div>

                                <div className="hero-sidebar">
                                    <div className="hero-sidebar-card">
                                        <h4>Getting There</h4>
                                        <p>{selectedDestination.howToReach}</p>
                                        <div className="hero-time-badge">
                                            <FaClock /> {selectedDestination.travelTime}
                                        </div>
                                    </div>

                                    <div className="hero-actions-stack">
                                        <a href={selectedDestination.mapLink} target="_blank" rel="noreferrer" className="hero-btn-primary">
                                            <FaMapMarkerAlt /> Open in Maps
                                        </a>
                                        <button className="hero-btn-secondary" onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success('Link copied to clipboard!');
                                        }}>
                                            <FaShareAlt /> Share Destination
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
