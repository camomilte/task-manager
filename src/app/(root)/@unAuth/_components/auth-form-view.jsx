"use client"

import { useState } from "react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

export const AuthFormView = () => {

    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="bg-primary rounded-xl min-h-1/2 p-4">
            {
                showLogin
                    ? <LoginForm />
                    : <RegisterForm />
            }
        </div>
    )
}