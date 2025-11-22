# Starting Action Plan

This document contains the step-by-step action plan for preparing the Circom circuit for the AZKT project.

## 🎯 Objective

Successfully compile the Circom circuit and overcome the biggest technical obstacle of the project.

## 📋 Steps

### 1. Create Basic File ✅

**Status:** Completed

The `TicketOwnership.circom` file has been created and the draft has been placed inside it.

**File:** `contracts/circuits/TicketOwnership.circom`

### 2. Install Libraries

**Task:** Include the libraries required by Circom in the working environment.

**Required Libraries:**
- `circomlib` - Circom library
- Specifically:
  - `Poseidon Hash` component
  - `MerklePathChecker` component

**Installation:**

```bash
cd contracts
npm install
```

This command installs the dependencies in `package.json`:
- `circomlib@^2.0.5`
- `snarkjs@^0.7.0`

**Verification:**

```bash
# Check that circomlib is installed
ls node_modules/circomlib

# Check Poseidon component
ls node_modules/circomlib/circuits/poseidon.circom

# Check MerklePathChecker
ls node_modules/circomlib/circuits/merklepath.circom
```

### 3. First Compilation

**Task:** Compile the circuit starting with a very simple and small tree depth.

**Starting Depth:** `TREE_DEPTH = 4`

**Compilation Command:**

```bash
cd contracts
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build
```

**Alternative (Using Setup Script):**

```bash
# Linux/Mac:
chmod +x setup.sh
./setup.sh

# Windows:
.\setup.ps1
```

**Expected Output:**

```
template instances: 3
non-linear constraints: XXX
linear constraints: XXX
public inputs: 2
public outputs: 1
private inputs: 1
private outputs: 0
wires: XXX
labels: XXX
```

**Generated Files:**

- `build/TicketOwnership.r1cs` - R1CS constraint file
- `build/TicketOwnership.wasm` - WASM file (for witness generation)
- `build/TicketOwnership.sym` - Symbol file

## ✅ Success Criteria

**If compilation is successful:** The biggest technical obstacle of the project has been overcome! 🎉

## 🔄 Next Steps

1. **Increase Depth:**
   - `TREE_DEPTH = 4` → `TREE_DEPTH = 20`
   - Compile again

2. **Trusted Setup:**
   - Generate powers of tau
   - Generate zkey
   - Export verification key

3. **Proof Generation:**
   - Generate witness
   - Generate proof
   - Verify

## 🐛 Troubleshooting

### Error: "circomlib not found"

**Solution:**
```bash
cd contracts
npm install circomlib
```

### Error: "Poseidon component not found"

**Solution:**
- Check that `node_modules/circomlib/circuits/poseidon.circom` file exists
- Check `circomlib` version (2.0.5+)

### Error: "MerklePathChecker not found"

**Solution:**
- Check that `node_modules/circomlib/circuits/merklepath.circom` file exists
- Check `circomlib` version

### Error: Compilation takes too long

**Solution:**
- Start with `TREE_DEPTH = 4`
- Increase depth after successful compilation

## 📝 Notes

- Use `TREE_DEPTH = 4` for first compilation (quick test)
- Use `TREE_DEPTH = 20` for production
- After successful compilation, proceed to trusted setup

## 🎯 Goal

**If you are ready to prepare the Circom circuit, we can proceed with these steps!**
