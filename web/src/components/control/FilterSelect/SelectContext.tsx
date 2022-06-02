import { createContext, PropsWithChildren, ReactElement, RefObject, useContext } from 'react';
import { StateSetter } from '../../../types/common';

export interface SelectContext {
  selected?: string;
  setSelected: StateSetter<string | undefined>;
}

const Select = createContext<SelectContext | undefined>(undefined);

export function useSelect() {
  const context = useContext(Select);
  if (!context) throw new Error('useSelectContext must be used within a ThemeProvider');
  return context;
}

interface SelectProviderProps {
  value?: string;
  setValue: StateSetter<string | undefined>;
}

export function SelectProvider(props: PropsWithChildren<SelectProviderProps>): ReactElement {
  const { value, setValue, ...restProps } = props;
  return <Select.Provider value={{ selected: value, setSelected: setValue }} {...restProps} />;
}
