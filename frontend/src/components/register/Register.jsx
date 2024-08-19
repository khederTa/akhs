// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// const schema = z.object({
//   fname: z
//     .string()
//     .min(3, { message: "Username must be at least 3 characters" })
//     .max(15),
//   mname: z.string().min(3).max(15),
//   lname: z.string().min(3).max(15),
//   email: z.string().email(),
//   password: z.string().min(8),
//   phone: z.string(),
//   bDate: z.date(),
//   study: z.string(),
//   gender: z.enum("male", "female"),
// });

// export default function Register() {
//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     defaultValues: {
//       email: "test@email.com",
//     },
//     resolver: zodResolver(schema),
//   });

//   const onSubmit = async (data) => {
//     console.log(data);

//     // try {
//     //   await new Promise((resolve) => setTimeout(resolve, 1000));
//     //   console.log(data);
//     // } catch (error) {
//     //   setError("root", {
//     //     message: "This email is already taken",
//     //   });
//     // }
//   };

//   return (
//     <div className="absolute translate-x-1/2 translate-y-1/2">
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <label htmlFor="fname">
//           {" "}
//           First Name:
//           <input
//             type="text"
//             id="fname"
//             className=""
//             {...register("fname", {
//               required: true,
//               maxLength: 20,
//             })}
//           />
//         </label>
//         <br />
//         <label htmlFor="mname">
//           {" "}
//           Middle Name:
//           <input
//             type="text"
//             id="mname"
//             {...register("mname", {
//               required: true,
//               maxLength: 20,
//             })}
//           />
//         </label>
//         <br />
//         <label htmlFor="lname">
//           {" "}
//           Last Name:
//           <input
//             type="text"
//             id="lname"
//             {...register("lname", {
//               required: true,
//               maxLength: 20,
//             })}
//           />
//         </label>
//         <br />

//         <label htmlFor="email">
//           Email:
//           <input
//             type="email"
//             id="email"
//             {...register("email", { required: "Email Address is required" })}
//           />
//         </label>
//         <br />
//         <label htmlFor="password">
//           Password:
//           <input
//             type="password"
//             id="password"
//             {...register("password", {
//               required: "password Address is required",
//             })}
//           />
//         </label>
//         <br />

//         <label htmlFor="phone">
//           Phone:
//           <input
//             type="tel"
//             id="phone"
//             {...register("phone", { required: true })}
//           />
//         </label>
//         <br />
//         <label htmlFor="bDate">
//           Birth Date:
//           <input id="bDate" {...register("bDate", { required: true })} />
//         </label>
//         <br />
//         <label>
//           Study:
//           <input {...register("study", { required: true })} />
//         </label>
//         <br />
//         <label htmlFor="gender">
//           Gender:
//           <select name="gender" id="gender">
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//           </select>
//         </label>
//         <br />

//         <label htmlFor="work">
//           Work:
//           <input id="work" {...register("work", { required: true })} />
//         </label>

//         <br />
//         <input type="submit" />
//       </form>
//     </div>
//   );
// }

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
  gender: z.enum(["male", "female"]), // corrected enum definition
});

export default function Register() {
  function ArpansForm() {
    const {
      register,
      handleSubmit,
      formState: { errors }, // corrected errors extraction
    } = useForm({
      mode: "onBlur",
      resolver: zodResolver(schema),
    });

    function woosalSubmit(data) {
      // handle submitting the form
      console.log(data);
    }

    return (
      <div className="w-1/3 bg-[var(--main-background-color)] p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(woosalSubmit)}>
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
              placeholder="hey@chrisoncode.io"
              className={`block w-full bg-transparent outline-none border-2 py-2 px-4  placeholder-[var(--secondary-text-color)] focus:bg-[var(--main-background-color)] ${
                errors.email
                  ? "text-red-300 border-red-400"
                  : "text-[var(--text-color)] dark:text-[var(--text-dark-color)]"
              }`}
              {...register("email")} // corrected ref usage
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
              placeholder="superduperpassword"
              className={`block w-full bg-transparent outline-none border-2 py-2 px-4  placeholder-[var(--secondary-text-color)] focus:bg-[var(--main-background-color)] ${
                errors.password
                  ? "text-red-300 border-red-400"
                  : "text-[var(--text-color)] dark:text-[var(--text-dark-color)]"
              }`}
              {...register("password")} // corrected ref usage
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                Your password is required.
              </p>
            )}
          </div>

          <button className="inline-block bg-[var(--primary-color)] text-[var(--main-background-color)] hover:bg-[var(--accent-color)] rounded shadow py-2 px-5 text-sm">
            Login
          </button>
        </form>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-screen text-[var(--text-color)] dark:text-[var(--text-dark-color)] bg-[var(--sidebar-background-color)] dark:bg-[var(--main-background-dark-color)]">
      <ArpansForm />
    </div>
  );
}
