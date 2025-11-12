import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaLeaf, FaUsers, FaRocket, FaBullseye, FaHeart, FaGlobeAsia, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "../assets/scss/style.scss";
import "../assets/scss/HomePage.modern.scss";
import "../assets/scss/AboutPage.scss";

export default function AboutPage() {
  return (
    <div className="recycle-app about-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-modern" style={{ minHeight: '50vh' }}>
        <div className="hero-bg-elements">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <FaLeaf className="badge-icon" />
            <span>About EcoWorth</span>
          </div>
          
          <h1 className="hero-title">
            Transforming Waste into <span className="gradient-text">Worth</span>
          </h1>
          
          <p className="hero-subtitle">
            We're on a mission to revolutionize waste management through technology and sustainability
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <MissionVision />

      {/* Our Story */}
      <OurStory />

      {/* Team Section */}
      <TeamSection />

      {/* Contact Section */}
      <ContactSection />

      <Footer />
    </div>
  );
}

const MissionVision = () => {
  const values = [
    {
      icon: FaBullseye,
      title: "Our Mission",
      description: "To create a sustainable ecosystem where waste is viewed as a valuable resource, connecting sellers and buyers through innovative AI technology.",
      color: "#10b981"
    },
    {
      icon: FaRocket,
      title: "Our Vision",
      description: "A world where zero waste is achievable, empowering communities to participate in the circular economy and build a greener future.",
      color: "#3b82f6"
    },
    {
      icon: FaHeart,
      title: "Our Values",
      description: "Sustainability, innovation, transparency, and community-driven growth are at the heart of everything we do.",
      color: "#8b5cf6"
    }
  ];

  return (
    <section className="mission-vision-section">
      <div className="container">
        <div className="values-grid">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            const hexToRgb = (hex) => {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
            };
            
            return (
              <div 
                key={index}
                className="value-card"
                style={{
                  '--card-bg-start': `${value.color}15`,
                  '--card-bg-end': `${value.color}05`,
                  '--card-border': `${value.color}30`,
                  '--card-shadow': `rgba(${hexToRgb(value.color)}, 0.2)`,
                  '--icon-color': value.color,
                  '--icon-shadow': `rgba(${hexToRgb(value.color)}, 0.3)`
                }}
              >
                <div className="value-icon">
                  <IconComponent />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const OurStory = () => {
  return (
    <section className="our-story-section">
      <div className="container">
        <div className="section-header-modern">
          <h2 className="section-title-modern">
            Our Story
          </h2>
        </div>

        <div className="story-content-grid">
          <div className="story-text">
            <p>
              EcoWorth was born from a simple observation: businesses waste millions of dollars annually on materials 
              that could be recycled, while manufacturers struggle to source affordable raw materials.
            </p>
            <p>
              Founded in 2023, we've built an AI-powered platform that bridges this gap, creating a marketplace 
              where waste becomes worth. Our desktop application uses advanced computer vision to scan and categorize 
              waste materials with 95% accuracy.
            </p>
            <p>
              Today, we're proud to serve over 1,000+ sellers and buyers, facilitating sustainable transactions 
              and diverting thousands of tons of waste from landfills.
            </p>
          </div>

          <div className="stats-card">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">1,000+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Tons Recycled</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">AI Accuracy</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      bio: "Environmental engineer with 10+ years in sustainability",
      icon: FaUsers
    },
    {
      name: "Rahul Mehta",
      role: "CTO",
      bio: "AI/ML expert specializing in computer vision",
      icon: FaRocket
    },
    {
      name: "Ananya Patel",
      role: "Head of Operations",
      bio: "Supply chain optimization specialist",
      icon: FaGlobeAsia
    }
  ];

  return (
    <section className="team-section">
      <div className="container">
        <div className="section-header-modern">
          <h2 className="section-title-modern">
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <p className="section-subtitle-modern">
            Passionate individuals driving sustainable change
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, index) => {
            const IconComponent = member.icon;
            return (
              <div key={index} className="team-member-card">
                <div className="member-avatar">
                  <IconComponent />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <div className="member-role">{member.role}</div>
                <p className="member-bio">{member.bio}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email Us",
      value: "hello@ecoworth.com",
      color: "#3b82f6"
    },
    {
      icon: FaPhone,
      title: "Call Us",
      value: "+91 98765 43210",
      color: "#10b981"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      value: "Mumbai, Maharashtra, India",
      color: "#8b5cf6"
    }
  ];

  return (
    <section className="contact-section">
      <div className="container">
        <div className="section-header-modern">
          <h2 className="section-title-modern">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle-modern">
            We'd love to hear from you
          </p>
        </div>

        <div className="contact-grid">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            const hexToRgb = (hex) => {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
            };
            
            return (
              <div 
                key={index}
                className="contact-card"
                style={{
                  '--contact-bg-start': `${info.color}15`,
                  '--contact-bg-end': `${info.color}05`,
                  '--contact-border': `${info.color}30`,
                  '--contact-shadow': `rgba(${hexToRgb(info.color)}, 0.2)`,
                  '--contact-icon-bg': info.color,
                  '--contact-icon-shadow': `rgba(${hexToRgb(info.color)}, 0.3)`
                }}
              >
                <div className="contact-icon">
                  <IconComponent />
                </div>
                <h3>{info.title}</h3>
                <p>{info.value}</p>
              </div>
            );
          })}
        </div>

        {/* Social Links */}
        <div className="social-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
