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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Import context
import { useAuth } from "@/context/authContext";

// Import user-friendly error messages
import { getFirebaseError } from "@/lib/getFirebaseError";


// Define schema for validation of register form
export const registerFormSchema = z.object({
    email: z.string().email({ message: "You have to enter valid email address" }), // Ensure email is in valid email format
    userName: z.string()
        .nonempty({ message: "Please enter a username" }) // Can not be empty
        .min(4, { message: "Username must be at least 4 characters long" }) // Must be at least 4 characters
        .max(20, { message: "Username can be maximum 20 charachters long" }), // Can not be more than 20 characters
    password: z.string()
        .nonempty({ message: "Please enter a password" }) // Can not be empty
        .min(6, { message: "Password must be at least 6 characters" }), // Must be at least 6 characters
    confirmPassword: z.string().nonempty({ message: "Please confirm ypur password" }) // Can not be empty
}).refine(data => data.password === data.confirmPassword, { // Ensure password and condirmPassword fields match
    message: "Passwords do not match",
    path: ["confirmPassword"] // Attach message to confirmPassword field
});



export const RegisterForm = ({ changeForm }) => {
    // Store and display any error messages
    const [errorMessage, setErrorMessage] = useState(null);
    // Access authentication logic
    const { register, loading } = useAuth();

    // Initialize form
    const form = useForm({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            email: "",
            password: "",
            userName: "",
            confirmPassword: ""
        }
    });

    /// /
    // Function to handle submission
    /// /
    async function onSubmit(values) {
        try {
            // Destructure values from submission
            const { email, password, userName } = values;

            // Attempt to register user
            await register(email, password, userName);
            
        } catch (error) {
            // Convert Firebase error code to user-friendly message
            const errorMessage = getFirebaseError(error.code);

            // Set error message
            setErrorMessage(errorMessage);
        }
    }

  return (
    <>
        <h3 className='text-primary-foreground text-3xl font-abril-fat pb-10'>Register an account </h3>
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
                {/* ----- USERNAME ----- */}
                <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-secondary">Username</FormLabel>
                    <FormControl>
                        <Input placeholder="Your username" className="bg-background" {...field} />
                    </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
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
                {/* ----- CONFIRM PASSWORD ----- */}
                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-secondary">Confirm your password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="Confirm password here" className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <p className="text-background">Already have an account? <span onClick={() => changeForm("login")} className="underline cursor-pointer">Log in here!</span></p>
                
                {/* ----- SUBMIT ----- */}
                <Button  type="submit" variant="secondary" size="lg" className="font-pacifico">Submit</Button>
            
            </form>
        </Form>

    </>
  )
};

