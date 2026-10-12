import { Link } from "react-router-dom";
import { subsidiaries } from "../../content";

export const FooterOne = () => <footer className="td-footer-area td-grey-bg integral-footer">
  <div className="container"><div className="integral-footer-main">
    <div className="integral-footer-links"><span>Explore</span><Link to="/">Home</Link><Link to="/about.html">About</Link><Link to="/leadership.html">Leadership</Link><Link to="/updates.html">Updates</Link><Link to="/careers.html">Careers</Link></div>
    <div className="integral-footer-center"><img src="/integral/integral-logo-transparent.png" alt="Integral" /><h2>Securing the future.<br />Building legacies.</h2><Link className="td-btn" to="/about.html">Discover our story <span aria-hidden="true">↗</span></Link></div>
    <div className="integral-footer-links"><span>Subsidiaries</span>{subsidiaries.map((item) => <Link key={item.id} to={item.path}>{item.name}</Link>)}</div>
  </div><div className="integral-footer-bottom"><span>© {new Date().getFullYear()} Integral Holdings Ltd.</span><span>Nigeria</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top ↑</a></div></div>
</footer>;
