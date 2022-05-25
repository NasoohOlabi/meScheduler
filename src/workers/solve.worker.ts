declare const self: Worker;
export default {} as typeof Worker & { new(): Worker };
import { blowoutFunction, blowoutFunctionSetupType, callNodeType, coreAlgoWorkerAnswer, IActlistObj, ISomeHowPutHimAtWorkerMsg, IWeekData, WeekObj } from "../Interfaces/Interfaces";
import { randomFiller, fastForward } from "../Logic/Logic";
import coreAlgoWorker from "./coreAlgo.worker";





self.addEventListener('message', (event) => {
	
})