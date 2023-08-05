import styled from 'styled-components';

export const ScStack = styled.div`
  h3,
  h4 {
    margin-top: 0;
    margin-bottom: 1em;
    color: #7dd2f0;
  }

  @media screen and (min-width: 960px) {
    display: flex;
    flex-direction: row-reverse;
  }
`;

export const ScStackMain = styled.div`
  flex: 2;
  color: #ffd2d7;
  padding: 24px;
  overflow: hidden;
  border-radius: 4px;
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
  color: #ffd2d7;
  padding: 24px;
  border-radius: 4px;
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
