'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getTranslations } from '../lib/i18n'
import styles from './QRDisplay.module.css'

export default function QRDisplay({ ticket, onNewTicket, language = 'en' }) {
  const t = (key) => {
    const translations = getTranslations(language)
    return translations[key] || key
  }
  const [copied, setCopied] = useState(false)

  const ticketString = JSON.stringify(ticket)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ticketString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <h2 style={{ color: '#DC143C', marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>{t('yourTicket')}</h2>

      <div className={styles.ticketInfo} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px' }}>
        <div className={styles.route}>
          <span className={styles.label}>{t('from')}:</span>
          <span className={styles.value}>{ticket.start}</span>
        </div>
        <div className={styles.route}>
          <span className={styles.label}>{t('to')}:</span>
          <span className={styles.value}>{ticket.destination}</span>
        </div>
        <div className={styles.validity}>
          <span className={styles.label}>{t('date')} & {t('time')}:</span>
          <span className={styles.value}>
            {ticket.date} {t('at')} {ticket.time}
          </span>
        </div>
        <div className={styles.validity}>
          <span className={styles.label}>{t('validUntil')}:</span>
          <span className={styles.value}>
            {formatDate(ticket.validity.end)}
          </span>
        </div>
        <div className={styles.ticketId}>
          <span className={styles.label}>{t('type')}:</span>
          <span className={styles.value}>{ticket.ticketType}</span>
        </div>
        <div className={styles.ticketId}>
          <span className={styles.label}>{t('price')}:</span>
          <span className={styles.value} style={{ color: '#DC143C', fontWeight: '700' }}>
            CHF {typeof ticket.price === 'number' ? ticket.price.toFixed(2) : ticket.price || '0.00'}
          </span>
        </div>
      </div>

      <div className="qr-container">
        <QRCodeSVG
          value={ticketString}
          size={256}
          level="M"
          includeMargin={true}
        />
      </div>

      <div className={styles.actions}>
        <button
          onClick={copyToClipboard}
          className={styles.copyBtn}
        >
          {copied ? t('copied') : t('copyTicket')}
        </button>
        <button
          onClick={() => {
            // Save ticket to history
            if (window.azktSaveTicket) {
              window.azktSaveTicket(ticket)
            }
            // Print ticket
            window.print()
          }}
          className="btn"
          style={{ background: '#000000' }}
        >
          🖨️ {t('printTicket')}
        </button>
        <button
          onClick={onNewTicket}
          className="btn"
        >
          {t('newTicket')}
        </button>
      </div>

      <div className={styles.security}>
        <p>🔒 {t('securityFeatures')}:</p>
        <ul>
          <li>{t('zkProof')}: <strong style={{ color: ticket.zkProof ? '#DC143C' : '#666' }}>{ticket.zkProof ? t('generated') : t('missing')}</strong></li>
          <li>{t('signature')}: <strong style={{ color: ticket.signature ? '#DC143C' : '#666' }}>{ticket.signature ? t('signedBySBB') : t('missing')}</strong></li>
          <li>{t('ephemeralKey')}: <strong style={{ color: '#DC143C' }}>{t('active')}</strong></li>
        </ul>
      </div>

      <div className={styles.note}>
        <p><strong>📱</strong> {t('showQR')}</p>
        <p><strong>🖨️</strong> {t('printTicket')}</p>
        <p><strong>✅</strong> {t('multiCheckNote')}</p>
        <p><strong>🔒</strong> {t('copySafeNote')}</p>
      </div>
    </div>
  )
}


