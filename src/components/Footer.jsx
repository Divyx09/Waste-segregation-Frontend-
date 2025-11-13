import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaRecycle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight, FaHeart } from "react-icons/fa";
import "../assets/scss/style.scss";
import "../assets/scss/Footer.modern.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    materials: [
      { name: "PET Recycling", link: "#" },
      { name: "HDPE Products", link: "#" },
      { name: "LDPE Films", link: "#" },
      { name: "PVC Solutions", link: "#" },
      { name: "PE Applications", link: "#" },
    ],
    company: [
      { name: "Our Mission", link: "#" },
      { name: "Technology", link: "#" },
      { name: "Careers", link: "#" },
      { name: "Press", link: "#" },
      { name: "Partners", link: "#" },
    ],
    support: [
      { name: "Help Center", link: "#" },
      { name: "Safety Guidelines", link: "#" },
      { name: "API Documentation", link: "#" },
      { name: "Contact Us", link: "#" },
      { name: "FAQ", link: "#" },
    ],
  };

  const socialLinks = [
    { icon: FaTwitter, label: "Twitter", link: "#", color: "#1DA1F2" },
    { icon: FaLinkedin, label: "LinkedIn", link: "#", color: "#0077B5" },
    { icon: FaFacebook, label: "Facebook", link: "#", color: "#1877F2" },
    { icon: FaInstagram, label: "Instagram", link: "#", color: "#E4405F" },
  ];

  return (
    <footer className="footer-modern">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon-wrapper">
                <FaRecycle className="logo-icon" />
              </div>
              <h3>EcoWorth</h3>
            </div>
            <p className="footer-mission">
              Building sustainable supply chains through innovative technology and AI-powered solutions for a greener tomorrow.
            </p>
            
            <div className="footer-social">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.link}
                    className="social-link"
                    aria-label={social.label}
                    style={{ '--social-color': social.color }}
                  >
                    <IconComponent />
                  </a>
                );
              })}
            </div>

            <div className="footer-contact">
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>hello@ecoworth.com</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+91 1234 567 890</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-section">
              <h4 className="footer-heading">Materials</h4>
              <ul className="footer-links">
                {footerSections.materials.map((item, index) => (
                  <li key={index}>
                    <a href={item.link}>
                      <FaArrowRight className="link-icon" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                {footerSections.company.map((item, index) => (
                  <li key={index}>
                    <a href={item.link}>
                      <FaArrowRight className="link-icon" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                {footerSections.support.map((item, index) => (
                  <li key={index}>
                    <a href={item.link}>
                      <FaArrowRight className="link-icon" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="footer-newsletter">
          <div className="newsletter-content">
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for the latest sustainability news</p>
          </div>
          <form className="newsletter-form">
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input 
                type="email" 
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="newsletter-btn">
              Subscribe
              <FaArrowRight className="btn-icon" />
            </button>
          </form>
        </div> */}

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} EcoWorth Technologies. Made with{" "}
            <FaHeart className="heart-icon" /> for a sustainable future.
          </p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;