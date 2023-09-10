import React from 'react';
import styled from 'styled-components';
import { EnumPoolType, PoolProps } from '../types';
import { generateTotalPrice } from '../utils';

const PoolWrapStyled = styled.div<{ type: string; disabled: boolean }>`
  height: 100%;
  .pool {
    background-color: #18191f;

    border: 0.2em #fff solid;
    border-color: ${({ type }) =>
      type === EnumPoolType.up ? '#92e204' : '#e02e2b'};
    border-radius: 0.8em;
    height: calc(100% - 6.4em);
    position: relative;
    .pool_header {
      border-radius: 0.65em 0.65em 0 0;
      padding: 1.15em 0.7em 0 0.2em;

      position: relative;
      border-bottom: ${(props) =>
        `solid 0.2em ${
          props.type === EnumPoolType.up ? '#92e204' : '#e02e2b'
        }`};

      .title {
        display: flex;
        justify-content: center;
        width: 100%;
        color: ${({ type }) =>
          type === EnumPoolType.up ? '#92e204' : '#e02e2b'};
        font-weight: bold;
        font-size: 1.1em;
        font-family: 'Barlow Semi Condensed';
        letter-spacing: -0.001em;
        text-transform: uppercase;
        opacity: 1;
      }
      .pool_size_player {
        display: flex;
        justify-content: space-between;
        flex-direction: ${({ type }) =>
          type === EnumPoolType.up ? 'row' : 'row-reverse'};
        .price {
          font-size: 3.2em;
          font-weight: 600;
          line-height: 1.1em;
          transition: all 0.2s;
          color: ${({ type }) =>
            type === EnumPoolType.up ? '#92e204' : '#e02e2b'};
        }
        .pool_player {
          color: ${({ type }) =>
            type === EnumPoolType.up ? '#92e204' : '#e02e2b'};
          .player {
            text-align: ${({ type }) =>
              type === EnumPoolType.up ? 'right' : 'left'};
            font-family: 'Barlow Semi Condensed';
            font-size: 1em;
            font-weight: 600;
          }
          .det_title {
            font-weight: 400;
            font-size: 0.7em;
            top: -0.1em;
            font-family: 'Source Sans Pro';
          }
        }
      }
    }
    .players {
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 5.9em);
      .scroll {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 0.6em 0.3em;
        .player_position {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;
          width: 32.5%;
          padding: 0.9vh 0;
          .user_avatar {
            width: 2.7em;
            height: 2.7em;
            border-radius: 50%;
            box-shadow: ${({ type }) =>
              `0 0 0 0.1em ${
                type === EnumPoolType.up ? '#92e204' : '#e02e2b'
              }`};
          }
          .country img {
            position: absolute;
            top: 0.3em;
            right: 0.6em;
            width: 1.1em;
            height: 1.1em;
          }
          .invest {
            margin-top: 0.5em;
            font-size: 1em;
            line-height: 1.6em;
            font-weight: 600;
            transition: color 0.5s;
            color: ${({ type }) =>
              type === EnumPoolType.up ? '#92e204' : '#e02e2b'};
          }
        }
      }
    }
  }
  .trade-btn {
    background-color: ${(props) =>
      props.type === EnumPoolType.up ? '#92e204' : '#e02e2b'};
    height: 4.8em;
    width: 100%;
    border-radius: 0.9em;
    padding-bottom: 1em;
    margin-top: 0.8em;
    box-shadow: 0 0.2em 0 #212121;
    position: relative;
    cursor: ${(props) => !props?.disabled && 'pointer'};
    ${(props) =>
      props?.disabled &&
      `
      opacity: .5;
      animation: .5s ease-out 0s 1 blink_fade_out;
      cursor: default;
    `}
    transition: padding-bottom 0.3s;
    .fill {
      img {
        width: 3.5em;
        height: 2.6em;
      }
      box-sizing: border-box;
      height: 100%;
      width: 100%;
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
    .hold_tooltip {
      font-size: 1em;
      font-family: 'Source Sans Pro';
      font-weight: bold;
      letter-spacing: 0.12em;
      line-height: 1.6em;
      height: 1.6em;
      overflow: hidden;
      text-align: center;
      transition: all 0.3s;
      opacity: 1;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      transform: scale(0.6);
      transform-origin: 50% 100%;
    }
  }

  @media screen and (max-width: 992px) {
    margin: 10px;
    flex: 1;
    .pool {
      .pool_header {
        display: none;
      }
      .players {
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% - 5.9em);
        .scroll {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          padding: 0.1em;
          .player_position {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: start;
            width: 32.5%;
            padding: 0.9vh 0;
            .user_avatar {
              width: 1em;
              height: 1em;
              border-radius: 50%;
              box-shadow: ${({ type }) =>
                `0 0 0 0.1em ${
                  type === EnumPoolType.up ? '#92e204' : '#e02e2b'
                }`};
            }
            .country img {
              display: none;
            }
            .invest {
              display: none;
            }
          }
        }
      }
    }
  }
`;

const Pool: React.FC<PoolProps> = ({
  data = [],
  type = 'up',
  disabled = false,
  onJoinPool,
}) => {
  return (
    <PoolWrapStyled type={type} disabled={disabled}>
      <div className="pool">
        <div className="pool_header">
          <div className="title">
            {EnumPoolType.up ? 'UP POOL TREASURY' : 'DOWN POOL TREASURY'}
          </div>
          <div className="pool_size_player">
            <div className="price">$ {generateTotalPrice(data)}</div>
            <div className="pool_player">
              <div className="det_title">Nguời chơi</div>
              <div className="player">{data?.length}</div>
            </div>
          </div>
        </div>
        <div className="players">
          <div className="scroll">
            {data?.length &&
              data?.map((item) => (
                <div className="player_position" key={item?.id}>
                  <img
                    className="user_avatar"
                    src="https://api.dicebear.com/5.x/open-peeps/svg?seed=ULtGApErg1bTAvqSGG&flip=true"
                  />
                  <div className="country">
                    <img src="https://upvsdown.com/media/images/flags/fi.svg" />
                  </div>
                  <div className="invest">
                    ${item?.betUpPrice ?? item?.betDownPrice}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div
        className="trade-btn"
        onClick={() => {
          if (!disabled) {
            onJoinPool(type);
          }
        }}
      >
        <div className="fill">
          <img
            src={`/images/game/${
              type === EnumPoolType.up ? 'arrow_up.png' : 'arrow_down.png'
            }`}
          />
        </div>
        <div className="hold_tooltip"></div>
      </div>
    </PoolWrapStyled>
  );
};

export const PoolTreasury = React.memo(Pool);
