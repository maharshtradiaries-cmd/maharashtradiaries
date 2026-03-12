import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { FaShieldAlt, FaEnvelope } from 'react-icons/fa'

export default function PrivacyPolicy() {
    return (
        <div className="static-page">
            <Navbar />
            <div className="static-container animate-fadeIn" style={{ padding: '120px 20px 50px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <FaShieldAlt style={{ fontSize: '3rem', color: '#10b981', marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>Privacy Policy</h1>
                    <p style={{ color: 'var(--gray-400)' }}>Last updated: March 2026</p>
                </div>

                <div className="static-content glass-card" style={{ padding: '40px', borderRadius: '20px', lineHeight: '1.8' }}>
                    <h2 style={{ color: '#10b981', marginTop: '0' }}>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us when using Maharashtra Diaries, such as your name, email address (when you register), created trips, favorites, and reviews. We also automatically collect some usage data such as your IP address and browser type for security purposes.</p>

                    <h2 style={{ color: '#10b981', marginTop: '30px' }}>2. How We Use Your Information</h2>
                    <p>We use the information to:</p>
                    <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                        <li>Provide, maintain and improve our travel services.</li>
                        <li>Create and secure your account.</li>
                        <li>Allow you to save planned trips and downloadable itineraries.</li>
                        <li>Communicate with you regarding your feedback.</li>
                    </ul>

                    <h2 style={{ color: '#10b981', marginTop: '30px' }}>3. Data Sharing</h2>
                    <p>We do not sell your personal information. We may share anonymous aggregated travel trends. We do not share your private trips or profile details publicly without your consent.</p>

                    <h2 style={{ color: '#10b981', marginTop: '30px' }}>4. Security</h2>
                    <p>We implement industry-standard encryption to protect your data. Your passwords are hashed and authenticated through standard secure json web tokens (JWT).</p>

                    <h2 style={{ color: '#10b981', marginTop: '30px' }}>5. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                        <FaEnvelope style={{ color: 'var(--primary-500)' }} />
                        <a href="mailto:maharshtradiaries@gmail.com" style={{ color: 'var(--primary-500)', textDecoration: 'none', fontWeight: 'bold' }}>maharshtradiaries@gmail.com</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
