import { render, screen } from '@testing-library/react';
import { ButtonProps } from '../Button/Button';
import { ButtonGroup } from './ButtonGroup';

describe('ButtonGroup', () => {
  const buttonTexts = Array(6)
    .fill(null)
    .map((_, i) => `btn-${i}`);

  it('renders the buttons given as props', () => {
    const buttons: ButtonProps[] = buttonTexts.map(text => ({ children: text }));
    render(<ButtonGroup buttons={buttons} />);

    buttonTexts.forEach(btn => {
      const buttonElem = screen.getByRole('button', { name: btn });
      expect(buttonElem).toBeInTheDocument();
    });
  });

  it('passes props to the buttons', () => {
    const buttons: ButtonProps[] = [
      { children: buttonTexts[0], size: 'big' },
      { children: buttonTexts[1], fill: 'text' },
      { children: buttonTexts[2], color: 'primary' },
      { children: buttonTexts[3], className: 'randomClass' },
      { children: buttonTexts[4], fill: 'fill', size: 'wide' },
      { children: buttonTexts[5], size: 'small', className: 'randomClass' },
    ];
    render(<ButtonGroup buttons={buttons} />);

    const buttonElem1 = screen.getByRole('button', { name: buttonTexts[0] });
    expect(buttonElem1).toHaveClass('big');

    const buttonElem2 = screen.getByRole('button', { name: buttonTexts[1] });
    expect(buttonElem2).toHaveClass('text');

    const buttonElem3 = screen.getByRole('button', { name: buttonTexts[2] });
    expect(buttonElem3).toHaveClass('primary');

    const buttonElem4 = screen.getByRole('button', { name: buttonTexts[3] });
    expect(buttonElem4).toHaveClass('randomClass');

    const buttonElem5 = screen.getByRole('button', { name: buttonTexts[4] });
    expect(buttonElem5).toHaveClass('fill', 'wide');

    const buttonElem6 = screen.getByRole('button', { name: buttonTexts[5] });
    expect(buttonElem6).toHaveClass('small', 'randomClass');
  });

  it('overrides button props(fill, size, color) with its own', () => {
    const buttons: ButtonProps[] = [
      { children: buttonTexts[0], size: 'big' },
      { children: buttonTexts[1], fill: 'text' },
      { children: buttonTexts[2], color: 'primary' },
      { children: buttonTexts[3], className: 'randomClass' },
      { children: buttonTexts[4], fill: 'fill', size: 'wide' },
      { children: buttonTexts[5], size: 'small', className: 'randomClass' },
    ];
    render(<ButtonGroup buttons={buttons} size="small" fill="border" color="secondary" />);

    const buttonElem1 = screen.getByRole('button', { name: buttonTexts[0] });
    expect(buttonElem1).toHaveClass('small', 'border', 'secondary');

    const buttonElem2 = screen.getByRole('button', { name: buttonTexts[1] });
    expect(buttonElem2).toHaveClass('small', 'border', 'secondary');

    const buttonElem3 = screen.getByRole('button', { name: buttonTexts[2] });
    expect(buttonElem3).toHaveClass('small', 'border', 'secondary');

    const buttonElem4 = screen.getByRole('button', { name: buttonTexts[3] });
    expect(buttonElem4).toHaveClass('small', 'border', 'secondary', 'randomClass');

    const buttonElem5 = screen.getByRole('button', { name: buttonTexts[4] });
    expect(buttonElem5).toHaveClass('small', 'border', 'secondary');

    const buttonElem6 = screen.getByRole('button', { name: buttonTexts[5] });
    expect(buttonElem6).toHaveClass('small', 'border', 'secondary', 'randomClass');
  });
});
