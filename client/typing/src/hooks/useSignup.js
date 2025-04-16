import { useState } from "react";
import { useAuth } from '../contexts/AuthContext'; 
import { message } from "antd";

const useSignup = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const registeredUser = async (values) => {
    if (values.password !== values.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError(null);
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.status === 201) {
        message.success(data.message);
        login(data.token, data.user); // Logs the user in
      } else if (res.status === 400 || res.status === 401) {
        setError(data?.message || "Registration failed. Please check your details.");
      } else {
        message.error(data?.message || "Registration Failed");
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
      message.error("An error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registeredUser };
};

export default useSignup;
