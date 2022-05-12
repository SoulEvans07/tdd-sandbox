import { ChangeEvent, FocusEvent, ReactElement, useState } from 'react';
import classNames from 'classnames';
import './ValidatedInput.scss';
import { HTMLInputProps, InputComp } from './types';
import { InputValidator } from '../../../validators/types';

export type ValidatedInputProps<ICP extends HTMLInputProps = HTMLInputProps> = ICP & {
  Input: InputComp<ICP>;
  validator?: InputValidator;
};

export function ValidatedInput<ICP extends HTMLInputProps = HTMLInputProps>(
  props: ValidatedInputProps<ICP>
): ReactElement {
  const { validator, onChange, onFocus, className, Input, ...restProps } = props;
  const [error, setError] = useState('');

  const validate = (value: string) => {
    if (validator) {
      const error = validator(value);
      if (error) setError(error);
      else setError('');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    validate(event.target.value);
    if (onChange) onChange(event);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    validate(event.target.value);
    if (onFocus) onFocus(event);
  };

  return (
    <>
      {/* @ts-ignore */}
      <Input
        {...restProps}
        className={classNames(className, { error })}
        onChange={handleChange}
        onFocus={handleFocus}
      />
      {error && (
        <span className="input-error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
