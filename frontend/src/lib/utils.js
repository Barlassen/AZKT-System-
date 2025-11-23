const generateSecret = () => {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  let acc = 0n
  for (const b of bytes) {
    acc = (acc << 8n) + BigInt(b)
  }
  return acc
}
