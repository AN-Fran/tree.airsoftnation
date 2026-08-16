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

export interface HpaFactoryReplica {
  name: string;
  manufacturer: "Wolverine Airsoft" | "ASG";
  slug: string;
  route: string;
  format: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  destinationUrl: string;
  destinationLabel: string;
  sourceUrl: string;
  evidenceStatus: "manufacturer_verified";
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

export const hpaFactoryReplicas: HpaFactoryReplica[] = [
  {
    name: "MTW Billet Series",
    manufacturer: "Wolverine Airsoft",
    slug: "wolverine-mtw-billet-series",
    route: "/hpa/fusiles/wolverine-mtw-billet-series/",
    format: "M4 / AR",
    summary: "La puerta de entrada a la plataforma MTW: cuerpo mecanizado desde bloques de aluminio y distintas longitudes y configuraciones. Según el acabado elegido puede montar INFERNO Gen 2 o INFERNO XTS y añadir electrónica o alimentación integrada.",
    imageUrl: "https://airsoftnation.store/web/image/product.template/6068/image_1920",
    imageAlt: "Wolverine MTW Billet Series HPA",
    destinationUrl: "https://airsoftnation.store/shop/rifle-hpa-wolverine-mtw-billet-standard-gen3-10-6068",
    destinationLabel: "Ver en Airsoft Nation Store",
    sourceUrl: "https://www.wolverineairsoft.com/product/mtw-billet-series/",
    evidenceStatus: "manufacturer_verified",
  },
  {
    name: "MTW Forged Series",
    manufacturer: "Wolverine Airsoft",
    slug: "wolverine-mtw-forged-series",
    route: "/hpa/fusiles/wolverine-mtw-forged-series/",
    format: "M4 / AR",
    summary: "La opción MTW con receptores mecanizados a partir de forjas de AR. Mantiene la arquitectura HPA propia de MTW y ofrece acabados estándar y Tactical con diferentes motores y controles electrónicos.",
    imageUrl: "https://airsoftnation.store/web/image/product.template/5604/image_1920",
    imageAlt: "Wolverine MTW Forged Series HPA",
    destinationUrl: "https://airsoftnation.store/shop/rifle-hpa-wolverine-mtw-forged-series-standard-10-5604",
    destinationLabel: "Ver en Airsoft Nation Store",
    sourceUrl: "https://www.wolverineairsoft.com/product/mtw-forged-series/",
    evidenceStatus: "manufacturer_verified",
  },
  {
    name: "Daniel Defense MTW MK18 RIS II XB",
    manufacturer: "Wolverine Airsoft",
    slug: "wolverine-daniel-defense-mtw-mk18",
    route: "/hpa/fusiles/wolverine-daniel-defense-mtw-mk18/",
    format: "MK18 con licencia",
    summary: "Interpretación MTW del MK18 con licencia Daniel Defense y EMG. Wolverine la publica con receptor forged, INFERNO XTS y control BLINC; está orientada a quien busca una configuración completa y una estética MK18 específica.",
    imageUrl: "/wolverine/01 - MTW-MK18-2026-Angled.webp",
    imageAlt: "Daniel Defense Wolverine MTW MK18 HPA",
    destinationUrl: "https://airsoftnation.store/shop/category/hpa-wolverine-rifles-mtw-687",
    destinationLabel: "Consultar en Airsoft Nation Store",
    sourceUrl: "https://www.wolverineairsoft.com/product/daniel-defense-mtw-mk18/",
    evidenceStatus: "manufacturer_verified",
  },
  {
    name: "MTW-9",
    manufacturer: "Wolverine Airsoft",
    slug: "wolverine-mtw-9",
    route: "/hpa/fusiles/wolverine-mtw-9/",
    format: "SMG / CQB",
    summary: "Versión compacta de la familia MTW para cargadores ASG EVO y PTS EPM E9. La configuración base usa INFERNO Gen 2 y la variante PDW XB incorpora INFERNO XTS y control BLINC.",
    imageUrl: "https://www.wolverineairsoft.com/wp-content/uploads/MTW-9-Standard-Angled-324x324.jpg",
    imageAlt: "Wolverine MTW-9 HPA",
    destinationUrl: "https://airsoftnation.store/shop/category/hpa-wolverine-rifles-mtw-687",
    destinationLabel: "Consultar en Airsoft Nation Store",
    sourceUrl: "https://www.wolverineairsoft.com/product/mtw-9/",
    evidenceStatus: "manufacturer_verified",
  },
  {
    name: "MTW-308",
    manufacturer: "Wolverine Airsoft",
    slug: "wolverine-mtw-308",
    route: "/hpa/fusiles/wolverine-mtw-308/",
    format: "DMR / 308",
    summary: "Plataforma semiautomática de formato 308 enfocada a configuraciones DMR. Admite cargadores MTW-308 y modelos SR-25 AEG compatibles; el motor depende del acabado seleccionado.",
    imageUrl: "https://airsoftnation.store/web/image/product.template/5466/image_1920",
    imageAlt: "Wolverine MTW-308 HPA",
    destinationUrl: "https://airsoftnation.store/shop/wolverine-mtw-308-unleashed-14-hpa-dmr-con-botella-integrada-5466",
    destinationLabel: "Ver en Airsoft Nation Store",
    sourceUrl: "https://www.wolverineairsoft.com/product/mtw-308/",
    evidenceStatus: "manufacturer_verified",
  },
  {
    name: "MTW AK-105",
    manufacturer: "Wolverine Airsoft",
    slug: "wolverine-mtw-ak-105",
    route: "/hpa/fusiles/wolverine-mtw-ak-105/",
    format: "AK",
    summary: "Traslada el concepto MTW a una réplica de formato AK-105. Wolverine indica que ha sido diseñada desde el inicio alrededor del INFERNO XTS, con receptor de acero estampado y chasis de motor propio.",
    imageUrl: "https://www.wolverineairsoft.com/wp-content/uploads/MTW-AK-105-Angled-scaled-324x324.jpg",
    imageAlt: "Wolverine MTW AK-105 HPA",
    destinationUrl: "https://www.wolverineairsoft.com/product/mtw-ak-105/",
    destinationLabel: "Ver en Wolverine Airsoft",
    sourceUrl: "https://www.wolverineairsoft.com/product/mtw-ak-105/",
    evidenceStatus: "manufacturer_verified",
  },
  {
    name: "Hybrid Series H-15 Carbine HPA",
    manufacturer: "ASG",
    slug: "asg-hybrid-h15-carbine-hpa",
    route: "/hpa/fusiles/asg-hybrid-h15-carbine-hpa/",
    format: "AR15 / M4",
    summary: "Carabina HPA completa de la serie Hybrid H-15. ASG la equipa con motor Backdraft Innovations Phoenix, FCU inalámbrica y controles configurables, dentro de una plataforma de estética AR con chasis metálico.",
    imageUrl: "https://actionsportgames.com/api/download?url=https%3A%2F%2Fapi.actionsportgames.com%2Fimages%2Fauto%2F0%2F0%2Fsm%2FcGVyZmlvbi8yMWM2N2EzMC1mZTVkLTRiZGUtYThiZi05OThjZDhhMDE4MjAucG5n.png",
    imageAlt: "ASG Hybrid Series H-15 Carbine HPA",
    destinationUrl: "https://actionsportgames.com/hybrid-series-h-15-carbine-hpa-black-20248",
    destinationLabel: "Ver en ASG",
    sourceUrl: "https://actionsportgames.com/hybrid-series-h-15-carbine-hpa-black-20248",
    evidenceStatus: "manufacturer_verified",
  },
  {
    name: "CZ Scorpion EVO 3 A1 HPA",
    manufacturer: "ASG",
    slug: "asg-cz-scorpion-evo-3-a1-hpa",
    route: "/hpa/fusiles/asg-cz-scorpion-evo-3-a1-hpa/",
    format: "EVO / SMG",
    summary: "La réplica HPA completa que ASG publica actualmente para la familia EVO. Sale configurada con motor Backdraft Innovations y FCU inalámbrica, conservando los controles y cargadores propios del Scorpion EVO.",
    imageUrl: "https://api.actionsportgames.com/images/fit/200/0/ce/L3BlcmZpb24vMThhZDdmYWUtMzBkOS00MGNkLTg0ZWMtY2YyZjBiNWU5ZTZkLnBuZw%3D%3D.png",
    imageAlt: "ASG CZ Scorpion EVO 3 A1 HPA",
    destinationUrl: "https://actionsportgames.com/cz-scorpion-evo-3-a1-hpa-black-20249",
    destinationLabel: "Ver en ASG",
    sourceUrl: "https://actionsportgames.com/cz-scorpion-evo-3-a1-hpa-black-20249",
    evidenceStatus: "manufacturer_verified",
  },
];
