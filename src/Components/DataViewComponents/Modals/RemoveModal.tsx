import { Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import React, { useRef } from "react";
import { texts } from "../../UiText";
import { weekContext } from "../DataViewModel";
import { TeacherSelector } from "../TeacherInput";
import RemoveIcon from "@material-ui/icons/Remove";

export function RemoveModal() {
	const [DialogOpen, setDialogOpen] = React.useState(false);
	const { week, id_provider: idProvider } = React.useContext(weekContext);
	let chosenToTeacher = useRef<string>('')

	const ClassTeacherInput = () => {
		setDialogOpen(true);
	};
	const onDialogChange = (id: string) => {
		console.log(id)
		chosenToTeacher.current = id;
	}
	const onDialogOK = () => {
		week.allClasses.forEach(Class => {
			Class.removeTeacher(chosenToTeacher.current);
		})
		week.teachersGuild = week.teachersGuild.filter(t => t !== chosenToTeacher.current);
		delete texts.NameMap[chosenToTeacher.current]
	}

	const handleDialogClose = () => {
		setDialogOpen(false);
	}

	return (<span>
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
				<TeacherSelector
					onChange={onDialogChange}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onDialogOK}>Remove</Button>
			</DialogActions>
		</Dialog>
	</span>
	);
}