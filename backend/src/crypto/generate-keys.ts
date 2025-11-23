import * as circomlibjs from "circomlibjs";
import { writeFileSync } from "fs";

(async () => {
  const eddsa = await circomlibjs.buildEddsa();

  const sk = crypto.getRandomValues(new Uint8Array(32));

  const pub = eddsa.prv2pub(sk);
  const Ax = pub[0];
  const Ay = pub[1];

function bytesToBigInt(bytes) {
  let acc = 0n;
  for (const b of bytes) {
    acc = (acc << 8n) + BigInt(b);
  }
  return acc;
}

function toHexField(bi) {
  return "0x" + bi.toString(16);
}

  console.log("Private key (hex):", Buffer.from(sk).toString("hex"));
const AxBi = bytesToBigInt(Ax);
const AyBi = bytesToBigInt(Ay);

console.log("Ax as BigInt:", AxBi.toString());
console.log("Ay as BigInt:", AyBi.toString());
console.log("Ax as hex:", toHexField(AxBi));
console.log("Ay as hex:", toHexField(AyBi));
})();
