import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textArea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from './ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Link } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  description: z.string().optional(),

  tag: z.string().min(2, {
    message: "Please enter tags",
  }),
});


interface EditItemFormProps {
  data: any; // Replace 'any' with the actual type of your row data
  onSave: (updatedData: z.infer<typeof formSchema>) => void;
}

export default function EditItemForm({ data, onSave }: EditItemFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name || "",
      url: data.url || "",
      category: data.category || "",
      description: data.description || "",
      tag:data.tags || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
  }

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-2rem)] pr-6">
      <SheetHeader>
        <SheetTitle>Edit Item</SheetTitle>
      </SheetHeader>
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Enter URL" {...field} />
                    <Link
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                // <FormItem>
                //   <FormLabel>Category</FormLabel>
                //   <Select onValueChange={field.onChange} defaultValue={field.value}>
                //     <FormControl>
                //       <SelectTrigger>
                //         <SelectValue placeholder="Select a category" />
                //       </SelectTrigger>
                //     </FormControl>
                //     <SelectContent>
                //       <SelectItem value="category1">Category 1</SelectItem>
                //       <SelectItem value="category2">Category 2</SelectItem>
                //       <SelectItem value="category3">Category 3</SelectItem>
                //     </SelectContent>
                //   </Select>
                //   <FormMessage />
                // </FormItem>
              )}
            /> */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Tags" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          

          <div className="text-sm flex justify-between pt-8 pb-3 ">
            Last Modified:{" "}
            <span className="font-medium">01:00 18 October 2024</span>
          </div>

          <Button type="submit" className="w-full">
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
