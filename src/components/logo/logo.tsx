import Image from "next/image";
import logoPath from "../../../public/assets/logos/logo.png";

const Logo = ({
  blur,
  width,
  height,
  priority = false,
}: {
  blur: string;
  width: string;
  height: string;
  priority?: boolean;
}) => (
  <div className="relative flex items-center justify-center">
    <div className={`relative ${height} ${width}`}>
      <div
        className={`absolute inset-0 rounded-full bg-brand-sand ${blur} ${width} ${height}`}
      />
      <Image
        src={logoPath}
        alt="Le Piaje Logo"
        fill
        sizes="100%"
        priority={priority}
        style={{ objectFit: "contain" }}
        className="relative z-40"
      />
    </div>
  </div>
);

export default Logo;
