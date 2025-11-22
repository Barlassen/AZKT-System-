'use client'

import { useState, useEffect, useRef } from 'react'
import { languages } from '../lib/i18n'
import styles from './LanguageSelector.module.css'

export default function LanguageSelector({ currentLang, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageSelect = (langCode) => {
    onLanguageChange(langCode)
    setIsOpen(false)
  }

  return (
    <div className={styles.languageSelector} ref={dropdownRef}>
      <button
        className={styles.languageButton}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>🌐</span>
        <span>{languages[currentLang] || 'English'}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          {Object.entries(languages).map(([code, name]) => (
            <button
              key={code}
              className={`${styles.languageOption} ${currentLang === code ? styles.active : ''}`}
              onClick={() => handleLanguageSelect(code)}
              type="button"
            >
              {name}
              {currentLang === code && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

