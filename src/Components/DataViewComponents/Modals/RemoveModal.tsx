import {
	Typography,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from "@material-ui/core";
import React, { useRef } from "react";
import { texts } from "../../UiText";
import { weekContext } from "../DataViewModel";
import { TeacherSelector } from "../TeacherInput";
import RemoveIcon from "@material-ui/icons/Remove";

interface RemoveModalProps {
	onSave: (name: string) => void;
}
export function RemoveModal(props: RemoveModalProps) {
	const [DialogOpen, setDialogOpen] = React.useState(false);
	const { week } = React.useContext(weekContext);
	let chosenToTeacher = useRef<string>("");

	const ClassTeacherInput = () => {
		setDialogOpen(true);
	};
	const onDialogChange = (id: string) => {
		console.log(id);
		chosenToTeacher.current = id;
	};
	const onDialogOK = () => {
		chosenToTeacher.current = texts.NameMap[chosenToTeacher.current];
		week.allClasses.forEach((Class) => {
			Class.removeTeacher(chosenToTeacher.current);
		});
		week.teachersGuild = week.teachersGuild.filter(
			(t) => t !== chosenToTeacher.current
		);
		delete texts.NameMap[chosenToTeacher.current];
		console.log(week);
		props.onSave(chosenToTeacher.current);
		setDialogOpen(false);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	return (
		<span>
			<Typography display="inline">Remove Teacher</Typography>
			<IconButton color="inherit" onClick={ClassTeacherInput}>
				<RemoveIcon />
			</IconButton>
			<Dialog open={DialogOpen} onClose={handleDialogClose}>
				<DialogTitle>Remove Teacher</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Select The Teacher to remove.
					</DialogContentText>
					<TeacherSelector onChange={onDialogChange} />
				</DialogContent>
				<DialogActions>
					<Button onClick={onDialogOK}>Remove</Button>
				</DialogActions>
			</Dialog>
		</span>
	);
}
