import React from "react";
import "../App.css";
import { useForceUpdate } from "../Logic/Logic";
import { equals } from "../Logic/util";
import TableCell from "@material-ui/core/TableCell";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { ICell } from "../Interfaces/Interfaces";
import { createStyles, makeStyles } from "@material-ui/core";
import { texts } from "./UiText";

const useStyles = makeStyles((theme: any) =>
	createStyles({
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120,
		},
		selectEmpty: {
			marginTop: theme.spacing(2),
		},
		highlighted: {
			font: theme.secondary,
		},
	})
);

export function UnmemCell(props: ICell): JSX.Element {
	const classes = useStyles();
	const week = props.WEEK_GLOBAL_Object;
	const [X, Y] = props.Pos
	const cellData = props.WEEK_GLOBAL_Object.allClasses[props.m].l[X][Y];

	const refreshCell = useForceUpdate();
	React.useEffect(
		() => {
			props.cellInitializer(refreshCell);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const cell = (D: boolean, show: string, highlight = false): JSX.Element => {
		const TeacherOptionsDropDown: string[] =
			cellData.Options.map((t: string) => {
				return texts.NameMap[t];
			});
		const displayTeacherName = texts.NameMap[show]
		return (
			<TableCell align="center">
				<FormControl>
					<InputLabel id="demo-simple-select-label"></InputLabel>
					<Select
						disabled={D}
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={displayTeacherName}
						onChange={props.handleChange}
						onMouseOver={refreshCell}
						className={highlight ? classes.highlighted : ""}
						error={highlight}
					>
						{TeacherOptionsDropDown &&
							TeacherOptionsDropDown.map((teachersName: string, index) => {
								return (
									<MenuItem value={teachersName} key={index}>
										{teachersName}
									</MenuItem>
								);
							})}
					</Select>
				</FormControl>
			</TableCell>
		);
	};

	if (cellData.isCemented) {
		return cell(true, cellData.currentTeacher);
	}

	if (week.Swapping) {
		const i = week.currentSolutionNumber;
		for (
			let j = 0;
			week.activateList[i] && j < week.activateList[i].length;
			j++
		) {
			if (
				equals(props.Pos, week.activateList[i][j].Pos) &&
				props.m === week.activateList[i][j].m
			) {
				return cell(true, week.activateList[i][j].teacher, true);
			}
		}
		return cell(true, cellData.currentTeacher);
	} else {
		return cell(false, cellData.currentTeacher);
	}
}

export const Cell = React.memo(UnmemCell);
