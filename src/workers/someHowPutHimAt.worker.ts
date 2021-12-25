declare const self: Worker;
export default {} as typeof Worker & { new(): Worker };
import { IActlistObj, ISomeHowPutHimAtWorkerMsg } from "../Interfaces/Interfaces";
import { someHowPutHimAt } from "../Logic/CoreAlgo";
import { randomFiller, fastForward } from "../Logic/Logic";
// (
//     m: number,
//     teacher: string,
//     Pos: PosType,
//     week: IWEEK_GLOBAL_Object,
//     freeze: boolean = true,
//     iterativeSolutionPoster?: (changes: IActlistObj[]) => void,
//     justOne: boolean = false
// )
self.addEventListener('message', (event) => {
    const args: ISomeHowPutHimAtWorkerMsg = event.data;

    someHowPutHimAt(...args)


    console.log(`posting Done`)
    self.postMessage({ payload: args[3], type: "Done" })
})