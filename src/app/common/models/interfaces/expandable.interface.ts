export interface IExpandable {
  id: string;
  isExpanded: boolean;
  toggleExpanded: (state: boolean) => void
}