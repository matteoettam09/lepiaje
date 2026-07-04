import Link from "next/link";
import { MdErrorOutline } from "react-icons/md";

function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-brand-linen">
      <h2 className="text-brand-terracotta text-4xl font-display">Uh Oh :(</h2>
      <MdErrorOutline size={75} className="text-brand-terracotta" />
      <p className="text-brand-ink text-2xl text-center px-4">{`Unfortunately we couldn't find the page you were looking for`}</p>
      <Link className="text-brand-terracotta text-xl mt-4 hover:underline underline-offset-4" href="/">
        Return Home
      </Link>
    </div>
  );
}

export default NotFound;
