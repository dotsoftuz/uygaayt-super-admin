import styled from "styled-components";

export const AboutStyled = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
  .working-time {
    display: flex;
    align-items: end;
    justify-content: space-between;
    > div {
      width: 48%;
    }
  }
  .address-options {
    position: absolute;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    padding: 10px 0;
    border-radius: 10px;
    background-color: #fff;
    max-height: 300px;
    overflow: auto;
    z-index: 10;
    .option {
      padding: 8px 15px;
      cursor: pointer;
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
  .save-btn {
    text-align: right;
  }

  .copyBtn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background-color: #f5f5f5;

    svg {
      path {
        fill: blue;
      }
    }
  }
`;
