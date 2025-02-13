import styled from "styled-components";

export const DefaultPageStyled = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 80px);
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  background-color: #EB5B00;
  border-radius: 51% 49% 72% 28% / 52% 35% 65% 48%;

  h2 {
    font-size: 47px;
    color: #fff;
  }
`;
