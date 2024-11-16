import styled from "styled-components";

export const LoginStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f3f3f8;
  form {
    width: 380px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
    padding: 24px;

    h1 {
      font-size: 26px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 20px;
    }
    main {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    button {
      width: 100%;
      height: 48px;
      margin-top: 8px;
    }
  }
`;
