import Image from "next/image";
import logoPath from "../../../public/assets/logos/logo.png";

const Logo = ({
  blur,
  width,
  height,
}: {
  blur: string;
  width: string;
  height: string;
}) => (
  <div className="relative justify-center flex items-center ">
    <div className={`relative  ${height} ${width}`}>
      <div
        className={`${width} ${height} absolute inset-0 bg-brand-sand rounded-full ${blur}`}
      ></div>
      <Image
        src={logoPath}
        alt="Le Piaje Logo"
        fill
        sizes="100%"
        style={{ objectFit: "contain" }}
        className="relative z-40"
      />
    </div>
  </div>
);

export default Logo;
