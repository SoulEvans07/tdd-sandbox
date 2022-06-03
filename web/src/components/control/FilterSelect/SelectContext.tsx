import { createContext, PropsWithChildren, ReactElement, useContext } from 'react';

export interface SelectContext {
  selected?: string;
  setSelected: (value?: string) => void;
}

const Select = createContext<SelectContext | undefined>(undefined);

export function useSelect() {
  const context = useContext(Select);
  if (!context) throw new Error('useSelectContext must be used within a ThemeProvider');
  return context;
}

interface SelectProviderProps {
  value?: string;
  setValue: (value?: string) => void;
}

export function SelectProvider(props: PropsWithChildren<SelectProviderProps>): ReactElement {
  const { value, setValue, ...restProps } = props;
  return <Select.Provider value={{ selected: value, setSelected: setValue }} {...restProps} />;
}
