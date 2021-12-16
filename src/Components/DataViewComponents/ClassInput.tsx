import { makeStyles, Theme, createStyles, Table, TableHead, TableRow, TableCell, Typography, TextField, TableBody, IconButton, Card } from "@material-ui/core";
import { useContext } from "react";
import { useForceUpdate } from "../../Logic/Logic";
import { texts } from "../UiText";
import { weekContext } from "./DataViewModel";
import AddIcon from "@material-ui/icons/Add";
import { MemoClassTeachersInputTRows } from "./TeacherInput";


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


export function Classporter(props: { m: number }) {
    const classes = useStyles();
    const { week, id_provider: idProvider } = useContext(weekContext);
    const Class = week.allClasses[props.m];
    const forceUpdate = useForceUpdate();
    const addClassTeacherInput = () => {
        const Id = idProvider.get_id();
        Class.addTeacher(Id, 0);
        week.teachersGuild.push(Id);
        forceUpdate();
        console.log(Class.teachers);
    };
    const textChange = (event: any) => {
        const value = event.target.value;
        Class.Name = value;
    };
    return (
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
                <Table>
                    <TableRow>
                        <TableCell
                            className={classes.cell}
                            component="th"
                            scope="row"
                        >
                            <Typography>{texts.classGroupName} :</Typography>
                        </TableCell>
                        <TableCell className={classes.cell} align="center">
                            <TextField
                                onChange={textChange}
                                id="standard-required"
                                label={Class.Name}
                            />
                        </TableCell>
                    </TableRow>
                </Table>
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
                <TableRow>
                    <Card className={classes.pCard}>
                        {Object.keys(Class.teachers).map((teacher_id: string, index: number) => {
                            return (
                                <MemoClassTeachersInputTRows
                                    key={index}
                                    m={props.m}
                                    id={teacher_id}
                                />
                            );
                        })}
                    </Card>
                </TableRow>
            </TableBody>
        </Table>
    );
}