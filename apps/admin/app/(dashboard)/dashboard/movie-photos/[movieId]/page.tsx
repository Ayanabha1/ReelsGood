"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CloudLightning, PlusCircleIcon, Trash2Icon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import Dropzone from "react-dropzone";

interface CustomFileInterface {
  url: string;
  file: File;
}

const AddCastModal = ({
  trigger,
  clickCb,
}: {
  trigger: ReactElement;
  clickCb: (data: any) => void;
}) => {
  const [files, setFiles] = useState<CustomFileInterface[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileType = file?.type?.split("/")[0];
    if (fileType !== "image") {
      showError("Only images are allowed");
    } else {
      const reader = new FileReader();
      let fileUrl: any;
      reader.onload = () => {
        fileUrl = reader.result;
        setFiles((prev) => [...prev, { url: fileUrl, file: file }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (file: CustomFileInterface) => {
    setFiles((prev) => prev?.filter((item) => item !== file));
  };

  const handleSubmit = () => {
    clickCb(files);
    setFiles([]);
  };

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select photo</DialogTitle>
          <DialogDescription>
            <Dropzone
              onDrop={(acceptedFiles) => {
                onDrop(acceptedFiles);
              }}
              accept={{
                "image/*": [".jpeg", ".png"],
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section className="text-center border border-dashed rounded-lg border-slate-500 mt-2 cursor-pointer">
                  <div {...getRootProps()} className="p-10">
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
            {files?.length > 0 ? (
              <div className="relative flex gap-3 mt-2 max-h-[300px] py-2 overflow-scroll">
                {files?.map((file: CustomFileInterface, i) => (
                  <div className="relative h-32 w-32">
                    <Image
                      key={i}
                      src={file?.url}
                      alt="image"
                      fill
                      className="object-cover rounded-md shadow-md"
                    />
                    <Trash2Icon
                      className="absolute top-2 right-2 bg-white p-1 rounded-md shadow-md h-7 w-7 cursor-pointer"
                      color="red"
                      onClick={() => {
                        removeFile(file);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : null}
            <DialogClose className="w-full">
              <Button
                className="mt-2 w-full"
                disabled={!files.length}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Add Photo(s)
              </Button>
            </DialogClose>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const MoviePhotosForMovie = ({
  params,
}: {
  params: { movieId: React.ReactNode };
}) => {
  const [movie, setMovie] = useState<any>({});
  const [actors, setActors] = useState<any>([]);
  const [mounted, setMounted] = useState(false);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [files, setFiles] = useState<CustomFileInterface[]>([]);

  const removePicture = (item: any) => {
    setChanged(true);
    console.log(item);
    setImages((prev: any) => prev.filter((i: any) => i !== item));
    setFiles((prev) =>
      prev?.filter((file: CustomFileInterface) => file?.url !== item?.picture)
    );
  };

  const addNewPicture = (data: any) => {
    setChanged(true);
    setFiles((prev) => [...prev, ...data]);
    const __images = data?.map((i: CustomFileInterface) => ({
      new: true,
      picture: i?.url,
    }));
    setImages((prev: any) => [...prev, ...__images]);
  };

  const uploadImage = async (file: CustomFileInterface) => {
    const fd = new FormData();
    fd.append("file", file?.file);
    fd.append("upload_preset", "reelsgood");
    fd.append("cloud_name", "dylg9n7hq");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dylg9n7hq/image/upload",
        {
          method: "POST",
          body: fd,
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data?.url;
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const updateCast = async () => {
    setLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const movieId = movie?.id;
      files?.map((file) => {
        uploadImage(file);
      });
      const newUrlsPromises = files?.map((file) => uploadImage(file));
      const newUrls = await Promise.all(newUrlsPromises);
      console.log(newUrls);

      let data: any = [];

      images?.forEach((i) => {
        if (!i?.new) {
          data?.push(i);
        }
      });

      const newImages = newUrls?.map((url: any) => ({
        movie_id: movieId,
        picture: url,
      }));

      data = [...data, ...newImages];
      const payload = {
        movie_id: movieId,
        images: data,
      };
      const res = await fetch(baseURL + "/api/updateMoviePictures", {
        method: "POST",
        body: JSON.stringify(payload),
        cache: "no-store",
      }).then((res) => {
        if (res.status > 200) {
          throw new Error();
        }
      });
      showSuccess("Movie images updated successfully");
    } catch (error) {
      showError("Could not update movie images");
    }
    setChanged(false);
    setLoading(false);
  };

  const getMovie = async () => {
    const { movieId } = params;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const usersRes = await fetch(
      baseURL + `/api/getMoviePhotos?movie_id=${movieId}`,
      {
        cache: "no-store",
      }
    );
    const data = await usersRes.json();
    setImages(data?.data);
    setMovie(data?.movie);
    // const __actors = data?.data?.movie_cast?.map((item: any) => item?.actor);
    // setActors(__actors);
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
        <h1 className="text-2xl">{movie?.name} Movie Photos</h1>
        <AddCastModal
          clickCb={addNewPicture}
          trigger={
            <Button variant="ghost" className="flex items-center gap-2 text-md">
              <PlusCircleIcon /> <span>Add New Photo</span>
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
        {images?.map((item: any, i: number) => (
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
            </div>
            <Button
              className="w-full rounded-tl-none rounded-tr-none"
              variant="destructive"
              onClick={() => {
                removePicture(item);
              }}
            >
              <Trash2Icon className="h-5 w-5" />
            </Button>{" "}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MoviePhotosForMovie;
