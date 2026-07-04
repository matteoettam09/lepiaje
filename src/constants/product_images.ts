import { StaticImageData } from "next/image";
import olive2 from "../../public/assets/farm/olive2.jpeg";
import orto2 from "../../public/assets/farm/orto2.jpeg";
import vigna1 from "../../public/assets/farm/vigna1.jpeg";

export const PRODUCT_IMAGES: Record<string, StaticImageData> = {
    "extra-virgin-olive-oil": olive2,
    "homemade-wine": vigna1,
    "seasonal-jam": orto2,
};
