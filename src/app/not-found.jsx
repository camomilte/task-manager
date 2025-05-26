import { Button } from "@/components/ui/button"
import Link from "next/link"

function NotFound() {
  return (
    <div className="mt-[35svh] flex flex-col gap-8 items-center">
      <h1 className="font-pacifico text-primary text-5xl">Oops!</h1>
      <p className="text-lg">404 - Could not find the page you were looking for.</p>
      <Button asChild className="h-13 w-50 font-semibold">
        <Link href="/" replace>
          Back to Home
        </Link>
      </Button>
    </div>
  )
}

export default NotFound