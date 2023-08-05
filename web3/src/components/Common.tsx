import styled from 'styled-components';

export const ScInfoList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media screen and (min-width: 960px) {
    max-width: 840px;
    margin-left: auto;
    margin-right: auto;
    justify-content: center;
  }
`;

export const ScInfoBlock = styled.div`
  margin-bottom: 2rem;
  width: 50%;

  @media screen and (min-width: 960px) {
    padding: 24px;
    width: 30%;
    margin-bottom: 0;
  }
`;
export const ScInfoValue = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`;
export const ScInfoLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
  opacity: 0.75;
`;

export const ScMessage = styled.p`
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  text-align: center;
`;

export const ScRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
`;

export const ScBlock = styled.div`
  margin-bottom: 2rem;
`;
