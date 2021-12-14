import { Paper, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { useRef } from "react";
import { useForceUpdate } from "../../Logic/Logic";
import { DEFAULT_WEEK } from "../Data";
import { texts } from "../UiText";
import { ClassesPorter } from "./ClassesInput";
import { weekContext, DataViewModel } from "./DataViewModel";

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




export function WeekInput() {
    const classes = useStyles();

    const refresh = useForceUpdate();

    const model = useRef(new DataViewModel()).current;

    return (
        <weekContext.Provider value={model}>
            <Paper className={classes.paper}>
                <Button
                    onClick={() => {
                        refresh();
                        console.log(model);
                        console.log('DEFAULT_WEEK = ', DEFAULT_WEEK);

                    }}
                >
                    Some TExt
                </Button>
                <ClassesPorter />
            </Paper>
        </weekContext.Provider>
    );
}