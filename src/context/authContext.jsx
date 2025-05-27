// Enable client-side rendering
"use client"

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Import React hooks and functions
const { createContext, useContext, useState, useEffect } = require("react");

// Create context for authentication data
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    // Store current user in local state
    const [user, setUser] = useState(null);
    // Tracks the loading state of an async operation 
    const [loading, setLoading] = useState(false);
    // Prevents rendering until authentication status is known
    const [authLoaded, setAuthLoaded] = useState(false);

    // Create router
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            // If no user is logged in, reset state
            if(!firebaseUser) {
                setUser(null);
                setAuthLoaded(true);
                return;
            }

            // Reference to user's Firestore document
            const docRef = doc(db, "users", firebaseUser.uid);

            // Function to fetch Firestore document with retry logic
            const getUserDocWithRetry = async (retries = 5, delay = 300) => {
                // Initialize the document snapshot variable
                let docSnap = null;

                // Try fetching document up to `retries` times
                for(let i  = 0; i < retries; i++) {
                    // Attempt to get the document snapshot from Firestore
                    docSnap = await getDoc(docRef);
                    // If the document exists, exit loop
                    if(docSnap.exists()) break; 

                    // If not, wait for `delay` milliseconds before retrying
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                // Return final result
                return docSnap;
            }

            // Try to fetch user's document from Firebase using retry function
            const docSnap = await getUserDocWithRetry();

            if(docSnap && docSnap.exists()) {
                // Store data in local user state if document is successfully retrieved
                setUser(docSnap.data());
            } else {
                // Log warning if document is not found
                console.warn("Could not get user document");
                // Set user to null (no valid data loaded)
                setUser(null);
            }

            // Mark auth loading process as complete
            setAuthLoaded(true);
        });

        // Cleanup function for useEffect
        return () => unsub()
    }, [])


    /// /
    // Function to register user
    /// /
    const register = async (email, password, userName) => {
        // Set loading state to true to indicate process has started
        setLoading(true);

        try {
            // Create new user with Firebase Authentication
            const res = await createUserWithEmailAndPassword(auth, email, password);
            
            // Check if user exists
            if(!res.user) {
                // Console log error and exit if no user is found
                console.log("No user");
                setLoading(false);
                return;
            }

            // Update new user profile in Firebase Authentication
            await updateProfile(res.user, { displayName: userName });

            // Create new document in Firestore, matching user ID
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid, // Unique user ID
                email: res.user.email, // Email used for registration
                userName: userName, // Username chosen by user
                role: "user", // Default role asigned to new users
                createdAt: Timestamp.now(), // Timestamp of user creation
                photoURL: null, // Placeholder for profile photo URL
                verified: false, // Custom flag for email verification
                color: null // Placeholder for user UI color
            });

        } catch (error) {
            // Console log error
            console.log("Error when registering user: ", error);
            // Rethrow error
            throw error;

        } finally {
            // Reset loading state to false regardless if successfull or not
            setLoading(false);
        }
    };

    /// /
    // Function to log out user
    /// /
    const logout = async () => {
        // Navigate user to home page
        router.replace("/");
        // Sign out user from Firebase Authentication
        await signOut(auth);
    };

    /// /
    // Function to log in user
    /// /
    const login = async (email, password) => {
        // Set loading state to true to indicate process has started
        setLoading(true);

        try {
            // Attempt signing in user with Firebase Authentication
            await signInWithEmailAndPassword(auth, email, password);

        } catch (error) {
            // Console log error
            console.log("Error signing in: ", error);
            // Rethrow error
            throw error;
        } finally {
            // Reset loading state to false regardless if successfull or not
            setLoading(false);
        }
    };

    /// /
    // Function to check admin role
    /// /
    const isAdmin = () => {
        // If there is no user, return false
        if(!user) return false;
        // Return user role if it has role admin
        return user.role === "admin";
    };

    /// /
    // Function to update user information
    /// /
    const updateUser = async (user, newUserData) => {
        // Set loading state to true to indicate process has started
        setLoading(true);
        const toastId = toast.loading("Loading...");

        // Check if user exists
        if (!user?.uid) {
            toast.error("Invalid user data.", { id: toastId });
            setLoading(false);
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid)
            await updateDoc(userRef, newUserData)
            setUser((prevUser) => ({ ...prevUser, ...newUserData}));
            toast.success("Profile successfully updated", { id: toastId })
    
        } catch (error) {
            toast.error("Something went wrong, try again.", { id: toastId });
            console.error("Error updating the user: ", error);
        } finally {
            // Reset loading state to false regardless if successfull or not
            setLoading(false);
        }

    }

    // Define value
    const value = {
        user,
        loading,
        authLoaded,
        register,
        logout,
        login,
        isAdmin, 
        updateUser
    };

    // Provide context value to children components
    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
};

// Custom hook to consume AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext)

    // Ensure hook is used within AuthProvider
    if(!context) {
        throw new Error("useAuth must be inside AuthProvider");
    };
    return context
};