import styled from "styled-components";

export const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 32px;
    font-weight: 500;
    font-family: "SF Pro Display";
  }

  button {
    width: 182px;
    height: 48px;
    background-color: #0f6fdf;
    border-radius: 12px;
    color: #ffffff;
    font-size: 16px;
    text-transform: inherit;
    &:hover {
      background-color: #0f6fdf;
    }
  }
  .header-btn-content {
    display: flex;
  }

  .header-filter {
    width: 140px;
    background-color: #f5f5f5;
    margin-right: 16px;
    color: #232323;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 18px;

    .devider-filter-box {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 7px;
    }

    &:hover {
      background-color: #f5f5f5;
    }
  }
`;
