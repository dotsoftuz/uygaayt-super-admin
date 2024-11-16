import { FC } from "react";
import { TextEditorStyled } from "./TextEditor.style";
import { TextEditorPropsType } from "./TextEditor.types";

const TextEditor: FC<TextEditorPropsType> = (props) => {
  const { value, onChange, onImageUpload, isError, type } = props;

  return (
    <TextEditorStyled
      controls={[
        [
          "bold",
          "italic",
          "underline",
          "strike",
          "clean",
          "unorderedList",
          "orderedList",
          "alignLeft",
          "alignCenter",
          "alignRight",
        ],
      ]}
      isError={!!isError}
      value={value}
      onChange={onChange}
      onImageUpload={onImageUpload}
      type={type}
    ></TextEditorStyled>
  );
};

export default TextEditor;
