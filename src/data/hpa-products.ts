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
  publicationStatus: "planned" | "published";
}

export interface HpaEngineFact {
  label: string;
  value: string;
}

export interface HpaEngine {
  name: string;
  manufacturer: "Wolverine Airsoft" | "PolarStar";
  slug: string;
  route: string;
  cycle: string;
  solenoids: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  destinationUrl: string;
  destinationLabel: string;
  sourceUrl: string;
  evidenceStatus: "manufacturer_verified";
  valveEvidenceStatus: EvidenceStatus;
  valveNote: string;
  valveSourceUrl: string;
  facts: HpaEngineFact[];
  whatItPrioritizes: string[];
  checkBeforeBuying: string[];
}

export interface HpaRegulator {
  name: string;
  manufacturer: "Wolverine Airsoft" | "PolarStar" | "SPEED Airsoft" | "Balystik";
  slug: string;
  route: string;
  format: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  destinationUrl: string;
  destinationLabel: string;
  sourceUrl: string;
  evidenceStatus: EvidenceStatus;
  sourceNote: string;
  facts: HpaEngineFact[];
  whatItPrioritizes: string[];
  checkBeforeBuying: string[];
  creepFocus: string;
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
  { name: "Wolverine Inferno Gen 2", manufacturer: "Wolverine", category: "engine", slug: "wolverine-inferno-gen-2", route: "/hpa/engines/wolverine-inferno-gen-2/", publicationStatus: "published" },
  { name: "Wolverine Inferno XTS", manufacturer: "Wolverine", category: "engine", slug: "wolverine-inferno-xts", route: "/hpa/engines/wolverine-inferno-xts/", publicationStatus: "published" },
  { name: "PolarStar JACK", manufacturer: "PolarStar", category: "engine", slug: "polarstar-jack", route: "/hpa/engines/polarstar-jack/", publicationStatus: "published" },
  { name: "PolarStar F2", manufacturer: "PolarStar", category: "engine", slug: "polarstar-f2", route: "/hpa/engines/polarstar-f2/", publicationStatus: "published" },
  { name: "Wolverine STORM Category 5", manufacturer: "Wolverine", category: "regulator", slug: "wolverine-storm-category-5", route: "/hpa/reguladores/wolverine-storm-category-5/", publicationStatus: "published" },
  { name: "PolarStar Micro Reg Gen2", manufacturer: "PolarStar", category: "regulator", slug: "polarstar-micro-reg-gen2", route: "/hpa/reguladores/polarstar-micro-reg-gen2/", publicationStatus: "published" },
  { name: "SPEED Airsoft Sport", manufacturer: "SPEED Airsoft", category: "regulator", slug: "speed-airsoft-sport", route: "/hpa/reguladores/speed-airsoft-sport/", publicationStatus: "published" },
  { name: "SPEED Airsoft Ultra", manufacturer: "SPEED Airsoft", category: "regulator", slug: "speed-airsoft-ultra", route: "/hpa/reguladores/speed-airsoft-ultra/", publicationStatus: "published" },
  { name: "Balystik SMR200", manufacturer: "Balystik", category: "regulator", slug: "balystik-smr200", route: "/hpa/reguladores/balystik-smr200/", publicationStatus: "published" },
];

