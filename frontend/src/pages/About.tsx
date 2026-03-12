import Navbar from '../components/Navbar'
import { FaInfoCircle, FaEnvelope, FaMapMarkedAlt, FaHeart } from 'react-icons/fa'

export default function About() {
    return (
        <div className="static-page">
            <Navbar />
            <div className="static-container animate-fadeIn" style={{ padding: '120px 20px 50px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <FaInfoCircle style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>About Us</h1>
                    <p style={{ color: 'var(--gray-400)' }}>Your Companion for Maharashtra's Best Experiences</p>
                </div>

                <div className="static-content glass-card" style={{ padding: '40px', borderRadius: '20px', lineHeight: '1.8' }}>
                    <h2 style={{ color: '#3b82f6', marginTop: '0', display: 'flex', alignItems: 'center', gap: '10px' }}><FaMapMarkedAlt /> Our Mission</h2>
                    <p>Maharashtra Diaries was built with a simple goal: to make discovering and planning trips across the incredible state of Maharashtra easier, more beautiful, and highly personalized. From the majestic forts of Sahyadris to the untouched beaches of the Konkan, we want to help users curate memories that last a lifetime.</p>

                    <h2 style={{ color: '#3b82f6', marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}><FaHeart /> What We Do</h2>
                    <p>We provide a premium, seamless digital experience where travelers can:</p>
                    <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                        <li>Discover hidden gems separated by regions and categories.</li>
                        <li>Plan out detailed, day-by-day customized itineraries.</li>
                        <li>Get personalized AI insights and travel guides.</li>
                        <li>Leave reviews and mark their trips as successfully accomplished.</li>
                    </ul>

                    <h2 style={{ color: '#3b82f6', marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}><FaEnvelope /> Contact Us</h2>
                    <p>Have ideas, feedback or simply want to say hello? Reach out to us anytime!</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                        <FaEnvelope style={{ color: '#3b82f6' }} />
                        <a href="mailto:maharshtradiaries@gmail.com" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>maharshtradiaries@gmail.com</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
