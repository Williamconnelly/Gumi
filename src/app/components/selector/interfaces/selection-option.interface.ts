export interface ISelectionOption<T = any> {
  id: string;
  display: string;
  value: T;
  selected?: boolean;
}