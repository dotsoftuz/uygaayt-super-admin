import styled from "styled-components";

export const RoleFormStyled = styled.div`
  .role-checkbox {
    padding: 0;
    background-color: transparent !important;
  }
  .MuiAccordion-root,
  .MuiAccordionSummary-content {
    margin: 0 !important;
  }
  .MuiAccordionSummary-root {
    padding: 0;
    border: none !important;
    margin-bottom: 5px;
  }
  .MuiPaper-root {
    box-shadow: none;
    &::before {
      display: none;
    }
  }
  .MuiAccordionDetails-root {
    padding: 0;
  }
  .MuiCheckbox-root {
    padding: 6px;
  }
`;
