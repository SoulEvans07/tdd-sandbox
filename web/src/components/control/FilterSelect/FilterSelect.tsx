import {
  ChangeEvent,
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import './FilterSelect.scss';
import { HTMLDivProps, PropsWithTypedChildren } from '../../../types/common';
import { Dropdown } from '../../layout/Dropdown/Dropdown';
import { SelectProvider } from './SelectContext';
import { SelectOption, SelectOptionComp } from './SelectOption';
import { TextInput } from '../TextInput/TextInput';

export const selectedItemId = 'selected-item';

interface FilterSelectData {
  open?: boolean;
  onOpen?: VoidFunction;
  onChange: (value?: string) => void;
  initial?: string;
  placeholder?: string;
}

export type FilterSelectProps = PropsWithTypedChildren<FilterSelectData, ReactNode>;

export function FilterSelect(props: FilterSelectProps): ReactElement {
  const { open, onOpen, onChange, initial, placeholder, children } = props;

  const [selected, setSelected] = useState<string | undefined>(initial);
  useEffect(() => {
    if (onChange) onChange(selected);
  }, [selected]);

  const [searchText, setSearchText] = useState('');
  const handleSearchChange = (evt: ChangeEvent<HTMLInputElement>) => setSearchText(evt.target.value);

  const SelectedElem = useCallback(
    (props: HTMLDivProps) => {
      const childList = Children.toArray(children);
      const selectedChild = childList.find(child => {
        if (!isValidElement(child)) return false;
        if (child.type !== SelectOption) return false;
        const option = child as SelectOptionComp;
        return option.props.value === selected;
      });

      if (!selectedChild || !isValidElement(selectedChild))
        return <div {...props} data-testid={selectedItemId} onClick={onOpen} />;
      return <>{cloneElement(selectedChild, { ...selectedChild.props, ...props, role: undefined })}</>;
    },
    [selected, children]
  );

  const FilteredChildren = useCallback(() => {
    const childList = Children.toArray(children);
    return (
      <>
        {childList.filter(child => {
          if (!isValidElement(child)) return false;
          if (child.type !== SelectOption) return false;
          const option = child as SelectOptionComp;
          return option.props.value.toLowerCase().includes(searchText.toLowerCase());
        })}
      </>
    );
  }, [searchText, children]);

  return (
    <SelectProvider value={selected} setValue={setSelected}>
      <div className="filter-select" data-value={selected}>
        <SelectedElem className="selection" data-testid={selectedItemId} onClick={onOpen} />
        <TextInput
          className="select-search"
          title="Search"
          hidden={!open}
          value={searchText}
          onChange={handleSearchChange}
          placeholder={placeholder}
        />
        <Dropdown className="select-dropdown" hidden={!open} role="listbox">
          <FilteredChildren />
        </Dropdown>
      </div>
    </SelectProvider>
  );
}
