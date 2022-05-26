declare const self: Worker;
export default {} as typeof Worker & { new(): Worker };
import { IActlistObj } from "../Interfaces/Interfaces";
import { randomFiller, fastForward } from "../Logic/Logic";


self.addEventListener('message', (event) => {
	const week = ((week: string) => JSON.parse(week))(event.data);
	const changeCellPost = (change: IActlistObj) => {
		self.postMessage({ payload: change, type: "oneChange" })
	}
	const iterativeSolutionPoster = (changes: IActlistObj[]) => {
		self.postMessage({ payload: changes, type: "multipleChanges" })
	}
	randomFiller(week, changeCellPost);
	fastForward(week, iterativeSolutionPoster);
	// randomFiller(week);
	// fastForward(week);
	console.log(`posting Done`)
	self.postMessage({ payload: week, type: "Done" })
})