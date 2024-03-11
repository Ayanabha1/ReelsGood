"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  picture: z.string().min(1),
  popularity_rating: z.coerce.number().min(1).max(5),
});

const AddActor = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  //   React hook form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      picture: "",
      popularity_rating: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(values);
    setLoading(true);
    try {
      await fetch(baseURL + "/api/addActor", {
        method: "POST",
        body: JSON.stringify(values),
      });
    } catch (error) {}
    setLoading(false);
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-6 flex flex-col gap-4 h-[85vh] overflow-scroll">
      <h1 className="text-2xl font-semibold">Add Actor(s)</h1>
      <div className="flex flex-col gap-10">
        <div
          {...getRootProps()}
          className="border-2 shadow-md w-[50%] flex items-center justify-center rounded-md p-14"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drop a CSV to bunch upload actors.</p>
          )}
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-[50%] gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter actor's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Picture URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a picture url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="popularity_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Popularity Rating</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter actor's rating"
                      type="number"
                      min={1}
                      max={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="font-bold col-span-12 lg:col-span-2"
              type="submit"
              disabled={loading}
            >
              Add Actor
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddActor;
