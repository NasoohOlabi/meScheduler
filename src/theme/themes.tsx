import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import { red } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";
import { texts } from "../Components/UiText";

export const darkTheme = createTheme({
	direction: texts.LangDirection,
	palette: {
		type: "dark",
		primary: {
			main: green[500],
		},
		secondary: {
			main: red[500],
		},
	},
});
export const lightTheme = createTheme({
	direction: texts.LangDirection,
	palette: {
		primary: {
			main: purple[500],
		},
		secondary: {
			main: green[500],
		},
	},
});
