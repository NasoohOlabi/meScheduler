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
import {useForceUpdate} from "../Logic/Logic";
import { IBasicTableProps , IActlistObj , ITableFooter} from "../Interfaces/Interfaces";

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


function TableFooter (props: ITableFooter ) {
  const week = props.WEEK_GLOBAL_Object;
  const ms : number[] = [];
  if (week.activateList[week.currentSolutionNumber])
  week.activateList[week.currentSolutionNumber].forEach((step)=>{
    let in_ms = false;
    for(let i = 0 ; i < ms.length ; i++){
      if(ms[i] === step.m){
        in_ms = true;
        break;
      }
    }
    if ( !in_ms ){
      ms.push(step.m);
    }
  });
  const tableFooterfn = useForceUpdate();
  React.useEffect(()=>{
    props.tableFooterInitializer( tableFooterfn );
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []
  );
  return (<div>{(week.Swaping)?((week.activateList.length>0)?((ms.includes(props.m))?<table><tr><td>
    <Button onClick={
      (e : any)=>{
        if(week.currentSolutionNumber >0) {
          week.currentSolutionNumber--;
          // week.forceUpdate();
          const sol1 = week.activateList[week.currentSolutionNumber + 1];
          const sol2 = week.activateList[week.currentSolutionNumber];
          if (sol1)
          sol1.forEach((step : IActlistObj)=>{
            week.refreshTable[step.m][step.Pos[0]][step.Pos[1]]()
          })
          if (sol2)
          sol2.forEach((step : IActlistObj)=>{
            week.refreshTable[step.m][step.Pos[0]][step.Pos[1]]()
          })
          week.tableFooterRefresher.forEach((tfr : any)=>{
            tfr();
          })
        }
      }
    }>{"<"}</Button>
    </td> 
    <td>{week.currentSolutionNumber+1}/{week.activateList.length}</td>
    <td>
      <Button onClick={
        (e : any)=>{
          if(week.currentSolutionNumber <week.activateList.length-1 ) {
            week.currentSolutionNumber++;
            const sol1 = week.activateList[week.currentSolutionNumber - 1];
            const sol2 = week.activateList[week.currentSolutionNumber];
            if (sol1)
            sol1.forEach((step : IActlistObj)=>{
              week.refreshTable[step.m][step.Pos[0]][step.Pos[1]]()
            })
            if (sol2)
            sol2.forEach((step : IActlistObj)=>{
              week.refreshTable[step.m][step.Pos[0]][step.Pos[1]]()
            })
            week.tableFooterRefresher.forEach((tfr : any)=>{
              tfr();
            })
          }
        }
      }>{">"}</Button>
      </td>
      <td>
      <Button onClick={Done(props.m,week)}>Done</Button>
      </td>
      <td>
        Effected Classes : {week.activateList[week.currentSolutionNumber].reduce(
          (acc,item)=>{
            if (!acc.includes(''+week.allClasses[item.m].Name)){
              return acc+`${week.allClasses[item.m].Name} `
            }
            else
              return acc + ''
          }
          ,'')}</td>
      </tr></table>:null):<p>No Solutions! <Button onClick={Done(props.m,week)}>OK</Button></p>):null}</div>);
}

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
        <TableFooter m={props.m} WEEK_GLOBAL_Object={week} tableFooterInitializer={props.tableFooterInitializer} />
      </TableContainer>
      
    );
  }