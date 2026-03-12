import Navbar from '../components/Navbar'
import { FaFileContract, FaEnvelope } from 'react-icons/fa'

export default function Terms() {
    return (
        <div className="static-page">
            <Navbar />
            <div className="static-container animate-fadeIn" style={{ padding: '120px 20px 50px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <FaFileContract style={{ fontSize: '3rem', color: '#f59e0b', marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>Terms of Service</h1>
                    <p style={{ color: 'var(--gray-400)' }}>Last updated: March 2026</p>
                </div>

                <div className="static-content glass-card" style={{ padding: '40px', borderRadius: '20px', lineHeight: '1.8' }}>
                    <h2 style={{ color: '#f59e0b', marginTop: '0' }}>1. Acceptance of Terms</h2>
                    <p>By accessing and using Maharashtra Diaries, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>

                    <h2 style={{ color: '#f59e0b', marginTop: '30px' }}>2. User Accounts</h2>
                    <p>To use certain features of the service, such as planning trips or adding favorites, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding the password that you use for your account.</p>

                    <h2 style={{ color: '#f59e0b', marginTop: '30px' }}>3. User Conduct</h2>
                    <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                        <li>You agree not to post any offensive, defamatory, or illicit reviews or profile information.</li>
                        <li>You will not interfere with the security of the application or try to access the backend databases maliciously.</li>
                        <li>You retain rights to data you submit (such as trip plans), but grant us a license to use it for providing the service to you.</li>
                    </ul>

                    <h2 style={{ color: '#f59e0b', marginTop: '30px' }}>4. Disclaimer of Liability</h2>
                    <p>Maharashtra Diaries offers travel information and planning tools. However, we do not guarantee the correctness of distance calculations, costs, or third-party service availability (like hotels or transports). Users are advised to double-check opening hours and trip safety conditions independently.</p>

                    <h2 style={{ color: '#f59e0b', marginTop: '30px' }}>5. Contact Us</h2>
                    <p>If you have any questions regarding these Terms, you can contact us at:</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                        <FaEnvelope style={{ color: '#f59e0b' }} />
                        <a href="mailto:maharshtradiaries@gmail.com" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 'bold' }}>maharshtradiaries@gmail.com</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
