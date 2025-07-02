export type FilterType = "select" | "checkbox" | "range";

export interface BaseFilter {
  key: string;
  label: string;
  type: FilterType;
}

export interface Option {
  value: string;
  label: string;
}

export interface SelectFilter extends BaseFilter {
  type: "select";
  options: Option[];
}

export interface CheckboxFilter extends BaseFilter {
  type: "checkbox";
  options: Option[];
}

export interface RangeFilter extends BaseFilter {
  type: "range";
  min?: number;
  max?: number;
  step?: number;
}

export type FilterConfig = SelectFilter | CheckboxFilter | RangeFilter;

export type FilterValue = string | string[] | number;

export type FilterState = Record<string, FilterValue>;


