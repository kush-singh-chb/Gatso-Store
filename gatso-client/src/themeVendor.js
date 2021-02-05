import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#59b5ef',
            main: '#1DA1F2',
            dark: '#2061bc',
            contrastText: "#ffffff"
        },
        secondary: {
            main: '#b39ddb',
            light: '#e6ceff',
            dark:'#836fa9'
        },
        spreadThis: {
            text: {
                main: '#FFFFFF',
                secondary: '#000000'
            },
            text_primary: {
                main: '#212121',
            },
            text_secondary: {
                main: '#757575',
            },
            divider: {
                main: '#BDBDBD',
            },
            error: {
                main: red.A400,
            },
            background: {
                default: '#fff',
            },
        }
    },
});

export default theme;