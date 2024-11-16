export interface TextEditorPropsType {
  onImageUpload?: any;
  value: any;
  onChange: (e: any) => void;
  isError?: boolean;
  type?: string;
  isFocused?: boolean;
}

export interface ITextEditorStyled {
  isError: boolean;
  type?: string;
  ref?: any;
  isFocused?: boolean;
}
