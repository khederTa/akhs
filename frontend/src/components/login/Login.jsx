import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { login } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

// Validation schema
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data.email, data.password);
      if (response.error) {
        alert(response.error);
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--main-background-color)] dark:bg-[var(--main-background-dark-color)]">
      <div className="w-1/3 text-[var(--text-color)] dark:text-[var(--text-dark-color)] bg-[var(--sidebar-background-color)] dark:bg-[var(--sidebar-background-dark-color)] p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="mb-8">
            <label
              htmlFor="email"
              className={`block font-bold text-sm mb-2 ${
                errors.email
                  ? "text-red-400"
                  : "text-[var(--text-color)] dark:text-[var(--text-dark-color)]"
              }`}
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="user@akhs.org"
              className={`block w-full bg-transparent outline-none border-2 py-2 px-4 placeholder-[var(--secondary-text-color)] ${
                errors.email
                  ? "text-red-300 border-red-400"
                  : "text-[var(--text-color)] dark:text-[var(--text-dark-color)]"
              }`}
              {...register("email")} // React Hook Form registration
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                A valid email is required.
              </p>
            )}
          </div>

          <div className="mb-8">
            <label
              htmlFor="password"
              className={`block font-bold text-sm mb-2 ${
                errors.password
                  ? "text-red-400"
                  : "text-[var(--text-color)] dark:text-[var(--text-dark-color)]"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="superpassword"
              className={`block w-full bg-transparent outline-none border-2 py-2 px-4 placeholder-[var(--secondary-text-color)] ${
                errors.password
                  ? "text-red-300 border-red-400"
                  : "text-[var(--text-color)] dark:text-[var(--text-dark-color)]"
              }`}
              {...register("password")} // React Hook Form registration
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                Your password is required.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="inline-block bg-[var(--primary-color)] text-[var(--main-background-color)] hover:bg-[var(--accent-color)] rounded shadow py-2 px-5 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
