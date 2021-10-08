/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from "react";
import "./App.css";
import { WeekObj } from "./Interfaces/Interfaces";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
	createStyles,
	IconButton,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
} from "@material-ui/core";
import { texts } from "./Components/UiText";
import AddIcon from "@material-ui/icons/Add";
import ClassObj from "./Interfaces/ClassObj";
import { useForceUpdate } from "./Logic/Logic";

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
		cell: {
			textAlign: "inherit",
		},
		table: {
			textAlign: texts.LangDirection === "ltr" ? "left" : "right",
			width: "fit-content",
			alignContent: "center",
		},
		TableContainer: {
			alignItems: "center",
		},
	})
);
function ClassTeacherInputTableRows(num: number) {
	const classes = useStyles();
	const week = useContext(weekContext);
	const teachersDict: JSX.Element[] = React.useRef([]).current;
	const tmpJSX = () => (
		<TableRow>
			<TableCell className={classes.cell}>{texts.teacherName} :</TableCell>
			<TableCell className={classes.cell} align="center">
				<TextField required id="standard-required" />
			</TableCell>
		</TableRow>
	);
	while (teachersDict.length >= num) {
		teachersDict.push(tmpJSX());
	}

	return (
		<Table className={classes.table} aria-label="simple table">
			{teachersDict}
		</Table>
	);
}
const MemoClassTeachersInputTRows = React.memo(ClassTeacherInputTableRows);

function TeacherSchedulePorter(): JSX.Element {
	return <p>Gotcha!!</p>;
}

function Classporter(props: { Class: ClassObj }) {
	const classes = useStyles();
	const [TeachersNum, setTeachersNum] = React.useState(0);
	const addClassTeacherInput = (e: any) => {
		setTeachersNum(TeachersNum + 1);
	};
	const teachersCount = React.useRef({ n: 0 }).current;
	return (
		<Table className={classes.table} aria-label="simple table">
			<TableHead>
				<TableRow>
					<TableCell className={classes.cell} component="th" scope="row">
						<Typography>{texts.classGroupName} :</Typography>
					</TableCell>
					<TableCell className={classes.cell} align="center">
						<TextField required id="standard-required" />
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				<TableRow>
					<TableCell className={classes.cell} component="th" scope="row">
						{texts.classTeachers}
						<IconButton color="inherit" onClick={addClassTeacherInput}>
							<AddIcon />
						</IconButton>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
function ClassesPorter(): JSX.Element {
	const classes = useStyles();
	const forceUpdate = useForceUpdate();
	const week = React.useContext(weekContext);
	const allClasses = week.allClasses;
	const addClass = (event: any) => {
		allClasses.push(new ClassObj());
		forceUpdate();
	};
	return (
		<Paper className={classes.paper}>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell className={classes.cell}>
								<Typography display="inline">
									{texts.addClass}
								</Typography>
								<IconButton color="inherit" onClick={addClass}>
									<AddIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{allClasses.map((Class, index) => (
							<TableRow>
								<Classporter Class={Class} key={index} />
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}

const weekContext = React.createContext(new WeekObj());

export function DataParserView(): JSX.Element {
	const week = useContext(weekContext);
	return (
		<weekContext.Provider value={week}>
			<ClassesPorter />
			{/* <Classporter Class={new ClassObj()} /> */}
			<TeacherSchedulePorter />
		</weekContext.Provider>
	);
}
