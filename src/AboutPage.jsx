import React from 'react';
import './About.css'; // Update the CSS file name if necessary

const About = () => {
  return (
    <div className="about-container">
      <nav className="sidebar">
        <a href="#section1">Introduction</a>
        <a href="#section2">Features</a>
        <a href="#section3">About Us</a>
      </nav>

      <div className="content">
        <section id="section1">
          <h2>Introduction</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.</p>
        </section>
        <section id="section2">
          <h2>Features</h2>
          <p>Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.</p>
        </section>
        <section id="section3">
          <h2>About Us</h2>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.</p>
        </section>
      </div>
    </div>
  );
};

export default About;