/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export const ContactBand = ({ label }) => <section className="integral-contact-band" aria-label="Contact us">
  <div className="integral-contact-band-inner">
    <div><span>{label}</span><h2>Contact us.</h2></div>
    <Link to="/contact.html">Get in touch</Link>
  </div>
</section>;
