
import "../assets/scss/style.scss";
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-section about">
          <h3 className="footer-logo">RecycleHub</h3>
          <p className="footer-mission">
            Building sustainable supply chains through technology
          </p>
          <div className="footer-social">
            <span className="social-icon">📱</span>
            <span className="social-icon">🐦</span>
            <span className="social-icon">📘</span>
            <span className="social-icon">🔗</span>
          </div>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading mx-4">Materials</h4>
          <ul className="footer-links">
            <li>PET Recycling</li>
            <li>HDPE Products</li>
            <li>LDPE Films</li>
            <li>PVC Solutions</li>
            <li>PE Applications</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading mx-4">Company</h4>
          <ul className="footer-links">
            <li>Our Mission</li>
            <li>Technology</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div className="footer-section ">
          <h4 className="footer-heading mx-4">Support</h4>
          <ul className="footer-links">
            <li>Help Center</li>
            <li>Safety Guidelines</li>
            <li>API Documentation</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">
          © {new Date().getFullYear()} RecycleHub Technologies
        </p>
        <div className="legal-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookie Settings</span>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;