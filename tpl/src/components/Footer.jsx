import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
            <a href="/" className="footer__logo">ThePortfolioLab</a>
            <p className="footer__description">ThePortfolioLab 2025</p>
        </div>
        <nav className="footer__nav" aria-label="Footer Navigation">
          <div className="footer__col">
            <div className="footer__heading">Pages</div>
            <a className="footer__link" href="/tutorials">Tutorials</a>
            <a className="footer__link" href="/articles">Articles</a>
            <a className="footer__link" href="/about">About</a>
            <a className="footer__link" href="/contact">Contact</a>
          </div>
          <div className="footer__col">
            <div className="footer__heading">Help</div>
            <a className="footer__link" href="/faq">FAQ</a>
            <a className="footer__link" href="/ask">Ask</a>
          </div>
          <div className="footer__col">
            <div className="footer__heading">Follow</div>
            <a className="footer__link" href="https://github.com" target="_blank" rel="noreferrer noopener">GitHub</a>
            <a className="footer__link" href="https://linkedin.com" target="_blank" rel="noreferrer noopener">LinkedIn</a>
          </div>
        </nav>
      </div>
    </footer>
  )
}
