"use client";
import {
  FormControl,
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
import CSVReader from "@/components/CSVReader";
import { showError, showSuccess } from "@/lib/commonFunctions";
import CustomTable from "@/components/CustomTable";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1),
  rating: z.coerce.number().min(0.0).max(10),
  pg_rating: z.string().min(1),
  duration: z.string().min(1),
  language: z.string().min(1),
  trailer_url: z.string().min(1),
  movie_banner: z.string().min(1),
});

const AddMovies = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvRawData, setCsvRawData] = useState([]);
  const requiredFeilds = [
    "name",
    "description",
    "rating (<= 10)",
    "pg_rating",
    "duration",
    "language",
    "trailer_url",
    "movie_banner",
  ];
  //   React hook form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      language: "",
      trailer_url: "",
      movie_banner: "",
    },
  });

  const onSubmit = async (values: any) => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    setLoading(true);
    if (!Array.isArray(values)) {
      values = [values];
    }
    console.log(values);
    try {
      await fetch(baseURL + "/api/addMovies", {
        method: "POST",
        body: JSON.stringify(values),
        cache: "no-store",
      });
      showSuccess("Actor(s) addedd successfully");
    } catch (error) {
      showError("Could not add actor(s)");
    }
    setLoading(false);
  };

  const onCsvLoad = (data: any, rawData: any) => {
    try {
      const payload = data?.map((item: any) => {
        let validatedData = formSchema.parse(item);
        console.log(validatedData);
        return validatedData;
      });
      // console.log(payload);
      setCsvData(payload);
      setCsvRawData(rawData);
    } catch (error: any) {
      console.log("ERROR");
      console.log(error);
      showError("CSV does not match required attributes");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-6 flex flex-col gap-4 h-[85vh] overflow-scroll">
      <h1 className="text-2xl font-semibold">Add Movie(s)</h1>
      <div className="flex flex-col gap-4">
        <CSVReader onLoad={onCsvLoad} reqFields={requiredFeilds} />
        {csvData.length === 0 ? (
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
                      <Input placeholder="Enter movie's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter language (eg: Hindi)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter duration (eg: 1h 23m)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter a description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter movie rating"
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pg_rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pg Rating</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter movie's pg rating (eg: 13+ / Not Rated)"
                        min={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="movie_banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter movie's banner url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trailer_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trailer URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter movie's trailer url"
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
                Add Movie
              </Button>
            </form>
          </Form>
        ) : (
          <div className="w-[50%] flex flex-col gap-5">
            <Button
              className="w-full"
              onClick={() => {
                onSubmit(csvData);
              }}
            >
              Upload CSV file
            </Button>
            <CustomTable
              fields={requiredFeilds}
              data={csvRawData}
              caption="Showing uploaded data"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMovies;
