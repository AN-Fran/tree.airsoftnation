# Airsoft Nation Tree

Astro application for `tree.airsoftnation.eu`, including the unified contact routing to Odoo and the authenticated contact-flow healthcheck used by Uptime Kuma.

## Runtime

- Node.js 20
- Astro with `@astrojs/node`
- Docker Compose
- Traefik on the external `proxy2` network
- Odoo connectivity through the API credentials supplied at runtime

## Local build

```sh
npm ci
npm run build
```

Never commit environment files. `.env` and `.env.production` are intentionally ignored.

## Production layout

The Git repository is maintained at:

```text
/root/tree_airsoftnation_repo
```

The running deployment is a separate copy at:

```text
/opt/tree
```

Production secrets live only in:

```text
/opt/tree/.env
```

`docker-compose.yml` explicitly loads that file. Do not point production at a `.env` inside the Git working copy.

Required runtime variables currently include the Odoo credentials, Brevo configuration and `KUMA_HEALTH_TOKEN`.

## Production deployment

After a change has been merged to `main`, deploy from the repository working copy:

```sh
cd /root/tree_airsoftnation_repo
sh scripts/deploy-production.sh
```

The script:

1. updates local `main` using fast-forward only;
2. synchronizes the repository into `/opt/tree` while preserving `/opt/tree/.env`;
3. validates the Compose configuration;
4. builds and recreates `tree_app`;
5. checks the authenticated Tree/Odoo health endpoint.

A deployment is not considered complete until the healthcheck returns successfully.

## Healthcheck

Endpoint:

```text
GET https://tree.airsoftnation.eu/api/health/contact
```

It requires:

```text
Authorization: Bearer <KUMA_HEALTH_TOKEN>
```

A valid request returns HTTP 200 and reports the `tree-contact` service plus Odoo status. Requests without the token must return HTTP 401.

Uptime Kuma should send the same bearer token in its HTTP monitor and alert through the configured Discord notification channel.

## Operational checks

```sh
cd /opt/tree

docker compose ps tree_app
docker compose logs --tail=200 tree_app
```

For contact-flow observability:

```sh
docker compose logs --tail=200 tree_app | grep 'contact\.'
```

Expected successful events include `contact.accepted` followed by `contact.completed`.
