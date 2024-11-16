import styled from "styled-components";

export const IntegrationStyled = styled.div`
  display: flex;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  height: 100%;
  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180px;
    height: 100px;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin-right: 10px;
    cursor: pointer;
  }
`;

export const InegrationCard = styled.div`
  padding: 20px;
  width: 880px;
  height: 440px;
  border-radius: 12px;
  background-color: #ffffff;
  position: relative !important;
  box-sizing: border-box;

  .integration-logo {
    display: flex;
    flex-direction: column;
    gap: 16px;
    img {
      width: 200px;
      max-height: 180px;
      object-fit: contain;
    }
  }

  .integration_loader {
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
  }
`;

export const IntegrationInfo = styled.div`
  max-height: 100%;

  h2 {
    font-size: 22px;
    text-align: center;
    padding: 15px 0;
  }
  p {
    font-size: 14px;
  }

  .fields_val {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 10px;

    li {
      list-style-type: none;
      padding: 0 10px;
      font-size: 14px;
      border-left: 2px solid darkgoldenrod;
      display: flex;

      span {
        color: darkgrey;
        cursor: pointer;
        display: flex;
        gap: 10px;
        word-break: break-all;

        i {
          width: 88%;
        }

        svg {
          path {
            fill: #eb469f;
          }
        }
      }
    }
  }
`;
