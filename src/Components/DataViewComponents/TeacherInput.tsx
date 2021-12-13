import { Card, Table, TableRow, TableCell, TextField, IconButton, Checkbox, FormControlLabel, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { useState, useContext } from "react";
import { NUM_OF_DAYS, NUM_OF_PERIODS_PER_DAY } from "../../Interfaces/ClassObj";
import { PosType } from "../../types";
import { texts } from "../UiText";
import { MAX_NUMBER_OF_PERIODS_TEACHER_CAN_TEACH, weekContext } from "./weekContextProvider";
import AddIcon from "@material-ui/icons/Add";

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

function ClassTeacherInputTableRows(props: { m: number; id: string }) {
    const classes = useStyles();
    const [availabilityPromptOn, setAvailabilityPromptOn] = useState(false);
    const { week } = useContext(weekContext);
    const onTeacherNameChange = (event: any) => {
        const v = event.target.value;
        texts.NameMap[props.id] = v;
    };
    const onTeacherPeriodsChange = (event: any) => {
        const n = event.target.value;
        week.allClasses[props.m].teachers[props.id].Periods = n;
        week.allClasses[props.m].teachers[props.id].remPeriods = n;
    };
    return (
        <Card className={classes.childCard}>
            <Table>
                <TableRow>
                    <TableCell className={classes.cell}>
                        {texts.teacherName} :
                    </TableCell>
                    <TableCell className={classes.cell} align="center">
                        <TextField
                            required
                            id="standard-required"
                            onChange={onTeacherNameChange}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            required
                            type="number"
                            id="standard-required"
                            onChange={onTeacherPeriodsChange}
                            InputProps={{
                                inputProps: {
                                    min: 0,
                                    max: MAX_NUMBER_OF_PERIODS_TEACHER_CAN_TEACH,
                                },
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <IconButton color="inherit" onClick={(e) => { setAvailabilityPromptOn(!availabilityPromptOn) }}>
                            <AddIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
                {(availabilityPromptOn) ? <TableRow>
                    <TeacherSchedulePorter
                        onSubmission={() => { setAvailabilityPromptOn(false) }} />
                </TableRow> : null}
            </Table>
        </Card>
    );
}

export const MemoClassTeachersInputTRows = React.memo(ClassTeacherInputTableRows);

function TeacherSchedulePorter(props: { onSubmission: any }) {
    const classes = useStyles();
    const ModelSetState =
        React.useRef(
            Array(NUM_OF_DAYS + 1)
                .fill(null)
                .map(() => Array(NUM_OF_PERIODS_PER_DAY + 1).fill(undefined))
        ).current;
    function ControlledCheckbox(props: { Pos: PosType; label?: string }) {
        // unpack & alias
        const [x, y] = props.Pos;

        const [checked, setChecked] = useState(false);
        ModelSetState[x][y] = setChecked;

        const fn = (event: any) => {
            const newVal = event.target.checked;
            ModelSetState[x][y]?.(newVal);
            if (x === 0 && y === 0) {
                for (let i = 0; i < ModelSetState.length; i++) {
                    for (let j = 0; j < ModelSetState[i].length; j++) {
                        ModelSetState[i][j]?.(newVal);
                    }
                }
            }
            else if (x === 0) {
                for (let i = 1; i < ModelSetState.length; i++) {
                    ModelSetState[i][y]?.(newVal);
                }
            } else if (y === 0) {
                for (let j = 1; j < ModelSetState[x].length; j++) {
                    ModelSetState[x][j]?.(newVal);
                }
            }
        };

        return props.label === undefined ? (
            <Checkbox
                checked={checked}
                onChange={fn}
                inputProps={{ "aria-label": "controlled" }}
                size="small"
            />
        ) : (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={fn}
                        inputProps={{ "aria-label": "controlled" }}
                        size="small"
                    />
                }
                label={props.label}
            />
        );
    }
    const Avail_terminator = () => {
        props.onSubmission()
    };
    const tmp: PosType = [0, 0];
    return (
        <div>
            <table>
                {Array(NUM_OF_DAYS + 1)
                    .fill(Array(NUM_OF_PERIODS_PER_DAY + 1).fill(0))
                    .map((dayArr: number[], index) => {
                        return (
                            <tr>
                                {dayArr.map((Period, jndex) => {
                                    let label = undefined;
                                    if (index === 0 && jndex === 0) {
                                        label = "Select all";
                                    } else if (index === 0) {
                                        label = texts.headRow[jndex - 1];
                                    } else if (jndex === 0) {
                                        label = texts.headCol[index - 1];
                                    }
                                    return (
                                        <td>
                                            <ControlledCheckbox
                                                Pos={[index, jndex]}
                                                label={label}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
            </table>

            <Button onClick={Avail_terminator}>Done</Button>
        </div>
    );
}