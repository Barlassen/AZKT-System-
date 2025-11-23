'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getTranslations } from '../lib/i18n'
import { proveTicket } from '../zk_circuit/noir'
import styles from './QRDisplay.module.css'

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
    setProofLoading(!ticket.zkProofPayload)
    setProofError(null)
  }, [ticket])

  useEffect(() => {
    const generateProof = async () => {
      if (!localTicket || localTicket.zkProofPayload) return

      try {
        setProofLoading(true)
        setProofError(null)

        const { md, C, N, pk_TA, sig, s, ticket_id } = localTicket

        const { proof, isValid } = await proveTicket({
          md,
          C,
          N,
          pk_TA,
          sig,
          s,
          ticket_id,
        })

        if (!isValid) {
          throw new Error('Proof is not valid')
        }

        let proofBytes = [];
        if (proof instanceof Uint8Array) {
          proofBytes = proof
        } else if (proof && proof.proof instanceof Uint8Array) {
          proofBytes = proof.proof
        } else {
          proofBytes = Uint8Array.from(proof)
        }
        const proofHex = Buffer.from(proofBytes).toString('hex')

        const zkProofPayload = {
          proof: proofHex,
          publicInputs: {
            md,
            C,
            N,
            pk_TA,
            sig,
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

  const copyToClipboard = () => {
    const qrPayload = buildQrPayload(localTicket)
    const ticketString = JSON.stringify(qrPayload)

    navigator.clipboard.writeText(ticketString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const buildQrPayload = (tkt) => {
    if (!tkt) return '{}'
    return {
      start: tkt.start,
      destination: tkt.destination,
      date: tkt.date,
      time: tkt.time,
      ticketType: tkt.ticketType,
      price: tkt.price,
      validity: tkt.validity,
      zk: tkt.zkProofPayload || null,
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
          <span className={styles.label}>{t('date')} & {t('time')}:</span>
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
            CHF {typeof localTicket.price === 'number'
              ? localTicket.price.toFixed(2)
              : localTicket.price || '0.00'}
          </span>
        </div>
      </div>

      {proofLoading && (
        <p style={{ marginTop: '16px' }}>{t('generatingProof') || 'Generating ZK proof…'}</p>
      )}
      {proofError && (
        <p style={{ marginTop: '16px', color: '#DC143C' }}>
          {t('proofError') || 'Error generating proof'}: {proofError}
        </p>
      )}

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
            <strong style={{ color: localTicket.signature ? '#DC143C' : '#666' }}>
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
        <p><strong>📱</strong> {t('showQR')}</p>
        <p><strong>🖨️</strong> {t('printTicket')}</p>
        <p><strong>✅</strong> {t('multiCheckNote')}</p>
        <p><strong>🔒</strong> {t('copySafeNote')}</p>
      </div>
    </div>
  )
}
