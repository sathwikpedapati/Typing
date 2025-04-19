import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const useSignup = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registeredUser = async (values) => {
    const trimmedValues = {
      fullName: values.fullName?.trim(),
      email: values.email?.trim(),
      password: values.password?.trim(),
      confirmPassword: values.confirmPassword?.trim(),
    };

    // ✅ Client-side validation
    if (!trimmedValues.fullName || !trimmedValues.email || !trimmedValues.password || !trimmedValues.confirmPassword) {
      const errMsg = "All fields are required.";
      setError(errMsg);
      message.error(errMsg);
      return;
    }

    if (trimmedValues.fullName.length < 2) {
      const errMsg = "Full name must be at least 2 characters.";
      setError(errMsg);
      message.error(errMsg);
      return;
    }

    if (!emailRegex.test(trimmedValues.email)) {
      const errMsg = "Invalid email format.";
      setError(errMsg);
      message.error(errMsg);
      return;
    }

    if (trimmedValues.password.length < 6) {
      const errMsg = "Password must be at least 6 characters.";
      setError(errMsg);
      message.error(errMsg);
      return;
    }

    if (trimmedValues.password !== trimmedValues.confirmPassword) {
      const errMsg = "Passwords do not match.";
      setError(errMsg);
      message.error(errMsg);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedValues),
      });

      const contentType = response.headers.get("content-type");
      let responseBody;

      if (contentType?.includes("application/json")) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
        console.warn("⚠️ Received non-JSON response from server:", responseBody);
      }

      // ✅ Log entire response for debugging
      console.log("📦 Server response:", {
        status: response.status,
        ok: response.ok,
        body: responseBody,
      });

      if (!response.ok) {
        const errorMsg =
          typeof responseBody === "string"
            ? responseBody
            : responseBody?.message || "Something went wrong during registration.";

        setError(errorMsg);
        message.error(errorMsg);
        return;
      }

      // ✅ Success
      const { token, user, message: successMsg } = responseBody;
      message.success(successMsg || "Registration successful!");
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.name === "TypeError"
          ? "Failed to fetch: Check your network or API endpoint."
          : `An error occurred: ${err.message || "Unknown error"}`;
      setError(errorMessage);
      message.error(errorMessage);
      console.error("🔥 Signup error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registeredUser };
};

export default useSignup;
