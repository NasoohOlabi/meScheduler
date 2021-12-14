import { makeStyles, Theme, createStyles, TableContainer, Paper, Table, TableHead, TableRow, TableCell, Typography, IconButton, TableBody } from "@material-ui/core";
import ClassObj from "../../Interfaces/ClassObj";
import { useForceUpdate } from "../../Logic/Logic";
import { texts } from "../UiText";
import { weekContext } from "./DataViewModel";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { Classporter } from "./ClassInput";

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
        pCard: {
            display: "inline-block",
            width: "100%",
        },
        childCard: {
            display: "inline-block",
            // maxWidth: 400,
        },
        cell: {
            textAlign: "inherit",
        },
        table: {
            textAlign: texts.LangDirection === "ltr" ? "left" : "right",
            width: "100%",
            minWidth: 650,
            alignContent: "center",
        },
        TableContainer: {
            alignItems: "center",
        }
    })
);


export function ClassesPorter(): JSX.Element {
    const classes = useStyles();
    const forceUpdate = useForceUpdate();
    const { week } = React.useContext(weekContext);
    const allClasses = week.allClasses;
    const addClass = (event: any) => {
        allClasses.push(new ClassObj());
        forceUpdate();
    };
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.cell}>
                            <Typography display="inline">{texts.addClass}</Typography>
                            <IconButton color="inherit" onClick={addClass}>
                                <AddIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allClasses.map((Class, index) => (
                        <TableRow>
                            <Classporter
                                m={index}
                                key={index}
                            />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}