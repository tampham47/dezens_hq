import React from 'react';
import styled from 'styled-components';
import { EnumPoolType, IHistoryProps } from '../types';

const HistoryStyled = styled.div<{ type: string }>`
  margin-right: 10px;
  margin-bottom: 10px;
  .fill {
    width: 3.84em;
    height: 2.1em;
    img {
      width: 12px;
      height: 9px;
    }
    box-sizing: border-box;
    border-radius: 0.9em;
    border: #fff solid 0.1em;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-position 0, box-shadow 0.2s;
    ${(props) =>
      props.type === EnumPoolType.up
        ? `background-color: #92e204;
            background: linear-gradient(90deg, #548708 34%, #92e204 34.01%);
            background-size: 300% 100%;
            background-position: 100% 0;
            border-color: #b2f939;
            border-width: 0.15em;
            box-shadow: 0 6 rgba(179,249,57,0) inset;
            `
        : `
          background-color: #e02e2b;
          background: linear-gradient(90deg, #891d1d 34%, #e02e2b 34.01%);
          background-size: 300% 100%;
          background-position: 100% 0;
          border-color: #f96161;
          border-width: 0.15em;
          box-shadow: 0 20vh rgba(249,97,97,0) inset;
          `}
  }
  @media screen and (max-width: 992px) {
    margin: 0px;
    .fill {
      width: 1.84em;
      height: 1%.5;
      img {
        width: 8px;
        height: 6px;
      }
    }
  }
`;

const History: React.FC<IHistoryProps> = ({ type }) => {
  return (
    <HistoryStyled type={type}>
      <div className="fill">
        <img
          src={`/images/game/${
            type === EnumPoolType.up ? 'arrow_up.png' : 'arrow_down.png'
          }`}
        />
      </div>
    </HistoryStyled>
  );
};

export { History };
