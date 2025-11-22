'use client'

import { useState, useEffect } from 'react'
import { EphemeralWallet } from '../lib/wallet'
import TicketSelector from '../components/TicketSelector'
import QRDisplay from '../components/QRDisplay'
import PaymentScreen from '../components/PaymentScreen'
import TicketHistory from '../components/TicketHistory'
import LanguageSelector from '../components/LanguageSelector'
import { getTranslations } from '../lib/i18n'
import pkg from 'tweetnacl-util'
const { encodeBase64 } = pkg
import styles from './page.module.css'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export default function Home() {
  const [wallet, setWallet] = useState(null)
  const [ticket, setTicket] = useState(null)
  const [zkProofData, setZkProofData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [language, setLanguage] = useState('en') // Default to English
  const [showPayment, setShowPayment] = useState(false)
  const [pendingTicketData, setPendingTicketData] = useState(null)

  // Initialize ephemeral wallet on mount
  useEffect(() => {
    const newWallet = new EphemeralWallet()
    const keyPair = newWallet.generate()
    setWallet(newWallet)
    
    // Load saved language preference
    const savedLang = localStorage.getItem('azkt-language')
    if (savedLang && ['de', 'en', 'fr', 'tr'].includes(savedLang)) {
      setLanguage(savedLang)
    }
  }, [])
  
  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    localStorage.setItem('azkt-language', lang)
  }
  
  const t = (key) => {
    const translations = getTranslations(language)
    return translations[key] || key
  }

  const handleTicketRequest = (ticketData) => {
    // Show payment screen first
    setPendingTicketData(ticketData)
    setShowPayment(true)
    setError(null)
  }

  const handlePaymentSuccess = async () => {
    if (!wallet || !pendingTicketData) {
      setError('Wallet not initialized')
      setShowPayment(false)
      return
    }

    setLoading(true)
    setError(null)
    setShowPayment(false)

    try {
      const userPublicKey = wallet.getPublicKey()
      const userPrivateKey = wallet.keyPair ? 
        encodeBase64(wallet.keyPair.secretKey) : null

      if (!userPrivateKey) {
        throw new Error('Private key not available')
      }

      const response = await fetch(`${BACKEND_URL}/api/ticket/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: pendingTicketData.start,
          destination: pendingTicketData.destination,
          date: pendingTicketData.date,
          time: pendingTicketData.time,
          ticketType: pendingTicketData.ticketType,
          price: pendingTicketData.price,
          userPublicKey: userPublicKey,
          userPrivateKey: userPrivateKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate ticket')
      }

      const result = await response.json()
      setTicket(result.ticket)
      setZkProofData(result.zkProofData)
      
      // Save ticket to history
      if (window.azktSaveTicket) {
        window.azktSaveTicket(result.ticket)
      }
      
      setPendingTicketData(null)

    } catch (err) {
      setError(err.message)
      console.error('Ticket request error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setPendingTicketData(null)
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* SBB Style Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuButton}>
              <span>☰</span>
              <span>{t('menu')}</span>
            </button>
          </div>
          <div className={styles.headerRight}>
            <a href="#" className={styles.headerLink}>
              <span>🔍</span>
              <span>{t('search')}</span>
            </a>
            <a href="#" className={styles.headerLink}>
              <span>👤</span>
              <span>{t('login')}</span>
            </a>
            <LanguageSelector 
              currentLang={language} 
              onLanguageChange={handleLanguageChange}
            />
            <div className={styles.logoContainer}>
              <img 
                src="/sbb-logo.svg" 
                alt="SBB Logo" 
                className={styles.sbbLogo}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </header>

        {/* Red Banner with Search Card */}
        <div className={styles.content}>
          <div className={styles.searchCard}>
            {error && (
              <div className="status invalid" style={{ marginBottom: '20px' }}>
                Error: {error}
              </div>
            )}

            {!ticket ? (
              <TicketSelector
                onRequestTicket={handleTicketRequest}
                loading={loading}
                language={language}
              />
            ) : (
              <QRDisplay
                ticket={ticket}
                zkProofData={zkProofData}
                language={language}
                onNewTicket={() => {
                  setTicket(null)
                  setZkProofData(null)
                  const newWallet = new EphemeralWallet()
                  newWallet.generate()
                  setWallet(newWallet)
                }}
              />
            )}

            {showPayment && pendingTicketData && (
              <PaymentScreen
                ticketData={pendingTicketData}
                onPaymentSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
                language={language}
              />
            )}
          </div>
        </div>

        {/* Ticket History */}
        <TicketHistory
          language={language}
          onSelectTicket={(selectedTicket) => {
            setTicket(selectedTicket)
            setZkProofData(null) // History tickets don't have zkProofData
          }}
        />

        <footer className={styles.footer}>
          <p>
            <span className={styles.footerIcon}>🔒</span>
            {t('identityNeverShared')}
          </p>
          <p>
            <span className={styles.footerIcon}>🔑</span>
            {t('ephemeralWallet')}: <strong style={{ color: '#DC143C' }}>{wallet ? t('active') : t('missing')}</strong>
          </p>
          {zkProofData && (
            <p>
              <span className={styles.footerIcon}>🌳</span>
              {t('merkleRoot')}: <code style={{ color: '#DC143C', fontSize: '12px', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>{zkProofData.merkleRoot?.substring(0, 16)}...</code>
            </p>
          )}
        </footer>
      </div>
    </main>
  )
}
