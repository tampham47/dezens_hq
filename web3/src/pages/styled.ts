import styled from 'styled-components';

export const ScMain = styled.div`
  color: #232129;
  font-family: -apple-system, Roboto, sans-serif, serif;
`;

export const ScContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1em 0.8em 0.8em;
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 4.6em);
  height: calc(100dvh - 4.6em);
  .pool_mobile {
    display: none;
  }
  @media screen and (max-width: 992px) {
    display: block;

    .pool_mobile {
      display: flex;
    }
  }
`;
export const ScContentPool = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  @media screen and (max-width: 992px) {
    display: none;
  }
`;

export const ScChart = styled.div`
  width: 57.5%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .stats {
    height: 5.4em;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    top: -0.1em;

    .blank {
      width: 10.5em;
    }
  }
  .graph_area {
    height: calc(100% - 10.2em);
    border-radius: 0.75em;
    border: solid 0.1em rgba(244, 213, 111, 0.56);
    box-shadow: 0 100vh 0 rgba(0, 0, 0, 0.56) inset;
    position: relative;
    overflow: hidden;
    .history_graph {
      height: calc(100%);
      width: 100%;
      position: relative;
      z-index: 1;
    }
    .last_result {
      position: absolute;
      bottom: 0.6em;
      right: 0.9em;
      left: 1.2em;
      padding: 0;
      z-index: 2;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }
  }
  .invest_select {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 1.1em;
  }
  @media screen and (max-width: 992px) {
    width: 100%;
    margin: auto;
    transition: width all 200ms;
    .stats {
      height: auto;
    }
  }
`;
export const ScContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  overflow: scroll;
`;
