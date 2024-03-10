import { SignIn, auth } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <title>Signin - ReelsGood</title>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">ReelsGood Admin Panel</h1>
        <h2 className="text-muted-foreground mb-10">
          Please Signin to continue
        </h2>
        <SignIn />
      </div>
    </>
  );
}
