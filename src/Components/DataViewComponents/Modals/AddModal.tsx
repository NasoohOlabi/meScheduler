import {
	Typography,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
	DialogActions,
	Button,
} from "@material-ui/core";
import React from "react";
import { texts } from "../../UiText";
import { weekContext } from "../DataViewModel";
import AddIcon from "@material-ui/icons/Add";

export function AddModal() {
	const { week, id_provider: idProvider } = React.useContext(weekContext);

	const [DialogOpen, setDialogOpen] = React.useState(false);
	let formTeacherName = "";

	const handleDialogClose = () => {
		setDialogOpen(false);
	};
	const ClassTeacherInput = () => {
		setDialogOpen(true);
	};
	const dialogTeacherTextChange = (event: any) => {
		const value = event.target.value;

		formTeacherName = value;
	};
	const onDialogOK = () => {
		const id = idProvider.get_id();
		week.teachersGuild.push(id);
		texts.NameMap[id] = formTeacherName;
		setDialogOpen(false);
	};

	return (
		<span>
			<Typography display="inline">Add Teacher</Typography>
			<IconButton color="inherit" onClick={ClassTeacherInput}>
				<AddIcon />
			</IconButton>
			<Dialog open={DialogOpen} onClose={handleDialogClose}>
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
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button onClick={onDialogOK}>Add</Button>
				</DialogActions>
			</Dialog>
		</span>
	);
}
