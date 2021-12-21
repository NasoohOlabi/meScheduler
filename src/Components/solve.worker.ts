declare const self: Worker;
export default {} as typeof Worker & { new(): Worker };
import { randomFiller, fastForward } from "../Logic/Logic";
self.addEventListener('message', (event) => {
	const week = ((week: string) => JSON.parse(week))(event.data);
	randomFiller(week);
	fastForward(week);
	self.postMessage(JSON.stringify(week))
})