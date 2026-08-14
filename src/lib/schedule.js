import {
  BOOKING_HORIZON_DAYS,
  SHOP_HOURS,
  SLOT_INTERVAL_MIN,
} from '../data/bookingConfig'

const STORAGE_KEY = 'suave-elite-appointments-v1'

export function loadAppointments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveAppointment(appointment) {
  const all = loadAppointments()
  all.push(appointment)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return appointment
}

export function pad(n) {
  return String(n).padStart(2, '0')
}

export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDisplayDate(dateKey) {
  const date = parseDateKey(dateKey)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTimeLabel(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = ((h + 11) % 12) + 1
  return `${hour}:${pad(m)} ${period}`
}

export function addMinutes(hhmm, minutes) {
  const [h, m] = hhmm.split(':').map(Number)
  const total = h * 60 + m + minutes
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function getMonthMatrix(year, monthIndex) {
  const first = new Date(year, monthIndex, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startPad; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, monthIndex, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function isDateBookable(date, now = new Date()) {
  const hours = SHOP_HOURS[date.getDay()]
  if (!hours) return false
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  if (target < today) return false
  const horizon = new Date(today)
  horizon.setDate(horizon.getDate() + BOOKING_HORIZON_DAYS)
  if (target > horizon) return false
  return true
}

export function buildTimeSlots({ dateKey, durationMin, barberId, now = new Date() }) {
  const date = parseDateKey(dateKey)
  const hours = SHOP_HOURS[date.getDay()]
  if (!hours || !isDateBookable(date, now)) return []

  const duration = Math.max(durationMin || SLOT_INTERVAL_MIN, SLOT_INTERVAL_MIN)
  const openMin = hours.open * 60
  const closeMin = hours.close * 60
  const appointments = loadAppointments().filter(
    (a) => a.barberId === barberId && a.date === dateKey && a.status !== 'cancelled',
  )

  const slots = []
  for (let start = openMin; start + duration <= closeMin; start += SLOT_INTERVAL_MIN) {
    const hh = Math.floor(start / 60)
    const mm = start % 60
    const time = `${pad(hh)}:${pad(mm)}`
    const end = addMinutes(time, duration)

    // Skip past times for today
    if (toDateKey(now) === dateKey) {
      const nowMin = now.getHours() * 60 + now.getMinutes() + 30 // 30 min lead time
      if (start < nowMin) continue
    }

    const conflicts = appointments.some((a) => {
      const aStart = toMinutes(a.time)
      const aEnd = aStart + (a.durationMin || SLOT_INTERVAL_MIN)
      const bStart = start
      const bEnd = start + duration
      return bStart < aEnd && bEnd > aStart
    })

    slots.push({
      time,
      end,
      label: formatTimeLabel(time),
      available: !conflicts,
    })
  }
  return slots
}

export function createIcs({
  title,
  description,
  location,
  dateKey,
  time,
  durationMin,
  organizerEmail,
  attendeeEmail,
}) {
  const [y, mo, d] = dateKey.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const start = new Date(y, mo - 1, d, hh, mm, 0)
  const end = new Date(start.getTime() + (durationMin || 30) * 60000)

  const stamp = (dt) =>
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}Z`

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Suave Elite Barbershop//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@suaveelitebarbershop`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(location)}`,
  ]
  if (organizerEmail) lines.push(`ORGANIZER:mailto:${organizerEmail}`)
  if (attendeeEmail) lines.push(`ATTENDEE:mailto:${attendeeEmail}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n')
}

function escapeIcs(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

export function downloadIcs(filename, contents) {
  const blob = new Blob([contents], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
