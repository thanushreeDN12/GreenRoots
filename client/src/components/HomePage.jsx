import React from "react";
import Navbar from "./Navbar.jsx";
import Hero from "./Hero";
import Mission from "./Mission";
import Programs from "./Programs.jsx";
import Impact from "./Impact";
import PublicTreeGallery from "./PublicTreeGallery.jsx";
import Leaderboard from "./Leaderboard.jsx";
import Stories from "./Stories";
import Partners from "./Partners";
import DonateCTA from "./DonateCTA";
import Newsletter from "./Newsletter.jsx";
import Footer from "./Footer";
import TreeImpactMap from "./TreeImpactMap";

const HomePage = () => {
  return (
    <>
      {/* <Navbar /> */}
      <Hero />
      <Mission />
      <Programs />
      <Impact />
      
      <PublicTreeGallery />
      
      <section style={{ padding: "3rem 1rem", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ color: "#154734", marginBottom: "0.5rem", fontSize: "2rem" }}>Global Impact Map 🌍</h2>
        <p style={{ color: "#4a6c4a" }}>See exactly where our community is planting trees across the globe.</p>
        <TreeImpactMap />
      </section>

      <Leaderboard />
      <Stories />
      <Partners />
      <DonateCTA />
      <Newsletter />
      <Footer />
      
    </>
  );
};

export default HomePage;