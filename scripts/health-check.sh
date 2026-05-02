#!/usr/bin/env bash
# Trigger a synchronous execution of stock-sync-orchestrator and
# print the result. Non-zero exit code if the execution failed.

set -euo pipefail

FUNCTION_ID="stock-sync-orchestrator"

echo "==> Triggering execution..."
appwrite functions create-execution \
  --function-id "$FUNCTION_ID" \
  --body '' \
  --path '/' \
  --method POST \
  --headers '{}' \
  --async false | cat

echo ""
echo "==> Latest executions:"
appwrite functions list-executions \
  --function-id "$FUNCTION_ID" | cat
