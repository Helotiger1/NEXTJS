
type FormInputProps = {
  label: string;
  name: string;
  type?: string;
};

export default function FormInput({ label, name, type = "text" }: FormInputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
      />
    </div>
  );
}