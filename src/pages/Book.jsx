import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import barbers from '../data/barbers.json'
import { PHONE, PHONE_TEL } from '../constants'
import { SiteFooter, SiteHeader } from '../components/SiteChrome'

function formatDuration(minutes) {
  if (!minutes) return null
  if (minutes < 60) return `${minutes} Min`
  const hours = Math.floor(minutes / 60)
  const rem = minutes % 60
  if (!rem) return `${hours} Hr`
  return `${hours} Hr ${rem} Min`
}

function priceSortValue(price) {
  if (!price) return Number.POSITIVE_INFINITY
  const n = Number(String(price).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
}

export default function Book() {
  const [selectedId, setSelectedId] = useState(barbers[0]?.id ?? null)
  const [selectedService, setSelectedService] = useState(null)

  const selectedBarber = useMemo(
    () => barbers.find((barber) => barber.id === selectedId) ?? null,
    [selectedId],
  )

  const startingAt = useMemo(() => {
    if (!selectedBarber) return null
    const prices = selectedBarber.services.map((s) => priceSortValue(s.price)).filter(Number.isFinite)
    if (!prices.length) return null
    return Math.min(...prices)
  }, [selectedBarber])

  const onSelectBarber = (id) => {
    setSelectedId(id)
    setSelectedService(null)
  }

  return (
    <>
      <SiteHeader />
      <main className="book-page">
        <section className="book-hero">
          <div className="container">
            <p className="section-label">Book An Appointment</p>
            <h1 className="section-title">Choose Your Barber</h1>
            <p className="section-lead">
              Select a barber to view their full service menu and pricing. Each cutter sets their own
              rates — then continue to schedule your visit.
            </p>
          </div>
        </section>

        <section className="section book-section">
          <div className="container book-layout">
            <aside className="barber-rail" aria-label="Barbers">
              <h2 className="book-rail-title">Our Barbers</h2>
              <ul className="barber-list">
                {barbers.map((barber) => {
                  const active = barber.id === selectedId
                  const minPrice = Math.min(
                    ...barber.services.map((s) => priceSortValue(s.price)).filter(Number.isFinite),
                  )
                  return (
                    <li key={barber.id}>
                      <button
                        type="button"
                        className={`barber-card ${active ? 'active' : ''}`}
                        onClick={() => onSelectBarber(barber.id)}
                        aria-pressed={active}
                      >
                        <div className="barber-card-media">
                          {barber.photo ? (
                            <img src={barber.photo} alt="" loading="lazy" />
                          ) : (
                            <div className="barber-fallback" aria-hidden="true">
                              {barber.name.slice(0, 1)}
                            </div>
                          )}
                        </div>
                        <div className="barber-card-body">
                          <div className="barber-card-name">{barber.name}</div>
                          <div className="barber-card-meta">
                            {barber.rating ? (
                              <span>
                                {barber.rating.toFixed(1)}★ · {barber.reviewsCount} Reviews
                              </span>
                            ) : (
                              <span>{barber.services.length} Services</span>
                            )}
                          </div>
                          {Number.isFinite(minPrice) && (
                            <div className="barber-card-price">From ${minPrice.toFixed(0)}</div>
                          )}
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </aside>

            <div className="barber-menu">
              {selectedBarber ? (
                <>
                  <div className="barber-menu-head">
                    <div>
                      <p className="section-label">Service Menu</p>
                      <h2 className="section-title barber-menu-title">{selectedBarber.name}</h2>
                      <p className="section-lead">
                        {selectedBarber.services.length} Services
                        {startingAt != null ? ` · Starting At $${startingAt.toFixed(0)}` : ''}
                        {selectedBarber.rating
                          ? ` · ${selectedBarber.rating.toFixed(1)}★ On Booksy`
                          : ''}
                      </p>
                    </div>
                    <a
                      className="btn btn-ink"
                      href={selectedBarber.booksyUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Schedule On Booksy
                    </a>
                  </div>

                  <ul className="book-service-list">
                    {selectedBarber.services.map((service, index) => {
                      const key = `${service.name}-${service.price}-${index}`
                      const active =
                        selectedService?.name === service.name &&
                        selectedService?.price === service.price &&
                        selectedService?.durationMin === service.durationMin
                      return (
                        <li key={key}>
                          <button
                            type="button"
                            className={`book-service-item ${active ? 'active' : ''}`}
                            onClick={() => setSelectedService(service)}
                          >
                            <div className="book-service-main">
                              <div className="book-service-name">{service.name}</div>
                              <div className="book-service-meta">
                                {formatDuration(service.durationMin) || 'Duration Varies'}
                                {service.deposit ? ` · $${service.deposit} Deposit` : ''}
                              </div>
                              {service.description ? (
                                <p className="book-service-desc">{service.description}</p>
                              ) : null}
                            </div>
                            <div className="book-service-pricing">
                              <div className="book-service-price">{service.price || 'Ask'}</div>
                              {service.promoPrice ? (
                                <div className="book-service-promo">Promo {service.promoPrice}</div>
                              ) : null}
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="book-confirm">
                    <div>
                      <h3 className="book-confirm-title">Ready To Book?</h3>
                      <p>
                        {selectedService ? (
                          <>
                            Selected: <strong>{selectedService.name}</strong>
                            {selectedService.price ? ` · ${selectedService.price}` : ''} with{' '}
                            <strong>{selectedBarber.name}</strong>
                          </>
                        ) : (
                          <>
                            Choose a service above, then continue to schedule with{' '}
                            <strong>{selectedBarber.name}</strong>.
                          </>
                        )}
                      </p>
                    </div>
                    <div className="book-confirm-actions">
                      <a
                        className="btn btn-primary"
                        href={selectedBarber.booksyUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Continue To Booking
                      </a>
                      <a className="btn btn-outline" href={PHONE_TEL}>
                        Call {PHONE}
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <p>Select A Barber To View Pricing.</p>
              )}
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="container">
            <p className="section-label" style={{ color: 'var(--brass)' }}>
              Prefer A Walk-In?
            </p>
            <h2 className="section-title">We Welcome Walk-Ins When Availability Allows.</h2>
            <p className="section-lead">
              Appointments Are Recommended — Especially On Weekends. Call The Shop Or Return Home To
              Explore The Full Experience.
            </p>
            <div className="cta-actions">
              <a className="btn btn-primary" href={PHONE_TEL}>
                {PHONE}
              </a>
              <Link className="btn btn-ghost" to="/">
                Back To Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
