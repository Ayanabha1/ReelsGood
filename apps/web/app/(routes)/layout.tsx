import Navbar from "@/components/Navbar";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <section className="">{children}</section>
    </div>
  );
};

export default layout;
