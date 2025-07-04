export type Option = { value: string; label: string };

export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "checkbox";
  options?: Option[];
};

export type DynamicFormProps = {
  config: Field[];
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
