import { StaticImageData } from "next/image";
import ceramica from "../who_we_are/ceramica.jpeg";
import mammasendy from "../who_we_are/mammasendy.jpg";
import selfieOlive from "../who_we_are/selfie_olive.jpeg";
import oliveto from "../who_we_are/oliveto.jpg";
import lago from "../who_we_are/lago.jpeg";
import orto2 from "../farm/orto2.jpeg";
import legna from "../farm/legna.jpeg";
import olive from "../farm/olive.jpeg";
import olive2 from "../farm/olive2.jpeg";
import oliveOil from "../farm/olive_oil.jpeg";
import vigna1 from "../farm/vigna1.jpeg";
import nonna from "../farm/nonna.jpeg";
import friends from "../villa_perlata/esterni/friends.png";
import boat from "../who_we_are/boat.png";
import ristoro from "../100esimo/ristoro.jpeg";
import cucina from "../100esimo/cucina.jpg";
import fuori from "../100esimo/fuori2.jpeg";
import villaInterno from "../villa_perlata/terra/salotto.jpg";

export type GalleryTab = "meet_us" | "farm" | "guests_events";

export const galleryImages: Record<GalleryTab, StaticImageData[]> = {
  meet_us: [ceramica, mammasendy, selfieOlive, oliveto, lago],
  farm: [orto2, oliveOil, vigna1, olive, olive2, legna, nonna],
  guests_events: [friends, boat, ristoro, villaInterno, cucina, fuori],
};
