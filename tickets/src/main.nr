use poseidon::poseidon::bn254::{hash_1, hash_2, hash_7};
use poseidon::poseidon::PoseidonHasher;
use std::hash::Hasher;

use eddsa::eddsa_verify;

pub struct TicketMetadataPublic {
    origin: Field,
    destination: Field,
    date: Field,
    class: Field,
    product_type: Field,
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


pub fn compute_commitment(ticket_id: Field, s: Field) -> Field {
    hash_2([ticket_id, s])
}

pub fn compute_nullifier(s: Field) -> Field {
    hash_1([s])
}

pub fn compute_message(md: TicketMetadataPublic, C: Field, ticket_id: Field) -> Field {
    hash_7([
        md.origin,
        md.destination,
        md.date,
        md.class,
        md.product_type,
        ticket_id,
        C,
    ])
}

fn verify_signature(msg: Field, pk: PubKey, sig: Signature) -> bool {
    eddsa_verify::<PoseidonHasher>(
        pk.x,
        pk.y,
        sig.s,
        sig.R_x,
        sig.R_y,
        msg,
    )
}

pub fn main(
    md: TicketMetadataPublic,
    C: Field,
    N: Field,
    pk_TA: PubKey,
    sig: Signature,

    s: Field,
    ticket_id: Field,
) {
    let C_calc = compute_commitment(ticket_id, s);
    assert(C == C_calc);

    let N_calc = compute_nullifier(s);
    assert(N == N_calc);

    let msg = compute_message(md, C, ticket_id);
    let ok = verify_signature(msg, pk_TA, sig);
    assert(ok);
}
