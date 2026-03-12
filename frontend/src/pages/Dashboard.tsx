import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { FaMapMarkerAlt, FaStar, FaRoute, FaHeart, FaArrowRight, FaCalendarAlt, FaSun, FaLeaf, FaCloudRain, FaCoins } from 'react-icons/fa'
import { destinations } from '../data/destinations'
import { TRIP_API_URL } from '../config'
import './Dashboard.css'

export default function Dashboard() {
    const { user, toggleFavorite } = useAuth()
    const [tripsCount, setTripsCount] = useState(0)
    const [welcomeMessage, setWelcomeMessage] = useState('')

    useEffect(() => {
        // Welcome Logic
        const isNew = localStorage.getItem('md_is_new_user')
        if (isNew === 'true') {
            setWelcomeMessage(`Welcome, ${user?.username || 'Traveler'}! 👋`)
        } else {
            setWelcomeMessage(`Welcome back, ${user?.username || 'Traveler'}! 👋`)
        }

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('md_token')
                const res = await axios.get(TRIP_API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setTripsCount(res.data.length)
            } catch (error) {
                console.error('Error fetching trip stats:', error)
            }
        }
        if (user) fetchStats()
    }, [user])

    // Get 3 random featured destinations
    const featuredDestinations = useMemo(() => {
        return [...destinations]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
    }, [])

    const stats = [
        { label: 'Planned Trips', value: tripsCount.toString(), icon: <FaRoute />, color: '#FF8C00' },
        { label: 'Wishlist', value: (user?.favorites?.length || 0).toString(), icon: <FaHeart />, color: '#ff4444' },
        { label: 'Travel Credits', value: (tripsCount * 150).toString(), icon: <FaCoins />, color: '#10b981' },
        { label: 'Member Tier', value: tripsCount > 2 ? 'Gold' : 'Silver', icon: <FaStar />, color: '#FFD700' },
    ]

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-content">
                {/* Welcome Section */}
                <header className="welcome-header animate-slideInDown">
                    <div className="welcome-text">
                        <h1>{welcomeMessage}</h1>
                        <p>Your journey through Maharashtra continues here.</p>
                    </div>
                    <Link to="/plan-trip" className="cta-button pulse">
                        Plan New Trip <FaArrowRight />
                    </Link>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {stats.map((stat, idx) => (
                        <div
                            key={stat.label}
                            className="stat-card glass-card animate-scaleIn"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Featured Section */}
                <section className="featured-section">
                    <div className="section-header">
                        <h2>Featured for You</h2>
                        <Link to="/explore">View All <FaArrowRight /></Link>
                    </div>

                    <div className="featured-grid">
                        {featuredDestinations.map((dest, idx) => (
                            <div
                                key={dest.id}
                                className="featured-card glass-card animate-scaleIn"
                                style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
                            >
                                <div className="card-image">
                                    <img src={dest.image} alt={dest.title} />
                                    <div className="card-overlay">
                                        <span className="featured-tag">Trending</span>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <div className="card-title-row">
                                        <h3>{dest.title}</h3>
                                        <span className="rating"><FaStar /> 4.9</span>
                                    </div>
                                    <p className="card-location"><FaMapMarkerAlt /> {dest.region}</p>
                                    <p className="card-desc">{dest.description}</p>
                                    <Link to="/explore" className="explore-btn">Explore Details</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Wishlist Section */}
                {user?.favorites && user.favorites.length > 0 && (
                    <section className="wishlist-section animate-slideInUp" style={{ marginTop: '40px' }}>
                        <div className="section-header">
                            <h2><FaHeart style={{ color: '#ff4444' }} /> My Wishlist</h2>
                            <p>Places you want to visit</p>
                        </div>
                        <div className="featured-grid">
                            {destinations.filter(d => user.favorites.includes(d.id)).map((dest, idx) => (
                                <div key={dest.id} className="featured-card glass-card animate-scaleIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="card-image">
                                        <img src={dest.image} alt={dest.title} />
                                        <button className="remove-fav" onClick={() => user && toggleFavorite(dest.id)}>
                                            <FaHeart />
                                        </button>
                                    </div>
                                    <div className="card-content">
                                        <h3>{dest.title}</h3>
                                        <p className="card-location"><FaMapMarkerAlt /> {dest.region}</p>
                                        <Link to="/explore" className="explore-btn">Explore Details</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Seasonal Travel Guide */}
                <section className="seasonal-section animate-slideInUp">
                    <div className="seasonal-header">
                        <h2><FaCalendarAlt className="winter-color" /> Seasonal Travel Guide</h2>
                        <p>Plan your journey according to Maharashtra's diverse seasons</p>
                    </div>

                    <div className="seasonal-grid">
                        <div className="season-card" style={{ background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.2)' }}>
                            <h3 style={{ color: '#FF8C00' }}>
                                <FaSun /> Summer (Mar - May)
                            </h3>
                            <p>
                                Escape the heat in the misty hill stations of Mahabaleshwar, Panchgani, and Matheran. Perfect for strawberry picking and cool evening walks.
                            </p>
                        </div>

                        <div className="season-card monsoon">
                            <h3 className="monsoon-color">
                                <FaCloudRain /> Monsoon (June - Sept)
                            </h3>
                            <p>
                                The Sahyadris come alive! Trek to majestic waterfalls, lush green forts like Rajmachi, and experience the magical fog in Lonavala and Igatpuri.
                            </p>
                        </div>

                        <div className="season-card winter">
                            <h3 className="winter-color">
                                <FaLeaf /> Winter (Oct - Feb)
                            </h3>
                            <p>
                                The perfect weather for coastal drives along the Konkan belt, exploring the beaches of Ratnagiri, Tarkarli, and water sports in Malvan.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Motivation Banner */}
                <section className="motivation-banner glass-card animate-slideInUp" style={{ marginTop: '40px' }}>
                    <div className="banner-content">
                        <h2>Ready for your next adventure?</h2>
                        <p>From the peaks of Sahyadris to the waves of Konkan, Maharashtra is waiting.</p>
                        <div className="banner-buttons">
                            <Link to="/explore" className="secondary-btn">Browse Destinations</Link>
                            <Link to="/plan-trip" className="primary-btn">Start Planning</Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="dashboard-footer">
                <p>&copy; 2026 Maharashtra Diaries New. All rights reserved.</p>
                <div className="footer-links">
                    <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
                    <Link to="/terms" className="footer-link">Terms of Service</Link>
                    <Link to="/about" className="footer-link">About Us</Link>
                    <Link to="/contact" className="footer-link">Contact Us</Link>
                </div>
            </footer>
        </div>
    )
}
