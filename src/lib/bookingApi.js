import { ADDRESS, PHONE } from '../constants'
import { resolveBarberEmail } from '../data/bookingConfig'
import {
  createIcs,
  formatDisplayDate,
  formatTimeLabel,
  saveAppointment,
} from './schedule'

/**
 * Submit an appointment: persist locally and email the barber (FormSubmit).
 * Customer also receives an auto-response confirmation when FormSubmit is activated.
 */
export async function submitAppointment({
  barber,
  service,
  date,
  time,
  customer,
}) {
  const barberEmail = resolveBarberEmail(barber.id)
  const appointment = {
    id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    barberId: barber.id,
    barberName: barber.name,
    barberEmail,
    serviceName: service.name,
    servicePrice: service.price,
    durationMin: service.durationMin || 30,
    date,
    time,
    customerName: customer.name.trim(),
    customerEmail: customer.email.trim(),
    customerPhone: customer.phone.trim(),
    notes: (customer.notes || '').trim(),
  }

  const when = `${formatDisplayDate(date)} at ${formatTimeLabel(time)}`
  const message = [
    'New Suave Elite appointment request',
    '',
    `Confirmation ID: ${appointment.id}`,
    `Barber: ${appointment.barberName}`,
    `Service: ${appointment.serviceName}`,
    `Price: ${appointment.servicePrice || 'See menu'}`,
    `Duration: ${appointment.durationMin} minutes`,
    `When: ${when}`,
    '',
    `Customer: ${appointment.customerName}`,
    `Email: ${appointment.customerEmail}`,
    `Phone: ${appointment.customerPhone}`,
    appointment.notes ? `Notes: ${appointment.notes}` : '',
    '',
    `Shop: ${ADDRESS}`,
    `Shop phone: ${PHONE}`,
  ]
    .filter(Boolean)
    .join('\n')

  const ics = createIcs({
    title: `${appointment.serviceName} with ${appointment.barberName}`,
    description: message,
    location: ADDRESS,
    dateKey: date,
    time,
    durationMin: appointment.durationMin,
    organizerEmail: barberEmail,
    attendeeEmail: appointment.customerEmail,
  })

  // Persist schedule on-device / this browser profile
  saveAppointment(appointment)

  // Notify barber by email (FormSubmit). First use requires inbox confirmation.
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(barberEmail)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: `New Appointment — ${appointment.barberName} — ${when}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: appointment.customerEmail,
      _cc: appointment.customerEmail,
      _autoresponse: `Your Suave Elite appointment is scheduled for ${when} with ${appointment.barberName} (${appointment.serviceName}). Confirmation ID: ${appointment.id}. Shop: ${ADDRESS} · ${PHONE}`,
      name: appointment.customerName,
      email: appointment.customerEmail,
      phone: appointment.customerPhone,
      barber: appointment.barberName,
      service: appointment.serviceName,
      price: appointment.servicePrice || '',
      date: formatDisplayDate(date),
      time: formatTimeLabel(time),
      duration: `${appointment.durationMin} minutes`,
      notes: appointment.notes || 'None',
      confirmation_id: appointment.id,
      message,
    }),
  })

  let emailResult = { ok: response.ok, status: response.status }
  try {
    emailResult.body = await response.json()
  } catch {
    emailResult.body = null
  }

  if (!response.ok) {
    const err = new Error(
      emailResult.body?.message ||
        'Booking was saved, but the notification email could not be sent. Please call the shop to confirm.',
    )
    err.appointment = appointment
    err.ics = ics
    err.emailResult = emailResult
    throw err
  }

  return { appointment, ics, emailResult, barberEmail }
}
