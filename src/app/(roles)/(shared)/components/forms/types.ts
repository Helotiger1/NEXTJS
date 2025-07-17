export type Option = {
  value: string | number;
  label: string;
};

export type OptionSource =
  | Option[]
  | ((context?: any) => Option[] | Promise<Option[]>);

export type Field = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: OptionSource;
};

export type DynamicFormProps<TData> = {
  initConfig?: any;
  name? : string
  config: Field[];
  onSubmit: (data: TData) => void | Promise<void>;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

