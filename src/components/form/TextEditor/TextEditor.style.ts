import { RichTextEditor } from "@mantine/rte";
import styled from "styled-components";
import { ITextEditorStyled } from "./TextEditor.types";

export const TextEditorStyled = styled(RichTextEditor)<ITextEditorStyled>`
  display: flex;
  flex-direction: column-reverse;
  border: none;
  width: 100%;
  padding-bottom: 20px;
  .quill {
    .ql-container {
      .ql-tooltip {
        transform: translateX(97px);
        z-index: 10;
      }
      .ql-editor {
        background-color: #fff;
        padding: 15px;
        border-radius: 12px;
        min-height: 80px;
        transition: all 0.3s;
        border: 1px solid #d9d9d9;
        p {
          margin: 0;
          font-size: 14px;
        }
      }
    }
  }
  .ql-toolbar {
    padding: 0;
    transition: opacity 1s ease-out;
    border-radius: 0;
    border-bottom: none;
    margin-top: 10px;
    button {
      border: none;
      margin: 0 5px;
      svg {
        width: 24px !important;
        height: 24px !important;
        fill: #000 !important;
        path {
          fill: #000;
        }
      }
    }
  }
  .ql-editing {
    left: 30px !important;
    transform: translateX(0px) !important;
    z-index: 100;
  }
`;
