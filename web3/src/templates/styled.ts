import styled from 'styled-components';
import { ScContent } from '../components/Content';

export { ScContent };

export const ScMain = styled.div`
  margin-top: 2rem;
  margin-bottom: 4rem;
  position: relative;

  @media screen and (min-width: 992px) {
    margin-top: 80px;
    margin-bottom: 10rem;
  }
`;

export const ScCategoryText = styled.div`
  font-size: 14px;
  color: #868f97;
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
`;

export const ScHeaderWrapper = styled.div`
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3rem;
`;

export const ScHeader = styled.h1`
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  font-size: 24px;
  line-height: 1.2;
  margin-bottom: 12px;

  @media screen and (min-width: 992px) {
    font-size: 40px;
  }
`;

export const ScAuthor = styled.div`
  font-size: 12px;
  > span {
    color: #868f97;
  }
`;
