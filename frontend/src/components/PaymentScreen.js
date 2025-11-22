'use client'

import { useState } from 'react'
import { getTranslations } from '../lib/i18n'
import styles from './PaymentScreen.module.css'

export default function PaymentScreen({ 
  ticketData, 
  onPaymentSuccess, 
  onCancel,
  language = 'en' 
}) {
  const t = (key) => {
    const translations = getTranslations(language)
    return translations[key] || key
  }

  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value)
    setExpiryDate(formatted)
  }

  const handleCvvChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').substring(0, 3)
    setCvv(v)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError(t('invalidCardNumber'))
      return
    }
    if (!cardName.trim()) {
      setError(t('invalidCardName'))
      return
    }
    if (expiryDate.length < 5) {
      setError(t('invalidExpiry'))
      return
    }
    if (cvv.length < 3) {
      setError(t('invalidCvv'))
      return
    }

    setProcessing(true)

    // Simulate payment processing (mock)
    setTimeout(() => {
      setProcessing(false)
      onPaymentSuccess()
    }, 2000)
  }

  return (
    <div className={styles.paymentOverlay}>
      <div className={styles.paymentCard}>
        <div className={styles.header}>
          <h2>{t('payment')}</h2>
          <button className={styles.closeButton} onClick={onCancel}>×</button>
        </div>

        <div className={styles.ticketSummary}>
          <h3>{t('ticketSummary')}</h3>
          <div className={styles.summaryRow}>
            <span>{t('route')}:</span>
            <strong>{ticketData.start} → {ticketData.destination}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>{t('date')}:</span>
            <strong>{ticketData.date}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>{t('time')}:</span>
            <strong>{ticketData.time}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>{t('ticketType')}:</span>
            <strong>{ticketData.ticketType === 'single' ? t('singleTicket') : t('dayPass')}</strong>
          </div>
          <div className={styles.priceRow}>
            <span>{t('total')}:</span>
            <strong className={styles.price}>CHF {ticketData.price.toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.paymentForm}>
          <div className={styles.formGroup}>
            <label>{t('cardNumber')}</label>
            <input
              type="text"
              className="input"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t('cardName')}</label>
            <input
              type="text"
              className="input"
              placeholder={t('cardNamePlaceholder')}
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>{t('expiryDate')}</label>
              <input
                type="text"
                className="input"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                maxLength={5}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t('cvv')}</label>
              <input
                type="text"
                className="input"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                maxLength={3}
                required
              />
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.note}>
            <p>🔒 {t('paymentNote')}</p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={processing}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="btn"
              disabled={processing}
            >
              {processing ? t('processing') : `${t('pay')} CHF ${ticketData.price.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

