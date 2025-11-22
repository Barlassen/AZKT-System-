# 🔧 Rust Installation (Required for Circom)

## Quick Install (Windows)

1. **Download Rust:**
   - Go to: https://rustup.rs/
   - Click "Download rustup-init.exe"
   - Run the installer

2. **Installation Options:**
   - Choose "1) Proceed with installation (default)"
   - Wait for installation to complete (~5 minutes)

3. **Restart Terminal:**
   - Close and reopen PowerShell/CMD
   - This is important for PATH to update!

4. **Verify Installation:**
   ```powershell
   rustc --version
   ```
   Should show: `rustc 1.x.x`

5. **Continue with Circom Setup:**
   ```powershell
   cd contracts
   .\setup-circom.ps1
   ```

## Alternative: Manual Installation

If the installer doesn't work:
1. Download from: https://www.rust-lang.org/tools/install
2. Follow platform-specific instructions

## After Rust Installation

Once Rust is installed, run:
```powershell
cd contracts
.\setup-circom.ps1
```

This will automatically:
- Clone Circom repository
- Build Circom compiler
- Install Circom globally
- Compile the circuit
- Run trusted setup

## Need Help?

If you encounter issues:
- Check Rust installation: `rustc --version`
- Make sure terminal was restarted after Rust installation
- Check PATH includes Rust binaries

