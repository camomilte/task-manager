"use client"

export const registerFormSchema = z.object({
    email: z.string().email({ message: "You have to enter valid email address" }),
    userName: z.string().nonempty({ "Please enter a username" }).min(4, { "Username must be at least 4 characters long" }).
})

function RegisterForm() {
  return (
    <div>
      <h3 className='text-primary-foreground text-3xl font-abril-fat'>Register</h3>
    </div>
  )
}

export default RegisterForm
