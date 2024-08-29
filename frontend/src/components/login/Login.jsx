import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { login } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { FormGroup } from "../formGroup/FormGroup";

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
      <div className="sm:w-1/2 md:w-[35%] text-[var(--text-color)] dark:text-[var(--text-dark-color)] bg-[var(--sidebar-background-color)] dark:bg-[var(--sidebar-background-dark-color)] p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(handleLogin)}>
          <FormGroup
            id={"email"}
            name={"email"}
            type={"email"}
            label={"email"}
            placeholder={"Enter Your Email"}
            required={true}
            register={register}
            errors={errors}
          />
          <FormGroup
            id={"password"}
            name={"password"}
            type={"password"}
            label={"password"}
            placeholder={"Enter Your Password"}
            required={true}
            register={register}
            errors={errors}
          />

          <button
            type="submit"
            className="w-full inline-block bg-[var(--primary-color)] text-[var(--main-background-color)] hover:bg-[var(--accent-color)] rounded shadow py-2 px-5 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Logining..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
