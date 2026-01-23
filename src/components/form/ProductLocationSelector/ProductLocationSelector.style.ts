import styled from 'styled-components';

export const ProductLocationSelectorStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .map-container {
    position: relative;
    width: 100%;
    display: block;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    background: #f5f5f5;

    .map-image {
      width: 100%;
      height: auto;
      display: block;
      max-width: 100%;
    }

    .map-overlay {
      pointer-events: none;
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .selected-info {
    padding: 12px;
    background: #e8f5e9;
    border: 1px solid #4caf50;
    border-radius: 4px;

    .selected-label {
      color: #666;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .selected-name {
      color: #2e7d32;
      font-weight: 600;
    }
  }
`;

