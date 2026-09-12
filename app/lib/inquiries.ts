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
