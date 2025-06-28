
import { ReactNode, FormEvent } from "react";

type FormWrapperProps = {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function FormWrapper({ children, onSubmit }: FormWrapperProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md border max-w-md mx-auto"
    >
      {children}
    </form>
  );
}