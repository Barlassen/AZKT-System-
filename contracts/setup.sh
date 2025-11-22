#!/bin/bash

# AZKT Circom Setup Script
# This script installs circomlib and performs the first compilation

echo "🚀 Starting AZKT Circom Setup..."

# 1. Install circomlib
echo "📦 Installing circomlib..."
npm install circomlib

# 2. Verify circomlib is in the correct location
if [ ! -d "node_modules/circomlib" ]; then
    echo "❌ circomlib installation failed!"
    exit 1
fi

echo "✅ circomlib installed"

# 3. Create build directory
echo "📁 Creating build directory..."
mkdir -p build

# 4. Try first compilation (with TREE_DEPTH = 4)
echo "🔨 Compiling circuit (TREE_DEPTH = 4)..."
circom circuits/TicketOwnership.circom --r1cs --wasm --sym -o build

if [ $? -eq 0 ]; then
    echo "✅ Compilation successful! The biggest technical obstacle of the project has been overcome!"
    echo "📊 Generated files:"
    ls -lh build/
else
    echo "❌ Compilation failed! Please check the errors."
    exit 1
fi

echo "🎉 Setup completed!"
