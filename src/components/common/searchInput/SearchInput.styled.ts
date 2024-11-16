import styled from "styled-components";

export const SearchInputStyled = styled.div`
  .search-box {
    position: relative;
    width: fit-content;
    height: fit-content;
    display: flex;
    border-radius: 12px;
  }
  .input-search {
    height: 45px;
    width: 300px;
    border: none;
    padding: 10px 15px;
    font-size: 14px;
    outline: none;
    padding-left: 45px;
    color: #333;
    border-radius: 10px;
    border: 1px solid #d9d9d9;
  }
  .input-search::placeholder {
    font-size: 14px;
    letter-spacing: 2px;
    font-weight: 100;
    color: #999999;
  }
  .btn-search {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-style: none;
    font-weight: bold;
    outline: none;
    cursor: pointer;
    border-radius: 4px;
    position: absolute;
    left: 0px;
    color: #ffffff;
    background-color: transparent;
    pointer-events: painted;
    svg {
      fill: #999;
      font-size: 20px;
    }
  }
`;
