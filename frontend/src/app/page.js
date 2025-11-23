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
      const allocResp = await fetch(`${BACKEND_URL}/ticket/allocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          md: {
            origin: pendingTicketData.start,
            destination: pendingTicketData.destination,
            date: pendingTicketData.date,
            class: '2',
            product_type: pendingTicketData.ticketType,
          },
        }),
      })

      if (!allocResp.ok) {
        const errorData = await allocResp.json()
        throw new Error(errorData.error || 'Failed to allocate ticket')
      }

      const allocData = await allocResp.json()
      const { md, ticket_id } = allocData

      const sBig = generateSecret()
      const s = sBig.toString()

      const ticketIdField = BigInt(ticket_id)
      const CField = poseidon2([ticketIdField, sBig])
      const C = CField.toString()

      const NField = poseidon1([sBig])
      const N = NField.toString()

      const issueResp = await fetch(`${BACKEND_URL}/ticket/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ md, ticket_id, C }),
      })

      if (!issueResp.ok) {
        const errorData = await issueResp.json()
        throw new Error(errorData.error || 'Failed to issue ticket')
      }

      const issueData = await issueResp.json()
      if (!issueData.ok) {
        throw new Error(issueData.reason || 'Ticket issue failed')
      }

      const { pk_TA, sig } = issueData

      const fullTicket = {
        start: pendingTicketData.start,
        destination: pendingTicketData.destination,
        date: pendingTicketData.date,
        time: pendingTicketData.time,
        ticketType: pendingTicketData.ticketType,
        price: pendingTicketData.price,
        validity: {
          end: new Date(
            new Date(pendingTicketData.date + 'T' + pendingTicketData.time).getTime() +
            4 * 60 * 60 * 1000,
          ).toISOString(),
        },
        md,
        C,
        N,
        pk_TA,
        sig,
        ticket_id,
        s,

        zkProofPayload: null,
      }

      setTicket(fullTicket)
      setZkProofData(null)

      try {
        const existing = JSON.parse(localStorage.getItem('azkt-tickets') || '[]')
        existing.push(fullTicket)
        localStorage.setItem('azkt-tickets', JSON.stringify(existing))
        if (window.azktSaveTicket) {
          window.azktSaveTicket(fullTicket)
        }
      } catch (e) {
        console.warn('Failed to persist ticket history', e)
      }

      setPendingTicketData(null)
    } catch (err) {
      setError(err.message || 'Ticket request error')
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
                  language={language}
                  onNewTicket={() => {
                    setTicket(null)
                    setZkProofData(null)
                  }}
                  onTicketUpdate={(updatedTicket) => {
                    setTicket(updatedTicket)
                    setZkProofData(updatedTicket.zkProofPayload || null)

                    try {
                      const existing = JSON.parse(localStorage.getItem('azkt-tickets') || '[]')
                      const idx = existing.findIndex((t) => t.ticket_id === updatedTicket.ticket_id)
                      if (idx >= 0) {
                        existing[idx] = updatedTicket
                        localStorage.setItem('azkt-tickets', JSON.stringify(existing))
                      }
                    } catch (e) {
                      console.warn('Failed to update ticket in history', e)
                    }
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
