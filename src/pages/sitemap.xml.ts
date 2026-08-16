import type { APIRoute } from "astro";
import { hpaFactoryReplicas } from "../data/hpa-products";

const routes = [
  "/",
  "/comprar/",
  "/contacto-form/",
  "/eventos/",
  "/hpa/",
  "/hpa/guia/",
  "/hpa/fusiles/",
  "/hpa/reguladores/slp-vs-estandar/",
  ...hpaFactoryReplicas.map(({ route }) => route),
  "/ir-a-jugar/",
  "/novedades/",
  "/saber/",
  "/taller/",
  "/wolverine/",
];

export const GET: APIRoute = () => {
  const urls = routes
    .map((route) => `<url><loc>https://tree.airsoftnation.eu${route}</loc></url>`)
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
