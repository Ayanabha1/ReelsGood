"use client";
import CustomTable from "@/components/CustomTable";
import {
  getDate2,
  getLocalTime,
  getTime,
  showError,
  showSuccess,
} from "@/lib/commonFunctions";
import {
  CinemaInterface,
  MovieInterface,
  TableCellInterface,
} from "@/lib/commonInterfaces";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { ReactElement, useEffect, useState } from "react";
import SearchBar from "@/components/CustomSearch";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import CustomButton from "@/components/CustomButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface StreamingInterface {
  date: Date;
  cinema: CinemaInterface;
  id: number | string;
}

const AddStreamingTimeModal = ({
  trigger,
  clickCb,
}: {
  trigger: ReactElement;
  clickCb: (data: any) => void;
}) => {
  const [data, setData] = useState<string>();

  const removeActor = (item: any) => {
    setData(undefined);
  };

  const addTime = (d: string) => {
    const date = new Date(d);
    setData(date.toUTCString());
  };

  const handleSubmit = () => {
    clickCb(data);
    setData(undefined);
  };

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select date & time</DialogTitle>
          <DialogDescription>
            <Input
              type="datetime-local"
              onChange={(e) => {
                addTime(e.target.value);
              }}
            />
            <div className="flex flex-col gap-3 mt-2 max-h-[300px] py-2 overflow-scroll">
              {data ? (
                <div className="flex gap-2 items-center w-full">
                  <h1 className="text-xl">
                    {getDate2(new Date(data))}, {getLocalTime(new Date(data))}
                  </h1>
                  <Button
                    className="ml-auto"
                    variant="ghost"
                    onClick={() => {
                      removeActor(data);
                    }}
                  >
                    <Trash2Icon color="red" className="h-5 w-5" />
                  </Button>
                </div>
              ) : null}
            </div>
            <DialogClose className="w-full">
              <Button
                className="mt-2 w-full"
                disabled={!data}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Add Time
              </Button>
            </DialogClose>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const StreamingTime = ({
  params,
}: {
  params: { movieId: React.ReactNode; cinemaId: React.ReactNode };
}) => {
  const tableFields = ["Cinema", "Date", "Time"];
  const [mounted, setMounted] = useState(false);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<MovieInterface>();
  const [cinema, setCinema] = useState<CinemaInterface>();
  const [dates, setDates] = useState<string[]>([]);
  const [tableData, setTableData] = useState<TableCellInterface[][]>([]);

  const getStreamingData = async () => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const movieId = params.movieId,
      cinemaId = params.cinemaId;
    if (!movieId) {
      showError("Please go back and select a movie");
      return;
    }
    const res = await fetch(
      baseURL +
        `/api/getStreamingInCinema?movie_id=${movieId}&cinema_id=${cinemaId}`,
      {
        cache: "no-store",
      }
    );
    const data = await res.json();
    const __tableData: TableCellInterface[][] = data?.data?.map(
      (item: StreamingInterface): TableCellInterface[] => [
        {
          field: "id",
          value: item?.cinema?.id,
          metadata: true,
        },
        {
          field: "Cinema",
          value: item?.cinema?.name,
        },
        {
          field: "Date",
          value: getDate2(item?.date),
        },
        {
          field: "Time",
          value: getLocalTime(item?.date),
        },
      ]
    );
    setCinema(data?.cinema);
    setMovie(data?.movie);
    setTableData(__tableData);
  };

  const addStreamingTime = (date: string) => {
    if (dates!?.length === 0) {
      setDates([date]);
    } else {
      setDates((prev) => [...prev!, date]);
    }

    setChanged(true);
  };

  const updateStreamingTime = async () => {
    if (dates!?.length) {
      setLoading(true);
      try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

        const payload = dates?.map((i) => ({
          date: new Date(i),
          cinema_id: cinema?.id,
          movie_id: movie?.id,
        }));
        const res = await fetch(baseURL + "/api/addStreamingTime", {
          method: "POST",
          body: JSON.stringify(payload),
          cache: "no-store",
        }).then((res) => {
          if (res.status > 200) {
            throw new Error();
          }
        });
        setDates([]);
        getStreamingData();
        showSuccess("Streaming time added successfully");
        setChanged(false);
      } catch (error) {
        showError("Could not add streaming time");
      }
      setLoading(false);
    }
  };

  const removeDate = (item: string) => {
    setDates((prev) => prev?.filter((i) => i !== item));
  };

  useEffect(() => {
    setMounted(true);
    getStreamingData();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-6 flex flex-col gap-10 h-[85vh] overflow-scroll">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">
          Streaming times of {movie?.name || "movie"} in cinema
        </h1>
        <AddStreamingTimeModal
          clickCb={addStreamingTime}
          trigger={
            <Button variant="ghost" className="flex items-center gap-2 text-md">
              <PlusCircleIcon /> <span>Add Streaming Time</span>
            </Button>
          }
        />
        <CustomButton
          variant="outline"
          loading={loading}
          className="shadow"
          disabled={!changed}
          onClick={updateStreamingTime}
        >
          Save Changes
        </CustomButton>
      </div>

      <div className="flex gap-5 flex-wrap w-full">
        {dates?.map((date: string, i: number) => (
          <Card
            key={i}
            className="flex flex-col gap-2 w-[15%] min-w-[250px]shadow  overflow-hidden cursor-pointer"
          >
            <div className="p-4 flex flex-col gap-2 ">
              <h1 className="text-lg">Date: {getDate2(new Date(date))}</h1>
              <h1 className="text-lg">Time: {getLocalTime(new Date(date))}</h1>
            </div>
            <Button
              className="h-10 flex gap-2 items-center"
              variant="destructive"
              onClick={() => {
                removeDate(date);
              }}
            >
              <Trash2Icon className="h-4 w-4" />
              <h1>Remove</h1>
            </Button>
          </Card>
        ))}
      </div>

      <CustomTable fields={tableFields} data={tableData} />
    </div>
  );
};

export default StreamingTime;
