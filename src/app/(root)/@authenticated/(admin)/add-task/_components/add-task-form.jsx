"use client"

import { Check, ChevronsUpDown } from "lucide-react"

// Import functions
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { parse } from "date-fns";
import { cn } from "@/lib/utils";

// Import ui components
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster } from "react-hot-toast";

// Import context
import { useAuth } from "@/context/authContext";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useUsers } from "@/context/usersContext";

// Base schema for all tasks
const base = z.object({
  title: z.string().nonempty({ message: "Task title is required "}), // Can not be empty
  ownerId: z.string().nonempty({ message: "You must pick a user to asign the task to."}), // Can not be empty
  description: z.string().optional()
});

// Schema for single-occurence task
const single = base.extend({
  reoccuring: z.literal("none"), // Set discriminator field to none
  date: z.date() // Date object
});

const multiple = base.extend({
  reoccuring: z.literal("multiple"), // Set discriminator field to multiple
  dateMultiple: z.array(z.date()).min(1, "A minimum of one date is required") // Requires at least one date object
});

const range = base.extend({
  reoccuring: z.literal("range"), // Set discriminator field to range
  dateRange: z.object({
    from:z.date(), // Range start date
    to: z.date() // Range end date
  })
});

// Final schema using discriminated union
const formSchema = z.discriminatedUnion("reoccuring", [
  single,
  multiple,
  range
]);

export const AddTaskForm = () => {
  // Access authentication logic
  const { loading } = useAuth();

  const searchParams = useSearchParams();
  const presetDate = searchParams.get("date");
  const presetUserId = searchParams.get("userId");
  const { users } = useUsers();
  const { user } = useAuth();

  const [submitted, setSubmitted] = useState(false);

  console.log(users);


  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      ownerId: presetUserId ?? "",
      description: "",
      reoccuring: "none",
      date: presetDate ? parse(presetDate, "yyyy-MM-dd", new Date()) ?? new Date() : new Date()
    },
  });

  /// /
  // Function to handle submission 
  /// /
  function onSubmit(values) {
    console.log(values)
  }


  return (
    <Form {...form}>
      {/* ---- TOASTER ---- */}
      <Toaster 
        toastOptions={{
          style: {
            background: 'var(--color-secondary)',
            color: 'var(--color-text)'
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: 'var(--color-background)'
            }
          },
          error: {
            iconTheme: {
              primary: 'CC0000',
              secondary: 'var(--color-background)'
            }
          },
          loading: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: 'var(--color-background)'
            }
          }
        }}
      />
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
        {/* ---- TASK TITLE ---- */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-lg">Title</FormLabel>
                <FormControl>
                  <Input {...field} className="border-2 border-primary focus-visible:ring-secondary focus-visible:border-primary"/>
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ---- ASSIGNED USER ---- */}
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-lg">Assigned User</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outlined"
                      role="combobox"
                      className={cn(
                        "w-full justify-between bg-secondary hover:bg-secondary-100 border-2 border-primary hover:border-primary-300",
                        !field.value && "text-primary"
                      )}
                    >
                      {field.value
                        ? users.find(
                            (user) => user.uid === field.value
                          )?.userName
                        : "Select user"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[85svw] max-w-2xl p-0">
                  <Command>
                    <CommandInput placeholder="Search user..." />
                    <CommandList>
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.userName.toLowerCase()}
                            key={user.uid}
                            onSelect={() => {
                              form.setValue("ownerId", user.uid)
                            }}
                          >
                            {user.userName}
                            <Check
                              className={cn(
                                "ml-auto",
                                user.uid === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ----  DATE ---- */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-lg w-1/5">Date</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} className="border-2 border-primary focus-visible:ring-secondary focus-visible:border-primary"/>
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ---- DESCRIPTION ---- */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-lg w-1/5">Description<span className="text-sm text-secondary-300">(Optional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="Describe the task" {...field} className="border-2 border-primary focus-visible:ring-secondary focus-visible:border-primary"/>
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      
        <Button disabled={loading || submitted} type="submit" className="font-bold w-full md:text-sm h-13 md:h-10 md:px-8 md:w-auto">{ loading ? "Creating..." : "Create task" } </Button>
      </form>
    </Form>
  )
}


