import { BellRingIcon } from "lucide-react";

const Navbar = () => {
  const greet = () => {
    const name = "Ayanabha";
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let greeting;

    if (currentHour < 12) {
      greeting = "Good Morning";
    } else if (currentHour < 18) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }

    return `${greeting}, ${name}!`;
  };

  return (
    <div className="p-6 flex justify-between">
      {/* Greeting */}
      <div className="flex items-center gap-5">
        {/* User Image */}
        <div className="border p-1 rounded-full">
          {/* img */}
          <div className="h-12 w-12 bg-[rgb(242,243,245)] rounded-full"></div>
        </div>

        {/* Greet */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">{greet()}</h1>
          <span className="text-sm text-muted-foreground">
            Have an in-depth look at all the metrics within your dashboard
          </span>
        </div>
      </div>
      {/* Controls */}

      <div className="flex gap-3 items-center ">
        <BellRingIcon className="text-[rgb(180,180,180)] mr-4" />
        <div className="h-8 w-8 bg-[rgb(242,243,245)] rounded-full"></div>
        <span className="text-lg">Ayanabha Misra</span>
      </div>
    </div>
  );
};

export default Navbar;
