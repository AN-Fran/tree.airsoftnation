export type HpaProductCategory = "engine" | "regulator";

export type EvidenceStatus =
  | "manufacturer_verified"
  | "airsoftnation_tested"
  | "community_reported";

export interface HpaProduct {
  name: string;
  manufacturer: string;
  category: HpaProductCategory;
  slug: string;
  route: string;
  publicationStatus: "planned";
}

export const evidenceLabels: Record<EvidenceStatus, string> = {
  manufacturer_verified: "Verificado por el fabricante",
  airsoftnation_tested: "Probado por Airsoft Nation",
  community_reported: "Reportado por la comunidad",
};

export const hpaProducts: HpaProduct[] = [
  { name: "Wolverine Inferno Gen 2", manufacturer: "Wolverine", category: "engine", slug: "wolverine-inferno-gen-2", route: "/hpa/engines/wolverine-inferno-gen-2/", publicationStatus: "planned" },
  { name: "Wolverine Inferno XTS", manufacturer: "Wolverine", category: "engine", slug: "wolverine-inferno-xts", route: "/hpa/engines/wolverine-inferno-xts/", publicationStatus: "planned" },
  { name: "PolarStar JACK", manufacturer: "PolarStar", category: "engine", slug: "polarstar-jack", route: "/hpa/engines/polarstar-jack/", publicationStatus: "planned" },
  { name: "PolarStar F2", manufacturer: "PolarStar", category: "engine", slug: "polarstar-f2", route: "/hpa/engines/polarstar-f2/", publicationStatus: "planned" },
  { name: "Wolverine STORM Category 5", manufacturer: "Wolverine", category: "regulator", slug: "wolverine-storm-category-5", route: "/hpa/reguladores/wolverine-storm-category-5/", publicationStatus: "planned" },
  { name: "PolarStar Micro Reg Gen2", manufacturer: "PolarStar", category: "regulator", slug: "polarstar-micro-reg-gen2", route: "/hpa/reguladores/polarstar-micro-reg-gen2/", publicationStatus: "planned" },
  { name: "SPEED Airsoft Sport", manufacturer: "SPEED Airsoft", category: "regulator", slug: "speed-airsoft-sport", route: "/hpa/reguladores/speed-airsoft-sport/", publicationStatus: "planned" },
  { name: "SPEED Airsoft Ultra", manufacturer: "SPEED Airsoft", category: "regulator", slug: "speed-airsoft-ultra", route: "/hpa/reguladores/speed-airsoft-ultra/", publicationStatus: "planned" },
  { name: "Balystik SMR200", manufacturer: "Balystik", category: "regulator", slug: "balystik-smr200", route: "/hpa/reguladores/balystik-smr200/", publicationStatus: "planned" },
];
