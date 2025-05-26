"use client"

// Import functions
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Import UI components
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TbAlertCircleFilled } from "react-icons/tb";

// Import context
import { useAuth } from "@/context/authContext";

// Import user-friendly error messages
import { getFirebaseError } from "@/lib/getFirebaseError";

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
    // Access authentication logic
    const { loading, login } = useAuth();

    // Initialize form
    const form = useForm({
        resolver: zodResolver(loginFormSchema), // Use Zod schema validation
        defaultValues: {
            email: "", // Default value for email field
            password: "" // Default value for password field
        }
    });

    // Submit handler triggered when the form is successfully validated and submitted
    async function onSubmit(values) {
        try {
            // Destructure values from submission
            const { email, password } = values;

            // Attempt to log in user
            await login(email, password);
            
        } catch (error) {
            if (
                error.code === "auth/user-not-fount" ||
                error.code === "auth/invalid-email" ||
                error.code === "auth/invalid-password"
            ) {
                // Normalize to single generic code
                throw new Error("auth/invalid-credential")
            }
            // Convert Firebase error code to user-friendly message
            const errorMessage = getFirebaseError(error.code);

            // Set error message
            setErrorMessage(errorMessage);
        }
    }

  return (
    <>
        <h3 className='text-primary-foreground text-3xl font-abril-fat pb-10'>Log in</h3>
        {
            errorMessage && 
            <Alert variant="destructive" className="mb-5 border-2 border-destructive/60">
                <TbAlertCircleFilled className="h-4 w-4" />
                <AlertDescription className="font-semibold">
                    { errorMessage }
                </AlertDescription>
            </Alert>     
        }
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
                <Button disabled={loading} type="submit" variant="secondary" size="lg" className="font-pacifico">Log in</Button>
            
            </form>
        </Form>

    </>
  )
};


