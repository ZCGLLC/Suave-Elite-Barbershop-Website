import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import barbers from '../data/barbers.json'
import { ADDRESS, PHONE, PHONE_TEL } from '../constants'
import { SiteFooter, SiteHeader } from '../components/SiteChrome'
import { submitAppointment } from '../lib/bookingApi'
import {
  buildTimeSlots,
  downloadIcs,
  formatDisplayDate,
  formatTimeLabel,
  getMonthMatrix,
  isDateBookable,
  toDateKey,
} from '../lib/schedule'

const STEPS = ['Barber', 'Service', 'Schedule', 'Details', 'Confirm']

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

const emptyCustomer = {
  name: '',
  email: '',
  phone: '',
  notes: '',
}

export default function Book() {
  const [step, setStep] = useState(0)
  const [selectedId, setSelectedId] = useState(barbers[0]?.id ?? null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [customer, setCustomer] = useState(emptyCustomer)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const today = useMemo(() => new Date(), [])
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )

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

  const monthCells = useMemo(
    () => getMonthMatrix(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth],
  )

  const timeSlots = useMemo(() => {
    if (!selectedBarber || !selectedService || !selectedDate) return []
    return buildTimeSlots({
      dateKey: selectedDate,
      durationMin: selectedService.durationMin || 30,
      barberId: selectedBarber.id,
    })
  }, [selectedBarber, selectedService, selectedDate])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step, confirmation])

  const onSelectBarber = (id) => {
    setSelectedId(id)
    setSelectedService(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setError('')
  }

  const goNextFromService = () => {
    if (!selectedService) {
      setError('Please Select A Service To Continue.')
      return
    }
    setError('')
    setStep(2)
  }

  const goNextFromSchedule = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please Select A Date And Time.')
      return
    }
    setError('')
    setStep(3)
  }

  const goNextFromDetails = () => {
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setError('Please Enter Your Name, Email, And Phone Number.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      setError('Please Enter A Valid Email Address.')
      return
    }
    setError('')
    setStep(4)
  }

  const onSubmit = async () => {
    if (!selectedBarber || !selectedService || !selectedDate || !selectedTime) return
    setSubmitting(true)
    setError('')
    try {
      const result = await submitAppointment({
        barber: selectedBarber,
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        customer,
      })
      setConfirmation(result)
    } catch (err) {
      if (err.appointment) {
        setConfirmation({
          appointment: err.appointment,
          ics: err.ics,
          emailResult: err.emailResult,
          barberEmail: err.appointment.barberEmail,
          emailWarning: err.message,
        })
      } else {
        setError(err.message || 'Something went wrong while booking. Please try again or call the shop.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const resetBooking = () => {
    setStep(0)
    setSelectedService(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setCustomer(emptyCustomer)
    setConfirmation(null)
    setError('')
  }

  if (confirmation?.appointment) {
    const apt = confirmation.appointment
    return (
      <>
        <SiteHeader />
        <main className="book-page">
          <section className="book-hero">
            <div className="container">
              <p className="section-label">Appointment Confirmed</p>
              <h1 className="section-title">You&apos;re On The Schedule.</h1>
              <p className="section-lead">
                {confirmation.emailWarning
                  ? confirmation.emailWarning
                  : `A confirmation was sent to ${apt.customerEmail}, and ${apt.barberName} was notified at ${confirmation.barberEmail}.`}
              </p>
            </div>
          </section>

          <section className="section book-section">
            <div className="container book-confirm-card">
              <dl className="confirm-grid">
                <div>
                  <dt>Confirmation</dt>
                  <dd>{apt.id}</dd>
                </div>
                <div>
                  <dt>Barber</dt>
                  <dd>{apt.barberName}</dd>
                </div>
                <div>
                  <dt>Service</dt>
                  <dd>
                    {apt.serviceName}
                    {apt.servicePrice ? ` · ${apt.servicePrice}` : ''}
                  </dd>
                </div>
                <div>
                  <dt>When</dt>
                  <dd>
                    {formatDisplayDate(apt.date)} · {formatTimeLabel(apt.time)}
                  </dd>
                </div>
                <div>
                  <dt>Guest</dt>
                  <dd>
                    {apt.customerName}
                    <br />
                    {apt.customerEmail}
                    <br />
                    {apt.customerPhone}
                  </dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{ADDRESS}</dd>
                </div>
              </dl>

              <div className="book-confirm-actions" style={{ marginTop: '1.75rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    downloadIcs(
                      `suave-elite-${apt.date}.ics`,
                      confirmation.ics,
                    )
                  }
                >
                  Add To Calendar
                </button>
                <a className="btn btn-outline" href={PHONE_TEL}>
                  Call {PHONE}
                </a>
                <button type="button" className="btn btn-outline" onClick={resetBooking}>
                  Book Another
                </button>
                <Link className="btn btn-ink" to="/">
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

  return (
    <>
      <SiteHeader />
      <main className="book-page">
        <section className="book-hero">
          <div className="container">
            <p className="section-label">Book An Appointment</p>
            <h1 className="section-title">
              {step === 0 && 'Choose Your Barber'}
              {step === 1 && 'Choose Your Service'}
              {step === 2 && 'Pick A Date & Time'}
              {step === 3 && 'Your Details'}
              {step === 4 && 'Confirm Booking'}
            </h1>
            <p className="section-lead">
              Stay on site to reserve your chair — select your barber, service, time, and contact
              details. We&apos;ll set the appointment and email your barber.
            </p>

            <ol className="book-steps" aria-label="Booking Steps">
              {STEPS.map((label, index) => (
                <li key={label} className={index === step ? 'active' : index < step ? 'done' : ''}>
                  <span>{index + 1}</span>
                  {label}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section book-section">
          <div className="container">
            {error ? <p className="book-error" role="alert">{error}</p> : null}

            {step === 0 && (
              <div className="book-layout">
                <aside className="barber-rail" aria-label="Barbers">
                  <h2 className="book-rail-title">Our Barbers</h2>
                  <ul className="barber-list">
                    {barbers.map((barber) => {
                      const active = barber.id === selectedId
                      const minPrice = Math.min(
                        ...barber.services
                          .map((s) => priceSortValue(s.price))
                          .filter(Number.isFinite),
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
                                    {Number(barber.rating).toFixed(1)}★ · {barber.reviewsCount}{' '}
                                    Reviews
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
                          <p className="section-label">Selected Barber</p>
                          <h2 className="section-title barber-menu-title">{selectedBarber.name}</h2>
                          <p className="section-lead">
                            {selectedBarber.services.length} Services
                            {startingAt != null ? ` · Starting At $${startingAt.toFixed(0)}` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setError('')
                            setStep(1)
                          }}
                        >
                          View Services
                        </button>
                      </div>
                      <p className="book-hint">
                        Next, choose a service from {selectedBarber.name}&apos;s menu and pricing.
                      </p>
                    </>
                  ) : (
                    <p>Select A Barber To Begin.</p>
                  )}
                </div>
              </div>
            )}

            {step === 1 && selectedBarber && (
              <div className="barber-menu">
                <div className="barber-menu-head">
                  <div>
                    <p className="section-label">Service Menu</p>
                    <h2 className="section-title barber-menu-title">{selectedBarber.name}</h2>
                    <p className="section-lead">Select One Service To Schedule</p>
                  </div>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(0)}>
                    Change Barber
                  </button>
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
                          onClick={() => {
                            setSelectedService(service)
                            setSelectedDate(null)
                            setSelectedTime(null)
                            setError('')
                          }}
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
                  <p>
                    {selectedService ? (
                      <>
                        Selected: <strong>{selectedService.name}</strong>
                        {selectedService.price ? ` · ${selectedService.price}` : ''}
                      </>
                    ) : (
                      'Select a service to continue to the calendar.'
                    )}
                  </p>
                  <div className="book-confirm-actions">
                    <button type="button" className="btn btn-primary" onClick={goNextFromService}>
                      Continue To Calendar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && selectedBarber && selectedService && (
              <div className="schedule-layout">
                <div className="calendar-panel">
                  <div className="calendar-head">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() =>
                        setVisibleMonth(
                          new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
                        )
                      }
                    >
                      Prev
                    </button>
                    <h2 className="calendar-title">
                      {visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() =>
                        setVisibleMonth(
                          new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
                        )
                      }
                    >
                      Next
                    </button>
                  </div>

                  <div className="calendar-weekdays" aria-hidden="true">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  <div className="calendar-grid">
                    {monthCells.map((date, idx) => {
                      if (!date) return <span key={`e-${idx}`} className="cal-cell empty" />
                      const key = toDateKey(date)
                      const bookable = isDateBookable(date)
                      const active = selectedDate === key
                      return (
                        <button
                          key={key}
                          type="button"
                          className={`cal-cell ${bookable ? '' : 'disabled'} ${active ? 'active' : ''}`}
                          disabled={!bookable}
                          onClick={() => {
                            setSelectedDate(key)
                            setSelectedTime(null)
                            setError('')
                          }}
                        >
                          {date.getDate()}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="times-panel">
                  <h2 className="book-rail-title">
                    {selectedDate ? formatDisplayDate(selectedDate) : 'Select A Date'}
                  </h2>
                  <p className="section-lead" style={{ marginBottom: '1rem' }}>
                    {selectedService.name} · {formatDuration(selectedService.durationMin) || '30 Min'}{' '}
                    with {selectedBarber.name}
                  </p>

                  {!selectedDate ? (
                    <p className="book-hint">Choose an available day on the calendar.</p>
                  ) : timeSlots.length === 0 ? (
                    <p className="book-hint">No remaining times on this day. Please pick another date.</p>
                  ) : (
                    <div className="time-grid">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          className={`time-slot ${selectedTime === slot.time ? 'active' : ''} ${slot.available ? '' : 'taken'}`}
                          disabled={!slot.available}
                          onClick={() => {
                            setSelectedTime(slot.time)
                            setError('')
                          }}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="book-confirm-actions" style={{ marginTop: '1.5rem' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button type="button" className="btn btn-primary" onClick={goNextFromSchedule}>
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="details-panel">
                <h2 className="book-rail-title">Guest Information</h2>
                <p className="section-lead" style={{ marginBottom: '1.25rem' }}>
                  {selectedService?.name} with {selectedBarber?.name} on{' '}
                  {selectedDate ? formatDisplayDate(selectedDate) : ''} at{' '}
                  {selectedTime ? formatTimeLabel(selectedTime) : ''}
                </p>

                <form
                  className="details-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    goNextFromDetails()
                  }}
                >
                  <label>
                    Full Name
                    <input
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                      placeholder="Your Name"
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      required
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      required
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                      placeholder="(214) 555-0100"
                      autoComplete="tel"
                    />
                  </label>
                  <label className="full">
                    Notes (Optional)
                    <textarea
                      rows={4}
                      value={customer.notes}
                      onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                      placeholder="Style preferences, allergies, or arrival notes"
                    />
                  </label>

                  <div className="book-confirm-actions full">
                    <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Review Booking
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 4 && selectedBarber && selectedService && selectedDate && selectedTime && (
              <div className="book-confirm-card">
                <h2 className="book-rail-title">Review & Submit</h2>
                <dl className="confirm-grid">
                  <div>
                    <dt>Barber</dt>
                    <dd>{selectedBarber.name}</dd>
                  </div>
                  <div>
                    <dt>Service</dt>
                    <dd>
                      {selectedService.name}
                      {selectedService.price ? ` · ${selectedService.price}` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt>When</dt>
                    <dd>
                      {formatDisplayDate(selectedDate)} · {formatTimeLabel(selectedTime)}
                    </dd>
                  </div>
                  <div>
                    <dt>Guest</dt>
                    <dd>
                      {customer.name}
                      <br />
                      {customer.email}
                      <br />
                      {customer.phone}
                    </dd>
                  </div>
                  {customer.notes ? (
                    <div className="full">
                      <dt>Notes</dt>
                      <dd>{customer.notes}</dd>
                    </div>
                  ) : null}
                </dl>

                <p className="book-hint" style={{ marginTop: '1rem' }}>
                  Submitting will reserve this time on our schedule and email {selectedBarber.name}{' '}
                  with your appointment details. You&apos;ll receive a confirmation as well.
                </p>

                <div className="book-confirm-actions" style={{ marginTop: '1.25rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(3)}>
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={submitting}
                    onClick={onSubmit}
                  >
                    {submitting ? 'Scheduling…' : 'Confirm Appointment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
