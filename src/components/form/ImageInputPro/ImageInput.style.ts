import styled from "styled-components";

export const ImageInputStyled = styled.div`
  h3 {
    font-size: 14px;
    font-weight: 500;
    color: #32324d;
    margin-bottom: 8px;
  }
  .just-image,
  .pre-loader {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      object-fit: contain !important;
    }
  }
  .input-file {
    position: relative;
    display: inline-block;
    cursor: pointer;
    .image-main {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 76px;
      height: 76px;
      border-radius: 12px;
      background: #f3f3f8;
    }
  }
  .input-file input[type="file"] {
    position: absolute;
    z-index: -1;
    opacity: 0;
    display: block;
    width: 0;
    height: 0;
  }

  /* Focus */
  .input-file input[type="file"]:focus + span {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  .input-file:active span {
    background-color: #2e703a;
  }

  /* Disabled */
  .input-file input[type="file"]:disabled + span {
    background-color: #eee;
  }

  /* Список c превью */
  .input-file-list {
    padding: 10px 0;
  }
  .input-file-list-item {
    display: inline-block;
    margin: 0 15px 15px;
    width: 150px;
    vertical-align: top;
    position: relative;
  }
  .input-file-list-item img {
    width: 150px;
  }
  .input-file-list-name {
    text-align: center;
    display: block;
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .input-file-list-remove {
    color: #fff;
    text-decoration: none;
    display: inline-block;
    position: absolute;
    padding: 0;
    margin: 0;
    top: 5px;
    right: 5px;
    background: #ff0202;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    border-radius: 50%;
  }
`;
