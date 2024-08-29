import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useContext, useEffect, useState } from "react";
import { signup } from "../../utils/auth";
import { FormGroup } from "../formGroup/FormGroup";
import { useTranslation } from "react-i18next";

// Custom validation schema
const schema = z
  .object({
    fname: z
      .string()
      .min(3, { message: "First name must be at least 3 characters" })
      .max(15, { message: "First name must be at most 15 characters" }),
    mname: z
      .string()
      .min(3, { message: "Middle name must be at least 3 characters" })
      .max(15, { message: "Middle name must be at most 15 characters" }),
    lname: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters" })
      .max(15, { message: "Last name must be at most 15 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    password2: z.string(),
    phone: z.string(),
    bDate: z.string(),
    study: z.string().min(3, { message: "Study field is required" }),
    position: z
      .string()
      .min(3, { message: "Position must be at least 3 characters" })
      .max(15, { message: "Position must be at most 15 characters" }),
    gender: z.enum(["male", "female"], { message: "Gender is required" }),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match",
    path: ["password2"], // Show error on confirm password field
  });

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [roles, setRoles] = useState([
    { name: "Select User Role", id: "" },
    { name: "Admin", id: "1" },
  ]);

  useEffect(() => {
    // Get Roles from Role API endpoint
  }, []);

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

  const handleRegister = async (data) => {
    setIsLoading(true);
    console.log(data);
    try {
      const response = await signup(data);
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
      <div className="mt-10 sm:w-1/2 md:w-[35%] text-[var(--text-color)] dark:text-[var(--text-dark-color)] bg-[var(--sidebar-background-color)] dark:bg-[var(--sidebar-background-dark-color)] p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(handleRegister)}>
          <FormGroup
            id={"fname"}
            name={"fname"}
            type={"text"}
            label={"fname"}
            placeholder={"e.g. John"}
            required={true}
            register={register}
            errors={errors}
          />
          <FormGroup
            id={"mname"}
            name={"mname"}
            type={"text"}
            label={"mname"}
            placeholder={"e.g. Adam"}
            required={true}
            register={register}
            errors={errors}
          />
          <FormGroup
            id={"lname"}
            name={"lname"}
            type={"text"}
            label={"lname"}
            placeholder={"e.g. Doe"}
            required={true}
            register={register}
            errors={errors}
          />
          <FormGroup
            id={"phone"}
            name={"phone"}
            type={"text"}
            label={"phone"}
            placeholder={"e.g. 0999-876-543"}
            required={true}
            register={register}
            options={{
              pattern: "(09)([3,4,5,6,8,9])([0-9]{7})",
              message: "you have to enter a valid phone number",
            }}
            errors={errors}
          />
          <FormGroup
            id={"study"}
            name={"study"}
            type={"text"}
            label={"study"}
            placeholder={"e.g. Software Engineer"}
            required={true}
            register={register}
            errors={errors}
          />
          <FormGroup
            id={"bDate"}
            name={"bDate"}
            type={"date"}
            label={"bDate"}
            required={true}
            register={register}
            errors={errors}
          />
          <FormGroup
            id={"position"}
            name={"position"}
            type={"text"}
            label={"position"}
            placeholder={"e.g. CEO"}
            required={true}
            register={register}
            errors={errors}
          />

          <div className="mb-8">
            <label
              htmlFor="gender"
              className={`block font-bold text-sm mb-2 ${
                errors.gender ? "text-red-400" : ""
              }`}
            >
              {t("gender")} <span className="text-red-500">*</span>
            </label>
            <input
              type="radio"
              name="gender"
              id="male"
              value="male"
              className="ml-5"
              {...register("gender")}
            />
            <label htmlFor="male" className="ml-4 font-bold text-sm">
              Male
            </label>
            <br />
            <input
              type="radio"
              name="gender"
              id="female"
              value="female"
              className="ml-5"
              {...register("gender")}
            />
            <label htmlFor="female" className="ml-4 font-bold text-sm">
              Female
            </label>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-2">
                {errors.gender.message}
              </p>
            )}
          </div>

          <FormGroup
            id={"email"}
            name={"email"}
            type={"email"}
            label={"email"}
            placeholder={"e.g. johndoe@example.com"}
            required={true}
            register={register}
            errors={errors}
          />
          <FormGroup
            id={"password"}
            name={"password"}
            type={"password"}
            label={"password"}
            placeholder={"e.g. At least 8 characters"}
            required={true}
            register={register}
            errors={errors}
          />

          {/* Confirm Password Field */}
          <FormGroup
            id={"password2"}
            name={"password2"}
            type={"password"}
            label={"confirm password"}
            placeholder={"e.g. Same as password"}
            required={true}
            register={register}
            errors={errors}
          />

          <div className="mb-8">
            <label
              htmlFor="role"
              className={`block font-bold text-sm mb-2 ${
                errors.role ? "text-red-400" : ""
              }`}
            >
              {t("role")} <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              id="role"
              required
              className={`block w-full bg-transparent outline-none border-2 py-2 px-4 ${
                errors.role ? "border-red-400 text-red-400" : ""
              }`}
              {...register("role")}
            >
              {roles.map((role) => (
                <option
                  value={role.id}
                  className="bg-[var(--sidebar-background-color)] dark:bg-[var(--sidebar-background-dark-color)]"
                >
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-2">{errors.role.message}</p>
            )}
          </div>

          <div className="mb-8">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-block bg-[var(--primary-color)] text-[var(--main-background-color)] hover:bg-[var(--accent-color)] rounded shadow py-2 px-5 text-sm"
            >
              {isLoading ? "Registering..." : t("register")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
