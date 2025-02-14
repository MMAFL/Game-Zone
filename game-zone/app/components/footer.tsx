import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import styles from "../style/Footer.module.css";

const Footer: React.FC = () => {
    const scrollToGames = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault(); // Prevent default link behavior
    
        const section = document.getElementById("gamesSection");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Section - Logo & Contact */}
        <div className={styles.logoSection}>
          <h2 className={styles.logo}>GameZone</h2>
          {/* <p className={styles.contactText}>
            Contact us at: <a href="mailto:gamezone@gmail.com">gamezone@gmail.com</a>
          </p> */}
        </div>

        {/* Center Section - Navigation */}
        <div className={styles.linksContainer}>
          {/* Navigation Links */}
          <div className={styles.linkList}>
            <h3>Navigation</h3>
            <ul>
              <li>
                <Link href="">Home</Link>
              </li>
              <li>
              <a href="#gamesSection" onClick={scrollToGames}>Games</a>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Policies */}
          <div className={styles.linkList}>
            <h3>Legal</h3>
            <ul>
              <li>
                <Link href="">Privacy Policy</Link>
              </li>
              <li>
                <Link href="">Terms of Service</Link>
              </li>
              <li>
                <Link href="">Cookie Policy</Link>
              </li>
            </ul>
          </div>

          {/* Other Useful Links */}
          <div className={styles.linkList}>
            <h3>More</h3>
            <ul>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/support">Support</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Media Icons Centered at the Bottom */}
      <div className={styles.socialContainer}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebookF className={styles.icon} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className={styles.icon} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className={styles.icon} />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <FaYoutube className={styles.icon} />
        </a>
      </div>

      {/* Divider Line and Copyright */}
      <hr className={styles.divider} />
      <p className={styles.copyright}>© 2025 GameZone. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
