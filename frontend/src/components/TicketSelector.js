'use client'

import { useState, useEffect } from 'react'
import { getTranslations } from '../lib/i18n'
import DiscountCode, { applyDiscount } from './DiscountCode'
import styles from './TicketSelector.module.css'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export default function TicketSelector({ onRequestTicket, loading, language = 'en' }) {
  const t = (key) => {
    const translations = getTranslations(language)
    return translations[key] || key
  }
  const [routes, setRoutes] = useState([
    { id: 'lausanne-geneva', from: 'Lausanne', to: 'Geneva', duration: 55, price: 15.00 },
    { id: 'zurich-bern', from: 'Zurich', to: 'Bern', duration: 60, price: 18.00 },
    { id: 'basel-zurich', from: 'Basel', to: 'Zurich', duration: 55, price: 16.00 },
    { id: 'geneva-lausanne', from: 'Geneva', to: 'Lausanne', duration: 55, price: 15.00 },
    { id: 'basel-bern', from: 'Basel', to: 'Bern', duration: 75, price: 22.00 },
    { id: 'zurich-lausanne', from: 'Zurich', to: 'Lausanne', duration: 135, price: 32.00 },
    { id: 'bern-geneva', from: 'Bern', to: 'Geneva', duration: 95, price: 25.00 },
    { id: 'lausanne-zurich', from: 'Lausanne', to: 'Zurich', duration: 135, price: 32.00 },
    { id: 'bern-basel', from: 'Bern', to: 'Basel', duration: 75, price: 22.00 },
    { id: 'zurich-basel', from: 'Zurich', to: 'Basel', duration: 55, price: 16.00 },
    { id: 'geneva-zurich', from: 'Geneva', to: 'Zurich', duration: 175, price: 38.00 },
    { id: 'bern-lausanne', from: 'Bern', to: 'Lausanne', duration: 95, price: 25.00 }
  ])
  const [selectedFrom, setSelectedFrom] = useState('')
  const [selectedTo, setSelectedTo] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [ticketType, setTicketType] = useState('single')
  const [loadingRoutes, setLoadingRoutes] = useState(false)
  const [departArrive, setDepartArrive] = useState('depart') // 'depart' or 'arrive'
  const [discountRate, setDiscountRate] = useState(0)

  useEffect(() => {
    // fetchRoutes()
    // Set default date to today
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
    // Set default time to current time
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    setSelectedTime(`${hours}:${minutes}`)
  }, [])

  const fetchRoutes = async () => {
    try {
      console.log('Fetching routes from:', `${BACKEND_URL}/itinaries`)
      const response = await fetch(`${BACKEND_URL}/itinaries`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Routes received:', data)
      setRoutes(data.routes || [])
      if (data.routes && data.routes.length > 0) {
        console.log(`Loaded ${data.routes.length} routes`)
      } else {
        console.warn('No routes found in response')
      }
    } catch (error) {
      console.error('Failed to fetch routes:', error)
      setRoutes([])
    } finally {
      setLoadingRoutes(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedFrom || !selectedTo || !selectedDate || !selectedTime) {
      alert('Please select departure, destination, date, and time')
      return
    }

    if (selectedFrom === selectedTo) {
      alert('Departure and destination cannot be the same')
      return
    }

    // Find route or calculate price
    const route = routes.find(r => r.from === selectedFrom && r.to === selectedTo)
    let price = route?.price || 15.00

    // Adjust price based on ticket type
    if (ticketType === 'day-pass') {
      price = price * 1.5 // Day pass is 50% more expensive
    }

    // Apply discount if any
    if (discountRate > 0) {
      price = applyDiscount(price, discountRate)
    }

    onRequestTicket({
      start: selectedFrom,
      destination: selectedTo,
      date: selectedDate,
      time: selectedTime,
      ticketType: ticketType,
      price: price,
      originalPrice: route?.price || 15.00,
      discountRate: discountRate
    })
  }

  const swapRoute = () => {
    const temp = selectedFrom
    setSelectedFrom(selectedTo)
    setSelectedTo(temp)
  }

  const getUniqueStations = () => {
    const stations = new Set()
    routes.forEach(route => {
      stations.add(route.from)
      stations.add(route.to)
    })
    return Array.from(stations).sort()
  }

  const stations = getUniqueStations()

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const formatDateDisplay = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    return `${days[date.getDay()]}, ${date.getDate()}.${months[date.getMonth()]}.${date.getFullYear()}`
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Von / Nach Inputs with Swap Button */}
        <div className={styles.routeInputs}>
          <div className={styles.fromInput}>
            <div className={styles.fromIcon}></div>
            <label className="label" style={{ display: 'none' }}>{t('from')}</label>
            {loadingRoutes ? (
              <input
                type="text"
                className="input"
                placeholder={t('from')}
                disabled
                value={t('loadingRoutes')}
              />
            ) : stations.length === 0 ? (
              <input
                type="text"
                className="input"
                placeholder={t('from')}
                disabled
                value={t('noRoutes')}
              />
            ) : (
              <select
                className="input"
                value={selectedFrom}
                onChange={(e) => setSelectedFrom(e.target.value)}
                required
                style={{ paddingLeft: '44px' }}
              >
                <option value="">{t('from')}</option>
                {stations.map(station => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="button"
            className={styles.swapButton}
            onClick={swapRoute}
            title="Swap stations"
            disabled={!selectedFrom || !selectedTo}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z" />
            </svg>
          </button>

          <div className={styles.toInput}>
            <div className={styles.toIcon}></div>
            <label className="label" style={{ display: 'none' }}>{t('to')}</label>
            {loadingRoutes ? (
              <input
                type="text"
                className="input"
                placeholder={t('to')}
                disabled
                value={t('loadingRoutes')}
                style={{ paddingLeft: '44px' }}
              />
            ) : stations.length === 0 ? (
              <input
                type="text"
                className="input"
                placeholder={t('to')}
                disabled
                value={t('noRoutes')}
                style={{ paddingLeft: '44px' }}
              />
            ) : (
              <select
                className="input"
                value={selectedTo}
                onChange={(e) => setSelectedTo(e.target.value)}
                required
                style={{ paddingLeft: '44px' }}
              >
                <option value="">{t('to')}</option>
                {stations
                  .filter(station => station !== selectedFrom) // Don't show selected "from" station
                  .map(station => (
                    <option key={station} value={station}>
                      {station}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>

        {/* Date and Time Row */}
        <div className={styles.dateTimeRow}>
          <div className={styles.dateInput}>
            <label className="label" style={{ display: 'none' }}>Date</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                className="input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                required
                style={{ paddingRight: '40px' }}
              />
              <span style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#666'
              }}>📅</span>
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {formatDateDisplay(selectedDate)}
            </div>
          </div>

          <div className={styles.timeInput}>
            <label className="label" style={{ display: 'none' }}>Time</label>
            <input
              type="time"
              className="input"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            />
          </div>

          <div className={styles.departArriveToggle}>
            <button
              type="button"
              className={`${styles.toggleButton} ${departArrive === 'depart' ? styles.active : ''}`}
              onClick={() => setDepartArrive('depart')}
            >
              {t('depart')}
            </button>
            <button
              type="button"
              className={`${styles.toggleButton} ${departArrive === 'arrive' ? styles.active : ''}`}
              onClick={() => setDepartArrive('arrive')}
            >
              {t('arrive')}
            </button>
          </div>
        </div>

        {/* Settings Link */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
          <a href="#" className={styles.settingsLink}>
            <span>⚙️</span>
            <span>{t('settings')}</span>
          </a>
        </div>

        {/* Ticket Type */}
        <div style={{ marginTop: '20px' }}>
          <label className="label" style={{ marginBottom: '8px' }}>{t('ticketType')}</label>
          <select
            className="input"
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            required
          >
            <option value="single">{t('singleTicket')}</option>
            <option value="day-pass">{t('dayPass')}</option>
          </select>
        </div>

        {/* Discount Code */}
        <DiscountCode
          onDiscountApplied={(rate) => setDiscountRate(rate)}
          language={language}
        />

        {/* Price Display */}
        {selectedFrom && selectedTo && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: '#fff5f5',
            border: '1px solid #ffcccc',
            borderRadius: '8px'
          }}>
            {(() => {
              const route = routes.find(r => r.from === selectedFrom && r.to === selectedTo)
              let basePrice = route?.price || 15.00
              if (ticketType === 'day-pass') {
                basePrice = basePrice * 1.5
              }
              const finalPrice = discountRate > 0 ? applyDiscount(basePrice, discountRate) : basePrice

              return (
                <>
                  {discountRate > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                      <span>{t('originalPrice')}:</span>
                      <span style={{ textDecoration: 'line-through' }}>CHF {basePrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#000', fontSize: '16px' }}>{t('total')}:</span>
                    <strong style={{ fontSize: '28px', color: '#DC143C', fontWeight: '700' }}>
                      CHF {finalPrice.toFixed(2)}
                    </strong>
                  </div>
                  {discountRate > 0 && (
                    <div style={{ fontSize: '12px', color: '#155724', marginTop: '4px', fontWeight: '600' }}>
                      {t('youSave')}: CHF {(basePrice - finalPrice).toFixed(2)}
                    </div>
                  )}
                  {ticketType === 'day-pass' && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '6px', fontStyle: 'italic' }}>
                      {t('dayPassNote')}
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn"
          disabled={loading || !selectedFrom || !selectedTo || !selectedDate || !selectedTime || selectedFrom === selectedTo}
          style={{ marginTop: '24px' }}
        >
          {loading ? t('generating') : t('getTicket')}
        </button>
      </form>

      {/* Info Banner */}
      <div className={styles.info} style={{ marginTop: '24px' }}>
        <strong>🔒</strong> {t('anonymous')} • <strong>{t('noPersonalData')}</strong> • <strong>{t('copySafe')}</strong> • <strong>{t('printHome')}</strong>
      </div>

      {/* Features */}
      <div className={styles.features}>
        <p style={{ color: '#DC143C', fontWeight: '700' }}>✨ {t('sbbFeatures')}:</p>
        <ul>
          <li><strong style={{ color: '#000' }}>{t('copySafe')}:</strong> {t('copySafeDesc')}</li>
          <li><strong style={{ color: '#000' }}>{t('anonymous')}:</strong> {t('anonymousDesc')}</li>
          <li><strong style={{ color: '#000' }}>{t('multiCheck')}:</strong> {t('multiCheckDesc')}</li>
          <li><strong style={{ color: '#000' }}>{t('printHome')}:</strong> {t('printHomeDesc')}</li>
          <li><strong style={{ color: '#000' }}>{t('easyAccess')}:</strong> {t('easyAccessDesc')}</li>
        </ul>
      </div>
    </div>
  )
}
