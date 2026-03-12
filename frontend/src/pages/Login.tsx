import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FaMapMarkedAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'
import './Auth.css'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            await login(email, password)
            toast.success('Welcome back! 🎉')
            navigate('/dashboard')
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                toast.error(err.response.data.message)
            } else {
                toast.error('Unable to connect to server. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page" id="login-page">
            {/* Animated Background */}
            <div className="auth-bg">
                <div className="bg-orb orb-1" />
                <div className="bg-orb orb-2" />
                <div className="bg-orb orb-3" />
                <div className="bg-grid" />
            </div>

            <div className="auth-container">
                {/* Left Panel - Branding */}
                <div className="auth-branding">
                    <div className="branding-content">
                        <div className="branding-icon">
                            <FaMapMarkedAlt />
                        </div>
                        <h1 className="branding-title">Maharashtra<br />Diaries</h1>
                        <p className="branding-subtitle">
                            Discover the soul of Maharashtra — from ancient forts to pristine beaches,
                            vibrant cities to serene hill stations.
                        </p>
                        <div className="branding-features">
                            <div className="feature-item">
                                <span className="feature-dot" />
                                <span>Plan personalized trips</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-dot" />
                                <span>Explore hidden gems</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-dot" />
                                <span>Save favorite places</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-dot" />
                                <span>Community recommendations</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="auth-form-panel">
                    <form className="auth-form" onSubmit={handleSubmit} id="login-form">
                        <div className="form-header">
                            <h2 className="form-title">Welcome Back</h2>
                            <p className="form-subtitle">Sign in to continue your journey</p>
                        </div>

                        <div className="input-group" id="login-email-group">
                            <label className="input-label">Email</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="login-email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                                <FaEnvelope className="input-icon" />
                            </div>
                        </div>

                        <div className="input-group" id="login-password-group">
                            <label className="input-label">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="login-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                <FaLock className="input-icon" />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-btn"
                            id="login-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="btn-loader">
                                    <span className="loader-dot" />
                                    <span className="loader-dot" />
                                    <span className="loader-dot" />
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <p className="auth-switch">
                            Don't have an account?{' '}
                            <Link to="/signup" className="auth-switch-link" id="goto-signup">
                                Create Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
