import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FaMapMarkedAlt, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCalendar } from 'react-icons/fa'
import axios from 'axios'
import { OTP_API_URL } from '../config'
import './Auth.css'

export default function Signup() {
    const { signup } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [age, setAge] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [verifying, setVerifying] = useState(false)

    // Validation States
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [validationErrors, setValidationErrors] = useState({
        username: '',
        password: '',
        email: ''
    })

    const validatePassword = (pass: string) => {
        let score = 0
        if (pass.length >= 8) score++
        if (/[a-z]/.test(pass)) score++
        if (/[A-Z]/.test(pass)) score++
        if (/[0-9]/.test(pass)) score++
        if (/[^a-zA-Z0-9]/.test(pass)) score++
        setPasswordStrength(score)
        
        const errors = []
        if (pass.length < 8) errors.push("8+ chars")
        if (!/[A-Z]/.test(pass)) errors.push("Uppercase")
        if (!/[0-9]/.test(pass)) errors.push("Number")
        if (!/[^a-zA-Z0-9]/.test(pass)) errors.push("Special char")
        
        return errors.length === 0 ? "" : `Missing: ${errors.join(", ")}`
    }

    const handlePasswordChange = (val: string) => {
        setPassword(val)
        const error = validatePassword(val)
        setValidationErrors(prev => ({ ...prev, password: error }))
    }

    const handleSignupSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!username || !email || !password || !age) {
            toast.error('Please fill in all fields')
            return
        }

        if (/^\d+$/.test(username)) {
            toast.error('Name cannot contain only numbers')
            return
        }

        const passError = validatePassword(password)
        if (passError) {
            toast.error('Password is too weak')
            return
        }

        setLoading(true)
        try {
            // Step 1: Send OTP
            await axios.post(`${OTP_API_URL}/send`, { email })
            toast.success('OTP sent to your email! 📧')
            setShowOtpModal(true)
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value.substring(value.length - 1)
        setOtp(newOtp)

        // Auto focus next
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleResendOtp = async () => {
        try {
            setLoading(true)
            await axios.post(`${OTP_API_URL}/send`, { email })
            toast.success('New OTP sent! 📧')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        const otpString = otp.join('')
        console.log('Button clicked. OTP String:', otpString)
        
        if (otpString.length < 6) {
            toast.error('Please enter the full 6-digit code')
            return
        }

        setVerifying(true)
        try {
            console.log('Verifying OTP for:', email)
            const verifyRes = await axios.post(`${OTP_API_URL}/verify`, { email, otp: otpString })
            console.log('Verification Success:', verifyRes.data)
            
            console.log('Proceeding to complete signup for:', username)
            // Step 3: Complete Signup
            await signup(username, email, password, Number(age))
            
            toast.success('Account verified & created! 🚀')
            localStorage.setItem('md_is_new_user', 'true')
            setShowOtpModal(false)
            navigate('/dashboard')
        } catch (err: any) {
            console.error('Final Signup/Verify Flow Error:', err)
            const errMsg = err.response?.data?.message || err.message || 'Something went wrong'
            toast.error(errMsg)
            // If it's a verification error, don't close modal. 
            // If it's a signup error (e.g. username taken), maybe help them go back.
        } finally {
            setVerifying(false)
        }
    }

    return (
        <div className="auth-page" id="signup-page">
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
                            Join thousands of travelers exploring Maharashtra's rich heritage,
                            breathtaking landscapes, and unforgettable experiences.
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
                    <form className="auth-form" onSubmit={handleSignupSubmit} id="signup-form">
                        <div className="form-header">
                            <h2 className="form-title">Create Account</h2>
                            <p className="form-subtitle">Start your Maharashtra adventure today</p>
                        </div>

                        <div className="input-group" id="signup-username-group">
                            <label className="input-label">Username</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="signup-username"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                    minLength={3}
                                    maxLength={30}
                                />
                                <FaUser className="input-icon" />
                            </div>
                            {username && /^\d+$/.test(username) && (
                                <span className="error-text">Name cannot contain only numbers</span>
                            )}
                        </div>

                        <div className="input-group" id="signup-email-group">
                            <label className="input-label">Email</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="signup-email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                                <FaEnvelope className="input-icon" />
                            </div>
                        </div>

                        <div className="input-group" id="signup-age-group">
                            <label className="input-label">Age</label>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    id="signup-age"
                                    placeholder="Your age"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                    min={13}
                                    max={120}
                                />
                                <FaCalendar className="input-icon" />
                            </div>
                        </div>

                        <div className="input-group" id="signup-password-group">
                            <label className="input-label">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="signup-password"
                                    placeholder="Strong password"
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    required
                                    autoComplete="new-password"
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
                            {password && (
                                <>
                                    <div className="strength-bar-container">
                                        <div 
                                            className={`strength-bar score-${passwordStrength}`} 
                                            style={{ width: `${(passwordStrength/5)*100}%` }}
                                        />
                                    </div>
                                    <span className="error-text">{validationErrors.password}</span>
                                </>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="auth-btn"
                            id="signup-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="btn-loader">
                                    <span className="loader-dot" />
                                    <span className="loader-dot" />
                                    <span className="loader-dot" />
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <p className="auth-switch">
                            Already have an account?{' '}
                            <Link to="/login" className="auth-switch-link" id="goto-login">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="otp-modal-overlay">
                    <div className="otp-modal glass-card">
                        <div className="form-header">
                            <h2 className="form-title">Verification</h2>
                            <p className="form-subtitle">Enter the 6-digit code sent to<br/><strong>{email}</strong></p>
                        </div>

                        <div className="otp-inputs">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`otp-${idx}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !digit && idx > 0) {
                                            document.getElementById(`otp-${idx - 1}`)?.focus()
                                        }
                                        if (e.key === 'Enter') {
                                            handleVerifyOtp()
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        <button 
                            type="button"
                            className="auth-btn" 
                            onClick={handleVerifyOtp}
                            disabled={verifying}
                        >
                            {verifying ? 'Verifying...' : 'Verify & Sign Up'}
                        </button>

                        <div style={{ marginTop: '15px' }}>
                            <button 
                                type="button" 
                                className="modal-close-btn" 
                                onClick={handleResendOtp}
                                disabled={loading}
                                style={{ color: 'var(--primary-400)', marginRight: '15px' }}
                            >
                                {loading ? 'Sending...' : 'Resend OTP'}
                            </button>
                            
                            <button 
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setShowOtpModal(false)}
                            >
                                Back to Signup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
