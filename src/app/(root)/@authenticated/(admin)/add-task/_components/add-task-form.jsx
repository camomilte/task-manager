"use client"

// Import external packages
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { eachDayOfInterval, parse } from "date-fns";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

// Import icons
import { TbAlertCircleFilled } from "react-icons/tb";
import { Check, ChevronsUpDown } from "lucide-react"

// Import utility functions
import { cn } from "@/lib/utils";

// Import ui components
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import context and hooks
import { useSearchParams } from "next/navigation";
import { useUsers } from "@/context/usersContext";
import { useRouter } from "next/navigation";
import { useTasks } from "@/context/TasksContext";

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
  // Access task and users logic
  const { addTask, loading } = useTasks();
  const { users } = useUsers();

  // Retrieve URL search parameters from current route
  const searchParams = useSearchParams();
  // Extract date from URL if it exists
  const presetDate = searchParams.get("date");
  // Extract userId from URL if it exists
  const presetUserId = searchParams.get("userId");


  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const reoccuringType = form.watch("reoccuring");

  /// /
  // Function to handle submission 
  /// /
  async function onSubmit(values) {
    // Define base task data shared on all submission types
    const base = {
      title: values.title,
      ownerId: values.ownerId,
    }

    try {
      // Set submission state to true to disable multiple submits while in progress
      setSubmitted(true);

      // If task is one-time task
      if(values.reoccuring === "none") {
        // Add a single task for specified date
        await addTask({ ...base, date: values.date })
      }

      // If task is multiple time task
      if(values.reoccuring === "multiple") {
        // Add task for each selected date
        await Promise.all(
          values.dateMultiple.map(date => addTask({ ...base, date}))
        )
      }

      // If task ranges from two seperate dates
      if(values.reoccuring === "range") {
        // Generate all days in selected range
        const days = eachDayOfInterval({ start: values.dateRange.from, end: values.dateRange.to });
        // Add task for each day in date range
        await Promise.all(
          days.map(date => addTask({ ...base, date}))
        )
      }

      // Reset form and redirect user when tasks are added
      form.reset();
      router.push("/");

    } catch (error) {
      // Log error for debugging
      console.error(error);
      // Show error message
      setErrorMessage( "Something went wrong. Please try again later." );
      // Re-enable submit for user to retry
      setSubmitted(false);
    }
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
        {/* ---- REOCCURING ---- */}
        <FormField
          control={form.control}
          name="reoccuring"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Reoccurance</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full justify-between bg-secondary rounded-full hover:bg-secondary-100 border-2 border-primary hover:border-primary-300">
                    <SelectValue placeholder="Set date reocurrance" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Single</SelectItem>
                  <SelectItem value="multiple">Multiple</SelectItem>
                  <SelectItem value="range">Start to finish</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-secondary-300">
                { reoccuringType === "none" && "Pick a single date for the task" }
                { reoccuringType === "multiple" && "Pick multiple dates for the task to reoccure" }
                { reoccuringType === "range" && "Pick a start and a finish date for the task" }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ----  DATE ---- */}
        {
          reoccuringType === "none" && (
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-lg w-1/5">Date</FormLabel>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="rounded-md border border-primary"
                        />
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        {
          reoccuringType === "multiple" && (
            <FormField
              control={form.control}
              name="dateMultiple"
              render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-lg w-1/5">Date</FormLabel>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="rounded-md border border-primary"
                        />
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        {
          reoccuringType === "range" && (
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-lg w-1/5">Date</FormLabel>
                        <Calendar
                          mode="range"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="rounded-md border border-primary"
                        />
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
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
        { errorMessage &&
          <Alert variant="destructive" className="border-2 border-destructive/60">
              <TbAlertCircleFilled className="h-4 w-4" />
              <AlertDescription className={cn("text-destructive text-sm font-semibold")}>
                { errorMessage }
              </AlertDescription>
          </Alert>
        }
        <Button disabled={loading || submitted} type="submit" className="font-bold w-full md:text-sm h-13 md:h-10 md:px-8 md:w-auto">{ loading ? "Creating..." : "Create task" } </Button>
      </form>
    </Form>
  )
}


