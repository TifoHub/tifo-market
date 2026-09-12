export const inquiryTypes = [
  'Sponsorship',
  'Collaboration',
  'Events',
  'Press',
  'General',
] as const

export type InquiryType = (typeof inquiryTypes)[number]

export const inquiryFields = [
  'name',
  'email',
  'inquiryType',
  'message',
] as const

export type InquiryPayload = {
  name: string
  email: string
  phone: string
  company: string
  inquiryType: string
  message: string
}

export function phoneDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, 10)
}

export function formatPhone(value: string) {
  const digits = phoneDigits(value)
  if (digits.length === 0) return ''
  if (digits.length < 4) return `(${digits}`
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function isCompletePhone(value: string) {
  return phoneDigits(value).length === 10
}
