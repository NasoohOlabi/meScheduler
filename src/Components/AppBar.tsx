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

export default function MyAppBar(props: IMyAppBarProps) {
	const classes = useStyles();

	const { pwaInstall, supported, isInstalled } = useReactPWAInstall();

	const handleClick = () => {
		pwaInstall({
			title: "My Scheduler",
			logo: myLogo,
			features: (
				<ul>
					<li>Cool feature 1</li>
					<li>Cool feature 2</li>
					<li>Even cooler feature</li>
					<li>Works offline</li>
				</ul>
			),
			description:
				"This is a very good app that does a lot of useful stuff. ",
		})
			.then(() =>
				alert(
					"App installed successfully or instructions for install shown"
				)
			)
			.catch(() => alert("User opted out from installing"));
	};

	return (
		<ThemeProvider theme={props.theme}>
			<ReactPWAInstallProvider enableLogging>
				<AppBar position="static" color="primary">
					<Toolbar>
						<Box className={classes.title}>
							<Button
								onClick={props.switchToETA}
								color="inherit"
								size="large"
							>
								My Scheduler
							</Button>
						</Box>

						{supported() && !isInstalled() && (
							<Button
								onClick={handleClick}
								color="inherit"
								className={classes.menuButton}
							>
								Install
							</Button>
						)}

						<Button
							onClick={props.switchToDataParser}
							color="inherit"
							className={classes.menuButton}
						>
							{texts.DataViewBtn}
						</Button>
						<Button
							onClick={props.switchToTable}
							color="inherit"
							className={classes.menuButton}
						>
							{texts.WeekBtn}
						</Button>

						<IconButton
							onClick={props.toggleTheme}
							color="inherit"
							className={classes.menuIcon}
						>
							{!props.darkThemed ? (
								<Brightness5Icon />
							) : (
								<Brightness3Icon />
							)}
						</IconButton>
						<IconButton
							onClick={props.toggleLang}
							color="inherit"
							className={classes.menuIcon}
						>
							<LanguageIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
			</ReactPWAInstallProvider>
		</ThemeProvider>
	);
}
//<Brightness5Icon />
