import styled from "styled-components";

export const TransactionFilterStyle = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  margin: 12px 0;

  button {
    width: 120px;
    border-radius: 20px;
    height: 32px;
    background-color: #ffffff;
    transition: all 0.3s ease;
    color: #999999;
    &:hover {
      background-color: rgba(153, 153, 153, 0.8);
      color: #ffffff;
    }

    &.active {
      background-color: #999999;
      color: #ffffff;
    }
  }
`;
