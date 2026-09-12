import { NextResponse } from 'next/server'
import { inquiryFields, inquiryTypes, formatPhone, isCompletePhone } from '@/app/lib/inquiries'

export async function POST(request: Request) {
  const webAppUrl = process.env.APPS_SCRIPT_WEBAPP_URL

  if (!webAppUrl) {
    return NextResponse.json(
      { ok: false, error: 'Form submissions are not configured yet.' },
      { status: 503 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const payload: Record<string, string> = {}
  for (const field of inquiryFields) {
    const value = String(body[field] ?? '').trim()
    if (!value) {
      return NextResponse.json(
        { ok: false, error: 'Please fill in all required fields.' },
        { status: 400 },
      )
    }
    payload[field] = value
  }

  if (!inquiryTypes.includes(payload.inquiryType as (typeof inquiryTypes)[number])) {
    return NextResponse.json(
      { ok: false, error: 'Please choose what this inquiry is about.' },
      { status: 400 },
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email address.' },
      { status: 400 },
    )
  }

  payload.phone = String(body.phone ?? '').trim()
  payload.company = String(body.company ?? '').trim()

  if (payload.phone && !isCompletePhone(payload.phone)) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a 10-digit phone number, like (555) 000-0000.' },
      { status: 400 },
    )
  }

  if (payload.phone) {
    payload.phone = formatPhone(payload.phone)
  }

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })

    const text = await response.text()
    let result: { ok?: boolean; error?: string } = {}
    try {
      result = JSON.parse(text)
    } catch {
      result = {}
    }

    if (!response.ok || result.ok !== true) {
      const needsGoogleAuth = /authorization needed|review permissions|access denied/i.test(text)
      return NextResponse.json(
        {
          ok: false,
          error: result.error
            || (needsGoogleAuth
              ? 'Google still needs permission to save this inquiry. Open the Apps Script web app once, click Review Permissions, then try again.'
              : 'Unable to send your inquiry right now.'),
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to send your inquiry right now.' },
      { status: 502 },
    )
  }
}
