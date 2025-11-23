use poseidon::poseidon::bn254::{hash_1, hash_2, hash_7};
use eddsa::eddsa_verify;

pub struct TicketMetadata {
    origin: Field,
    destination: Field,
    date: Field,
    class: Field,
    product_type: Field,
    ticket_id: Field,
}

pub struct PubKey {
    x: Field,
    y: Field,
}

pub struct Signature {
    R_x: Field,
    R_y: Field,
    s: Field,
}

pub fn compute_commitment(md: TicketMetadata, s: Field) -> Field {
    hash_2([md.ticket_id, s])
}

pub fn compute_nullifier(s: Field) -> Field {
    hash_1([s])
}

pub fn compute_message(md: TicketMetadata, C: Field) -> Field {
    let h = hash_7([
        md.origin,
        md.destination,
        md.date,
        md.class,
        md.product_type,
        md.ticket_id,
        C,
    ]);
    h
}

fn verify_signature(msg: Field, pk: PubKey, sig: Signature) -> bool {
    eddsa_verify::<poseidon::poseidon::PoseidonHasher>(
      pk.x,
      pk.y,
      sig.s,
      sig.R_x,
      sig.R_y,
      msg,
    )
}

pub fn main(
    md: TicketMetadata,
    C: Field,
    N: Field,
    pk_TA: PubKey,
    sig: Signature,
    s: Field,
) {
    let C_calc = compute_commitment(md, s);
    assert(C == C_calc);

    let N_calc = compute_nullifier(s);
    assert(N == N_calc);

    let msg = compute_message(md, C);

    let ok = verify_signature(msg, pk_TA, sig);
    assert(ok);
}
