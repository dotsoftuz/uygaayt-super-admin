import styled from "styled-components";

export const DefaultPageStyled = styled.div`
  position: relative;
  width: 100%;
  height: calc(99vh - 80px);
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  /* border-radius: 51% 49% 72% 28% / 52% 35% 65% 48%; */
  img{
    width: 300px;
  }
  p {
    font-size: 28px;
    color: #000;
  }
`;
