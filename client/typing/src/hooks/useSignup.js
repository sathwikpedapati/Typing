import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { message } from "antd";

// Enhanced email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const useSignup = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const registeredUser = async (values) => {
    // Trim whitespace from inputs
    const trimmedValues = {
      fullName: values.fullName?.trim(),
      email: values.email?.trim(),
      password: values.password?.trim(),
      confirmPassword: values.confirmPassword?.trim(),
    };

    console.log("Sending request with:", trimmedValues); // Debug log

    // Validate all required fields
    if (!trimmedValues.fullName || !trimmedValues.email || !trimmedValues.password || !trimmedValues.confirmPassword) {
      setError("All fields are required");
      message.error("All fields are required");
      return;
    }

    // Validate minimum length for fullName (e.g., 2 characters)
    if (trimmedValues.fullName.length < 2) {
      setError("Full Name must be at least 2 characters long");
      message.error("Full Name must be at least 2 characters long");
      return;
    }

    // Validate email format
    if (!emailRegex.test(trimmedValues.email)) {
      setError("Please enter a valid email address");
      message.error("Please enter a valid email address");
      return;
    }

    // Validate minimum length for password (e.g., 6 characters)
    if (trimmedValues.password.length < 6) {
      setError("Password must be at least 6 characters long");
      message.error("Password must be at least 6 characters long");
      return;
    }

    // Validate password match
    if (trimmedValues.password !== trimmedValues.confirmPassword) {
      setError("Passwords do not match");
      message.error("Passwords do not match");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedValues),
      });

      let data = null;
      const contentType = res.headers.get("content-type");

      // Check if response is JSON
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else if (res.status !== 204) {
        const text = await res.text();
        throw new Error(`Invalid response format: ${text.substring(0, 50)}...`);
      }

      console.log("Server response:", { status: res.status, data }); // Debug log

      // Handle response status
      if (res.status === 201) {
        message.success(data.message || "Registration successful!");
        login(data.token, data.user);
      } else if (res.status === 400 || res.status === 401) {
        setError(data?.message || "Registration failed. Invalid details.");
        message.error(data?.message || "Registration failed. Invalid details.");
      } else if (res.status >= 500) {
        setError("Server error. Please try again later.");
        message.error("Server error. Please try again later.");
      } else {
        setError(`Unexpected error (status: ${res.status}). Please try again.`);
        message.error(`Unexpected error (status: ${res.status}). Please try again.`);
      }
    } catch (err) {
      // Specifically handle fetch errors (e.g., network issues)
      const errorMessage = err.name === "TypeError" ? "Failed to fetch: Check your network or API endpoint." : `An error occurred: ${err.message}`;
      setError(errorMessage);
      message.error(errorMessage);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registeredUser };
};

export default useSignup;