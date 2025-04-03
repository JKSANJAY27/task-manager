import React from 'react';
import './Footer.css';

function Footer() {
const currentYear = new Date().getFullYear();

return (
<footer className="app-footer">
<div className="footer-content">
<p>&copy; {currentYear} My Task Manager. All rights reserved.</p>
<ul className="footer-links">
<li><a href="/privacy">Privacy Policy</a></li>
<li><a href="/terms">Terms of Service</a></li>
<li><a href="/contact">Contact Us</a></li>
</ul>
<p className="footer-version">Version 1.0</p>
</div>
</footer>
);
}

export default Footer;