export const hpaEngines: HpaEngine[] = [
  {
    name: "Wolverine Inferno Gen 2",
    manufacturer: "Wolverine Airsoft",
    slug: "wolverine-inferno-gen-2",
    route: "/hpa/engines/wolverine-inferno-gen-2/",
    cycle: "Híbrido",
    solenoids: "Un solenoide",
    summary: "Engine de conversión con poppet y nozzle independientes. Wolverine lo define como híbrido: introduce una pausa entre la carga de la bola y el disparo sin convertirlo en un sistema de doble solenoide.",
    imageUrl: "https://www.wolverineairsoft.com/wp-content/uploads/inferno-scaled-324x324.jpg",
    imageAlt: "Wolverine Inferno Gen 2 HPA engine",
    destinationUrl: "https://www.wolverineairsoft.com/product/inferno-gen-2/",
    destinationLabel: "Ver en Wolverine Airsoft",
    sourceUrl: "https://www.wolverineairsoft.com/product/inferno-gen-2/",
    evidenceStatus: "manufacturer_verified",
    valveEvidenceStatus: "airsoftnation_tested",
    valveNote: "Airsoft Nation identifica por experiencia de taller una electroválvula MAC específica para este engine, trabajando a 5 V. Es una comprobación propia; no atribuimos el dato del voltaje a la documentación del fabricante.",
    valveSourceUrl: "https://www.wolverineairsoft.com/product/o-ring-kit-for-mac-valves/",
    facts: [
      { label: "Presión de entrada", value: "60–140 PSI" },
      { label: "Energía publicada", value: "1–3 J, según la build" },
      { label: "Cadencia publicada", value: "5–35 RPS ajustables" },
      { label: "Ajuste", value: "Dwell regulable" },
    ],
    whatItPrioritizes: [
      "Ciclo híbrido con una pausa definida entre alimentación y disparo.",
      "Electrónica Spartan o Premium FCU según el kit.",
      "Versiones de conversión para distintas plataformas; hay que elegir el kit y nozzle correctos.",
    ],
    checkBeforeBuying: [
      "Compatibilidad exacta de gearbox, nozzle y electrónica.",
      "Que el regulador secundario cubra el rango requerido sin superar el límite del engine.",
      "Alineación, grupo de hop y longitud de cañón de la build concreta.",
    ],
  },
  {
    name: "Wolverine Inferno XTS",
    manufacturer: "Wolverine Airsoft",
    slug: "wolverine-inferno-xts",
    route: "/hpa/engines/wolverine-inferno-xts/",
    cycle: "Híbrido de carrera extendida",
    solenoids: "Un solenoide",
    summary: "Evolución del INFERNO con carrera extendida y poppet y nozzle independientes. Wolverine atribuye a esta secuencia más margen de alimentación, sellado y ajuste de dwell; las versiones AEG y MTW no incluyen exactamente las mismas funciones.",
    imageUrl: "https://www.wolverineairsoft.com/wp-content/uploads/INFERNO-XTS-for-AEG-scaled-324x324.jpg",
    imageAlt: "Wolverine Inferno XTS HPA engine para AEG",
    destinationUrl: "https://www.wolverineairsoft.com/product/inferno-xts-hpa-engine-for-aeg/",
    destinationLabel: "Ver en Wolverine Airsoft",
    sourceUrl: "https://www.wolverineairsoft.com/product/inferno-xts-hpa-engine-for-aeg/",
    evidenceStatus: "manufacturer_verified",
    valveEvidenceStatus: "airsoftnation_tested",
    valveNote: "Airsoft Nation identifica por experiencia de taller una electroválvula MAC específica para este engine, trabajando a 5 V. Wolverine confirma el uso de MAC en la familia INFERNO; el dato del voltaje se presenta como comprobación propia.",
    valveSourceUrl: "https://www.wolverineairsoft.com/product/o-ring-kit-for-mac-valves/",
    facts: [
      { label: "Presión de entrada", value: "60–160 PSI" },
      { label: "Presión mínima de sellado", value: "30 PSI" },
      { label: "Energía publicada", value: "1–3 J, según la build" },
      { label: "Cadencia publicada", value: "5–35 RPS ajustables" },
    ],
    whatItPrioritizes: [
      "Más separación entre el movimiento de carga y la liberación de aire.",
      "Reductores de flujo opcionales para configuraciones de baja energía.",
      "BLINC en el kit AEG correspondiente; la compatibilidad QUAKE indicada por Wolverine es específica de MTW.",
    ],
    checkBeforeBuying: [
      "Distinguir la versión AEG de la versión MTW y revisar qué incluye cada kit.",
      "Confirmar nozzle, gearbox y electrónica compatibles.",
      "No extrapolar a una build concreta las cifras de energía o consumo publicadas por la marca.",
    ],
  },
  {
    name: "PolarStar JACK",
    manufacturer: "PolarStar",
    slug: "polarstar-jack",
    route: "/hpa/engines/polarstar-jack/",
    cycle: "Bolt abierto",
    solenoids: "Un solenoide",
    summary: "Conversión neumática compacta para AEG con nozzle de movimiento único que actúa también como válvula poppet. Su arquitectura simplifica el conjunto y vincula la alimentación y el disparo a una sola secuencia.",
    imageUrl: "https://polarstarairsoft.com/cdn/shop/products/h_jack_1920x500.jpg?v=1553538779&width=1445",
    imageAlt: "PolarStar JACK HPA conversion kit",
    destinationUrl: "https://polarstarairsoft.com/products/polarstar-airsoft-jack-hpa-engine",
    destinationLabel: "Ver en PolarStar",
    sourceUrl: "https://polarstarairsoft.com/products/polarstar-airsoft-jack-hpa-engine",
    evidenceStatus: "manufacturer_verified",
    valveEvidenceStatus: "airsoftnation_tested",
    valveNote: "Airsoft Nation identifica por experiencia de taller una electroválvula MAC específica para JACK, trabajando a 5 V. Es una afirmación técnica propia y no una especificación atribuida a la ficha comercial de PolarStar.",
    valveSourceUrl: "https://polarstarairsoft.com/apps/help-center",
    facts: [
      { label: "Presión de entrada", value: "50–130 PSI" },
      { label: "Cadencia publicada", value: "Hasta 30 RPS en configuraciones estándar" },
      { label: "Mecánica", value: "Una pieza móvil: el nozzle" },
      { label: "Ajuste", value: "Presión, dwell y cadencia mediante FCU" },
    ],
    whatItPrioritizes: [
      "Arquitectura de un solenoide y pocas piezas móviles.",
      "Conversión tipo cilindro para gearbox con nozzle centrado y kits específicos.",
      "Control de volumen mediante dwell, ajustado al cañón y a la presión de trabajo.",
    ],
    checkBeforeBuying: [
      "Modelo de gearbox y número de nozzle del kit.",
      "Calidad de alimentación del cargador y ajuste del hop, especialmente al subir la cadencia.",
      "La botella, el regulador, la línea y la batería se adquieren por separado según PolarStar.",
    ],
  },
  {
    name: "PolarStar F2",
    manufacturer: "PolarStar",
    slug: "polarstar-f2",
    route: "/hpa/engines/polarstar-f2/",
    cycle: "Cerrado o modo AEG",
    solenoids: "Dos solenoides",
    summary: "Sistema de doble solenoide que permite controlar por separado el nozzle y la válvula poppet. La FCU puede usar secuencia de bolt cerrado o invertirla al modo AEG, dando más margen de ajuste que un engine de un solo solenoide.",
    imageUrl: "https://polarstarairsoft.com/cdn/shop/products/Floating_F2_High_Res_1920x500.jpg?v=1553526825&width=1445",
    imageAlt: "PolarStar F2 HPA conversion kit",
    destinationUrl: "https://polarstarairsoft.com/products/polarstar-airsoft-f2-hpa-engine",
    destinationLabel: "Ver en PolarStar",
    sourceUrl: "https://polarstarairsoft.com/products/polarstar-airsoft-f2-hpa-engine",
    evidenceStatus: "manufacturer_verified",
    valveEvidenceStatus: "airsoftnation_tested",
    valveNote: "Airsoft Nation identifica por experiencia de taller electroválvulas MAC específicas para F2, trabajando a 5 V. Es una afirmación técnica propia y no una especificación atribuida a la ficha comercial de PolarStar.",
    valveSourceUrl: "https://archived.polarstarairsoft.com/prod-f1.php",
    facts: [
      { label: "Presión de entrada", value: "45–145 PSI" },
      { label: "Cadencia publicada", value: "Hasta 30 RPS en configuraciones estándar" },
      { label: "Ciclo", value: "Bolt cerrado o modo AEG configurable" },
      { label: "Control", value: "Nozzle y poppet ajustables por separado" },
    ],
    whatItPrioritizes: [
      "Ajuste independiente del tiempo de carga y del volumen de aire.",
      "Elección entre respuesta de bolt cerrado y secuencia tipo AEG.",
      "Una sola familia de nozzle para recorrer el rango de energía de cada variante compatible.",
    ],
    checkBeforeBuying: [
      "Versión del gearbox, nozzle, switchboard y longitud del cableado.",
      "Ajustes de FCU coherentes con cargador, hop, presión y cañón.",
      "La botella, el regulador, la línea y la batería se adquieren por separado según PolarStar.",
    ],
  },
];

