import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import { red } from "@material-ui/core/colors";

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: green[500]
    },
    secondary: {
      main: red[500]
    }
  }
});
export const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500]
    },
    secondary: {
      main: green[500]
    }
  }
});