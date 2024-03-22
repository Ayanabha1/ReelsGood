import IncreasePercentage from "@/components/IncreasePercentage";
import Transactions from "@/components/Transactions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChartIcon,
  BookOpenTextIcon,
  ChevronRightIcon,
  DollarSign,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Dashboard = async () => {
  const bannerData = [
    {
      title: "Movie Of The Month",
      name: "Avengers: Endgame",
      sales: "500k",
      comparison: "50%",
      comparisionText: "of all movies combined",
    },
    {
      title: "Cinema Of The Month",
      name: "SVF Cinemas: Malda",
      sales: "100k",
      comparison: "40%",
      comparisionText: "of all cinemas combined",
    },
  ];

  return (
    <div className="p-6 flex gap-10 h-[85vh] overflow-scroll">
      {/* Left part */}
      <section className="w-[80%] flex flex-col gap-10 ">
        <div className="flex gap-4">
          {/* Total Sales & Cost */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-semibold">Total Sales & Cost</h1>
              <span className="text-muted-foreground text-sm">This month</span>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-3xl font-bold text-secondary">
                $956.82k
              </span>
              <IncreasePercentage value={"5.4%"} />
            </div>
            <IncreasePercentage
              value="8k"
              text="than last month"
              textColor="text-muted-foreground"
            />
          </div>

          {/* Banners */}
          {bannerData?.map((item, i) => (
            <Card className="bg-secondary min-w-[100px] rounded-lg text-white p-4 flex-grow flex flex-col gap-2 shadow-xl">
              <h1 className="text-2xl font-bold">{item.title}</h1>
              <h2>{item.name}</h2>
              <div className="flex items-center gap-4">
                <h2>Total Sales</h2>
                <span>{item.sales}</span>
              </div>
              <div>
                <IncreasePercentage
                  value={item.comparison}
                  text={item.comparisionText}
                  textColor="rgb(0,0,0)"
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Transaction History */}
        <div className="flex flex-col gap-5">
          <Transactions />
        </div>
      </section>
      <section className="w-[20%] flex flex-col gap-10">
        <Calendar className="rounded-lg shadow-md" />
        <Card className="w-full h-full shadow-md border p-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">View Insights</h1>
            <span className="text-sm text-muted-foreground">
              There are more to view
            </span>
          </div>

          <div className="mt-2 flex flex-col gap-4">
            <Button
              className="flex items-center justify-between shadow w-full"
              variant="outline"
            >
              <div className="flex items-center gap-2">
                <BarChartIcon className="h-4 w-4" />
                Order complete ratio
              </div>
              <ChevronRightIcon className="h-4 w-4" />{" "}
            </Button>
            <Button
              className="flex items-center justify-between shadow w-full"
              variant="outline"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Invoice Analysis
              </div>
              <ChevronRightIcon className="h-4 w-4" />{" "}
            </Button>
            <Button
              className="flex items-center justify-between shadow w-full"
              variant="outline"
            >
              <div className="flex items-center gap-2">
                <BookOpenTextIcon className="h-4 w-4" />
                Bookings
              </div>
              <ChevronRightIcon className="h-4 w-4" />{" "}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
