"use client";

import React, { useState } from "react";
import { proveTicket } from "../../zk_circuits/noir.js";
import { poseidon1, poseidon2 } from "poseidon-lite";

function toField(value: string) {
  return BigInt(value);
}

export default function TicketProver() {
  const [origin, setOrigin] = useState("1");
  const [destination, setDestination] = useState("2");
  const [date, setDate] = useState("3");
  const [clazz, setClazz] = useState("4");
  const [productType, setProductType] = useState("5");
  const [ticketId, setTicketId] = useState("6");
  const [s, setS] = useState("7");

  const [status, setStatus] = useState < string | null > (null);
  const [proofHex, setProofHex] = useState < string | null > (null);

  const [CState, setCState] = useState < string | null > (null);
  const [NState, setNState] = useState < string | null > (null);
  const [pkTA, setPkTA] = useState < { x: string; y: string } | null > (null);
  const [sig, setSig] = useState < { R_x: string; R_y: string; s: string } | null > (
    null,
  );

  const handleProve = async () => {
    try {
      setStatus("Computing commitment & nullifier...");
      setProofHex(null);

      const CBig = poseidon2([toField(ticketId), toField(s)]);
      const NBig = poseidon1([toField(s)]);
      const C = CBig.toString();
      const N = NBig.toString();

      setCState(C);
      setNState(N);

      const md = {
        origin,
        destination,
        date,
        class: clazz,
        product_type: productType,
        ticket_id: ticketId,
      };

      setStatus("Requesting TA signature from backend...");
      const issueResp = await fetch("http://localhost:3001/ticket/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ md, C }),
      });

      const issueData = await issueResp.json();
      if (!issueData.ok) {
        console.error("Issue error:", issueData);
        setStatus(`Issuance failed: ${issueData.reason ?? "unknown error"}`);
        return;
      }

      const pk_TA = issueData.pk_TA as { x: string; y: string };
      const sigObj = issueData.sig as {
        R_x: string;
        R_y: string;
        s: string;
      };

      setPkTA(pk_TA);
      setSig(sigObj);

      console.log("Issuance response:", { pk_TA, sig: sigObj, C, N, md });

      setStatus("Generating ZK proof locally...");

      const { proof, isValid } = await proveTicket({
        md,
        C,
        N,
        pk_TA,
        sig: sigObj,
        s,
      });

      console.log("Proof generated:", proof, "Valid:", isValid);

      if (!isValid) {
        setStatus("Proof failed ❌");
        return;
      }

      // Send proof to backend /ticket/check for fraud detection
      // const checkResp = await fetch("http://localhost:3001/ticket/check", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     proof,
      //     publicInputs: { md, C, N, pk_TA, sig: sigObj },
      //     train_id: "IC-1234",
      //     segment: "ZH-BS",
      //     timestamp: Date.now(),
      //   }),
      // });
      // const checkData = await checkResp.json();
      // console.log("Check response:", checkData);

      setStatus("Proof is valid ✅");

      let proofBytes: Uint8Array;
      if (proof instanceof Uint8Array) {
        proofBytes = proof;
      } else if (proof && proof.proof instanceof Uint8Array) {
        proofBytes = proof.proof;
      } else {
        proofBytes = Uint8Array.from(proof as any);
      }

      setProofHex(Buffer.from(proofBytes).toString("hex"));
    } catch (err) {
      console.error(err);
      setStatus("Error generating proof ❌");
    }
  };

  return (
    <div className="ticket-prover">
      <h2>Ticket ZK Proof</h2>

      <label>
        Origin
        <input value={origin} onChange={e => setOrigin(e.target.value)} />
      </label>

      <label>
        Destination
        <input
          value={destination}
          onChange={e => setDestination(e.target.value)}
        />
      </label>

      <label>
        Date
        <input value={date} onChange={e => setDate(e.target.value)} />
      </label>

      <label>
        Class
        <input value={clazz} onChange={e => setClazz(e.target.value)} />
      </label>

      <label>
        Product type
        <input
          value={productType}
          onChange={e => setProductType(e.target.value)}
        />
      </label>

      <label>
        Ticket ID
        <input
          value={ticketId}
          onChange={e => setTicketId(e.target.value)}
        />
      </label>

      <label>
        Secret s
        <input value={s} onChange={e => setS(e.target.value)} />
      </label>

      <button onClick={handleProve}>Generate ZK proof</button>

      {status && <p>{status}</p>}

      {CState && (
        <p>
          <strong>C (commitment):</strong> {CState}
        </p>
      )}
      {NState && (
        <p>
          <strong>N (nullifier):</strong> {NState}
        </p>
      )}

      {proofHex && (
        <div>
          <h3>Proof (hex)</h3>
          <code style={{ wordBreak: "break-all" }}>{proofHex}</code>
        </div>
      )}
    </div>
  );
}
