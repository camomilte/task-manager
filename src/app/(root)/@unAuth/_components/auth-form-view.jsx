"use client"

import { useState } from "react";

// Import components
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export const AuthFormView = () => {

    const [showLogin, setShowLogin] = useState(false);

    const changeForm = (formName) => {
        if(formName === "login") {
            setShowLogin(true)
        } else if (formName === "register") {
            setShowLogin(false)
        }
    }

    return (
        <div className="bg-primary rounded-xl min-h-1/2 p-4 lg:max-w-3xl mx-auto mb-10 py-10">
            {
                showLogin
                    ? <LoginForm changeForm={changeForm} />
                    : <RegisterForm changeForm={changeForm}/>
            }
        </div>
    )
}