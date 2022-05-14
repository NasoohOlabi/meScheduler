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
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import { texts } from "../../UiText";
import { TeacherSelector } from "../TeacherInput";

export function RenameModal() {
	const [DialogOpen, setDialogOpen] = React.useState(false);
	let formTeacherName: string;
	const Handler = (s: string) => {
		texts.NameMap[s] = formTeacherName;
		setDialogOpen(false);
		console.log(`texts.NameMap[${s}] = ${texts.NameMap[s]}`);
	};

	const dialogTeacherTextChange = (event: any) => {
		const value = event.target.value;
		formTeacherName = value;
	};
	const ClassTeacherInput = () => {
		setDialogOpen(true);
	};
	const onDialogChange = (id: string) => {
		console.log(id);
		formTeacherName = id;
	};
	const onDialogOK = () => {
		Handler(formTeacherName);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	return (
		<span>
			<Typography display="inline">Rename Teacher</Typography>
			<IconButton color="inherit" onClick={ClassTeacherInput}>
				<EditIcon />
			</IconButton>
			<Dialog open={DialogOpen} onClose={handleDialogClose}>
				<DialogTitle>Rename Teacher</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Select The Teacher to rename.
					</DialogContentText>
					<TeacherSelector onChange={onDialogChange} />
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="New Teacher's Name"
						type="text"
						fullWidth
						variant="standard"
						onChange={dialogTeacherTextChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onDialogOK}>Rename</Button>
				</DialogActions>
			</Dialog>
		</span>
	);
}
