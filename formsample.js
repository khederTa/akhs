import React from 'react';
import { useForm } from 'react-hook-form';

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input {...register("name", { required: true })} className="mt-1 p-2 border rounded w-full" />
        {errors.name && <span className="text-red-500">This field is required</span>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input {...register("email", { required: true })} className="mt-1 p-2 border rounded w-full" />
        {errors.email && <span className="text-red-500">This field is required</span>}
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
    </form>
  );
};

export default MyForm;
