import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../actions/authentication";
import leaf from '../assets/leaf.png';


const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const location = useLocation();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleScrollToSection = (Id) => {
    // Navigate to home first
    navigate("/");

    // Wait for navigation, then scroll
    setTimeout(() => {
      const section = document.getElementById(Id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 300); // delay allows React to load homepage first
  };

  const logOut=()=>{
    // console.log('logout action called inside navbar'); 
    dispatch(logout());
    // setUser(null);
    navigate("/login"); // redirect to login page
    
  }
  const login=()=>{
    navigate('/login')
  }
  const avatarClick=()=>{
     // Admin users don't have an email field, regular users do
     if (!user?.result?.email && user?.result?.username) {
    navigate('/adminprofile');
  } else {
    navigate('/userprofile');
  }
  }

  return (
    <nav style={styles.nav} role="navigation" aria-label="Main Navigation">
      <div style={styles.container}>
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
          <img style={styles.img} src={leaf} alt="Leaf Icon" />
          <div style={styles.brand}>GreenRoots</div>
        </div>

        {/* Desktop Links */}
        <ul
          id="primary-navigation"
          className="nav-desktop-links"
          style={styles.navLinks}
        >
          <li><button onClick={() => handleScrollToSection("home")} style={styles.navLink}>Home</button></li>
          <li><button onClick={() => handleScrollToSection("programs")} style={styles.navLink}>Programs</button></li>
          <li><button onClick={() => handleScrollToSection("donate")} style={styles.navLink}>Donate</button></li>
          <li><button onClick={() => handleScrollToSection("public-tree-gallery")} style={styles.navLink}>Gallery</button></li>
        </ul>

        {/* Right side controls: Avatar + Auth Button + Mobile Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div onClick={avatarClick} style={styles.avatar} title={user?.result?.username || "Account"}>
            {
              (!user?.result?.email && user?.result?.username)
                ? "*" // admin
                : user?.result?.username
                    ? user.result.username[0].toUpperCase()
                    : "?"
            }
          </div>
          {user ? (
            <button style={styles.button} onClick={logOut}>Logout</button>
          ) : (
            <button style={styles.button} onClick={login}>Login</button>
          )}

          <button
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
            onClick={toggleMenu}
            className="nav-mobile-toggle"
            style={styles.menuButton}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div id="mobile-navigation" className="nav-mobile-menu" style={styles.mobileDropdown}>
          <button 
            onClick={() => { handleScrollToSection("home"); setMenuOpen(false); }} 
            style={styles.mobileNavLink}
          >
            🏡 Home
          </button>
          <button 
            onClick={() => { handleScrollToSection("programs"); setMenuOpen(false); }} 
            style={styles.mobileNavLink}
          >
            🌿 Programs
          </button>
          <button 
            onClick={() => { handleScrollToSection("public-tree-gallery"); setMenuOpen(false); }} 
            style={styles.mobileNavLink}
          >
            📸 Tree Gallery
          </button>
          <button 
            onClick={() => { handleScrollToSection("donate"); setMenuOpen(false); }} 
            style={styles.mobileNavLink}
          >
            💚 Donate
          </button>
          <button 
            onClick={() => { avatarClick(); setMenuOpen(false); }} 
            style={styles.mobileNavLink}
          >
            👤 {user?.result?.username ? `@${user.result.username}` : "My Profile"}
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#2e8b57",
    color: "white",
    padding: "0.75rem 1.5rem",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  img: {
    width: 50,
    height: 50,
    marginRight: "0.5rem",
  },

  container: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "1.4rem",
    margin: 0,
    letterSpacing: "0.5px",
  },

  menuButton: {
    fontSize: "1.8rem",
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    display: "none", // hidden on desktop
  },

   navLinks: {
    display: "flex",
    flexDirection: "row", // align horizontally
    alignItems: "center",
    justifyContent: "flex-end",
    listStyle: "none",
    gap: "1.5rem",
    margin: 0,
    padding: 0,
    transition: "all 0.3s ease-in-out",
  },

navLink: {
    backgroundColor: "transparent",
    border: "2px solid transparent",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  navLinkHover: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "#fff",
    transform: "scale(1.05)",
  },

  showMenu: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    backgroundColor: "#2e8b57",
    top: "4rem",
    right: "1rem",
    width: "200px",
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    gap: "1rem",
  },

  avatar: {
    backgroundColor: "#ffffff",
    color: "#2e8b57",
    border: "2px solid white",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1rem",
    marginLeft: "1rem",
  },

  button: {
    backgroundColor: "#ffffff",
    color: "#2e8b57",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: "1rem",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },

  buttonHover: {
    backgroundColor: "#e0f2e9",
    transform: "scale(1.03)",
  },

  mobileDropdown: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#236b43",
    padding: "1rem",
    marginTop: "0.75rem",
    borderRadius: "10px",
    gap: "8px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
  },

  mobileNavLink: {
    backgroundColor: "transparent",
    border: "none",
    color: "#ffffff",
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "background 0.2s",
  },
};

export default Navbar;
