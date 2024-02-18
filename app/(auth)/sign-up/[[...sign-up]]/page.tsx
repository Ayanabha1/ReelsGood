import { SignUp, auth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <>
      <title>Signup - ReelRush</title>
      <SignUp appearance={{ baseTheme: dark }} />
    </>
  );
}
