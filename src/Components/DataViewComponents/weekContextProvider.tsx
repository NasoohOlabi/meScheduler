import { createContext } from "react";
import { WeekObj } from "../../Interfaces/Interfaces";

export class teacher_id_generator implements Iid_provider {
    n: number = -1;
    get_id() {
        this.n++;
        return "t" + this.n;
    }
    get_id_list() {
        const res: string[] = [];
        for (let i = 0; i <= this.n; i++) {
            res.push("t" + i);
        }
        return res;
    }
}

export const weekContext = createContext({ week: new WeekObj(), id_provider: new teacher_id_generator() });

export const MAX_NUMBER_OF_PERIODS_TEACHER_CAN_TEACH = 10;


export interface Iid_provider {
    get_id: () => string;
    get_id_list: () => string[];
}



