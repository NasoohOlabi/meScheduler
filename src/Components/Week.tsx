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
import solveWorker from "../workers/solve.worker";
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

	const handleChange = (Pos: PosType, m: number) => {
		return (event: React.ChangeEvent<{ value: unknown }>) => {
			let teacher: string = texts.NameMap[event.target.value as string];
			console.clear();
			someHowPutHimAt(m, teacher, Pos, WEEK_GLOBAL_Object);
		}
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
			if (!window.Worker) {
				console.log("Your browser doesn't support web workers.");
				return
			}
			const data: any = JSON.stringify({
				...WEEK_GLOBAL_Object,
				refreshTable: undefined,
				forceUpdate: undefined,
				tableFooterRefresher: undefined,
			});
			const worker: Worker = new solveWorker();
			worker.postMessage(data);
			worker.onmessage = (event) => {
				const msg = event.data;
				try {

					if (msg.type === "oneChange") {
						const [x, y] = msg.payload.Pos
						const m = msg.payload.m
						WEEK_GLOBAL_Object.allClasses[m].l[x][y].currentTeacher = msg.payload.teacher
						WEEK_GLOBAL_Object.refreshTable[m][x][y]()
					}
					else if (msg.type === "multipleChanges") {
						for (let i = 0; i < event.data.payload.length; i++) {
							const [x, y] = msg.payload[i].Pos
							const m = msg.payload[i].m
							WEEK_GLOBAL_Object.allClasses[m].l[x][y].currentTeacher = msg.payload[i].teacher
							WEEK_GLOBAL_Object.refreshTable[m][x][y]()
						}
					}
					else {
						console.log('Final post msg.payload = ', msg.payload);
						WEEK_GLOBAL_Object.allClasses = msg.payload.allClasses;
						WEEK_GLOBAL_Object.teacherSchedule = msg.payload.teacherSchedule;
						worker.terminate();
						forceUpdate();
					}
				}
				catch {
					console.log(`unknown message error`, msg)
				}
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	return (
		<div className={classes.root}>
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
									handleChange={handleChange}
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
