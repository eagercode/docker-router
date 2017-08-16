import 'normalize.css';
import 'typeface-roboto';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import registerServiceWorker from './registerServiceWorker';
import { getMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import { blue500 } from 'material-ui/styles/colors';
import App from './app/App';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blue500
    }
});

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <App/>
    </MuiThemeProvider>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
