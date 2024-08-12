import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  fname: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(15),
  mname: z.string().min(3).max(15),
  lname: z.string().min(3).max(15),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string(),
  bDate: z.date(),
  study: z.string(),
  gender: z.enum("male", "female"),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "test@email.com",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   console.log(data);
    // } catch (error) {
    //   setError("root", {
    //     message: "This email is already taken",
    //   });
    // }
  };

  return (
    <div className="absolute translate-x-1/2 translate-y-1/2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="fname">
          {" "}
          First Name:
          <input
            type="text"
            id="fname"
            className=""
            {...register("fname", {
              required: true,
              maxLength: 20,
            })}
          />
        </label>
        <br />
        <label htmlFor="mname">
          {" "}
          Middle Name:
          <input
            type="text"
            id="mname"
            {...register("mname", {
              required: true,
              maxLength: 20,
            })}
          />
        </label>
        <br />
        <label htmlFor="lname">
          {" "}
          Last Name:
          <input
            type="text"
            id="lname"
            {...register("lname", {
              required: true,
              maxLength: 20,
            })}
          />
        </label>
        <br />

        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email Address is required" })}
          />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "password Address is required",
            })}
          />
        </label>
        <br />

        <label htmlFor="phone">
          Phone:
          <input
            type="tel"
            id="phone"
            {...register("phone", { required: true })}
          />
        </label>
        <br />
        <label htmlFor="bDate">
          Birth Date:
          <input id="bDate" {...register("bDate", { required: true })} />
        </label>
        <br />
        <label>
          Study:
          <input {...register("study", { required: true })} />
        </label>
        <br />
        <label htmlFor="gender">
          Gender:
          <select name="gender" id="gender">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <br />

        <label htmlFor="work">
          Work:
          <input id="work" {...register("work", { required: true })} />
        </label>

        <br />
        <input type="submit" />
      </form>
    </div>
  );
}
