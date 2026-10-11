#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Finder can start .command files with a limited PATH.
export PATH="/opt/homebrew/bin:/usr/local/bin:${HOME}/.cargo/bin:${PATH}"
if [[ "$(uname -s)" != "Darwin" || "$(uname -m)" != "arm64" ]]; then
  echo "此脚本用于 Apple 芯片 Mac（M1/M2/M3/M4/M5）。"
  exit 1
fi
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo "请先安装 Node.js 20 或更新版本：https://nodejs.org/"
  exit 1
fi
if [[ "$(node -p 'Number(process.versions.node.split(".")[0]) >= 20')" != "true" ]]; then
  echo "需要 Node.js 20 或更新版本。"
  exit 1
fi
if ! command -v cargo >/dev/null || ! command -v rustup >/dev/null; then
  echo "请先安装 Rust：https://rustup.rs/"
  exit 1
fi
if ! xcode-select -p >/dev/null 2>&1; then
  echo "请先运行 xcode-select --install，安装 Apple 命令行工具后重试。"
  exit 1
fi
rustup target add aarch64-apple-darwin
npm ci
npm run build:mac:zh
open target/aarch64-apple-darwin/release/bundle/dmg
printf '\n构建完成，已打开 DMG 所在文件夹。\n'
