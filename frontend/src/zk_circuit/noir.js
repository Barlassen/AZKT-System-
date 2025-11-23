import { UltraHonkBackend } from "@aztec/bb.js";
import { Noir } from "@noir-lang/noir_js";

import initACVM from "@noir-lang/acvm_js";
import initNoirC from "@noir-lang/noirc_abi";
import acvmWasmUrl from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noircWasmUrl from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

import circuitDef from "./tickets.json";

await Promise.all([
  initACVM(fetch(acvmWasmUrl)),
  initNoirC(fetch(noircWasmUrl)),
]);

let noir = null;
let backend = null;

async function getNoirInstance() {
  if (!noir) {
    // Create Noir instance with the compiled circuit
    noir = new Noir(circuitDef);
    // Create UltraHonk backend using the circuit bytecode
    backend = new UltraHonkBackend(circuitDef.bytecode);
  }
  return { noir, backend };
}

export async function proveTicket(input) {
  const { noir, backend } = await getNoirInstance();

  const { witness, returnValue } = await noir.execute(input);

  const proof = await backend.generateProof(witness);

  const isValid = await backend.verifyProof(proof);

  return { proof, isValid, returnValue };
}
