const SHEET_TITLE = 'Tifo Market - Inquiries'
const TAB_NAME = 'Inquiries'
const HEADERS = ['Timestamp', 'Name', 'Company', 'Phone', 'Email', 'Inquiry Type', 'Message']

/**
 * Paste the Tifo Gmail that should receive inquiry emails.
 * Leave blank to send to the Google account that deployed this script.
 */
const NOTIFY_EMAIL = ''

/**
 * Paste the ID of the Google Sheet you created in the Tifo Google account.
 * The ID is the long string in the sheet URL:
 * https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
 *
 * Leave blank to auto-create a sheet on first submission.
 */
const USER_SPREADSHEET_ID = ''

function doGet() {
  return json_({ ok: true, service: 'Tifo Market Inquiries' })
}

function doPost(e) {
  try {
    const data = parseBody_(e)
    const name = String(data.name || '').trim()
    const company = String(data.company || '').trim()
    const phone = String(data.phone || '').trim()
    const email = String(data.email || '').trim()
    const inquiryType = String(data.inquiryType || '').trim()
    const message = String(data.message || '').trim()

    if (!name || !email || !inquiryType || !message) {
      return json_({ ok: false, error: 'Missing required fields' })
    }

    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss')
    appendIntake_([timestamp, name, company, phone, email, inquiryType, message])
    sendNotice_(timestamp, name, company, phone, email, inquiryType, message)

    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) })
  }
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents)
    } catch (err) {
      throw new Error('Could not read the inquiry.')
    }
  }
  return (e && e.parameter) || {}
}

function getSpreadsheet_() {
  if (USER_SPREADSHEET_ID) {
    return SpreadsheetApp.openById(USER_SPREADSHEET_ID)
  }

  try {
    const active = SpreadsheetApp.getActiveSpreadsheet()
    if (active) {
      return active
    }
  } catch (err) {
    // Standalone script — fall through to saved/created spreadsheet.
  }

  const props = PropertiesService.getScriptProperties()
  const existingId = props.getProperty('SPREADSHEET_ID')

  if (existingId) {
    return SpreadsheetApp.openById(existingId)
  }

  const ss = SpreadsheetApp.create(SHEET_TITLE)
  props.setProperty('SPREADSHEET_ID', ss.getId())
  return ss
}

function getIntakesSheet_() {
  const ss = getSpreadsheet_()
  let sheet = ss.getSheetByName(TAB_NAME)

  if (!sheet) {
    sheet = ss.getSheets()[0]
    sheet.setName(TAB_NAME)
  }

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]
  const needsHeaders = HEADERS.some(function (header, i) {
    return String(firstRow[i] || '') !== header
  })

  if (needsHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }

  return sheet
}

function appendIntake_(row) {
  getIntakesSheet_().appendRow(row)
}

function notifyEmail_() {
  return NOTIFY_EMAIL || Session.getEffectiveUser().getEmail()
}

function sendNotice_(timestamp, name, company, phone, email, inquiryType, message) {
  const to = notifyEmail_()
  if (!to) {
    throw new Error('No notify email configured for Tifo inquiries.')
  }

  const body = [
    'A new inquiry was submitted on the Tifo Market website.',
    '',
    'Submitted: ' + timestamp,
    'Name: ' + name,
    'Company / Brand: ' + (company || '—'),
    'Phone: ' + (phone || '—'),
    'Email: ' + email,
    'Inquiry Type: ' + inquiryType,
    '',
    'Message:',
    message,
  ].join('\n')

  MailApp.sendEmail({
    to: to,
    replyTo: email,
    subject: 'New Tifo inquiry (' + inquiryType + ') from ' + name,
    body: body,
  })
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}
