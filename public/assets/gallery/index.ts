import { StaticImageData } from "next/image";
import verna from "../who_we_are/verna.jpg";
import mammasendy from "../who_we_are/mammasendy.jpg";
import selfieOlive from "../who_we_are/selfie_olive.jpeg";
import oliveto from "../who_we_are/oliveto.jpg";
import lago from "../who_we_are/lago.jpeg";
import orto2 from "../farm/orto2.jpeg";
import legna from "../farm/legna.jpeg";
import melograni from "../farm/melograni.jpeg";
import olive from "../farm/olive.jpeg";
import olive2 from "../farm/olive2.jpeg";
import orto1 from "../farm/orto1.jpeg";
import vigna1 from "../farm/vigna1.jpeg";
import nonna from "../farm/nonna.jpeg";
import friends from "../friends.png";
import boat from "../boat.png";
import ristoro from "../ristoro.jpeg";
import letti from "../100esimo/letti.jpeg";
import fuori from "../100esimo/fuori.jpeg";
import villaInterno from "../villa_perlata/interno3.jpeg";

export type GalleryTab = "meet_us" | "farm" | "guests_events";

export const galleryImages: Record<GalleryTab, StaticImageData[]> = {
  meet_us: [verna, mammasendy, selfieOlive, oliveto, lago],
  farm: [orto2, orto1, vigna1, olive, olive2, melograni, legna, nonna],
  guests_events: [friends, boat, ristoro, villaInterno, letti, fuori],
};
