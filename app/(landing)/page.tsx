import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignIn, SignUp, UserButton, auth } from "@clerk/nextjs";
import { Lato, Montserrat, Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const auth_ = auth();
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 justify-center">
      <h1 className={cn("text-2xl sm:text-4xl md:text-6xl font-semibold")}>
        ReelRush
      </h1>
      <Link href={"/movies"}>
        <Button>Signin to continue</Button>
      </Link>
    </main>
  );
}
