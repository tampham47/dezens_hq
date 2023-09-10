import React, { useEffect } from 'react';
import styled from 'styled-components';
import { EnumPoolType, StatsProps } from '../types';

const StatsStyled = styled.div<{ type: string }>`
  display: flex;
  flex-direction: ${({ type }) =>
    type === EnumPoolType.up ? 'row' : 'row-reverse'};
  position: relative;

  .pool_payout {
    text-align: center;
    .title {
      color: #fff;
      font-weight: 500;
      opacity: 0.7;
      font-size: 1em;
      padding: 0 1.5em;
      box-sizing: border-box;
      letter-spacing: 0.11em;
    }
    .amount {
      color: ${({ type }) =>
        type === EnumPoolType.up ? '#92e204' : '#e02e2b'};
      font-size: 2.6em;
      font-weight: 600;
      line-height: 1.05em;
      .sign {
        font-size: 0.53em;
        vertical-align: top;
        position: relative;
        top: -0.1em;
      }
    }
  }

  .payments {
    .title {
      opacity: 0.7;
      color: #fff;
      font-family: 'Source Sans Pro';
      font-size: 0.9em;
      font-weight: 400;
      letter-spacing: 0.089em;
      line-height: 1em;
      margin: -0.25em 0;
      width: 200%;
      transform-origin: 0 50%;
      transform: scale(0.5);
    }
    .amount {
      font-size: 1em;
      line-height: 0.9em;
      font-weight: 500;
      color: #f4d56f;
      transition: all 1s;
      text-shadow: 0 0 0 rgba(244, 213, 111, 0), 0 0 0 rgba(244, 213, 111, 0);
    }
    .large_txt {
      font-size: 1.5em;
    }
    .mb-10 {
      margin-bottom: 1em;
    }
  }

  @media screen and (max-width: 992px) {
    .pool_payout {
      flex: 1;
      .title {
        font-size: 0.4em;
        padding: 0px;
        letter-spacing: 0em;
      }
      .amount {
        font-size: 2em;
      }
    }
    .payments {
      margin-right: ${({ type }) => (type === EnumPoolType.up ? '5px' : '0px')};
      margin-left: ${({ type }) => (type === EnumPoolType.up ? '0px' : '5px')};
      .title {
        font-size: 0.5em;
      }
      .amount {
        font-size: 0.7em;
      }
      .large_txt {
        font-size: 1em;
      }
    }
  }
`;

const Statistics: React.FC<StatsProps> = ({
  type = 'up',
  betPrice = 5,
  callback,
  percent = 200,
}) => {
  useEffect(() => {
    if (type) {
      callback?.(type);
    }
  }, [type]);

  return (
    <StatsStyled type={type}>
      <div className="payments">
        <div className="title">Đầu tư của bạn</div>
        <div className="amount mb-10">${betPrice}</div>
        <div className="title">Có tiềm năng</div>
        <div className="amount large_txt">${(betPrice * percent) / 100}</div>
      </div>
      <div className="pool_payout">
        <div className="title">
          {type === EnumPoolType.up ? 'UP POOL PAYOUT' : 'DOWN POOL PAYOUT'}
        </div>
        <div className="amount">
          {percent}
          <span className="sign">%</span>
        </div>
      </div>
    </StatsStyled>
  );
};

export { Statistics };
