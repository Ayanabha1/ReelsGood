"use client";
import CustomTable from "@/components/CustomTable";
import { getDate2, showError, showSuccess } from "@/lib/commonFunctions";
import {
  CinemaInterface,
  MovieInterface,
  TableCellInterface,
} from "@/lib/commonInterfaces";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactElement, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SearchBar from "@/components/CustomSearch";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import CustomButton from "@/components/CustomButton";
import { Card } from "@/components/ui/card";

interface StreamingInterface {
  cinema: CinemaInterface;
  streaming: { date: Date };
}

const AddCinemaModal = ({
  trigger,
  clickCb,
}: {
  trigger: ReactElement;
  clickCb: (data: any) => void;
}) => {
  const [data, setData] = useState<any>([]);
  const clickHandler = (item: any) => {
    let includes = data?.filter((i: any) => i.id === item.id);
    if (includes?.length === 0) {
      setData((prev: any) => [...prev, { ...item, new: true }]);
    }
  };

  const removeActor = (item: any) => {
    setData((prev: any) => prev.filter((i: any) => i !== item));
  };

  const handleSubmit = () => {
    clickCb(data);
    setData([]);
  };

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search for an cinema</DialogTitle>
          <DialogDescription>
            <SearchBar
              apiRoute="getCinemaByName"
              placeholder="Enter a name"
              clickCb={clickHandler}
              className="mt-2 w-full"
            />
            <div className="flex flex-col gap-3 mt-2 max-h-[300px] py-2 overflow-scroll">
              {data?.map((item: any, i: number) => (
                <div className="flex gap-2 items-center w-full" key={i}>
                  <h1 className="text-xl">{item?.name}</h1>
                  <Button
                    className="ml-auto"
                    variant="ghost"
                    onClick={() => {
                      removeActor(item);
                    }}
                  >
                    <Trash2Icon color="red" className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
            <DialogClose className="w-full">
              <Button
                className="mt-2 w-full"
                disabled={data.length === 0}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Add Cinema(s)
              </Button>
            </DialogClose>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const MovieStreaming = ({
  params,
}: {
  params: { movieId: React.ReactNode };
}) => {
  const router = useRouter();
  const [tableData, setTableData] = useState<TableCellInterface[][]>([]);
  const [movie, setMovie] = useState<MovieInterface>();
  const [mounted, setMounted] = useState(false);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCinemas, setNewCinemas] = useState<CinemaInterface[]>([]);

  const tableFields = ["Cinema", "Cinema Rating", "City", "State", "Added On"];
  const getStreamingData = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const movieId = params.movieId;
      if (!movieId) {
        showError("Please go back and select a movie");
        return;
      }
      const res = await fetch(
        baseURL + `/api/getStreamingCinemas?movie_id=${movieId}`,
        {
          cache: "no-store",
        }
      );
      const __data = await res.json();
      if (res?.status > 200) {
        console.log(__data);
        throw new Error(__data?.message);
      }
      const __tableData: TableCellInterface[][] = __data?.data?.map(
        (item: StreamingInterface): TableCellInterface[] => [
          {
            field: "id",
            value: item?.cinema?.id,
            metadata: true,
          },
          {
            field: "name",
            value: item?.cinema?.name,
          },
          {
            field: "rating",
            value: item?.cinema?.rating,
          },
          {
            field: "city",
            value: item?.cinema?.city,
          },
          {
            field: "state",
            value: item?.cinema?.state,
          },
          {
            field: "created_at",
            value: getDate2(item?.cinema?.created_at),
          },
        ]
      );

      setMovie(__data?.movie);
      setTableData(__tableData);
    } catch (error: any) {
      showError(error?.message || error);
    }
  };

  const selectCinema = (data: CinemaInterface) => {
    if (data?.id) {
      router.push(`/dashboard/streaming/${params.movieId}/${data?.id}`);
    }
  };

  const addNewCinema = (data: CinemaInterface[]) => {
    setChanged(true);
    console.log([...newCinemas, ...data]);
    setNewCinemas((prev: any) => [...prev, ...data]);
  };

  const removeCinema = (data: CinemaInterface) => {
    setNewCinemas((prev: any) =>
      prev?.filter((item: CinemaInterface) => item !== data)
    );
  };

  const updateCinema = async (data: CinemaInterface[]) => {
    setLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const movieId = movie?.id;
      const data = newCinemas?.map((item: any) => ({
        movie_id: movieId,
        cinema_id: item?.id,
      }));
      const payload = {
        movie_id: movieId,
        data: data,
      };
      const res = await fetch(baseURL + "/api/addStreamingCinema", {
        method: "POST",
        body: JSON.stringify(payload),
        cache: "no-store",
      }).then((res) => {
        if (res.status > 200) {
          throw new Error();
        }
      });
      setNewCinemas([]);
      getStreamingData();
      showSuccess("Movie cast updated successfully");
      setChanged(false);
    } catch (error) {
      showError("Could not add cinema");
    }
    setLoading(false);
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
          {movie?.name} | Select a cinema{" "}
        </h1>
        <AddCinemaModal
          clickCb={addNewCinema}
          trigger={
            <Button variant="ghost" className="flex items-center gap-2 text-md">
              <PlusCircleIcon /> <span>Add New Cinema</span>
            </Button>
          }
        />
        <CustomButton
          variant="outline"
          loading={loading}
          className="shadow"
          disabled={!changed}
          onClick={updateCinema}
        >
          Save Changes
        </CustomButton>
      </div>

      <div className="flex gap-5 flex-wrap w-full">
        {newCinemas?.map((item: CinemaInterface, i: number) => (
          <Card
            key={i}
            className="flex flex-col gap-2 w-[15%] min-w-[250px]shadow  overflow-hidden cursor-pointer"
          >
            <div className="p-4 flex flex-col gap-2 ">
              <h1 className="text-lg">Cinema: {item?.name}</h1>
              <h1 className="text-lg">
                Location: {item?.city}, {item?.state}
              </h1>
              <h1 className="text-lg">Rating: {item?.rating}</h1>
            </div>
            <Button
              className="h-10 flex gap-2 items-center"
              variant="destructive"
              onClick={() => {
                removeCinema(item);
              }}
            >
              <Trash2Icon className="h-4 w-4" />
              <h1>Remove</h1>
            </Button>
          </Card>
        ))}
      </div>
      <CustomTable
        fields={tableFields}
        data={tableData}
        clickCb={selectCinema}
        caption="Movie streaming at"
      />
    </div>
  );
};

export default MovieStreaming;
