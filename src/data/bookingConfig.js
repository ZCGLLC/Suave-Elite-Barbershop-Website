/** Shop hours and booking notification targets. */
export const SHOP_HOURS = {
  // 0 = Sunday ... 6 = Saturday
  0: { open: 10, close: 17 }, // Sunday 10–5
  1: { open: 10, close: 19 },
  2: { open: 10, close: 19 },
  3: { open: 10, close: 19 },
  4: { open: 10, close: 19 },
  5: { open: 10, close: 19 },
  6: { open: 10, close: 19 },
}

export const SLOT_INTERVAL_MIN = 15
export const BOOKING_HORIZON_DAYS = 45

/** Fallback shop inbox — override with VITE_SHOP_BOOKING_EMAIL or SHOP_BOOKING_EMAIL. */
export const DEFAULT_SHOP_EMAIL =
  import.meta.env.VITE_SHOP_BOOKING_EMAIL ||
  import.meta.env.SHOP_BOOKING_EMAIL ||
  'suaveelitebarbershop@gmail.com'

/**
 * Optional per-barber inboxes. Falls back to DEFAULT_SHOP_EMAIL.
 * Populate via Vite env or edit this map.
 */
export const BARBER_EMAILS = {
  '611673':
    import.meta.env.VITE_BARBER_EMAIL_MICHAEL_ANGELO ||
    import.meta.env.BARBER_EMAIL_MICHAEL_ANGELO ||
    '',
  '1480891':
    import.meta.env.VITE_BARBER_EMAIL_BRYAN || import.meta.env.BARBER_EMAIL_BRYAN || '',
  '954973':
    import.meta.env.VITE_BARBER_EMAIL_TRUEBLENDZ ||
    import.meta.env.BARBER_EMAIL_TRUEBLENDZ ||
    '',
  '1379513':
    import.meta.env.VITE_BARBER_EMAIL_JC_CUTS || import.meta.env.BARBER_EMAIL_JC_CUTS || '',
  '1429427':
    import.meta.env.VITE_BARBER_EMAIL_AB_CUTZZ || import.meta.env.BARBER_EMAIL_AB_CUTZZ || '',
  '1512855':
    import.meta.env.VITE_BARBER_EMAIL_ANDY_ORU || import.meta.env.BARBER_EMAIL_ANDY_ORU || '',
  '1808602':
    import.meta.env.VITE_BARBER_EMAIL_JACKIE_JAMES ||
    import.meta.env.BARBER_EMAIL_JACKIE_JAMES ||
    '',
  '1354808':
    import.meta.env.VITE_BARBER_EMAIL_JHON_CUTS || import.meta.env.BARBER_EMAIL_JHON_CUTS || '',
}

export function resolveBarberEmail(barberId) {
  const specific = BARBER_EMAILS[barberId]
  return (specific && specific.trim()) || DEFAULT_SHOP_EMAIL
}
