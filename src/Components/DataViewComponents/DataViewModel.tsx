import { createContext } from "react";
import { TeachersDictionary } from "../../Interfaces/Interfaces";
import { DEFAULT_WEEK } from "../Data";
import { Topic } from "./Topic";

export class teacher_id_generator implements Iid_provider {
	n: number = -1;
	constructor(m: number) {
		this.n = m;
	}
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

function topicList(teachersGuild: string[]) {
	const result: TeachersDictionary<Topic<string>> = {};
	teachersGuild.forEach((t_id) => (result[t_id] = new Topic<string>(t_id)));
	return result;
}
export const MAX_NUMBER_OF_PERIODS_TEACHER_CAN_TEACH = 10;
export interface Iid_provider {
	get_id: () => string;
	get_id_list: () => string[];
}
export class DataViewModel {
	week = DEFAULT_WEEK;
	id_provider = new teacher_id_generator(
		DEFAULT_WEEK.teachersGuild.length - 1
	);
}
export const weekContext = createContext(new DataViewModel());
