import './globals.css'

export const metadata = {
  title: 'AZKT - Anonymous Zero-Knowledge Ticket',
  description: 'Privacy-preserving ticketing system for SBB CFF FFS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

