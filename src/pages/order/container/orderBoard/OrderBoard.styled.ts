import styled from "styled-components";

export const OrderBoardStyled = styled.div`
  position: relative;
  overflow-y: hidden !important;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
  .header {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: 10px;
  }
  .react-trello-board {
    background-color: transparent;
    height: 75vh !important;
    padding: 0;
    .react-trello-lane {
      position: relative;
      border-radius: 12px;
      border: 1px solid #d9d9d9;
      background-color: #ffffff;
      width: 260px;
      max-height: 70vh;
      & {
        width: 200px;
      }
      div:nth-child(2):not(div.smooth-dnd-draggable-wrapper) {
        margin-top: 45px;
        &::-webkit-scrollbar {
          width: 10px;
        }
        &::-webkit-scrollbar-track {
          background-color: #f6f6f6;
          border-radius: 3px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #d9d9d9;
          border-radius: 3px;

          &:hover {
            background-color: #999;
          }
        }
      }
      width: 12px;
      header {
        padding-bottom: 3px;
        margin-bottom: 5px;
        button {
          display: none;
        }
      }
      .lane_title {
        position: absolute;
        top: 0;
        left: 0;
        height: 48px;
        width: 100%;
        border-radius: 8px 8px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        border-bottom: 1px solid #d9d9d9;
      }
    }
    .react-trello-card {
      border-radius: 8px;
      border: 1px solid #d9d9d9;
      background-color: #f8f8f8;
      min-height: 70px;
      textarea {
        pointer-events: none !important;
        font-size: 14px;
        font-weight: 600;
        color: #006ffd;
      }
      span:nth-child(2) textarea {
        color: #000;
        text-align: left;
      }
      div {
        textarea {
          color: #888888;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
    .smooth-dnd-draggable-wrapper,
    .smooth-dnd-container {
      article {
        header {
          display: flex;
          flex-direction: column;
          span {
            width: 100%;
          }
          textarea {
          }
        }
        div {
          margin: 0 !important ;
          padding: 0 !important;
        }
      }
    }
  }
  .add-lane-form {
    border-radius: 12px;
    padding: 10px;
    width: 300px;
    background-color: #d9d9d9;
    .MuiInputBase-input {
      border: 1px solid #999;
      background-color: white;
    }
  }
  .filters {
    .MuiAutocomplete-root {
      position: relative;
    }
    margin-bottom: 1rem;
    label {
      position: absolute;
      top: -15px;
    }
  }
  .load-more {
    width: 100%;
    background-color: transparent !important;
    height: 30px;
  }
`;

export const OrderChangedStyled = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #f5f5f5;
  border-radius: 12px;
  margin-right: 18px;
  .MuiToggleButton-root {
    border-radius: 12px;
    &:last-child {
      background-color: #0f6fdf;
      border-radius: 12px !important;
      z-index: 2;
      transition: all 0.3s ease !important;

      &:hover {
        background-color: #0f6fdf;
      }
    }
    &:first-child {
      border: none;
      border-radius: 12px !important;
      transition: all 0.3s ease !important;

      &:hover {
        background-color: #0f6fdf;
      }
    }
  }
`;
