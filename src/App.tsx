import React, { useRef } from "react";
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
import { weekContext, DataViewModel } from "./Components/DataViewComponents/DataViewModel";
import { useForceUpdate } from "./Logic/Logic";

const HomeScreen: Screen = Screen.TABLE;

function AppropriateScreen(UI: Screen): JSX.Element {
	switch (UI) {
		case Screen.ETA:
			return <TimeRemaining />;
		case Screen.TABLE:
			return <WeekView />;
		case Screen.DATAPARSER:
			return <DataParserView />;
	}
}

function Body(props: { UI: Screen, model: DataViewModel }): JSX.Element {
	return (<weekContext.Provider value={props.model}>
		{AppropriateScreen(props.UI)}
	</weekContext.Provider>)
}

function App(): JSX.Element {
	const [screen, setScreen] = React.useState(HomeScreen);
	const [dark, setDark] = React.useState(true);
	const reRender = useForceUpdate()

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
		texts.changeLanguage()
		reRender()
	};

	let theme = () => (dark ? { ...darkTheme } : { ...lightTheme });
	const model = useRef(new DataViewModel()).current;

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
				<div dir={texts.LangDirection}>
					<Body UI={screen} model={model} />
				</div>
			</ThemeProvider>
		</div>
	);
}

export default App;
