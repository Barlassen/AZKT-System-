'use client'

import { useState } from 'react'
import { getTranslations } from '../lib/i18n'
import styles from './DiscountCode.module.css'

const DISCOUNT_CODES = {
  'LAUZHACK2025': 0.20, // 20% discount
  'SBB50': 0.50, // 50% discount
  'STUDENT': 0.15, // 15% discount
  'WELCOME': 0.10, // 10% discount
}

export default function DiscountCode({ onDiscountApplied, language = 'en' }) {
  const t = (key) => {
    const translations = getTranslations(language)
    return translations[key] || key
  }

  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [error, setError] = useState(null)

  const handleApply = () => {
    setError(null)
    const upperCode = code.toUpperCase().trim()
    
    if (DISCOUNT_CODES[upperCode]) {
      const discountRate = DISCOUNT_CODES[upperCode]
      setDiscount(discountRate)
      setApplied(true)
      onDiscountApplied && onDiscountApplied(discountRate)
    } else {
      setError(t('invalidDiscountCode'))
    }
  }

  const handleRemove = () => {
    setCode('')
    setApplied(false)
    setDiscount(0)
    onDiscountApplied && onDiscountApplied(0)
  }

  return (
    <div className={styles.discountContainer}>
      {!applied ? (
        <div className={styles.inputGroup}>
          <input
            type="text"
            className="input"
            placeholder={t('discountCodePlaceholder')}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <button
            type="button"
            className={styles.applyButton}
            onClick={handleApply}
            disabled={!code.trim()}
          >
            {t('apply')}
          </button>
        </div>
      ) : (
        <div className={styles.appliedDiscount}>
          <span className={styles.discountText}>
            ✓ {t('discountApplied')}: {Math.round(discount * 100)}%
          </span>
          <button
            type="button"
            className={styles.removeButton}
            onClick={handleRemove}
          >
            ✕
          </button>
        </div>
      )}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  )
}

export function applyDiscount(price, discountRate) {
  return price * (1 - discountRate)
}

