#!/bin/bash
# CTR AIOps Backend 시작 스크립트 (ARM64 네이티브 모드)

cd "$(dirname "$0")"
arch -arm64 ./venv/bin/python3 main.py

