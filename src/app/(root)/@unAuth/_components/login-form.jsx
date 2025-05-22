"use client"

// Import functions
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Import shadcn components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


// Define schema for validation of register form
export const loginFormSchema = z.object({
    email: z.string().email({ message: "You have to enter valid email address" }), // Ensure email is in valid email format
    password: z.string().nonempty({ message: "Please enter a password" }) // Password can not be empty
});


/// /
// Login form component with validation and submission handling
/// /
export const LoginForm = ({ changeForm }) => {
    // Local state to manage and display any error
    const [errorMessage, setErrorMessage] = useState(null);

    // Initialize form
    const form = useForm({
        resolver: zodResolver(loginFormSchema), // Use Zod schema validation
        defaultValues: {
            email: "", // Default value for email field
            password: "" // Default value for password field
        }
    });

    // Submit handler triggered when the form is successfully validated and submitted
    function onSubmit(values) {
        console.log(values)
    }

  return (
    <>
        <h3 className='text-primary-foreground text-3xl font-abril-fat pb-10'>Log in</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* ----- EMAIL ----- */}
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-secondary">Email Address</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="example@email.com" className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                {/* ----- PASSWORD ----- */}
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-secondary">Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="Enter password here" className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />    
                <p className="text-background">Don't have an account? <span onClick={() => changeForm("register")} className="underline cursor-pointer">Register here!</span></p>
                
                {/* ----- SUBMIT ----- */}
                <Button type="submit" variant="secondary" size="lg" className="font-pacifico">Log in</Button>
            
            </form>
        </Form>

    </>
  )
};


