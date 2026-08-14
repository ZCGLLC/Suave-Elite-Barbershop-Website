import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BOOKING_PATH, PHONE, PHONE_TEL, INSTAGRAM, MAPS_URL, ADDRESS } from '../constants'

function sectionHref(id) {
  return { pathname: '/', hash: id }
}

export function SiteHeader({ solid = true }) {
  const [scrolled, setScrolled] = useState(solid)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (solid) {
      setScrolled(true)
      return undefined
    }
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [solid])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`site-header ${scrolled || menuOpen ? 'scrolled' : ''}`}>
        <div className="container nav">
          <Link to="/" className="brand" onClick={closeMenu}>
            <span className="brand-mark">Suave Elite</span>
            <span className="brand-sub">Barbershop · Dallas</span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/" end onClick={closeMenu}>
              Home
            </NavLink>
            <Link to={sectionHref('experience')} onClick={closeMenu}>
              Experience
            </Link>
            <Link to={sectionHref('services')} onClick={closeMenu}>
              Services
            </Link>
            <Link to={sectionHref('visit')} onClick={closeMenu}>
              Visit
            </Link>
            <NavLink to={BOOKING_PATH} onClick={closeMenu}>
              Book
            </NavLink>
          </nav>

          <Link className="btn btn-primary nav-cta" to={BOOKING_PATH} onClick={closeMenu}>
            Book Now
          </Link>

          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
          </button>
        </div>
      </header>

      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile">
        <NavLink to="/" end onClick={closeMenu}>
          Home
        </NavLink>
        <Link to={sectionHref('experience')} onClick={closeMenu}>
          Experience
        </Link>
        <Link to={sectionHref('services')} onClick={closeMenu}>
          Services
        </Link>
        <Link to={sectionHref('visit')} onClick={closeMenu}>
          Visit
        </Link>
        <NavLink to={BOOKING_PATH} onClick={closeMenu}>
          Book
        </NavLink>
        <Link className="btn btn-primary" to={BOOKING_PATH} onClick={closeMenu}>
          Book Appointment
        </Link>
      </nav>
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            Suave <span>Elite</span>
          </div>
          <p>
            Premium barbering in Old East Dallas — cuts, fades, beards, and classic shaves for
            clients who value craft.
          </p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to={sectionHref('experience')}>Experience</Link>
          <Link to={sectionHref('services')}>Services</Link>
          <Link to={BOOKING_PATH}>Book</Link>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <a href={PHONE_TEL}>{PHONE}</a>
          <Link to={BOOKING_PATH}>Book Online</Link>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={MAPS_URL} target="_blank" rel="noreferrer">
            Directions
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Suave Elite Barbershop. All rights reserved.</span>
        <span>{ADDRESS.replace(', Dallas, TX 75204', ' · Dallas, TX')}</span>
      </div>
    </footer>
  )
}
