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
  rating: z.coerce.number().min(0).max(5),
  city: z.string().min(1).max(50),
  state: z.string().min(1).max(50),
});

const AddCinema = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvRawData, setCsvRawData] = useState([]);
  const requiredFeilds = ["name", "rating (max: 5)", "city", "state"];
  //   React hook form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rating: 0,
      city: "",
      state: "",
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
      const res = await fetch(baseURL + "/api/addCinema", {
        method: "POST",
        body: JSON.stringify(values),
        cache: "no-store",
      });
      if (res.status >= 400) {
        throw new Error();
      }
      showSuccess("Cinema(s) added successfully");
    } catch (error) {
      showError("Could not add cinema(s)");
    }
    setLoading(false);
  };

  const onCsvLoad = (data: any, rawData: any) => {
    try {
      console.log(data);
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
      <h1 className="text-2xl font-semibold">Add Cinema(s)</h1>
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
                      <Input placeholder="Enter cinema's name" {...field} />
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
                        placeholder="Enter cinema's popularity rating"
                        {...field}
                        type="number"
                        min={1}
                        max={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter cinema's city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter cinema's state" {...field} />
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
                Add Cinema
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

export default AddCinema;
