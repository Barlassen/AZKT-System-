'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getTranslations } from '../lib/i18n'
import { proveTicket } from '../zk_circuit/noir'
import styles from './QRDisplay.module.css'

// Must match backend maps exactly
const StationMap = {
  Bern: 1,
  Zurich: 2,
  Lausanne: 3,
  Geneva: 4,
  Basel: 5,
}

const ProductTypeMap = {
  single: 1,
  'day-pass': 2,
  supersaver: 3,
}

const ClassMap = {
  '1': 1,
  '2': 2,
}

export default function QRDisplay({
  ticket,
  onNewTicket,
  onTicketUpdate,
  language = 'en',
}) {
  const t = (key) => {
    const translations = getTranslations(language)
    return translations[key] || key
  }

  const [localTicket, setLocalTicket] = useState(ticket)
  const [copied, setCopied] = useState(false)
  const [proofLoading, setProofLoading] = useState(!ticket?.zkProofPayload)
  const [proofError, setProofError] = useState(null)

  useEffect(() => {
    setLocalTicket(ticket)
    setProofLoading(!ticket?.zkProofPayload)
    setProofError(null)
  }, [ticket])

  useEffect(() => {
    const generateProof = async () => {
      if (!localTicket) return
      if (localTicket.zkProofPayload) return

      try {
        setProofLoading(true)
        setProofError(null)

        const { md, C, N, pk_TA, sig, s, ticket_id } = localTicket

        if (!md || !pk_TA || !sig) {
          throw new Error('Missing ZK inputs on ticket')
        }

        // 🔥 Encode md fields into integers (as Noir Fields)
        const encodedMd = {
          origin: String(StationMap[md.origin]),
          destination: String(StationMap[md.destination]),
          // same logic as backend dateToField: seconds since epoch
          date: String(Math.floor(new Date(md.date).getTime() / 1000)),
          class: String(ClassMap[md.class]),
          product_type: String(ProductTypeMap[md.product_type]),
        }

        if (
          encodedMd.origin === 'undefined' ||
          encodedMd.destination === 'undefined' ||
          encodedMd.class === 'undefined' ||
          encodedMd.product_type === 'undefined'
        ) {
          throw new Error('Unknown station/class/product_type in md')
        }

        // Build Noir input exactly like the circuit expects
        const noirInput = {
          md: encodedMd,
          C: C.toString(),
          N: N.toString(),
          pk_TA: {
            x: pk_TA.x.toString(),
            y: pk_TA.y.toString(),
          },
          sig: {
            R_x: sig.R_x.toString(),
            R_y: sig.R_y.toString(),
            s: sig.s.toString(),
          },
          s: s.toString(),
          ticket_id: ticket_id.toString(),
        }

        const { proof, isValid } = await proveTicket(noirInput)

        if (!isValid) {
          throw new Error('Proof is not valid')
        }

        // Normalize proof to Uint8Array
        let proofBytes
        if (proof instanceof Uint8Array) {
          proofBytes = proof
        } else if (proof && proof.proof instanceof Uint8Array) {
          proofBytes = proof.proof
        } else if (Array.isArray(proof)) {
          proofBytes = Uint8Array.from(proof)
        } else {
          throw new Error('Unexpected proof format')
        }

        // Convert proof bytes to hex (no Buffer in browser)
        const proofHex = Array.from(proofBytes)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')

        const zkProofPayload = {
          proof: proofHex,
          publicInputs: {
            md: encodedMd,       // public values as used in circuit
            C: noirInput.C,
            N: noirInput.N,
            pk_TA: noirInput.pk_TA,
            sig: noirInput.sig,
          },
        }

        const updated = {
          ...localTicket,
          zkProofPayload,
        }

        setLocalTicket(updated)
        setProofLoading(false)

        if (onTicketUpdate) {
          onTicketUpdate(updated)
        }
      } catch (err) {
        console.error('Error generating ZK proof:', err)
        setProofError(err.message || 'Failed to generate ZK proof')
        setProofLoading(false)
      }
    }

    generateProof()
  }, [localTicket, onTicketUpdate])


  const buildQrPayload = (tkt) => {
    if (!tkt) return {}
    return {
      start: tkt.start,
      destination: tkt.destination,
      date: tkt.date,
      time: tkt.time,
      ticketType: tkt.ticketType,
      price: tkt.price,
      validity: tkt.validity,
      ticketId: tkt.ticket_id,     // so verifier can look up stuff
      hasZk: !!tkt.zkProofPayload, // just a flag
    }
  }


  const copyToClipboard = () => {
    const qrPayload = buildQrPayload(localTicket)
    const ticketString = JSON.stringify(qrPayload)

    navigator.clipboard.writeText(ticketString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!localTicket) {
    return <p>{t('noTicket') || 'No ticket available'}</p>
  }

  const qrPayload = buildQrPayload(localTicket)
  const ticketString = JSON.stringify(qrPayload)

  return (
    <div>
      <h2
        style={{
          color: '#DC143C',
          marginBottom: '24px',
          fontSize: '24px',
          fontWeight: '600',
        }}
      >
        {t('yourTicket')}
      </h2>

      <div
        className={styles.ticketInfo}
        style={{
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <div className={styles.route}>
          <span className={styles.label}>{t('from')}:</span>
          <span className={styles.value}>{localTicket.start}</span>
        </div>
        <div className={styles.route}>
          <span className={styles.label}>{t('to')}:</span>
          <span className={styles.value}>{localTicket.destination}</span>
        </div>
        <div className={styles.validity}>
          <span className={styles.label}>
            {t('date')} &amp; {t('time')}:
          </span>
          <span className={styles.value}>
            {localTicket.date} {t('at')} {localTicket.time}
          </span>
        </div>
        <div className={styles.validity}>
          <span className={styles.label}>{t('validUntil')}:</span>
          <span className={styles.value}>
            {formatDate(localTicket.validity.end)}
          </span>
        </div>
        <div className={styles.ticketId}>
          <span className={styles.label}>{t('type')}:</span>
          <span className={styles.value}>{localTicket.ticketType}</span>
        </div>
        <div className={styles.ticketId}>
          <span className={styles.label}>{t('price')}:</span>
          <span
            className={styles.value}
            style={{ color: '#DC143C', fontWeight: '700' }}
          >
            CHF{' '}
            {typeof localTicket.price === 'number'
              ? localTicket.price.toFixed(2)
              : localTicket.price || '0.00'}
          </span>
        </div>
      </div>

      {proofLoading && (
        <p style={{ marginTop: '16px' }}>
          {t('generatingProof') || 'Generating ZK proof…'}
        </p>
      )}
      {proofError && (
        <p style={{ marginTop: '16px', color: '#DC143C' }}>
          {t('proofError') || 'Error generating proof'}: {proofError}
        </p>
      )}

      {/* QR only once proof is generated and attached */}
      {!proofLoading && localTicket.zkProofPayload && (
        <>
          <div className="qr-container">
            <QRCodeSVG
              value={ticketString}
              size={256}
              level="M"
              includeMargin={true}
            />
          </div>

          <div className={styles.actions}>
            <button onClick={copyToClipboard} className={styles.copyBtn}>
              {copied ? t('copied') : t('copyTicket')}
            </button>
            <button
              onClick={() => {
                if (window.azktSaveTicket) {
                  window.azktSaveTicket(localTicket)
                }
                window.print()
              }}
              className="btn"
              style={{ background: '#000000' }}
            >
              🖨️ {t('printTicket')}
            </button>
            <button onClick={onNewTicket} className="btn">
              {t('newTicket')}
            </button>
          </div>
        </>
      )}

      <div className={styles.security}>
        <p>🔒 {t('securityFeatures')}:</p>
        <ul>
          <li>
            {t('zkProof')}:{' '}
            <strong
              style={{
                color: localTicket.zkProofPayload ? '#DC143C' : '#666',
              }}
            >
              {localTicket.zkProofPayload ? t('generated') : t('missing')}
            </strong>
          </li>
          <li>
            {t('signature')}:{' '}
            <strong
              style={{
                color: localTicket.signature ? '#DC143C' : '#666',
              }}
            >
              {localTicket.signature ? t('signedBySBB') : t('missing')}
            </strong>
          </li>
          <li>
            {t('ephemeralKey')}:{' '}
            <strong style={{ color: '#DC143C' }}>{t('active')}</strong>
          </li>
        </ul>
      </div>

      <div className={styles.note}>
        <p>
          <strong>📱</strong> {t('showQR')}
        </p>
        <p>
          <strong>🖨️</strong> {t('printTicket')}
        </p>
        <p>
          <strong>✅</strong> {t('multiCheckNote')}
        </p>
        <p>
          <strong>🔒</strong> {t('copySafeNote')}
        </p>
      </div>
    </div>
  )
}
