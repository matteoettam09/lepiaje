import Link from "next/link";
import { MdErrorOutline } from "react-icons/md";

function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-brand-charcoal">
      <h2 className="text-[#ff5733] text-4xl">Uh Oh :(</h2>
      <MdErrorOutline size={75} color="#ff5733 " />
      <p className="text-brand-gold text-2xl">{`Unfortunately we couldn't find the page you were looking for`}</p>
      <Link className="text-[#0000FF] text-2xl" href="/">
        Return Home?
      </Link>
    </div>
  );
}

export default NotFound;
