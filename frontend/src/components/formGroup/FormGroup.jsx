import React from "react";
import { useTranslation } from "react-i18next";
export function FormGroup({
  id,
  name,
  type,
  label,
  placeholder,
  required,
  register,
  options,
  errors,
  value,
  onChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <label
        htmlFor={id}
        className={`block font-bold text-sm mb-2 ${
          errors[name] ? "text-red-400" : ""
        }`}
      >
        {t(label)} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        name={name}
        id={id}
        required={required}
        placeholder={placeholder}
        className={`block w-full bg-transparent outline-none border-2 py-2 px-4 ${
          errors[name] ? "border-red-400 text-red-400" : ""
        }`}
        {...register(name, { ...options })}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-2">{errors[name].message}</p>
      )}
    </div>
  );
}
