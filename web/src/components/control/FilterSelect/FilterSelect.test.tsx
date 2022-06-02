import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { FilterSelect, FilterSelectProps, selectedItemId } from './FilterSelect';
import { SelectOption } from './SelectOption';

describe('FilterSelect', () => {
  const testOptions = [
    { value: 'test.user-1', text: 'Test User 1' },
    { value: 'test.user-2', text: 'Test User 2' },
    { value: 'test.user-3', text: 'Test User 3' },
  ];
  const otherOptions = [
    { value: 'adam.szi', text: 'Adam Szi' },
    { value: 'tamas.horvath', text: 'Tamas Horvath' },
    { value: 'andras.balogh', text: 'Andras Balogh' },
  ];
  const options = [...otherOptions, ...testOptions];

  function MockFilterSelect(props: Partial<Omit<FilterSelectProps, 'open'>>) {
    const { onChange = jest.fn(), ...restProps } = props;
    const [isOpen, setOpen] = useState(false);

    const handleChange = (value?: string) => {
      setOpen(false);
      onChange(value);
    };

    return (
      <FilterSelect {...restProps} open={isOpen} onOpen={() => setOpen(true)} onChange={handleChange}>
        {options.map(opt => (
          <SelectOption key={opt.value} value={opt.value}>
            <span className="item">{opt.text}</span>
          </SelectOption>
        ))}
      </FilterSelect>
    );
  }

  function checkIfItemsAreVisible(items: typeof options) {
    items.forEach(opt => {
      const item = screen.getByRole('option', { name: opt.value });
      expect(item).toBeVisible();
    });
  }

  function checkIfItemsAreNotVisible(items: typeof options) {
    items.forEach(opt => {
      const item = screen.getByRole('option', { name: opt.value, hidden: true });
      expect(item).not.toBeVisible();
    });
  }

  it('starts as not visible', () => {
    render(<MockFilterSelect />);
    expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
    checkIfItemsAreNotVisible(options);
  });

  function openSelect() {
    const selectedItem = screen.getByTestId(selectedItemId);
    userEvent.click(selectedItem);
  }

  describe('clicking on select element opens the dropdown', () => {
    test('has selected item', () => {
      const [first] = options;
      render(<MockFilterSelect initial={first.value} />);

      checkIfItemsAreNotVisible(options);
      openSelect();
      checkIfItemsAreVisible(options);
    });

    test('no selected item', () => {
      render(<MockFilterSelect />);

      checkIfItemsAreNotVisible(options);
      openSelect();
      checkIfItemsAreVisible(options);
    });
  });

  function checkIfItemsAreSelected(items: typeof options, selected: boolean) {
    items.forEach(opt => {
      const item = screen.getByRole('option', { name: opt.value });
      expect(item).toHaveAttribute('aria-selected', selected.toString());
    });
  }

  test('aria-selected="true" if item is selected', () => {
    const [first, ...rest] = options;
    render(<MockFilterSelect initial={first.value} />);
    openSelect();

    checkIfItemsAreSelected([first], true);
    checkIfItemsAreSelected(rest, false);
  });

  it('changes selection when option gets clicked', async () => {
    const [first, other, ...rest] = options;
    render(<MockFilterSelect initial={first.value} />);
    openSelect();

    const otherOption = screen.getByRole('option', { name: other.value });
    userEvent.click(otherOption);
    openSelect();

    checkIfItemsAreSelected([other], true);
    checkIfItemsAreSelected([first, ...rest], false);
  });

  it('calls onChange when option gets clicked', () => {
    const [first, other] = options;
    const onChange = jest.fn();
    render(<MockFilterSelect initial={first.value} onChange={onChange} />);
    openSelect();

    const otherOption = screen.getByRole('option', { name: other.value });
    userEvent.click(otherOption);

    expect(onChange).toBeCalledWith(other.value);
  });

  it('renders a copy of the selected item', () => {
    render(<MockFilterSelect />);
    openSelect();

    expect(screen.queryByTestId(selectedItemId)).toBeEmptyDOMElement();

    const [first] = options;
    const firstItem = screen.getByRole('option', { name: first.value });
    userEvent.click(firstItem);

    const selectedItem = screen.getByTestId(selectedItemId);
    expect(selectedItem).toBeInTheDocument();

    expect(selectedItem).toHaveAttribute('data-value', firstItem.getAttribute('data-value'));
    expect(selectedItem.children).toEqual(firstItem.children);
  });

  test('search input not visible when closed', () => {
    render(<MockFilterSelect />);
    const searchInput = screen.queryByRole('textbox', { name: /search/i, hidden: true });
    expect(searchInput).not.toBeInTheDocument();
  });

  test('search input visible when opened', () => {
    render(<MockFilterSelect />);
    openSelect();

    const searchInput = screen.getByRole('textbox', { name: /search/i });
    expect(searchInput).toBeVisible();
  });

  test('search input filteres shown option items', () => {
    render(<MockFilterSelect />);
    openSelect();
    const searchInput = screen.getByRole('textbox', { name: /search/i });

    options.forEach(opt => {
      const item = screen.getByRole('option', { name: opt.value });
      expect(item).toBeVisible();
    });

    userEvent.clear(searchInput);
    userEvent.type(searchInput, 'test');

    testOptions.forEach(opt => {
      const item = screen.getByRole('option', { name: opt.value });
      expect(item).toBeVisible();
    });
    otherOptions.forEach(opt => {
      const item = screen.queryByRole('option', { name: opt.value });
      expect(item).not.toBeInTheDocument();
    });
  });
});
