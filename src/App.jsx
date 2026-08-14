import { useEffect, useEffectEvent, useState } from 'react'
import './App.css'

const BOOKING_URL =
  'https://booksy.com/en-us/954976_suave-elite-barbershop_barber-shop_134786_dallas'
const PHONE = '(214) 272-9996'
const PHONE_TEL = 'tel:+12142729996'
const ADDRESS = '4540 Ross Ave, Suite 110, Dallas, TX 75204'
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Suave+Elite+Barbershop+4540+Ross+Ave+Suite+110+Dallas+TX+75204'
const INSTAGRAM = 'https://www.instagram.com/suaveelitebarbershop/'
const GOOGLE_SEARCH =
  'https://www.google.com/search?q=Suave+Elite+Barbershop+Dallas'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=2000&q=80'
const EXPERIENCE_IMAGE =
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=80'

const SERVICE_CATEGORIES = [
  {
    id: 'cuts',
    label: 'Cuts & Fades',
    items: [
      { name: 'Haircut', detail: 'Precision cut tailored to your style', price: '$40', duration: '30 min' },
      { name: "Men's Haircut", detail: 'Classic or modern silhouette', price: '$40', duration: '30 min' },
      { name: 'Skin Fade', detail: 'Clean, seamless fade to skin', price: '$35', duration: '30 min' },
      { name: 'Buzz Cut', detail: 'Even, low-maintenance length', price: '$30', duration: '30 min' },
      { name: "Kid's Haircut", detail: 'Ages 12 & under', price: '$30', duration: '30 min' },
      { name: 'Head Shave', detail: 'Smooth, finished bald cut', price: '$30', duration: '30 min' },
      { name: 'Shaved Head', detail: 'Refined full-head shave', price: '$35', duration: '30 min' },
    ],
  },
  {
    id: 'beard',
    label: 'Beard & Shave',
    items: [
      { name: 'Haircut & Beard', detail: 'Complete cut with beard detailing', price: '$50', duration: '45 min' },
      { name: 'Beard Trim', detail: 'Shape and tidy the beard line', price: '$20', duration: '15 min' },
      { name: 'Beard Shaping', detail: 'Sculpted cheek and neck lines', price: '$20', duration: '15 min' },
      { name: 'Beard Grooming', detail: 'Trim, clean-up, and finish', price: '$20', duration: '15 min' },
      { name: 'Beard Maintenance', detail: 'Quick upkeep between full visits', price: '$20', duration: '15 min' },
      { name: 'Beard Shave', detail: 'Clean face shave', price: '$20', duration: '15 min' },
      { name: 'Head Shave & Beard Trim', detail: 'Bald finish with beard detail', price: '$40', duration: '45 min' },
      { name: 'Hot Towel Shave', detail: 'Traditional hot towel experience', price: '$40', duration: '30 min' },
      { name: 'Straight Razor Shave', detail: 'Classic straight-razor finish', price: '$35', duration: '30 min' },
    ],
  },
  {
    id: 'finish',
    label: 'Line-Ups & Finish',
    items: [
      { name: 'Line Up', detail: 'Sharp hairline and edges', price: '$25', duration: '20 min' },
      { name: 'Shape Up', detail: 'Refresh the perimeter', price: '$20', duration: '30 min' },
      { name: 'Edge Up', detail: 'Quick edge refinement', price: '$10', duration: '15 min' },
      { name: 'Design', detail: 'Custom hair design detail', price: '$10', duration: '30 min' },
      { name: 'Eyebrow Shaping', detail: 'Clean, natural brow shape', price: '$10', duration: '10 min' },
      { name: 'Hair Wash', detail: 'Cleanse before or after your cut', price: '$10', duration: '10 min' },
    ],
  },
  {
    id: 'signature',
    label: 'Signature',
    items: [
      {
        name: 'Full Service',
        detail: 'Complete grooming session — cut, beard, and finishing touch',
        price: '$60',
        duration: '60 min',
      },
    ],
  },
]

const QUOTES = [
  {
    text: 'Clean edges. Best fade I\'ve had, and consistent work. The owner cares about his work and it shows.',
    author: 'Jayden R.',
  },
  {
    text: 'Great haircut. Friendly staff. No long waits even without an appointment. The barbers are professional and focused.',
    author: 'Shon J.',
  },
  {
    text: 'Crisp edge and clean cut. Attention to detail from start to finish — exactly what you want from a barbershop.',
    author: 'Booksy Client',
  },
]

const HOURS = [
  { day: 'Monday', time: '10:00 AM – 7:00 PM' },
  { day: 'Tuesday', time: '10:00 AM – 7:00 PM' },
  { day: 'Wednesday', time: '10:00 AM – 7:00 PM' },
  { day: 'Thursday', time: '10:00 AM – 7:00 PM' },
  { day: 'Friday', time: '10:00 AM – 7:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 7:00 PM' },
  { day: 'Sunday', time: '10:00 AM – 5:00 PM' },
]

