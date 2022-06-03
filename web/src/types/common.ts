export type PropsWithTypedChildren<T, C> = T & {
  children?: C | C[];
};

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
export type HTMLDivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export interface TestProps {
  'data-testid'?: string;
}
