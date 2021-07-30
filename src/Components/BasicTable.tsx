//import { Card, Typography } from "@material-ui/core";
import React from "react";
import "../App.css";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Button, Paper } from '@material-ui/core';
//import Grid from "@material-ui/core/Grid";
//import InputLabel from "@material-ui/core/InputLabel";
//import MenuItem from "@material-ui/core/MenuItem";
//import FormHelperText from "@material-ui/core/FormHelperText";
//import FormControl from "@material-ui/core/FormControl";
//import Select from "@material-ui/core/Select";
import {Cell} from "./TableCell";
import {Done} from "../Logic/CoreAlgo";
import { IBasicTableProps } from "../Interfaces/Interfaces";

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




export function BasicTable(props: IBasicTableProps) {
    const week = props.WEEK_GLOBAL_Object;
    const classes = useStyles();
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell 
              component="th" 
              scope="row" 
              onClick={(event)=>{console.log(props.School[props.m]);console.log(week);}}
              >
                {" "}
                {props.School[props.m].Name}{" "}
              </TableCell>
              {props.headRow.map((x , c) => {
                return <TableCell key ={c} align="center">{x}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.headCol.map((day, index) => {
              return (
                <TableRow key={index}>
                  <TableCell component="th" scope="row"> {" "}{day}{" "} </TableCell>
                  {props.School[props.m].l[index].map((d, jndex) => {
                    return (
                      <Cell 
                      key={`${[index , jndex]}`} 
                      cellInitializer = {props.cellInitializer([index,jndex])}
                      data = {props.School[props.m].l[index][jndex]} 
                      Pos={[index,jndex]} 
                      m={props.m}
                      teacher={week.allClasses[props.m].l[index][jndex].currentTeacher}
                      handleChange={props.handleChange([index,jndex] , props.m )} 
                      WEEK_GLOBAL_Object={week}
                     /> 
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {(week.Swaping)?((week.activateList.length>0)?((week.activateList[0][0].m === props.m)?<table><tr><td>
          <Button onClick={(e : any)=>{if(week.currentSolutionNumber >0) {week.currentSolutionNumber--;week.forceUpdate();}}}>{"<"}</Button>
          </td> 
          <td>{week.currentSolutionNumber}/{week.activateList.length}</td>
          <td>
            <Button onClick={(e : any)=>{if(week.currentSolutionNumber <week.activateList.length-1 ) {week.currentSolutionNumber++;week.forceUpdate();}}}>{">"}</Button>
            </td>
            <td>
            <Button onClick={Done(props.m,week)}>{"Done"}</Button>
            </td>
            </tr></table>:null):<p>No Solutions!</p>):null}
      </TableContainer>
      
    );
  }