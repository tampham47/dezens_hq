import React from "react";
import { createGlobalStyle } from "styled-components";
import { Helmet } from "react-helmet";

import { Footer } from "./Footer";
import { NavBar } from "./NavBar";

import "../css/normalize.css";

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
  }

  body {
    font-family: "Inter", sans-serif;
    font-size: 1rem;
    line-height: 1.5em;
    font-weight: 400;
    font-style: normal;
    letter-spacing: 0;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    background-color: #0B0B0F;
    color: white;
    overflow-x: hidden;
  }

  * {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "Inter", sans-serif;
  }

  audio,
  canvas,
  iframe,
  img,
  svg,
  video {
    vertical-align: middle;
  }

  a {
    text-decoration: none;
    color: white;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const name = "Gatsby";
  const title = "Gatsby Starter Blog";
  const description = "A starter blog demonstrating what Gatsby can do.";
  const link = "example.com";

  return (
    <main>
      <Helmet>
        <meta charSet="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>{title}</title>

        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="description" content={description} />

        <meta property="og:site_name" content={name} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={name} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={link} />
        <meta property="og:image" content="/tw-social.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={name} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:url" content={link} />
        <meta name="twitter:image" content="/tw-social.png" />
        <meta name="twitter:site" content={name} />
        <meta property="og:image:width" content="1500" />
        <meta property="og:image:height" content="500" />
      </Helmet>
      <GlobalStyle />

      <NavBar />
      {children}
      <Footer />
    </main>
  );
};
