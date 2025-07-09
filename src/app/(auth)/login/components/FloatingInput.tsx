
import { FloatingInputProps } from "../types";

export default function FloatingInput({
    label,
    name,
    type = "text",
    value,
    onChange,
}: FloatingInputProps) {

    return (
        <div className="relative w-full">
  <input
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    required
    placeholder=" "
    className="peer w-full border-b border-gray-500 bg-transparent px-1 pt-5 py-2.5 text-sm text-white focus:border-purple-400 focus:outline-none placeholder-transparent"
  />
  <label
    htmlFor={name}
    className="absolute left-1 top-2 text-gray-400 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:top-[22px] peer-focus:top-[4px] peer-focus:text-xs peer-focus:text-purple-400 pointer-events-none"
  >
    {label}
  </label>
</div>

    );
}
