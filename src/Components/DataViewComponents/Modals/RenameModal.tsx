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
import { weekContext } from "../DataViewModel";
import { TeacherSelector } from "../TeacherInput";

interface RemoveModalProps {
	onSave: (name: string) => void;
}
export function RenameModal(props: RemoveModalProps) {
	const [DialogOpen, setDialogOpen] = React.useState(false);
	const { week } = React.useContext(weekContext);

	const formTeacherName = React.useRef<string>(
		texts.NameMap[week.teachersGuild[0]]
	);
	const targetedId = React.useRef<string>(week.teachersGuild[0]);

	const dialogTeacherTextChange = (event: any) => {
		const value = event.target.value;
		formTeacherName.current = value;
	};
	const ClassTeacherInput = () => {
		setDialogOpen(true);
	};
	const onDialogChange = (id: string) => {
		targetedId.current = texts.NameMap[id];
	};
	const onDialogOK = () => {
		texts.NameMap[targetedId.current] = formTeacherName.current;
		setDialogOpen(false);
		props.onSave(formTeacherName.current);
		console.log(
			`texts.NameMap[${targetedId.current}] = ${
				texts.NameMap[targetedId.current]
			}`
		);
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
