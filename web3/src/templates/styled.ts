import styled from "styled-components";

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
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
`;

export const ScHeaderWrapper = styled.div`
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3rem;
`;

export const ScHeader = styled.h1`
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  font-size: 24px;
  line-height: 1.2;
  margin-bottom: 12px;

  @media screen and (min-width: 992px) {
    font-size: 40px;
  }
`;

export const ScContent = styled.section`
  font-size: 20px;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);

  h2,
  h3 {
    font-size: 24px;
    font-weight: 500;
    margin-top: 2em;
    margin-bottom: 1em;
    line-height: 1.2;
    color: #f7f8f8;
  }

  h3 {
    font-size: 20px;
  }

  h4,
  h5 {
    font-size: 18px;
    font-weight: 500;
    margin-top: 2em;
    margin-bottom: 1em;
    line-height: 1.2;
    color: #f7f8f8;
  }

  h5 {
    font-size: 16px;
  }

  p {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2em;
  }

  img {
    width: 100%;
  }

  a {
    color: #bfff00;
  }

  table {
    thead {
      text-align: left;

      th {
        padding: 12px;
      }
    }

    tr td {
      padding: 12px;
    }
  }

  table,
  th,
  td {
    border: 1px solid gray;
    border-collapse: collapse;
  }
`;

export const ScAuthor = styled.div`
  font-size: 12px;
  > span {
    color: #868f97;
  }
`;
