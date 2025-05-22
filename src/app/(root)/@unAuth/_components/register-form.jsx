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
    const [errorMessage, setErrorMessage] = useState(null);
    const { register, loading } = useAuth();

    const form = useForm({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            email: "",
            password: "",
            userName: "",
            confirmPassword: ""
        }
    });

    async function onSubmit(values) {
        try {
            const { email, password, userName } = values;
            await register(email, password, userName);
            
        } catch (error) {
            const errorMessage = getFirebaseError(error.code);
            setErrorMessage(errorMessage);
        }
    }

  return (
    <>
        <h3 className='text-primary-foreground text-3xl font-abril-fat pb-10'>Register an account </h3>
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

