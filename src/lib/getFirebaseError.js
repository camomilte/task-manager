export const getFirebaseError = (errorCode) => {
  switch(errorCode) {
    case "auth/email-already-in-use":
      return "The email you are trying to register is already in use";
    case "auth/invalid-credential":
      return "Invalid email or password";
    case "auth/weak-password":
      return "The password is too weak. Please use a stronger password. Do not use your name or email in your password.";
    default:
      return "Unknown error occured. Please try again later.";
  }
}
