import { SignIn, auth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <>
      <title>Signin - ReelRush</title>
      <SignIn
        appearance={{
          baseTheme: dark,
        }}
      />
    </>
  );
}
