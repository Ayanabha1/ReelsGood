import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import CustomUserButton from "./CustomUserButton";

const Navbar = () => {
  return (
    <nav className="flex justify-between px-3 sm:px-6 py-4  border-b border-[rgba(255,255,255,0.3)] items-center">
      <Link
        href="/movies"
        className="text-2xl font-semibold flex gap-1 items-center"
      >
        <div className="relative h-8 w-10">
          <Image src="/logo.png" alt="logo" fill />
        </div>
        ReelsGood
      </Link>
      <CustomUserButton />
    </nav>
  );
};

export default Navbar;
