//import { Card, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import "../App.css";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Paper, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { BasicTable } from "./BasicTable";
import {
	fill,
	SwitchEventHander,
	useForceUpdate,
	teacherScheduleInit,
	randomFiller,
	fastForward,
} from "../Logic/Logic";
import { emptyNumMatrix } from "../Logic/util";
import { IClass, IWEEK_GLOBAL_Object } from "../Interfaces/Interfaces";
import greenlet from "greenlet";
import { allClasses, teachersGuild, availables } from "./Data";
import { texts } from "./UiText";
import { heavyLoad } from "./worker/worker";
//sth##########################################################################################################

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

const addPeriods = (allClasses: IClass[]) => {
	allClasses.forEach((clas: IClass) => {
		Object.keys(clas.teachers).forEach((teacher) => {
			clas.teachers[teacher].Periods = clas.teachers[teacher].remPeriods;
		});
	});
};

const workerize = greenlet(heavyLoad);
export function WeekView(theme: any): JSX.Element {
	const classes = useStyles();
	const forceUpdate = useForceUpdate();
	//initializing with nums works because you can't triger the switchEventHandler unless all Cells has mounted thus refreshTable becomes a (()=>void)[][][]
	const refreshTable = React.useRef(
		emptyNumMatrix(
			allClasses.length,
			allClasses[0].l.length,
			allClasses[0].l[0].length
		)
	).current;
	let WEEK_GLOBAL_Object: IWEEK_GLOBAL_Object = React.useRef({
		allClasses,
		teachersGuild,
		refreshTable,
		forceUpdate,
		Swaping: false,
		currentSolutionNumber: 0,
		activateList: [],
		tableFooterRefresher: [],
		availables,
		teacherSchedule: {},
	}).current;
	const handleChange = () => {
		return (Pos: [number, number], m: number) => {
			return SwitchEventHander(
				Pos,
				m,
				teachersGuild,
				WEEK_GLOBAL_Object
			);
		};
	};

	const initCell = (m: number) => {
		return (Pos: [number, number]) => {
			return (cellRefresher: any) => {
				if (WEEK_GLOBAL_Object.refreshTable !== undefined)
					WEEK_GLOBAL_Object.refreshTable[m][Pos[0]][Pos[1]] = cellRefresher;
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
			addPeriods(WEEK_GLOBAL_Object.allClasses);
			teacherScheduleInit(WEEK_GLOBAL_Object, availables);
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
				randomFiller
			</Button>
			<Button
				onClick={async (e) => {
					if (window.Worker) {
						// else
						//   let getName = greenlet( async username => {
						//     let url = `https://api.github.com/users/${username}`
						//     let res = await fetch(url)
						//     let profile = await res.json()
						//     return profile.name
						// })
						// console.log(await getName('developit'))
						const data : any= JSON.stringify({
							...WEEK_GLOBAL_Object,
							refreshTable: undefined,
							forceUpdate: undefined,
							tableFooterRefresher: undefined,
						})
						const solved = JSON.parse(await workerize(data));
						WEEK_GLOBAL_Object.allClasses = solved.allClasses;
						WEEK_GLOBAL_Object.teacherSchedule = solved.teacherSchedule;
						forceUpdate();
					} else {
						console.log("Your browser doesn't support web workers.");
					}
				}}
			>
				Worker Grand fill
			</Button>
			<Grid container spacing={0}>
				<Grid item xs={12}>
					{allClasses.map((Class, i) => {
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
