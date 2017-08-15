import 'typeface-roboto';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import registerServiceWorker from './registerServiceWorker';
import { getMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import App from './app/App';

injectTapEventPlugin();

const muiTheme = getMuiTheme({});

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <App/>
    </MuiThemeProvider>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
