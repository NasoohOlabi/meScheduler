declare const self: Worker;
export default {} as typeof Worker & { new(): Worker };
import { argumentsQueue, coreAlgoWorkerAnswer, ISomeHowPutHimAtWorkerMsg } from "../Interfaces/Interfaces";
import { re, pre, pivotTo } from "../Logic/CoreAlgo";

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
    const args: ISomeHowPutHimAtWorkerMsg = JSON.parse(event.data);
    const { nodes, week, name } = args;
    // someHowPutHimAt(...args)
    console.log(`${name} is working`);

    const q = new argumentsQueue();

    for (let i = 0; i < nodes.length; i++) {
        q.enqueue(nodes[i]);
    }

    while (q.notEmpty() && week.activateList.length <= 1) {
        q.callFront(re, pre, pivotTo);
        q.dequeue();
    }


    console.log(`${name} is posting Done`)
    const ans: coreAlgoWorkerAnswer = { payload: week.activateList, type: "Done", name };
    self.postMessage(JSON.stringify(ans));
})

