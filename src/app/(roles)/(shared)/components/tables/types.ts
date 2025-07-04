export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};

export type DynamicTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowsPerPage?: number;
};
