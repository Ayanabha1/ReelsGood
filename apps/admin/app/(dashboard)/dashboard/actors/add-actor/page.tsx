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
import { ZodError, z } from "zod";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import CSVReader from "@/components/CSVReader";
import { showError, showSuccess } from "@/lib/commonFunctions";
import CustomTable from "@/components/CustomTable";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  picture: z.string().min(1),
  popularity_rating: z.coerce.number().min(1).max(5),
});

const AddActor = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvRawData, setCsvRawData] = useState([]);
  const requiredFeilds = ["name", "picture", "popularity_rating (max: 5)"];
  //   React hook form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      picture: "",
      popularity_rating: 1,
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
      await fetch(baseURL + "/api/addActor", {
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
      const validatedData = data?.map((item: any) => {
        let validData = formSchema.parse(item);
        return validData;
      });
      setCsvData(validatedData);
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
      <h1 className="text-2xl font-semibold">Add Actor(s)</h1>
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

export default AddActor;
