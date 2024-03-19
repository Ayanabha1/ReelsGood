import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/dashboard/main">
        <Button>Go to dashboard</Button>
      </Link>
    </main>
  );
}
