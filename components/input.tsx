interface FormInputProps {
  placeholder?: string;
  type?: string;
  name: string;
  required: boolean;
  errors?: string[];
}

export function FormInput({
  placeholder,
  type = "text",
  name,
  required = false,
  errors,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <input
        placeholder={placeholder}
        type={type}
        name={name}
        required={required}
        className="px-4 py-1 text-black border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
      />
      {errors &&
        errors.map((error, index) => (
          <span key={index} className="text-red-500">
            {error}
          </span>
        ))}
    </div>
  );
}
