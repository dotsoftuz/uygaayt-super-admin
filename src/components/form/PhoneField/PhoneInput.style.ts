import PhoneInput from "react-phone-input-2";
import styled from "styled-components";

export const PhoneNumberCountryStyled = styled(PhoneInput)`
  height: 47px;
  width: 100%;
  .form-control {
    width: 100%;
    font-size: 15px !important;
    height: 47px;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    font-size: 14px !important;
    background-color: #fff;
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .flag-dropdown {
    border-radius: 10px 0 0 10px;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-right: none !important;
    .selected-flag {
      border-radius: 10px 0 0 10px;

      &:hover {
        background-color: inherit !important;
        border-radius: 10px 0 0 10px;
      }

      &.open {
        border-radius: 10px 0 0 10px;
        background-color: inherit !important;
      }
    }

    &.open {
      border-radius: 10px 0 0 10px;
    }
  }
`;

export const PhoneNumberlabelStyled = styled.div`
  margin-bottom: 5px;
  margin-top: 5px;

  label {
    color: #232323;
    font-weight: 500;
    font-size: 14px;
  }
`;

// export const MaskInputStyled = styled(MaskInput)`
//   border-radius: 8px;
//   border: 1px solid ${({ theme }) => theme.colors.border.grey};
//   box-sizing: border-box;
//   width: 100%;
//   color: ${({ theme }) => theme.colors.text.lightBlack};
//   padding: 16px 15px;
//   font-style: normal;
//   font-weight: normal;
//   font-size: 16px;
//   outline: none;
//   transition: all 300ms ease-out;
//   &:hover {
//     border-color: ${({ theme }) => theme.colors.border.grey};
//   }
//   &:focus {
//     border-color: ${({ theme }) => theme.colors.border.grey};
//   }
//   &::placeholder {
//     color: ${({ theme }) => theme.colors.text.lightBlack};
//   }
//   &:focus {
//     box-shadow: none;
//     color: #8b90a5;
//     border-color: #edf1ff;
//   }
//   &.error {
//     border-color: ${({ theme }) => theme.colors.border.red};
//   }
// `;
