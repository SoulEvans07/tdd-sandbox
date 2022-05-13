export type PropsWithTypedChildren<T, C> = T & {
  children?: C | C[];
};
