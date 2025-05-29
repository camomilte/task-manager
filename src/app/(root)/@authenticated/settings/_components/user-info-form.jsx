"use client"

// Import functions
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Import ui components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "react-hot-toast";

// Import context
import { useAuth } from "@/context/authContext";


// Define schema for validation of form
const formSchema = z.object({
  email: z.string().email({ message: "You have to enter valid email address" }), // Ensure email is in valid email format
  userName: z.string()
    .nonempty({ message: "Please enter a username" }) // Can not be empty
    .min(4, { message: "Username must be at least 4 characters long" }) // Must be at least 4 characters
    .max(20, { message: "Username can be maximum 20 charachters long" }), // Can not be more than 20 characters
})


export const UserInfoForm = ({ user }) => {
  // Access authentication logic
  const { updateUser, loading } = useAuth();

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: user.userName || "Username",
      email: user.email || "email"
    },
  })

  /// /
  // Function to handle submission 
  /// /
  function onSubmit(values) {
    const newUserData = {
      userName: values.userName
    }
    updateUser(user, newUserData);
  }

  return (
    <Form {...form}>
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
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-4">
                <FormLabel className="text-lg w-1/5">Username:</FormLabel>
                <FormControl>
                  <Input placeholder={user.userName} {...field} className="border-2 border-primary focus-visible:ring-secondary focus-visible:border-primary"/>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-4">
                <FormLabel className="text-lg w-1/5">Email:</FormLabel>
                <FormControl>
                  <Input disabled placeholder={user.email} {...field} className="border-2 border-primary focus-visible:ring-secondary focus-visible:border-primary" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit" className="bg-accent hover:bg-accent-600 font-bold w-full md:text-sm h-13 md:h-10 md:px-8 md:w-auto">{ loading ? "Saving..." : "Save changes" } </Button>
      </form>
    </Form>
  )
}