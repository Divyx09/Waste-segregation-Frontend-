import React from "react";
import { 
  FaTimes, 
  FaEnvelope, 
  FaPhone, 
  FaWhatsapp, 
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";
import "../assets/scss/ContactAdminModal.scss";

export default function ContactAdminModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const contactInfo = {
    email: "admin@ecoworth.com",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    address: "EcoWorth Platform, Green Tech Park, Bangalore - 560001",
    workingHours: "Mon - Sat: 9:00 AM - 6:00 PM"
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi, I'm interested in purchasing a seller license for EcoWorth platform.");
    window.open(`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent("Seller License Inquiry");
    const body = encodeURIComponent("Hi Admin,\n\nI'm interested in purchasing a seller license for the EcoWorth platform. Please provide me with the details and pricing information.\n\nThank you!");
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
  };

  const handleCallClick = () => {
    window.location.href = `tel:${contactInfo.phone}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <div className="header-icon">
            <FaCheckCircle />
          </div>
          <h2>Contact Admin for License</h2>
          <p>Get in touch with our admin team to purchase your seller license</p>
        </div>

        <div className="modal-body">
          <div className="license-info-box">
            <h3>📋 License Plans Available</h3>
            <ul>
              <li><strong>Basic:</strong> ₹999/month - Up to 10 listings</li>
              <li><strong>Pro:</strong> ₹2,499/month - Up to 50 listings</li>
              <li><strong>Enterprise:</strong> ₹4,999/month - Unlimited listings</li>
            </ul>
          </div>

          <div className="contact-methods">
            <h3>Choose Your Preferred Contact Method</h3>
            
            <div className="contact-cards">
              <div className="contact-card whatsapp-card" onClick={handleWhatsAppClick}>
                <div className="contact-icon whatsapp-icon">
                  <FaWhatsapp />
                </div>
                <div className="contact-details">
                  <h4>WhatsApp</h4>
                  <p>{contactInfo.whatsapp}</p>
                  <span className="contact-badge">Fastest Response</span>
                </div>
              </div>

              <div className="contact-card email-card" onClick={handleEmailClick}>
                <div className="contact-icon email-icon">
                  <FaEnvelope />
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>{contactInfo.email}</p>
                  <span className="contact-badge">Detailed Inquiry</span>
                </div>
              </div>

              <div className="contact-card phone-card" onClick={handleCallClick}>
                <div className="contact-icon phone-icon">
                  <FaPhone />
                </div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <p>{contactInfo.phone}</p>
                  <span className="contact-badge">Direct Call</span>
                </div>
              </div>
            </div>
          </div>

          <div className="additional-info">
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h4>Office Address</h4>
                <p>{contactInfo.address}</p>
              </div>
            </div>

            <div className="info-item">
              <FaClock className="info-icon" />
              <div>
                <h4>Working Hours</h4>
                <p>{contactInfo.workingHours}</p>
              </div>
            </div>
          </div>

          <div className="process-info">
            <h4>📝 License Purchase Process:</h4>
            <ol>
              <li>Contact admin via your preferred method</li>
              <li>Discuss your business requirements</li>
              <li>Choose the best plan for your needs</li>
              <li>Complete payment and verification</li>
              <li>Start listing and earning!</li>
            </ol>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={handleWhatsAppClick}>
            <FaWhatsapp /> Chat on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
