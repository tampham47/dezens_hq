import styled from 'styled-components';

export const ScContent = styled.section`
  font-size: 20px;
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  line-height: 1.6;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 3em;
    margin-bottom: 1.5em;
  }

  h2,
  h3 {
    font-weight: 500;
    line-height: 1.2;
    color: #f7f8f8;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
  }

  h4,
  h5 {
    font-weight: 500;
    line-height: 1.2;
    color: #f7f8f8;
  }

  h4 {
    font-size: 18px;
  }

  h5 {
    font-size: 16px;
  }

  p,
  ul {
    font-size: 18px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 1em;
    margin-bottom: 1em;
  }
  ul li {
    line-height: 1.6;
  }

  img {
    width: 100%;
  }

  a {
    color: #ff78c4;
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
