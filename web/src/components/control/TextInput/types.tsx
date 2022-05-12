import React, { HTMLProps } from 'react';

export type TextInputTypes = 'text' | 'password';

export type HTMLInputProps = HTMLProps<HTMLInputElement>;

export interface InputPropBase extends Omit<HTMLInputProps, 'role'> {}

export interface TextInputProps extends InputPropBase {
  type?: TextInputTypes;
}

export interface PasswordInputProps extends Omit<InputPropBase, 'type'> {
  enableShow?: boolean;
}

export type InputComp<ICP extends HTMLInputProps = HTMLInputProps> = React.FunctionComponent<ICP>;
