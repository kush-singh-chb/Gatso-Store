import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#C8E6C9',
            main: '#4CAF50',
            dark: '#388E3C',
            contrastText: "#ffffff"
        },
        secondary: {
            main: '#FFEB3B',
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