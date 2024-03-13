"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
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
import CustomButton from "@/components/CustomButton";
import { showError, showSuccess } from "@/lib/commonFunctions";

const AddCastModal = ({
  trigger,
  clickCb,
}: {
  trigger: ReactElement;
  clickCb: (data: any) => void;
}) => {
  const [actors, setActors] = useState<any>([]);
  const clickHandler = (item: any) => {
    let includes = actors?.filter((i: any) => i.id === item.id);
    if (includes?.length === 0) {
      setActors((prev: any) => [...prev, { ...item, new: true }]);
    }
  };

  const removeActor = (item: any) => {
    setActors((prev: any) => prev.filter((i: any) => i !== item));
  };

  const handleSubmit = () => {
    clickCb(actors);
    setActors([]);
  };

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search for an actor</DialogTitle>
          <DialogDescription>
            <SearchBar
              apiRoute="getActorByName"
              placeholder="Enter a name"
              clickCb={clickHandler}
              className="mt-2 w-full"
            />
            <div className="flex flex-col gap-3 mt-2 max-h-[300px] py-2 overflow-scroll">
              {actors?.map((item: any, i: number) => (
                <div className="flex gap-2 items-center w-full" key={i}>
                  <div className="relative h-14 w-14 rounded-md overflow-hidden">
                    <Image
                      src={item?.picture}
                      className="object-cover"
                      alt="image"
                      fill
                    />
                  </div>
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
                disabled={actors.length === 0}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Add Cast
              </Button>
            </DialogClose>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const MovieCastingForMovie = ({
  params,
}: {
  params: { movieId: React.ReactNode };
}) => {
  const [movie, setMovie] = useState<any>({});
  const [actors, setActors] = useState<any>([]);
  const [mounted, setMounted] = useState(false);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const removeActor = (item: any) => {
    setChanged(true);
    setActors((prev: any) => prev.filter((i: any) => i !== item));
  };

  const addNewCast = (data: any) => {
    setChanged(true);
    console.log(data);
    setActors((prev: any) => [...prev, ...data]);
  };

  const updateCast = async () => {
    setLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const movieId = movie?.id;
      const data = actors?.map((item: any) => ({
        movie_id: movieId,
        actor_id: item?.id,
      }));
      const payload = {
        movie_id: movieId,
        cast: data,
      };
      const res = await fetch(baseURL + "/api/updateMovieCast", {
        method: "POST",
        body: JSON.stringify(payload),
        cache: "no-store",
      }).then((res) => {
        if (res.status > 200) {
          throw new Error();
        }
      });
      showSuccess("Movie cast updated successfully");
    } catch (error) {
      showError("Could not update movie cast");
    }
    setLoading(false);
  };

  const getMovie = async () => {
    const { movieId } = params;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const usersRes = await fetch(
      baseURL + `/api/getMovieById?movie_id=${movieId}`,
      {
        cache: "no-store",
      }
    );
    const data = await usersRes.json();
    setMovie(data?.data);
    const __actors = data?.data?.movie_cast?.map((item: any) => item?.actor);
    setActors(__actors);
  };

  useEffect(() => {
    setMounted(true);
    getMovie();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-6 flex flex-col gap-10 h-[85vh] overflow-scroll">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl">{movie?.name} Movie Cast</h1>
        <AddCastModal
          clickCb={addNewCast}
          trigger={
            <Button variant="ghost" className="flex items-center gap-2 text-md">
              <PlusCircleIcon /> <span>Add New Cast</span>
            </Button>
          }
        />

        <CustomButton
          variant="outline"
          loading={loading}
          className="shadow"
          disabled={!changed}
          onClick={updateCast}
        >
          Save Changes
        </CustomButton>
      </div>
      <div className="flex gap-5 flex-wrap w-full">
        {actors?.map((item: any, i: number) => (
          <Card
            key={i}
            className="flex flex-col h-[350px] w-[15%] min-w-[250px] shadow  overflow-hidden cursor-pointer"
          >
            <div className="relative h-[90%] w-full">
              {item?.new ? (
                <span className="absolute top-0 left-0 w-full text-center bg-secondary text-white z-[50]">
                  New Addition
                </span>
              ) : null}
              <Image
                src={item?.picture}
                alt="Image"
                fill
                className="object-cover"
              />
              <Button
                className="ml-auto z-[50] absolute bottom-2 right-2 p-2"
                variant="outline"
                onClick={() => {
                  removeActor(item);
                }}
              >
                <Trash2Icon className="h-5 w-5" />
              </Button>{" "}
            </div>
            <h1 className="m-auto text-lg">{item?.name}</h1>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MovieCastingForMovie;
