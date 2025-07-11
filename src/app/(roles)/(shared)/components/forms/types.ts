export type Option = { value: string; label: string };

export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "checkbox" | "number";
  options?: Option[];
};

export type DynamicFormProps<TData> = {
  initConfig?: any;
  config: Field[];
  onSubmit: (data: TData) => void | Promise<void>;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

