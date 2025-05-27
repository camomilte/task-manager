"use client"

import { useEffect } from "react";

const { useAuth } = require("@/context/authContext");
const { useRouter } = require("next/router");

function AdminLayout({ children }) {
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(!isAdmin()) {
      router.replace("/")
    };
  }, []);

  if(!isAdmin()) {
    return null
  }

  return (
    <>{ children }</>
  )
};
export default AdminLayout