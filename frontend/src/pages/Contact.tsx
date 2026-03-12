import { useState } from 'react'
import Navbar from '../components/Navbar'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp, FaInstagram, FaTwitter } from 'react-icons/fa'
import toast from 'react-hot-toast'
import './Contact.css'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulated submission
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'Sending your message...',
                success: 'Message sent! We will get back to you soon.',
                error: 'Failed to send message.'
            }
        )
        setFormData({ name: '', email: '', subject: '', message: '' })
    }

    return (
        <div className="contact-page">
            <Navbar />

            <main className="contact-main">
                <header className="contact-header animate-slideInDown">
                    <h1>Get in Touch</h1>
                    <p>Have questions or suggestions? We'd love to hear from you.</p>
                </header>

                <div className="contact-grid">
                    {/* Contact Info */}
                    <section className="contact-info-section animate-slideInLeft">
                        <div className="info-card glass-card">
                            <div className="info-item">
                                <div className="info-icon"><FaEnvelope /></div>
                                <div className="info-text">
                                    <h4>Email Us</h4>
                                    <p>maharshtradiaries@gmail.com</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><FaPhone /></div>
                                <div className="info-text">
                                    <h4>Call Us</h4>
                                    <p>+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><FaMapMarkerAlt /></div>
                                <div className="info-text">
                                    <h4>Visit Us</h4>
                                    <p>Heritage Plaza, Fort, Mumbai - 400001</p>
                                </div>
                            </div>
                        </div>

                        <div className="social-connect glass-card">
                            <h4>Follow Our Journey</h4>
                            <div className="social-links">
                                <a href="#"><FaInstagram /></a>
                                <a href="#"><FaTwitter /></a>
                                <a href="#"><FaWhatsapp /></a>
                            </div>
                        </div>
                    </section>

                    {/* Contact Form */}
                    <section className="contact-form-section glass-card animate-slideInRight">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    rows={5}
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button type="submit" className="submit-btn primary-btn">
                                Send Message <FaPaperPlane />
                            </button>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    )
}
