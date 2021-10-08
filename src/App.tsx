import React from "react";
import "./App.css";
import { TimeRemaining } from "./ETAScreen";
import MyAppBar from "./Components/AppBar";
import { lightTheme, darkTheme } from "./theme/themes";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import ReactPWAInstallProvider from "react-pwa-install";
import { WeekView } from "./Components/Week";
import { DataParserView } from "./DataParserView";
import { Screen } from "./Interfaces/Interfaces";
import { texts } from "./Components/UiText";

const HomeScreen: Screen = Screen.DATAPARSER;

function Body(props: { UI: Screen }): JSX.Element {
	switch (props.UI) {
		case Screen.ETA:
			return <TimeRemaining />;
		case Screen.TABLE:
			return <WeekView />;
		case Screen.DATAPARSER:
			return <DataParserView />;
	}
}

function App(): JSX.Element {
	const [screen, setScreen] = React.useState(HomeScreen);
	const [dark, setDark] = React.useState(true);
	const [lang, setLang] = React.useState(texts.LangDirection);
	const switchViewTo =
		(s: "ETA" | "TABLE" | "DATAPARASER") => (event: any) => {
			switch (s) {
				case "ETA":
					setScreen(Screen.ETA);
					break;
				case "TABLE":
					setScreen(Screen.TABLE);
					break;
				case "DATAPARASER":
					setScreen(Screen.DATAPARSER);
					break;
			}
		};

	const toggleTheme = (event: any) => {
		setDark(!dark);
	};
	const toggleLang = (event: any) => {
		if (lang === "ltr") {
			setLang("rtl");
		} else {
			setLang("ltr");
		}
	};

	let theme = () => (dark ? { ...darkTheme } : { ...lightTheme });

	return (
		<div>
			<ThemeProvider theme={theme()}>
				<CssBaseline />
				<ReactPWAInstallProvider enableLogging>
					<MyAppBar
						theme={theme()}
						UI={screen}
						toggleTheme={toggleTheme}
						darkThemed={dark}
						switchToTable={switchViewTo("TABLE")}
						switchToETA={switchViewTo("ETA")}
						switchToDataParser={switchViewTo("DATAPARASER")}
						toggleLang={toggleLang}
					/>
				</ReactPWAInstallProvider>
				<div dir={lang}>
					<Body UI={screen} />
				</div>
			</ThemeProvider>
		</div>
	);
}

export default App;
