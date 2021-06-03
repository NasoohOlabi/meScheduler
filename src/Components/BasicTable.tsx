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
import {IClass,IWEEK_GLOBAL_Object} from './Week';
import Cell from "./TableCell";
import { useForceUpdate , Done} from "../Logic/Logic";

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


export interface IBasicTableProps {
  School : IClass[],
  m: number;
  handleChange : any,
  cellInitializer : any;
  headRow: string[],
  headCol : string[],
  WEEK_GLOBAL_Object:IWEEK_GLOBAL_Object
}

export function BasicTable(props: IBasicTableProps) {
    const classes = useStyles();
    const tableUpdate = useForceUpdate();
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell 
              component="th" 
              scope="row" 
              onClick={(event)=>{console.log(props.School[props.m]);console.log(props.WEEK_GLOBAL_Object);}}
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
                      handleChange={props.handleChange([index,jndex] , props.m )} 
                      WEEK_GLOBAL_Object={props.WEEK_GLOBAL_Object}
                     /> 
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {(props.WEEK_GLOBAL_Object.activateList.length>0)?((props.WEEK_GLOBAL_Object.activateList[0][0].m === props.m)?<table><tr><td>
          <Button onClick={(e : any)=>{if(props.WEEK_GLOBAL_Object.currentSolutionNumber >0) {props.WEEK_GLOBAL_Object.currentSolutionNumber--;tableUpdate();}}}>{"<"}</Button>
          </td> 
          <td>
            <Button onClick={(e : any)=>{if(props.WEEK_GLOBAL_Object.currentSolutionNumber <props.WEEK_GLOBAL_Object.activateList.length-1 ) {props.WEEK_GLOBAL_Object.currentSolutionNumber++;tableUpdate();}}}>{">"}</Button>
            </td>
            <td>
            <Button onClick={Done(props.School,props.m,props.WEEK_GLOBAL_Object)}>{"Done"}</Button>
            </td>
            </tr></table>:null):null}
      </TableContainer>
      
    );
  }