export const hpaRegulators: HpaRegulator[] = [
  {
    name: "Wolverine STORM Category 5",
    manufacturer: "Wolverine Airsoft",
    slug: "wolverine-storm-category-5",
    route: "/hpa/reguladores/wolverine-storm-category-5/",
    format: "Regulador secundario en botella",
    summary: "Regulador secundario dedicado a airsoft para presets de botella estándar o de baja presión. Wolverine amplía el área del pistón respecto al STORM clásico y publica un intervalo de salida que también cubre engines de presión elevada.",
    imageUrl: "https://www.wolverineairsoft.com/wp-content/uploads/Storm-Category-5-with-Background-324x324.jpg",
    imageAlt: "Wolverine STORM Category 5 HPA regulator",
    destinationUrl: "https://www.wolverineairsoft.com/product/cat5/",
    destinationLabel: "Ver en Wolverine Airsoft",
    sourceUrl: "https://www.wolverineairsoft.com/product/cat5/",
    evidenceStatus: "manufacturer_verified",
    sourceNote: "Página de producto y manual oficial de Wolverine Airsoft.",
    facts: [
      { label: "Entrada publicada", value: "300–1000 PSI" },
      { label: "Salida ajustable", value: "60–180 PSI" },
      { label: "Altura publicada", value: "59,3 mm" },
      { label: "Servicio recomendado", value: "100.000 disparos o 6 meses" },
    ],
    whatItPrioritizes: [
      "Rango de salida amplio para diferentes engines HPA.",
      "Bloqueo de torneo con brida y regulación mediante tornillo frontal.",
      "Menos superficies de sellado y mayor área de pistón que el STORM clásico, según Wolverine.",
    ],
    checkBeforeBuying: [
      "Que el preset entregue entre 300 y 1000 PSI y esté en buen estado.",
      "Que el rango mínimo de 60 PSI sea compatible con la configuración buscada.",
      "Si el paquete incluye línea y qué tipo de conectores utiliza.",
    ],
    creepFocus: "Registrar la presión al conectar, tras varios disparos y después de 1 y 5 minutos sin disparar. Wolverine no publica en la ficha una cifra de creep que sustituya esa prueba.",
  },
  {
    name: "PolarStar Micro Reg Gen2",
    manufacturer: "PolarStar",
    slug: "polarstar-micro-reg-gen2",
    route: "/hpa/reguladores/polarstar-micro-reg-gen2/",
    format: "Regulador secundario compacto",
    summary: "Regulador compacto para botella con componentes internos compartidos con UGS y CGS. PolarStar destaca su mantenimiento simplificado, cuerpo de dos piezas y un conjunto interno con dos juntas tóricas.",
    imageUrl: "https://polarstarairsoft.com/cdn/shop/products/Micro_Reg_GEN2_Slider_1920x500.jpg?v=1564777667&width=1445",
    imageAlt: "PolarStar Micro Reg Gen2 HPA regulator",
    destinationUrl: "https://polarstarairsoft.com/products/micro-reg%E2%84%A2-gen2",
    destinationLabel: "Ver en PolarStar",
    sourceUrl: "https://polarstarairsoft.com/products/micro-reg%E2%84%A2-gen2",
    evidenceStatus: "manufacturer_verified",
    sourceNote: "Página de producto y documentación oficial de PolarStar.",
    facts: [
      { label: "Entrada máxima", value: "900 PSI" },
      { label: "Salida estándar", value: "40–130 PSI" },
      { label: "Con muelle HP opcional", value: "Hasta ~200 PSI" },
      { label: "Salidas", value: "2 × 1/8 NPT" },
    ],
    whatItPrioritizes: [
      "Tamaño reducido para bolsas compactas.",
      "Compatibilidad declarada con presets estándar y SLP.",
      "Bloqueo de torneo integrado y mantenimiento con pocas juntas.",
    ],
    checkBeforeBuying: [
      "El regulador solo no incluye necesariamente línea, QD ni filter fitting.",
      "No instalar el muelle HP salvo que el engine y el uso requieran ese intervalo.",
      "Confirmar que el preset no supera los 900 PSI de entrada publicados.",
    ],
    creepFocus: "Separar creep de una lectura lenta del manómetro: medir siempre con el sistema presurizado, disparar para descargar y repetir la observación con botella alta, media y baja.",
  },
  {
    name: "SPEED Airsoft Sport",
    manufacturer: "SPEED Airsoft",
    slug: "speed-airsoft-sport",
    route: "/hpa/reguladores/speed-airsoft-sport/",
    format: "Regulador secundario compacto",
    summary: "Modelo compacto para montaje sobre botella, con dos puertos 1/8 NPT y salida ajustable. SPEED lo presenta como alternativa de acceso a la arquitectura de sus reguladores externos.",
    imageUrl: "https://static.wixstatic.com/media/c1a799_c2d627e7c9c04d3a84f3e280f4908034~mv2.jpg/v1/fill/w_1920%2Ch_1920%2Cal_c%2Cq_90%2Cquality_auto/c1a799_c2d627e7c9c04d3a84f3e280f4908034~mv2.jpg",
    imageAlt: "SPEED Airsoft HPA Sport regulator",
    destinationUrl: "https://www.speedairsoft.com/product-page/hpa-sport-regulator",
    destinationLabel: "Ver en SPEED Airsoft",
    sourceUrl: "https://www.speedairsoft.com/product-page/hpa-sport-regulator",
    evidenceStatus: "manufacturer_verified",
    sourceNote: "Página de producto oficial de SPEED Airsoft.",
    facts: [
      { label: "Entrada máxima", value: "900 PSI" },
      { label: "Salida publicada", value: "20–140 PSI" },
      { label: "Preset indicado", value: "300–800 PSI de salida" },
      { label: "Puertos", value: "2 × 1/8 NPT" },
    ],
    whatItPrioritizes: [
      "Configuración flexible de línea y manómetro mediante dos puertos.",
      "Bloqueo de torneo con brida.",
      "Válvula de alivio ante sobrepresión, según SPEED.",
    ],
    checkBeforeBuying: [
      "Comprobar qué línea, manómetro y conectores incluye la referencia concreta.",
      "Usar grasa de silicona, que es el lubricante especificado por SPEED.",
      "No confundir la presión de almacenamiento de la botella con la salida de su preset.",
    ],
    creepFocus: "El fabricante no publica una cifra de creep. La estabilidad debe verificarse tras cerrar una ráfaga y dejar el sistema en reposo, además de medir la recuperación entre disparos.",
  },
  {
    name: "SPEED Airsoft Ultra",
    manufacturer: "SPEED Airsoft",
    slug: "speed-airsoft-ultra",
    route: "/hpa/reguladores/speed-airsoft-ultra/",
    format: "Sistema on-gun / hoseless",
    summary: "Regulador integrado en un frame para M4 V2 compatible con Tokyo Marui. El aire circula por el propio frame, incorpora purga manual y deja espacio interior para FCU y batería; no es un regulador remoto directamente equivalente a los demás.",
    imageUrl: "https://static.wixstatic.com/media/c1a799_abea992955164810b4f90c223bd2c71b~mv2.jpg/v1/fill/w_2080%2Ch_2080%2Cal_c%2Cq_90%2Cquality_auto/c1a799_abea992955164810b4f90c223bd2c71b~mv2.jpg",
    imageAlt: "SPEED Airsoft HPA Ultra on-gun regulator",
    destinationUrl: "https://www.speedairsoft.com/product-page/hpa-ultra-regulator",
    destinationLabel: "Ver en SPEED Airsoft",
    sourceUrl: "https://www.speedairsoft.com/product-page/hpa-ultra-regulator",
    evidenceStatus: "manufacturer_verified",
    sourceNote: "Página de producto oficial de SPEED Airsoft.",
    facts: [
      { label: "Entrada máxima", value: "900 PSI" },
      { label: "Salida publicada", value: "20–140 PSI" },
      { label: "Plataforma", value: "M4 V2 compatible TM" },
      { label: "Batería indicada", value: "260 mAh o menor" },
    ],
    whatItPrioritizes: [
      "Configuración sin línea externa entre botella y réplica.",
      "Mando ON/OFF con purga y manómetro orientado hacia la parte posterior.",
      "Frame, grips magnéticos y gatillo incluidos como sistema integrado.",
    ],
    checkBeforeBuying: [
      "Compatibilidad real del receiver y gearbox M4 V2 de la build.",
      "Espacio, conector y capacidad de la batería y la FCU.",
      "No compararlo por tamaño o precio con un regulador remoto: sustituye también el frame y el circuito de aire.",
    ],
    creepFocus: "La prueba debe hacerse con el sistema montado: observar manómetro tras la purga, presurización y reposo, y comprobar que el mando ON/OFF descarga el tramo indicado antes de desmontar.",
  },
  {
    name: "Balystik SMR200",
    manufacturer: "Balystik",
    slug: "balystik-smr200",
    route: "/hpa/reguladores/balystik-smr200/",
    format: "Regulador secundario compacto",
    summary: "Regulador compacto para presets SLP y de alta presión, comercializado con muelle estándar y otro de mayor rango. La documentación pública localizada procede de distribuidores, no de una ficha oficial actual de Balystik.",
    imageUrl: "https://airsoftyecla.es/19412-home_default/regulador-hpa-smr200-balystik-linea-de-aire.jpg",
    imageAlt: "Balystik SMR200 HPA regulator con línea",
    destinationUrl: "https://airsoftyecla.es/hpa/regulador-hpa-smr200-balystik-linea-de-aire.html",
    destinationLabel: "Ver en distribuidor",
    sourceUrl: "https://airsoftyecla.es/hpa/regulador-hpa-smr200-balystik-linea-de-aire.html",
    evidenceStatus: "community_reported",
    sourceNote: "Especificaciones coincidentes publicadas por varios distribuidores; falta una fuente primaria vigente de Balystik.",
    facts: [
      { label: "Entrada documentada", value: "200–1500 PSI" },
      { label: "Salida con muelle instalado", value: "40–140 PSI" },
      { label: "Muelle adicional", value: "80–210 PSI" },
      { label: "Peso documentado", value: "120 g" },
    ],
    whatItPrioritizes: [
      "Compatibilidad anunciada con presets SLP y HP.",
      "Formato ligero con entrada ASA y salida 1/8 NPT.",
      "Collar para bloquear el tornillo de ajuste.",
    ],
    checkBeforeBuying: [
      "Confirmar con el vendedor qué línea y conectores incluye el kit.",
      "Mantener el muelle estándar si la configuración trabaja por debajo de 140 PSI.",
      "Solicitar manual, recambios y procedimiento de mantenimiento antes de comprar.",
    ],
    creepFocus: "No hay una cifra primaria de creep disponible. Conviene registrar presión en reposo y recuperación durante varios minutos y repetir la prueba antes de atribuir una desviación al engine o al manómetro.",
  },
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
