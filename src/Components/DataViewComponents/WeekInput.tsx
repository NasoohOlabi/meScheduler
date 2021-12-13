import { Paper, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { WeekObj } from "../../Interfaces/Interfaces";
import { texts } from "../UiText";
import { ClassesPorter } from "./ClassesInput";
import { teacher_id_generator, weekContext } from "./weekContextProvider";

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


    const model = { week: new WeekObj(), id_provider: new teacher_id_generator() }

    return (
        <weekContext.Provider value={model}>
            <Paper className={classes.paper}>
                <Button
                    onClick={() => {
                        console.log(model);
                    }}
                >
                    Some TExt
                </Button>
                <ClassesPorter />
            </Paper>
        </weekContext.Provider>
    );
}