import styled from "styled-components";
import { Box } from "@mui/material";
import { createGlobalStyle } from "styled-components";
import React from "react";

export const SIDEBAR_OPEN = "280px";
export const SIDEBAR_CLOSE = "103px";

// ? Colors
export const lightMode = {
  primaryColor: "#2a363b",
  primaryColor2: "#3f4f56",

  darkColor: "#000",
  whiteColor: "#fff",
  whiteColor2: "#eee",
  whiteColor3: "#E8E8E8",
  inputColor: "#f4fff1",
  paragColor: "#A1A1A1",
  checkPointBackground: "#fafafa",
  borderBottomColor: "#e8e8e8",
  ProductItemBackColor: "#fafafa",
};

export const darkMode = {
  primaryColor: "rgb(0, 7, 61)",
  darkColor: "#fff",
  whiteColor: "#0E1621",
  whiteColor2: "#0E1621",
  whiteColor3: "#0E1621",
  inputColor: "#242F3D",
  paragColor: "#eee",
  checkPointBackground: "#17212B",
  borderBottomColor: "#17212B",
  ProductItemBackColor: "#17212B",
};

// ? Font size
export const buttonSize = "16px";
export const paragraphSize = "14px";
export const miniSize = "12px";

// ? Font weight
export const ButtonWeight = "500";
export const sixHundred = "600";

export const GlobalStyle = createGlobalStyle`
     * {
          margin: 0;
          padding: 0;
          outline:0;
          box-sizing: border-box;
          font-family: "SF Pro Display" sans-serif;
     }

     body {
          background-color:  #ffffff;

          :not(:root):fullscreen::backdrop {
               position: fixed;
               top: 0px;
               right: 0px;
               bottom: 0px;
               left: 0px;
               background: #F6F6F9;
          }
     }
     #root{
          margin:0 auto;
     }

     p {
          font-weight: 400;
          font-size: 16px;
          line-height: 20px;
     }
    
   
` as unknown as React.FC;

export const Container = styled.div`
  /* padding-left: 250px !important; */
`;

export const PrivateContainer = styled.div`
  background: #ffffff;
`;

export const CloseBtn = styled(Box)`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  margin-left: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: none;
  transition: all 0.3s ease;
  cursor: pointer;

  svg {
    path {
      fill: ${({ theme }) => theme.primary.dark};
    }
  }
`;

export const BackGroundColorContainer = styled.div`
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 0.5rem;
`;

export const AddEditImgContainer = styled.div`
  padding: 1.5rem;
  border-radius: 4px;
  border: 1px solid #eaeaef;
  background-color: #fff;

  .btns-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
  }
`;
