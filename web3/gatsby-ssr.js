import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStylesServer, ServerStyles } from '@mantine/ssr';

// optional: you can provide your cache as a first argument in createStylesServer function
const stylesServer = createStylesServer();

export const replaceRenderer = ({ bodyComponent, replaceBodyHTMLString, setHeadComponents }) => {
  const html = renderToString(bodyComponent);
  setHeadComponents([<ServerStyles html={html} server={stylesServer} />]);
  replaceBodyHTMLString(html);
};