import React from "react";
import "../App.css";
import {useForceUpdate} from "../Logic/Logic";
import {equals} from "../Logic/util";
import TableCell from "@material-ui/core/TableCell";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { ICell } from "../Interfaces/Interfaces";
import { createStyles, makeStyles } from "@material-ui/core";


const useStyles = makeStyles((theme: any) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
	highlighted:{
		font : theme.secondary
	}
  }),
);



export function UnmemCell (props : ICell) : JSX.Element{
		const classes = useStyles()
		const week = props.WEEK_GLOBAL_Object;
		// const classes = useStyles();
		// const [More , setMore] = React.useState(false);
		// const tug = ()=>{
		// 	setMore(!More);
		// }
		const refreshCell = useForceUpdate();
		React.useEffect(()=>{
			props.cellInitializer( refreshCell);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
		);

		const cell = (D:boolean , show:string,highlight = false) :JSX.Element=>{
			let ActList : string[] =[];
			// if (show==='' && !More){
			// 	ActList = actualOptions(props.Pos,props.m,props.WEEK_GLOBAL_Object,"filtered");
			// }
			// else{
				ActList = props.WEEK_GLOBAL_Object.allClasses[props.m].l[props.Pos[0]][props.Pos[1]].Options;
			// }
			// console.log(ActList);
			return(
				<TableCell align="center">
						<FormControl>
							<InputLabel id="demo-simple-select-label"></InputLabel>
							<Select
								disabled ={D}
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={show}
								onChange={props.handleChange}
								onMouseOver = {refreshCell}
								className = {((highlight)?classes.highlighted:'')}
								error = {highlight}
							>
								{ActList && ActList.map(
									(teachersName: string,index) => {
										return (
											<MenuItem value={teachersName} key = {index}>
												{teachersName}
											</MenuItem>
										);
									}
								)
								}
							</Select>
						</FormControl>
				</TableCell>
			);
		}

		if(props.data.isCemented){
			return (
				cell(true,props.data.currentTeacher)
			);
		}
		
		if(week.Swaping){
			const i = week.currentSolutionNumber;
			for(let j= 0 ; week.activateList[i] && j<week.activateList[i].length;j++){
				if (equals(props.Pos , week.activateList[i][j].Pos) && props.m === week.activateList[i][j].m){          
					return(
						cell(true,week.activateList[i][j].teacher,true)
					);
				}
			}
			return (
				cell(true,props.data.currentTeacher)
			);
		}
		else{
			return (
				cell(false,props.data.currentTeacher)
			);
		}

};


export const Cell = React.memo(UnmemCell)






// {/* <MenuItem>{(!More)?<Button onClick={tug}>More</Button>:<Button onClick={tug}>Less</Button>}</MenuItem> */}









//import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
//import Table from "@material-ui/core/Table";
//import TableBody from "@material-ui/core/TableBody";
//import TableContainer from "@material-ui/core/TableContainer";
//import TableHead from "@material-ui/core/TableHead";
//import TableRow from "@material-ui/core/TableRow";
//import Paper from "@material-ui/core/Paper";
//import Grid from "@material-ui/core/Grid";
//import FormHelperText from "@material-ui/core/FormHelperText";
//import {IClass , useForceUpdate} from './Week';