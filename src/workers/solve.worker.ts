declare const self: Worker;
export default {} as typeof Worker & { new(): Worker };
import { IActlistObj } from "../Interfaces/Interfaces";
import { randomFiller, fastForward } from "../Logic/Logic";
import coreAlgoWorker from "./coreAlgo.worker";



const blowoutSetup: () => { fn: blowoutFunctionSetupType, workers: any[] } = () => {
	const worker1: Worker = new coreAlgoWorker();
	const worker2: Worker = new coreAlgoWorker();
	const worker3: Worker = new coreAlgoWorker();
	const worker4: Worker = new coreAlgoWorker();
	const worker5: Worker = new coreAlgoWorker();

	const workers = [worker1, worker2, worker3, worker4, worker5];

	console.log('workers')
	console.log(workers)

	return {
		fn: (week: IWeekData, lst: callNodeType[], callBack: (msg: coreAlgoWorkerAnswer) => void) => {
			const chunckSize = Math.floor(lst.length / 5);
			const chunck1 = lst.slice(0, chunckSize);
			const chunck2 = lst.slice(chunckSize, chunckSize * 2);
			const chunck3 = lst.slice(chunckSize * 2, chunckSize * 3);
			const chunck4 = lst.slice(chunckSize * 3, chunckSize * 4);
			const chunck5 = lst.slice(chunckSize * 4, lst.length);
			const worker1msg: ISomeHowPutHimAtWorkerMsg = { week, nodes: chunck1, name: "worker1" };
			const worker2msg: ISomeHowPutHimAtWorkerMsg = { week, nodes: chunck2, name: "worker2" };
			const worker3msg: ISomeHowPutHimAtWorkerMsg = { week, nodes: chunck3, name: "worker3" };
			const worker4msg: ISomeHowPutHimAtWorkerMsg = { week, nodes: chunck4, name: "worker4" };
			const worker5msg: ISomeHowPutHimAtWorkerMsg = { week, nodes: chunck5, name: "worker5" };
			worker1.postMessage(JSON.stringify(worker1msg));
			worker2.postMessage(JSON.stringify(worker2msg));
			worker3.postMessage(JSON.stringify(worker3msg));
			worker4.postMessage(JSON.stringify(worker4msg));
			worker5.postMessage(JSON.stringify(worker5msg));
			worker1.onmessage = (event) => { callBack(JSON.parse(event.data)); };
			worker2.onmessage = (event) => { callBack(JSON.parse(event.data)); };
			worker3.onmessage = (event) => { callBack(JSON.parse(event.data)); };
			worker4.onmessage = (event) => { callBack(JSON.parse(event.data)); };
			worker5.onmessage = (event) => { callBack(JSON.parse(event.data)); };
			console.log(`blowoutSetup is Done`)
		}
		, workers
	}
}

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