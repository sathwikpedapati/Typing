import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { message } from "antd";

const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loggeduser = async (values) => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const contentType = res.headers.get("content-type");
      let data = null;

      // Check if the response is not empty and contains JSON
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else if (res.status !== 204) { // Handle case where the server might send no content
        const text = await res.text();
        throw new Error(`Invalid response: Received non-JSON response. Response: ${text.substring(0, 50)}...`);
      }

      console.log("Server response:", { status: res.status, data });

      if (res.status === 200) {
        message.success(data?.message || "Login successful!");
        login(data.token, data.user);
      } else if (res.status === 400 || res.status === 401) {
        setError(data?.message || "Invalid email or password.");
        message.error(data?.message || "Invalid email or password.");
      } else if (res.status >= 500) {
        setError("Server error. Please try again later.");
        message.error("Server error. Please try again later.");
      } else {
        setError(`Unexpected error (status: ${res.status}). Please try again.`);
        message.error(`Unexpected error (status: ${res.status}). Please try again.`);
      }
    } catch (err) {
      const errorMessage = `An error occurred: ${err.message}`;
      setError(errorMessage);
      message.error(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, loggeduser };
};

export default useLogin;
