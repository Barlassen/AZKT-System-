# AZKT Backend

SBB ticket generation and signing server.

## Features

- Ticket generation with unique IDs
- ZK proof generation
- Ticket signing with SBB private key
- QR code generation
- API endpoints for ticket requests

## Tech Stack

- Node.js
- Express.js
- TweetNaCl for signatures
- QR Code generation

## Development

```bash
npm install
npm run dev
```

## API Endpoints

- `POST /api/ticket/request` - Request new ticket
- `GET /api/ticket/:id` - Get ticket details
- `GET /api/routes` - Available routes
- `POST /api/verify` - Verify ticket (for testing)

## Security

- SBB private key stored securely
- Rate limiting on ticket requests
- Input validation
- CORS configuration

