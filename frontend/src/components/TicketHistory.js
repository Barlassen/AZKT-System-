'use client'

import { useState, useEffect } from 'react'
import { getTranslations } from '../lib/i18n'
import styles from './TicketHistory.module.css'

export default function TicketHistory({ language = 'en', onSelectTicket }) {
  const t = (key) => {
    const translations = getTranslations(language)
    return translations[key] || key
  }

  const [tickets, setTickets] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = () => {
    try {
      const saved = localStorage.getItem('azkt-tickets')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Filter expired tickets
        const valid = parsed.filter(t => {
          const end = new Date(t.validity?.end || t.validUntil)
          return end > new Date()
        })
        setTickets(valid)
        // Update storage
        if (valid.length !== parsed.length) {
          localStorage.setItem('azkt-tickets', JSON.stringify(valid))
        }
      }
    } catch (error) {
      console.error('Error loading tickets:', error)
    }
  }

  const saveTicket = (ticket) => {
    try {
      const saved = localStorage.getItem('azkt-tickets')
      const tickets = saved ? JSON.parse(saved) : []
      // Check if ticket already exists
      if (!tickets.find(t => t.ticketId === ticket.ticketId)) {
        tickets.unshift(ticket) // Add to beginning
        // Keep only last 10 tickets
        const limited = tickets.slice(0, 10)
        localStorage.setItem('azkt-tickets', JSON.stringify(limited))
        loadTickets()
      }
    } catch (error) {
      console.error('Error saving ticket:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = (ticket) => {
    const end = new Date(ticket.validity?.end || ticket.validUntil)
    return end < new Date()
  }

  // Expose saveTicket function
  useEffect(() => {
    window.azktSaveTicket = saveTicket
    return () => {
      delete window.azktSaveTicket
    }
  }, [])

  if (tickets.length === 0 && !showHistory) {
    return null
  }

  return (
    <div className={styles.historyContainer}>
      <button
        className={styles.toggleButton}
        onClick={() => setShowHistory(!showHistory)}
      >
        <span>🎫</span>
        <span>{t('ticketHistory')} ({tickets.length})</span>
        <span>{showHistory ? '▲' : '▼'}</span>
      </button>

      {showHistory && (
        <div className={styles.historyList}>
          {tickets.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('noTickets')}</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className={`${styles.ticketItem} ${isExpired(ticket) ? styles.expired : ''}`}
                onClick={() => onSelectTicket && onSelectTicket(ticket)}
              >
                <div className={styles.ticketHeader}>
                  <span className={styles.route}>
                    {ticket.start} → {ticket.destination}
                  </span>
                  {isExpired(ticket) && (
                    <span className={styles.expiredBadge}>{t('expired')}</span>
                  )}
                </div>
                <div className={styles.ticketDetails}>
                  <span>{formatDate(ticket.date)}</span>
                  <span className={styles.price}>CHF {ticket.price?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

