import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto'
import { SnackbarProvider } from 'notistack';

import App from './App';

import * as serviceWorker from './serviceWorker';

import { ThemeProvider, CssBaseline, createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import { deepPurple, purple, blue, deepOrange, grey, blueGrey, yellow, amber, orange, indigo, green } from '@material-ui/core/colors';

let theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: '#47c7f0',
    }
  }
});

theme = responsiveFontSizes(theme);

ReactDOM.render(  
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <CssBaseline/>

      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </ThemeProvider>
    
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
