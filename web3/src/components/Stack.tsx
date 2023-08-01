import styled from 'styled-components';

export const ScStack = styled.div`
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #fd8d14;
  }

  @media screen and (min-width: 960px) {
    display: flex;
    flex-direction: row-reverse;
  }
`;

export const ScStackMain = styled.div`
  flex: 2;
  background-color: #322653;
  color: #ffd2d7;
  padding: 24px;
  overflow: hidden;
  border-radius: 8px;
  margin-left: -16px;
  margin-right: -16px;
  margin-bottom: 4px;

  @media screen and (min-width: 960px) {
    margin-left: 0;
    margin-right: 0;
    border-radius: 16px;
    margin-bottom: 1rem;
  }
`;

export const ScStackAside = styled.div`
  flex: 5;
  background-color: #322653;
  color: #ffd2d7;
  padding: 24px;
  border-radius: 8px;
  margin-left: -16px;
  margin-right: -16px;
  margin-bottom: 4px;

  @media screen and (min-width: 960px) {
    margin-left: 0;
    margin-right: 0;
    border-radius: 16px;
    margin-bottom: 1rem;
    margin-right: 1rem;
  }
`;
