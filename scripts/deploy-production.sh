#!/bin/sh
set -eu

REPO_DIR="${REPO_DIR:-/root/tree_airsoftnation_repo}"
DEPLOY_DIR="${DEPLOY_DIR:-/opt/tree}"
HEALTH_URL="${HEALTH_URL:-https://tree.airsoftnation.eu/api/health/contact}"
HEALTH_ATTEMPTS="${HEALTH_ATTEMPTS:-12}"
HEALTH_RETRY_SECONDS="${HEALTH_RETRY_SECONDS:-5}"

if [ ! -f "$DEPLOY_DIR/.env" ]; then
  echo "ERROR: missing $DEPLOY_DIR/.env" >&2
  exit 1
fi

cd "$REPO_DIR"
git switch main
git pull --ff-only

# Production is a deployment copy. Secrets stay local in /opt/tree/.env.
rsync -a --delete \
  --exclude='.git/' \
  --exclude='.env' \
  --exclude='node_modules/' \
  --exclude='dist/' \
  ./ "$DEPLOY_DIR/"

cd "$DEPLOY_DIR"
docker compose config >/dev/null
docker compose build tree_app
docker compose up -d --force-recreate tree_app
docker compose ps tree_app

set -a
. "$DEPLOY_DIR/.env"
set +a

if [ -z "${KUMA_HEALTH_TOKEN:-}" ]; then
  echo "ERROR: KUMA_HEALTH_TOKEN is missing" >&2
  exit 1
fi

attempt=1
while [ "$attempt" -le "$HEALTH_ATTEMPTS" ]; do
  echo "Healthcheck attempt $attempt/$HEALTH_ATTEMPTS..."

  if curl --fail --silent --show-error \
    --connect-timeout 5 \
    --max-time 10 \
    -H "Authorization: Bearer $KUMA_HEALTH_TOKEN" \
    "$HEALTH_URL"; then
    printf '\nDeployment completed successfully.\n'
    exit 0
  fi

  if [ "$attempt" -lt "$HEALTH_ATTEMPTS" ]; then
    sleep "$HEALTH_RETRY_SECONDS"
  fi
  attempt=$((attempt + 1))
done

echo "ERROR: healthcheck failed after $HEALTH_ATTEMPTS attempts" >&2
docker compose logs --tail=50 tree_app >&2 || true
exit 1
