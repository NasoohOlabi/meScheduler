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
import {
	blowoutFunction,
	blowoutFunctionSetupType,
	callNodeType,
	coreAlgoWorkerAnswer,
	IActlistObj,
	ISomeHowPutHimAtWorkerMsg,
	IWeekData,
	WeekObj,
} from "../Interfaces/Interfaces";
// import { allClasses } from "./Data";
import { texts } from "./UiText";
import { PosType } from "../types";
import solveWorker from "../workers/solve.worker";
import { weekContext } from "./DataViewComponents/DataViewModel";
import { someHowPutHimAt } from "../Logic/CoreAlgo";
import coreAlgoWorker from "../workers/coreAlgo.worker";

const blowoutSetup: () => {
	fn: blowoutFunctionSetupType;
	workers: any[];
} = () => {
	const worker1: Worker = new coreAlgoWorker();
	const worker2: Worker = new coreAlgoWorker();
	const worker3: Worker = new coreAlgoWorker();
	const worker4: Worker = new coreAlgoWorker();
	const worker5: Worker = new coreAlgoWorker();

	const workers = [worker1, worker2, worker3, worker4, worker5];

	console.log("workers");
	console.log(workers);

	return {
		fn: (
			week: IWeekData,
			lst: callNodeType[],
			callBack: (msg: coreAlgoWorkerAnswer) => void
		) => {
			const chunckSize = Math.floor(lst.length / 5);
			const chunck1 = lst.slice(0, chunckSize);
			const chunck2 = lst.slice(chunckSize, chunckSize * 2);
			const chunck3 = lst.slice(chunckSize * 2, chunckSize * 3);
			const chunck4 = lst.slice(chunckSize * 3, chunckSize * 4);
			const chunck5 = lst.slice(chunckSize * 4, lst.length);
			const worker1msg: ISomeHowPutHimAtWorkerMsg = {
				week,
				nodes: chunck1,
				name: "worker1",
			};
			const worker2msg: ISomeHowPutHimAtWorkerMsg = {
				week,
				nodes: chunck2,
				name: "worker2",
			};
			const worker3msg: ISomeHowPutHimAtWorkerMsg = {
				week,
				nodes: chunck3,
				name: "worker3",
			};
			const worker4msg: ISomeHowPutHimAtWorkerMsg = {
				week,
				nodes: chunck4,
				name: "worker4",
			};
			const worker5msg: ISomeHowPutHimAtWorkerMsg = {
				week,
				nodes: chunck5,
				name: "worker5",
			};
			worker1.postMessage(JSON.stringify(worker1msg));
			worker2.postMessage(JSON.stringify(worker2msg));
			worker3.postMessage(JSON.stringify(worker3msg));
			worker4.postMessage(JSON.stringify(worker4msg));
			worker5.postMessage(JSON.stringify(worker5msg));
			worker1.onmessage = (event) => {
				callBack(JSON.parse(event.data));
			};
			worker2.onmessage = (event) => {
				callBack(JSON.parse(event.data));
			};
			worker3.onmessage = (event) => {
				callBack(JSON.parse(event.data));
			};
			worker4.onmessage = (event) => {
				callBack(JSON.parse(event.data));
			};
			worker5.onmessage = (event) => {
				callBack(JSON.parse(event.data));
			};
			console.log(`blowoutSetup is Done`);
		},
		workers,
	};
};

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
			if (!window.Worker) {
				console.log("Your browser doesn't support web workers.");
				return;
			}
			const data: any = {
				...WEEK_GLOBAL_Object,
				refreshTable: undefined,
				forceUpdate: undefined,
				tableFooterRefresher: undefined,
			};
			const week = data;
			const changeCellPost = (change: IActlistObj) => {
				const msg = { payload: change, type: "oneChange" };
				const [x, y] = msg.payload.Pos;
				const m = msg.payload.m;
				WEEK_GLOBAL_Object.allClasses[m].l[x][y].currentTeacher =
					msg.payload.teacher;
				WEEK_GLOBAL_Object.refreshTable[m][x][y]();
			};
			const iterativeSolutionPoster = (changes: IActlistObj[]) => {
				const msg = { payload: changes, type: "multipleChanges" };
				for (let i = 0; i < msg.payload.length; i++) {
					const [x, y] = msg.payload[i].Pos;
					const m = msg.payload[i].m;
					WEEK_GLOBAL_Object.allClasses[m].l[x][y].currentTeacher =
						msg.payload[i].teacher;
					WEEK_GLOBAL_Object.refreshTable[m][x][y]();
				}
			};
			// initiate 5 coreAlgo workers
			// create a function that takes a list of callNodeType and split it into 5
			// each worker will take a list of callNodeType and run the coreAlgo on it
			// the worker will post the result to the here and we'll validate the result
			// if the result is valid
			// then we'll shut down the workers
			// we'll post the result to the main thread
			// if the result is not valid
			// we'll just wait for a valid result
			const { fn: f, workers } = blowoutSetup();

			const g: blowoutFunction = (lst: callNodeType[]) =>
				f(week, lst, (msg: coreAlgoWorkerAnswer) => {
					console.log(`msg is`);
					console.log(msg);
				});

			randomFiller(week, changeCellPost);
			fastForward(week, iterativeSolutionPoster, g);
			// randomFiller(week);
			// fastForward(week);
			workers.forEach((worker) => worker.terminate());
			const msg = { payload: week, type: "Done" };
			console.log("Final post msg.payload = ", msg.payload);
			WEEK_GLOBAL_Object.allClasses = msg.payload.allClasses;
			WEEK_GLOBAL_Object.teacherSchedule = msg.payload.teacherSchedule;
			forceUpdate();
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
