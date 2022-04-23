import { Card, TableContainer, Paper, Table, TableRow, TableCell, TextField, IconButton, Checkbox, FormControlLabel, Button, createStyles, makeStyles, Theme, Select, MenuItem, TableBody, TableHead } from "@material-ui/core";

import { useEffect, memo, useRef } from "react";
import { useState, useContext } from "react";
import { NUM_OF_DAYS, NUM_OF_PERIODS_PER_DAY } from "../../Interfaces/ClassObj";
import { PosType } from "../../types";
import { texts } from "../UiText";
import { MAX_NUMBER_OF_PERIODS_TEACHER_CAN_TEACH, weekContext } from "./DataViewModel";
import ScheduleIcon from "@material-ui/icons/Schedule";
import RemoveIcon from "@material-ui/icons/Remove";
import { equals } from "../../Logic/util";
import { Topic } from "./Topic";
import React from "react"

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

function parseModel(mat: boolean[][]) {
    const Result: PosType[] = []
    mat.forEach(
        (row, i) => {
            row.forEach(
                (col, j) => {
                    if (col && i !== 0 && j !== 0) {
                        Result.push([i - 1, j - 1])
                    }
                }
            )
        }
    )
    return Result;
}

function TeacherSelector(props: { id: string }) {

    const { FormControl, week } = useContext(weekContext)
    const [name, setName] = useState(texts.NameMap[props.id])

    const onTeacherNameChange = (event: any) => {
        const v: string = event.target.value;
        texts.NameMap[props.id] = v;
        FormControl.TeachersTopics[props.id].Publish(v)
    };
    useEffect(() => {
        setName(texts.NameMap[props.id])
    },
        [texts.NameMap[props.id]]
    )

    useEffect(() => {
        FormControl.TeachersTopics[props.id].Subscribe(setName)
        return () => {
            FormControl.TeachersTopics[props.id].Unsubscribe(setName)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={name}
            label="Age"
            onChange={onTeacherNameChange}
            defaultValue={name}
            placeholder={texts.NameMap['Teacher']}
        >
            {week.teachersGuild.map((t, i) => <MenuItem key={i} value={texts.NameMap[t]} >{texts.NameMap[t]}</MenuItem>)}
        </Select>
    )
}

function TeacherSchedulePorter(props: { onSubmission: any, lastValue: PosType[] }) {
    const Model: boolean[][] =
        useRef(
            Array(NUM_OF_DAYS + 1)
                .fill(null)
                .map(() => Array(NUM_OF_PERIODS_PER_DAY + 1).fill(false))
        ).current;
    const allSelected = new Topic<boolean>(false)
    const rowTopics = new Array(NUM_OF_DAYS + 1).fill(null).map(() => new Topic<boolean>(false));
    const colTopics = new Array(NUM_OF_PERIODS_PER_DAY + 1).fill(null).map(() => new Topic<boolean>(false));
    const lastValue = props.lastValue
    function ControlledCheckbox(props: { Pos: PosType; label?: string }) {
        const [x, y] = props.Pos;
        const [checked, setChecked] = useState(lastValue.some((v) =>
            equals(v, [x - 1, y - 1])
        ));
        Model[x][y] = checked
        useEffect(() => {
            if (x === 0 || y === 0) {
                //nothing for now
                // console.log("Mat Zero")
            } else {
                // console.log('Subscribing props.Pos = ', props.Pos);
                allSelected.Subscribe(setChecked)
                rowTopics[x].Subscribe(setChecked)
                colTopics[y].Subscribe(setChecked)
            }
            return () => {
                if (x === 0 || y === 0) {
                    //nothing for now
                } else {
                    allSelected.Unsubscribe(setChecked)
                    rowTopics[x].Unsubscribe(setChecked)
                    colTopics[y].Unsubscribe(setChecked)
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        const changeHandler = (event: any) => {
            const newVal: boolean = event.target.checked;
            setChecked(newVal)
            if (x === 0 || y === 0) {
                if (x === 0 && y === 0)
                    allSelected.Publish(newVal)
                else if (x === 0)
                    colTopics[y].Publish(newVal)
                else if (y === 0)
                    rowTopics[x].Publish(newVal)
            }
        }

        return props.label === undefined ? (
            <Checkbox
                checked={checked}
                onChange={changeHandler}
                inputProps={{ "aria-label": "controlled" }}
                size="small"
            />
        ) : (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={changeHandler}
                        inputProps={{ "aria-label": "controlled" }}
                        size="small"
                    />
                }
                label={props.label}
            />
        );
    }
    const Avail_terminator = () => {
        const parsedModel = parseModel(Model)
        props.onSubmission(parsedModel)
    };

    return (
        <Card>
            <TableContainer>
                <Table>
                    <TableHead></TableHead>
                    <TableBody>
                        {Array(NUM_OF_DAYS + 1)
                            .fill(Array(NUM_OF_PERIODS_PER_DAY + 1).fill(0))
                            .map((dayArr: number[], index) => {
                                return (
                                    <TableRow key={index}>
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
                                                <TableCell key={`${index},${jndex}`}>
                                                    <ControlledCheckbox
                                                        Pos={[index, jndex]}
                                                        label={label}
                                                    />
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button onClick={Avail_terminator}>Done</Button>
        </Card >
    );
}

export function ClassTeacherInputTableRows(props: { m: number; id: string; key: number }) {
    const classes = useStyles();
    const [availabilityPromptOn, setAvailabilityPromptOn] = useState(false);
    const { week } = useContext(weekContext);

    const onTeacherPeriodsChange = (event: any) => {
        const n = event.target.value;
        week.allClasses[props.m].teachers[props.id].Periods = n;
        week.allClasses[props.m].teachers[props.id].remPeriods = n;
    };
    const onAvailabilitySubmission = (availability: PosType[]) => {
        week.availables[props.id] = availability
    }
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <IconButton color="inherit" onClick={(e) => { setAvailabilityPromptOn(!availabilityPromptOn) }}>
                                <RemoveIcon />
                            </IconButton>
                        </TableCell>
                        <TableCell className={classes.cell}>
                            {texts.teacherName} :
                        </TableCell>
                        <TableCell className={classes.cell} align="center">
                            <TeacherSelector id={props.id} />
                        </TableCell>
                        <TableCell>
                            <TextField
                                required
                                type="number"
                                id="standard-required"
                                onChange={onTeacherPeriodsChange}
                                defaultValue={week.allClasses[props.m].teachers[props.id].Periods}
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
                                <ScheduleIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(availabilityPromptOn) ? <TableRow>
                        <TableCell>
                            <TeacherSchedulePorter
                                lastValue={week.availables[props.id] || []}
                                onSubmission={(availability: PosType[]) => {
                                    onAvailabilitySubmission(availability)
                                    setAvailabilityPromptOn(false)
                                }} />
                        </TableCell>
                    </TableRow> : null}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

