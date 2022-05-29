import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import { ThemeProvider } from "@material-ui/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import ReactPWAInstallProvider, { useReactPWAInstall } from "react-pwa-install";
import myLogo from "./Square71x71Logo.scale-200.png";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import LanguageIcon from "@material-ui/icons/Language";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import { IMyAppBarProps } from "../Interfaces/Interfaces";
import { texts } from "./UiText";

//import { Banner, StaticBanner } from 'material-ui-banner';
/*
export function InstallBanner() : JSX.Element {
    return (
        <StaticBanner/>
    );
}
*/

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(0),
		},
		menuIcon: {
			marginRight: theme.spacing(0),
		},
		title: {
			marginLeft: theme.spacing(-1),
			flexGrow: 1,
		},
	})
);

export default function MyAppBar(props: { Solve: () => void }): JSX.Element {
	const classes = useStyles();

	return (
		<AppBar position="static" color="secondary">
			<Toolbar>
				<Box className={classes.title}>
					<Button
						// onClick={props.switchToETA}
						color="inherit"
						size="large"
					>
						{"<-"}
					</Button>
				</Box>

				<Button
					onClick={props.Solve}
					color="inherit"
					className={classes.menuButton}
				>
					{texts.Solve}
				</Button>
			</Toolbar>
		</AppBar>
	);
}
//<Brightness5Icon />
