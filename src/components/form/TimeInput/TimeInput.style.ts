import styled from "styled-components";

export const TimeInputStyled = styled.div`
     label {
          font-weight: 600;
          font-size: 12px;
          line-height: 16px;
          color: #32324d;
          margin-bottom: 6px;
          span {
               color: red;
          }
     }
     input {
          padding: 10px 16px;
          border-radius: 4px;
          &::placeholder {
               font-weight: 400;
               font-size: 14px;
               line-height: 20px;
               color: #8e8ea9;
          }
     }
`;
