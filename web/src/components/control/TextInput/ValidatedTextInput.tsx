import { ChangeEvent, ReactElement, useState } from 'react';
import classNames from 'classnames';
import './ValidatedTextInput.scss';
import { InputValidator } from '../../../validators/types';
import { TextInput, TextInputProps } from './TextInput';

interface ValidatedTextInputProps extends TextInputProps {
  validator: InputValidator;
}

export function ValidatedTextInput(props: ValidatedTextInputProps): ReactElement {
  const { validator, onChange, className, ...restProps } = props;
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const error = validator(e);
    if (error) setError(error);
    else setError('');

    if (onChange) onChange(e);
  };

  return (
    <>
      <TextInput className={classNames(className, { error })} {...restProps} onChange={handleChange} />
      {error && (
        <span className="input-error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
