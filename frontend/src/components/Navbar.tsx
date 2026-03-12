import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaMapMarkedAlt, FaBars, FaTimes } from 'react-icons/fa'
import './Navbar.css'

export default function Navbar() {
    const { logout } = useAuth()
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/explore', label: 'Explore' },
        { to: '/plan-trip', label: 'Plan Trip' },
        { to: '/profile', label: 'My Profile' },
        { to: '/contact', label: 'Contact' },
    ]

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand" id="navbar-brand">
                    <FaMapMarkedAlt className="brand-icon" />
                    <span className="brand-text">MaharashtraDiaries</span>
                </Link>

                <button
                    className="mobile-toggle"
                    id="mobile-menu-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button
                        className="nav-logout-btn"
                        id="logout-button"
                        onClick={() => { logout(); setMobileOpen(false) }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}
