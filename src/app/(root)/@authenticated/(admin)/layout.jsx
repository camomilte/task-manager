"use client"

const { useAuth } = require("@/context/authContext");
const { useRouter } = require("next/router");

function AdminLayout({ children }) {
  const { isAdmin } = useAuth();
  const router = useRouter();

  if(!isAdmin()) {
    router.replace("/")
  }

  return (
    <>{ children }</>
  )
}
export default AdminLayout