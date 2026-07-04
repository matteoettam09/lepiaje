export type TusciaAttractionKey =
  | "rocca_papi"
  | "isola_bisentina"
  | "civita_di_bagnoregio"
  | "villa_lante"
  | "sacro_bosco"
  | "rocca_monaldeschi"
  | "duomo_orvieto";

export const TUSCIA_ATTRACTION_IMAGES: Record<TusciaAttractionKey, string> = {
  rocca_papi: "/assets/tuscia/rocca-papi.jpg",
  isola_bisentina: "/assets/tuscia/isola-bisentina.jpg",
  civita_di_bagnoregio: "/assets/tuscia/civita-di-bagnoregio.jpg",
  villa_lante: "/assets/tuscia/villa-lante.jpg",
  sacro_bosco: "/assets/tuscia/sacro-bosco.jpg",
  rocca_monaldeschi: "/assets/tuscia/rocca-monaldeschi.jpg",
  duomo_orvieto: "/assets/tuscia/duomo-orvieto.jpg",
};

export const TUSCIA_IMAGE_PLACEHOLDER = "/assets/logos/logo.png";
