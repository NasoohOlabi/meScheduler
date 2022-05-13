import { makeStyles, Theme, createStyles, TableContainer, Paper, Table, TableHead, TableRow, TableCell, Typography, IconButton, TableBody, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import ClassObj from "../../Interfaces/ClassObj";
import { useForceUpdate } from "../../Logic/Logic";
import { texts } from "../UiText";
import RemoveIcon from "@material-ui/icons/Remove";
import { weekContext } from "./DataViewModel";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { Classporter } from "./ClassInput";
import { TeacherSelector } from "./TeacherInput";

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
    const { week, id_provider: idProvider } = React.useContext(weekContext);
    const allClasses = week.allClasses;
    const addClass = (event: any) => {
        allClasses.push(new ClassObj());
        forceUpdate();
    };
    const [AddDialogOpen, setAddDialogOpen] = React.useState(false);
    let formTeacherName = "";

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    }
    const addClassTeacherInput = () => {
        setAddDialogOpen(true);
    };
    const dialogTeacherTextChange = (event: any) => {
        const value = event.target.value;
        formTeacherName = value;
    }
    const onAddDialogOK = () => {
        const id = idProvider.get_id();
        week.teachersGuild.push(id);
        texts.NameMap[id] = formTeacherName;
        setAddDialogOpen(false);
    }


    const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
    const removeClassTeacherInput = () => {
        setRemoveDialogOpen(true);
    };

    const onRemoveDialogOK = (id: string) => {
        week.allClasses.forEach(Class => {
            Class.removeTeacher(id);
        })
        week.teachersGuild = week.teachersGuild.filter(t => t !== id);
        delete texts.NameMap[id]
    }

    const handleRemoveDialogClose = () => {
        setRemoveDialogOpen(false);
    }



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
                        <TableCell className={classes.cell}>
                            <Typography display="inline">Add Teacher</Typography>
                            <IconButton color="inherit" onClick={addClassTeacherInput}>
                                <AddIcon />
                            </IconButton>
                            <Dialog open={AddDialogOpen} onClose={handleAddDialogClose}>
                                <DialogTitle>Add Teacher</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Add The Name of the Teacher.
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Teacher's Name"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        onChange={dialogTeacherTextChange}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleAddDialogClose}>Cancel</Button>
                                    <Button onClick={onAddDialogOK}>Add</Button>
                                </DialogActions>
                            </Dialog>
                            <Typography display="inline">Remove Teacher</Typography>
                            <IconButton color="inherit" onClick={removeClassTeacherInput}>
                                <RemoveIcon />
                            </IconButton>
                            <Dialog open={removeDialogOpen} onClose={handleRemoveDialogClose}>
                                <DialogTitle>Remove Teacher</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                    Select The Teacher to remove.
                                    </DialogContentText>
                                    <TeacherSelector
                                        onChange={onRemoveDialogOK}
                                        />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleRemoveDialogClose}>Cancel</Button>
                                    {/* <Button onClick={onRemoveDialogOK}>Remove</Button> */}
                                </DialogActions>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allClasses.map((Class, index) => (
                        <TableRow key={index}>
                            <TableCell colSpan={2} className={classes.cell}>
                                <Classporter
                                    m={index}
                                    key={index}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}