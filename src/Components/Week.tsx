//import { Card, Typography } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import "../App.css";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Paper, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { BasicTable } from "./BasicTable";
import {
	fill,
	useForceUpdate,
	randomFiller,
	fastForward,
} from "../Logic/Logic";
import { WeekObj } from "../Interfaces/Interfaces";
// import { allClasses } from "./Data";
import { texts } from "./UiText";
import { PosType } from "../types";
import solveWorker from "./solve.worker";
import { weekContext } from "./DataViewComponents/DataViewModel";
import { someHowPutHimAt } from "../Logic/CoreAlgo";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		paper: {
			padding: theme.spacing(2),
			textAlign: "center",
			color: theme.palette.text.secondary,
		},
		table: {
			minWidth: 650,
		},
	})
);
// const workerize = greenlet(heavyLoad);
export function WeekView(theme: any): JSX.Element {
	const classes = useStyles();
	const forceUpdate = useForceUpdate();

	// let WEEK_GLOBAL_Object: WeekObj = React.useRef(new WeekObj()).current;
	let WEEK_GLOBAL_Object: WeekObj = useContext(weekContext).week;
	WEEK_GLOBAL_Object.forceUpdate = forceUpdate;

	const handleChange = () => {
		return (Pos: PosType, m: number) => {
			return (event: React.ChangeEvent<{ value: unknown }>) => {
				let teacher: string = texts.NameMap[JSON.stringify(event.target.value)];
				console.clear();
				someHowPutHimAt(m, teacher, Pos, WEEK_GLOBAL_Object);
			}
		};
	};
	const initCell = (m: number) => {
		return (Pos: PosType) => {
			return (cellRefresher: any) => {
				if (WEEK_GLOBAL_Object.refreshTable !== undefined)
					WEEK_GLOBAL_Object.refreshTable[m][Pos[0]][Pos[1]] =
						cellRefresher;
			};
		};
	};
	const initTableFooter = (m: number) => {
		return (tableFooterfn: any) => {
			if (WEEK_GLOBAL_Object.tableFooterRefresher !== undefined)
				WEEK_GLOBAL_Object.tableFooterRefresher[m] = tableFooterfn;
		};
	};
	useEffect(
		() => {
			console.clear();
			WEEK_GLOBAL_Object.teacherScheduleInit();
			fill(WEEK_GLOBAL_Object);
			forceUpdate();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	return (
		<div className={classes.root}>
			<Button
				onClick={(e) => {
					fastForward(WEEK_GLOBAL_Object);
				}}
			>
				fast Forward
			</Button>
			<Button
				onClick={() => {
					randomFiller(WEEK_GLOBAL_Object);
					forceUpdate();
				}}
			>
				{texts.randomFillerButton}
			</Button>
			<Button
				onClick={async (e) => {
					if (window.Worker) {
						const data: any = JSON.stringify({
							...WEEK_GLOBAL_Object,
							refreshTable: undefined,
							forceUpdate: undefined,
							tableFooterRefresher: undefined,
						});
						const worker: Worker = new solveWorker();
						worker.postMessage(data);
						worker.onmessage = (event) => {
							const solved = JSON.parse(event.data);
							WEEK_GLOBAL_Object.allClasses = solved.allClasses;
							WEEK_GLOBAL_Object.teacherSchedule = solved.teacherSchedule;
							worker.terminate();
							forceUpdate();
						}
					} else {
						console.log("Your browser doesn't support web workers.");
					}
				}}
			>
				{texts.randomFillerButton}
				Worker Grand fill
			</Button>
			<Grid container spacing={0}>
				<Grid item xs={12}>
					{WEEK_GLOBAL_Object.allClasses.map((Class, i) => {
						return (
							<Paper key={i} className={classes.paper}>
								<BasicTable
									// theme = {props.theme}
									m={i}
									headCol={texts.headCol}
									headRow={texts.headRow}
									cellInitializer={initCell(i)}
									tableFooterInitializer={initTableFooter(i)}
									handleChange={handleChange()}
									WEEK_GLOBAL_Object={WEEK_GLOBAL_Object}
								/>
							</Paper>
						);
					})}
				</Grid>
			</Grid>
		</div>
	);
}
