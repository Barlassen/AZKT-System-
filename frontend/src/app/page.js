'use client'

import { useState, useEffect } from 'react'
import TicketSelector from '../components/TicketSelector'
import QRDisplay from '../components/QRDisplay'
import PaymentScreen from '../components/PaymentScreen'
import TicketHistory from '../components/TicketHistory'
import LanguageSelector from '../components/LanguageSelector'
import { getTranslations } from '../lib/i18n'
import { generateSecret } from '../lib/utils'
import styles from './page.module.css'

import * as circomlib from "circomlibjs";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export default function Home() {
  const [ticket, setTicket] = useState(null)
  const [zkProofData, setZkProofData] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [language, setLanguage] = useState('en')

  const [showPayment, setShowPayment] = useState(false)
  const [pendingTicketData, setPendingTicketData] = useState(null)

  const [poseidon, setPoseidon] = useState(null)
  const [F, setF] = useState(null)
  const [ready, setReady] = useState(false)

  // ───────────────────────────────────────────────
  // INIT POSEIDON (browser-safe)
  // ───────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const p = await circomlib.buildPoseidon()
        setPoseidon(() => p)
        setF(() => p.F)
        setReady(true)
      } catch (e) {
        console.error("Poseidon init failed:", e)
        setError("Cryptographic engine failed to load.")
      }
    })()

    // Load language
    const savedLang = localStorage.getItem('azkt-language')
    if (savedLang) setLanguage(savedLang)
  }, [])

  const t = k => getTranslations(language)[k] || k

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    localStorage.setItem('azkt-language', lang)
  }

  const handleTicketRequest = (ticketData) => {
    setPendingTicketData(ticketData)
    setShowPayment(true)
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setPendingTicketData(null)
  }

  // ───────────────────────────────────────────────
  // PAYMENT SUCCESS (ticket allocate + issue)
  // ───────────────────────────────────────────────
  const handlePaymentSuccess = async () => {
    if (!ready || !poseidon) {
      setError("Crypto not ready.")
      return
    }

    setLoading(true)
    setError(null)
    setShowPayment(false)

    try {
      // 1) ALLOCATE TICKET ID
      const alloc = await fetch(`${BACKEND_URL}/ticket/allocate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          md: {
            origin: pendingTicketData.start,
            destination: pendingTicketData.destination,
            date: pendingTicketData.date,
            class: "2",
            product_type: pendingTicketData.ticketType
          }
        })
      })

      const allocData = await alloc.json()
      if (!alloc.ok) throw new Error(allocData.error)
      const { md, ticket_id } = allocData

      // 2) LOCAL SECRET & HASHES (circomlibjs Poseidon)
      const sBig = generateSecret()
      const s = sBig.toString()

      const tid = BigInt(ticket_id)

      // ⭐ circomlibjs poseidon requires F.e() for input fields
      const CField = poseidon([F.e(tid), F.e(sBig)])
      const C = F.toObject(CField).toString()

      const NField = poseidon([F.e(sBig)])
      const N = F.toObject(NField).toString()

      // 3) ISSUE (backend signs payload)
      const issue = await fetch(`${BACKEND_URL}/ticket/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ md, ticket_id, C })
      })

      const issueData = await issue.json()
      if (!issue.ok) throw new Error(issueData.error)
      if (!issueData.ok) throw new Error(issueData.reason)

      // TICKET OBJECT
      const full = {
        start: pendingTicketData.start,
        destination: pendingTicketData.destination,
        date: pendingTicketData.date,
        time: pendingTicketData.time,
        ticketType: pendingTicketData.ticketType,
        price: pendingTicketData.price,
        validity: {
          end: new Date(
            new Date(pendingTicketData.date + "T" + pendingTicketData.time).getTime()
            + 4 * 3600 * 1000
          ).toISOString()
        },
        md,
        ticket_id,
        C,
        N,
        s,
        pk_TA: issueData.pk_TA,
        sig: issueData.sig,
        zkProofPayload: null
      }

      setTicket(full)

      // Save to localStorage
      const arr = JSON.parse(localStorage.getItem("azkt-tickets") || "[]")
      arr.push(full)
      localStorage.setItem("azkt-tickets", JSON.stringify(arr))

    } catch (e) {
      console.error(e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <main style={{ padding: 40 }}>
        <h2>Loading Poseidon…</h2>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuButton}>☰ {t('menu')}</button>
          </div>
          <div className={styles.headerRight}>
            <LanguageSelector currentLang={language} onLanguageChange={handleLanguageChange} />
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.searchCard}>
            {error && (
              <div style={{ marginBottom: 20, color: "red" }}>
                ❌ {error}
              </div>
            )}

            {!ticket ? (
              <TicketSelector onRequestTicket={handleTicketRequest} loading={loading} language={language} />
            ) : (
              <QRDisplay
                ticket={ticket}
                language={language}
                onNewTicket={() => setTicket(null)}
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

        <TicketHistory
          language={language}
          onSelectTicket={(t) => setTicket(t)}
        />

      </div>
    </main>
  )
}
