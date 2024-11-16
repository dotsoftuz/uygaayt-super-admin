import styled from "styled-components";

export const StoreStyled = styled.div`
  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .title {
    font-size: 40px;
    font-weight: 600;
    margin-top: 32px;
  }
  .comment {
    display: block;
    color: #999;
    font-weight: 500;
    margin-bottom: 24px;
  }
  .stores {
    height: 100vh;
    overflow: auto;
  }
  .store {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 14px;
    font-weight: 500;
    border-radius: 14px;
    background: #f5f4f2;
    transition: 0.3s ease all;
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
  }
`;
