import styled from "styled-components";

export const LoaderStyled = styled.div`
  // paddingLeft: "200px";
  overflow: hidden;
  .scale {
    transform: scale(1.5);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 75vh;
    .loader {
      width: 48px;
      height: 48px;
      border: 3px solid #2a3042;
      border-radius: 50%;
      display: inline-block;
      position: relative;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
      transform: scale(1.5);
    }
    .loader::after {
      content: "";
      box-sizing: border-box;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 3px solid;
      border-color: #ff3d00 transparent;
    }

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;