function useReveal() {
  const onIntersect = useEffectEvent((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    }
  })

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(onIntersect, {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px',
    })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(SERVICE_CATEGORIES[0].id)

  useReveal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const activeServices =
    SERVICE_CATEGORIES.find((category) => category.id === activeCategory)?.items ?? []

  return (
    <>
      <header className={`site-header ${scrolled || menuOpen ? 'scrolled' : ''}`}>
        <div className="container nav">
          <a href="#top" className="brand" onClick={closeMenu}>
            <span className="brand-mark">Suave Elite</span>
            <span className="brand-sub">Barbershop · Dallas</span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            <a href="#experience">Experience</a>
            <a href="#services">Services</a>
            <a href="#reviews">Reviews</a>
            <a href="#visit">Visit</a>
          </nav>

          <a className="btn btn-primary nav-cta" href={BOOKING_URL} target="_blank" rel="noreferrer">
            Book Now
          </a>

          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
          </button>
        </div>
      </header>

      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile">
        <a href="#experience" onClick={closeMenu}>Experience</a>
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#reviews" onClick={closeMenu}>Reviews</a>
        <a href="#visit" onClick={closeMenu}>Visit</a>
        <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noreferrer">
          Book Appointment
        </a>
      </nav>

      <main id="top">
        <section className="hero">
          <div className="hero-media" aria-hidden="true">
            <img
              src={HERO_IMAGE}
              alt=""
              width={2000}
              height={1333}
              fetchPriority="high"
            />
            <div className="hero-overlay" />
          </div>

          <div className="container hero-content">
            <h1 className="hero-brand">
              Suave Elite
              <span>Barbershop</span>
            </h1>
            <p className="hero-headline">Precision Grooming For The Discerning Gentleman.</p>
            <p className="hero-copy">
              Old East Dallas&apos; destination for sharp fades, classic cuts, and traditional
              shaves — crafted by a skilled team in a refined, welcoming shop.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noreferrer">
                Book Appointment
              </a>
              <a className="btn btn-ghost" href="#services">
                View Services
              </a>
            </div>
          </div>

          <div className="hero-scroll" aria-hidden="true">
            Scroll
          </div>
        </section>

        <section className="section experience" id="experience">
          <div className="container experience-grid">
            <div className="experience-visual reveal">
              <img
                src={EXPERIENCE_IMAGE}
                alt="Barber crafting a precision haircut"
                width={1400}
                height={1750}
                loading="lazy"
              />
            </div>

            <div className="experience-copy">
              <p className="section-label reveal">The Experience</p>
              <h2 className="section-title reveal reveal-delay-1">
                Modern Craft. Timeless Standards.
              </h2>
              <p className="reveal reveal-delay-2">
                Suave Elite Barbershop is a Latino-owned grooming house on Ross Avenue, built for
                clients who expect more than a quick cut. Our barbers specialize in men&apos;s
                haircuts, seamless fades, beard detailing, and traditional hot towel and
                straight-razor shaves — across African American, Asian, curly, and kids&apos; hair.
              </p>
              <p className="reveal reveal-delay-2">
                Walk-ins are welcome. Appointments are recommended. Either way, you leave sharper
                than you arrived.
              </p>

              <ul className="experience-points">
                <li className="reveal">
                  <span className="point-num">01</span>
                  <div className="point-text">
                    <strong>Technical Precision</strong>
                    <span>Fades, line-ups, and beard work executed with consistency and care.</span>
                  </div>
                </li>
                <li className="reveal reveal-delay-1">
                  <span className="point-num">02</span>
                  <div className="point-text">
                    <strong>Refined Atmosphere</strong>
                    <span>A clean, modern shop with a calm energy suited to high-end clients.</span>
                  </div>
                </li>
                <li className="reveal reveal-delay-2">
                  <span className="point-num">03</span>
                  <div className="point-text">
                    <strong>Trusted Team</strong>
                    <span>
                      Skilled barbers known for listening first — then delivering exactly what you
                      asked for.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container">
            <div className="section-head">
              <p className="section-label reveal">Services & Pricing</p>
              <h2 className="section-title reveal reveal-delay-1">The Full Menu.</h2>
              <p className="section-lead reveal reveal-delay-2">
                Every service we offer — from signature full grooming to quick edge-ups — priced for
                transparent, premium care.
              </p>
            </div>

            <div className="service-tabs reveal" role="tablist" aria-label="Service categories">
              {SERVICE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  role="tab"
                  aria-selected={activeCategory === category.id}
                  className={`service-tab ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="service-panel active" role="tabpanel" key={activeCategory}>
              <ul className="service-list">
                {activeServices.map((service) => (
                  <li className="service-item" key={service.name}>
                    <div>
                      <div className="service-name">{service.name}</div>
                      <div className="service-meta">
                        {service.detail} · {service.duration}
                      </div>
                    </div>
                    <div className="service-price">{service.price}</div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="services-note">
              Pricing reflects current Booksy listings and may vary by barber. Credit and debit cards
              accepted. Gift experiences available — inquire in shop or by phone.
            </p>

            <div className="services-cta">
              <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noreferrer">
                Reserve Your Chair
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="reviews">
          <div className="container">
            <div className="section-head">
              <p className="section-label reveal">Client Praise</p>
              <h2 className="section-title reveal reveal-delay-1">Rated 4.7+ On Google.</h2>
              <p className="section-lead reveal reveal-delay-2">
                A locally favored shop with a strong following for craftsmanship, punctuality, and a
                welcoming atmosphere.
              </p>
            </div>

            <div className="reviews-grid">
              <aside className="rating-card reveal">
                <div className="rating-score">4.7+</div>
                <div className="rating-stars" aria-hidden="true">
                  ★★★★★
                </div>
                <p>
                  Google reviews highlight precise fades, attentive barbers, and a clean modern
                  shop. On Booksy, Suave Elite carries a 5.0 rating from a large booking community.
                </p>
                <div style={{ marginTop: '1.5rem' }}>
                  <a className="btn btn-outline" href={GOOGLE_SEARCH} target="_blank" rel="noreferrer">
                    Read Google Reviews
                  </a>
                </div>
              </aside>

              <div className="quote-list">
                {QUOTES.map((quote, index) => (
                  <figure
                    className={`quote reveal ${index > 0 ? `reveal-delay-${index}` : ''}`}
                    key={quote.author}
                  >
                    <blockquote>“{quote.text}”</blockquote>
                    <cite>— {quote.author}</cite>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section visit" id="visit">
          <div className="container">
            <div className="section-head">
              <p className="section-label reveal">Visit Us</p>
              <h2 className="section-title reveal reveal-delay-1">Ross Avenue, Suite 110.</h2>
              <p className="section-lead reveal reveal-delay-2">
                Conveniently located in Old East Dallas with street, validated, and private lot
                parking — plus free Wi‑Fi and wheelchair-accessible entry.
              </p>
            </div>

            <div className="visit-grid">
              <div className="visit-map reveal">
                <iframe
                  title="Map to Suave Elite Barbershop"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Suave%20Elite%20Barbershop%204540%20Ross%20Ave%20Suite%20110%20Dallas%20TX%2075204&z=15&output=embed"
                />
              </div>

              <div className="visit-details reveal reveal-delay-1">
                <div className="visit-block">
                  <h3>Address</h3>
                  <p>{ADDRESS}</p>
                  <p style={{ marginTop: '0.5rem' }}>
                    <a href={MAPS_URL} target="_blank" rel="noreferrer">
                      Get directions
                    </a>
                  </p>
                </div>

                <div className="visit-block">
                  <h3>Contact</h3>
                  <p>
                    <a href={PHONE_TEL}>{PHONE}</a>
                  </p>
                  <p style={{ marginTop: '0.5rem' }}>
                    <a href={INSTAGRAM} target="_blank" rel="noreferrer">
                      @suaveelitebarbershop
                    </a>
                  </p>
                </div>

                <div className="visit-block">
                  <h3>Hours</h3>
                  <ul className="hours-list">
                    {HOURS.map((row) => (
                      <li key={row.day}>
                        <span>{row.day}</span>
                        <span>{row.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="visit-actions">
                  <a className="btn btn-ink" href={BOOKING_URL} target="_blank" rel="noreferrer">
                    Book on Booksy
                  </a>
                  <a className="btn btn-outline" href={PHONE_TEL}>
                    Call the Shop
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="container">
            <p className="section-label" style={{ color: 'var(--brass)' }}>
              Ready When You Are
            </p>
            <h2 className="section-title">Elevate Your Look At Suave Elite.</h2>
            <p className="section-lead">
              Appointments recommended. Walk-ins welcomed. Come experience the best fades in town.
            </p>
            <div className="cta-actions">
              <a className="btn btn-primary" href={BOOKING_URL} target="_blank" rel="noreferrer">
                Book Appointment
              </a>
              <a className="btn btn-ghost" href={PHONE_TEL}>
                {PHONE}
              </a>
            </div>
          </div>
        </section>
      </main>

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
            <a href="#experience">Experience</a>
            <a href="#services">Services</a>
            <a href="#reviews">Reviews</a>
            <a href="#visit">Visit</a>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <a href={PHONE_TEL}>{PHONE}</a>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer">
              Book Online
            </a>
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
          <span>4540 Ross Ave Ste 110 · Dallas, TX</span>
        </div>
      </footer>
    </>
  )
}

export default App
