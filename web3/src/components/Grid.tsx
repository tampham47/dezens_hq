import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1260px;
  width: calc(100% - 40px);
  margin-left: auto;
  margin-right: auto;

  .post-full {
    margin-top: 36px;
  }
`;

export const MobileWrapper = styled.div`
  margin-left: -16px;
  margin-right: -16px;

  @media screen and (min-width: 992px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

export const ScMain = styled.div`
  margin-top: 4px;
  margin-bottom: 2rem;

  @media screen and (min-width: 992px) {
    margin-top: 2rem;
    margin-bottom: 4rem;
  }
`;
