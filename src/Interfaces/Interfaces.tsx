/* eslint-disable no-throw-literal */
import { Theme } from "@material-ui/core";
import { backtrack, takeOneOffTheStack } from "../Logic/CoreAlgo";
import { actionType, util } from "../Logic/util";
import { PosType, refreshTableType, tableFooterRefresherType } from "../types";
import ClassObj, { NUM_OF_DAYS, NUM_OF_PERIODS_PER_DAY } from "./ClassObj";

/**
 * obj : {
 * Pos: PosType,
 * m: number,
 * teacher: string}
 */
export interface IActlistObj {
	Pos: PosType;
	m: number;
	teacher: string;
}
export class Queue<T> {
	_store: T[] = [];
	Empty(): boolean {
		return this._store.length === 0;
	}
	length(): number {
		return this._store.length;
	}
	notEmpty(): boolean {
		return !this.Empty();
	}
	enqueue(val: T) {
		this._store.push(val);
	}
	dequeue(): void {
		this._store.shift();
	}
	front(): T {
		return this._store[0];
	}
}
/**
 * PivotParent.stackLength is the number of pivots we are waiting to resolve once they do we'll consider this a solution
 * in other word the number of pointers keeping the obj alive!
 */
export type callNodeType = {
	teacher: string;
	Pos: PosType;
	m: number;
	callTo: "pre" | "re" | "pivotTo" | "nothing";
	parent: callNodeType | undefined | null;
	pivotArgs?: {
		next_m: number;
		/**
		 * @type callNodeType with Parent preferably undefined
		 */
		AfterReChainNode?: callNodeType;
		beforeReChainNode: callNodeType | null;
	};
	cycleClosingParentName?: string;
	Action?: actionType;
	week: IWEEK_GLOBAL_Object;
	Pivots: callNodeType[];
};
export type NodeProcessor = (vertix: callNodeType) => void;

export class argumentsQueue {
	queue: Queue<callNodeType> = new Queue<callNodeType>();
	_max: number = 100000;
	_accepting: boolean = true;
	
	// _stats = { preCalls: 0, reCalls: 0, pivotToCalls: 0 };
	Empty(): boolean {
		return this.queue.Empty();
	}
	notEmpty(): boolean {
		return !this.Empty();
	}
	enqueue(val: callNodeType): boolean {
		if (this._accepting && this.queue.length() < this._max) {
			this.queue.enqueue(val);
			return true;
		}
		this._accepting = false;
		return false;
	}
	dequeue(): void {
		this.queue.dequeue();
	}
	unlock(): void {
		if (!this._accepting) this._accepting = true;
		// if (this._accepting) console.log(`Max wasn't reached!`);
		// else {
		// 	console.log(`Max was reached ;( `);
		// 	this._accepting = true;
		// }
		// console.log(this);
		// const total =
		// 	this._stats.preCalls + this._stats.reCalls + this._stats.pivotToCalls;
		// const obj = {
		// 	...this._stats,
		// 	total,
		// 	stoped_at: this.queue.length(),
		// 	sched: total + this.queue.length(),
		// };
		// console.log(JSON.stringify(obj));
		// this._stats = { preCalls: 0, reCalls: 0, pivotToCalls: 0 };
	}
	length() {
		return this.queue.length();
	}
	eraseAll() {
		while (this.notEmpty()) {
			this.dequeue();
		}
	}
	callFront(
		re_fn: NodeProcessor,
		pre_fn: NodeProcessor,
		pivot_fn: NodeProcessor
	): void {
		const vertix = this.queue.front();
		if (vertix.callTo === "pre") {
			// this._stats.preCalls++;
			pre_fn(vertix);
		} else if (vertix.callTo === "re") {
			if (vertix.Action !== undefined) {
				// this._stats.reCalls++;
				re_fn(vertix);
			}
			// eslint-disable-next-line no-throw-literal
			else throw { ...vertix, message: "Action not specified for re call" };
		} else if (vertix.callTo === "pivotTo") {
			if (vertix.pivotArgs !== undefined) {
				// this._stats.pivotToCalls++;
				pivot_fn(vertix);
			} else {
				throw {
					...vertix,
					message: "callTo pivotTo with missing pivotArgs",
				};
			}
		} else if (vertix.callTo === "nothing") {
			// console.warn(`considering nothing a solution : `, vertix);
			if (vertix.Pivots.length !== 0) {
				takeOneOffTheStack(vertix);
			} else {
				const solution = backtrack(vertix);
				vertix.week.activateList.push(util.copyInstructions(solution));
			}
		}
	}
}

/**
 * { depth?: number,
 * actList_Length?:number,
 * Pivots?: PivotsCallStack,
 * baseLength? : number}
 */
export interface IMisc {
	depth?: number;
	actList_Length?: number;
	Pivots?: callNodeType[];
	baseLength?: number;
}
export interface lCellObj {
	currentTeacher: string;
	isCemented: boolean;
	Options: string[];
}
export interface TimeRemainingState {
	whatToSayIndex: number;
	total: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}
export interface I_installButtonProps {
	color?: any;
	className?: any;
}
export interface IBasicTableProps {
	m: number;
	handleChange: any;
	cellInitializer: any;
	tableFooterInitializer: any;
	headRow: string[];
	headCol: string[];
	WEEK_GLOBAL_Object: IWEEK_GLOBAL_Object;
}
export interface ITableFooter {
	m: number;
	tableFooterInitializer: any;
	WEEK_GLOBAL_Object: IWEEK_GLOBAL_Object;
}
export enum Screen {
	ETA,
	TABLE,
	DATAPARSER,
}
export interface INavProps {
	UI: Screen;
	switchToTable: (event: any) => void;
	switchToETA: (event: any) => void;
	switchToDataParser: (event: any) => void;
}
export interface IMyAppBarProps {
	UI: Screen;
	switchToTable: (event: any) => void;
	switchToETA: (event: any) => void;
	switchToDataParser: (event: any) => void;
	toggleTheme: (event: any) => void;
	toggleLang: (event: any) => void;
	theme: Theme;
	darkThemed: boolean;
}
export interface ICell {
	Pos: PosType;
	cellInitializer: any;
	m: number;
	handleChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
	WEEK_GLOBAL_Object: IWEEK_GLOBAL_Object;
}
export interface TeachersDictionary<T> {
	[index: string]: T;
}
export interface ITeacherSchedule {
	[index: string]: (number | null)[][];
}
export interface IAvailables {
	[index: string]: PosType[];
}
export interface IClassTeachers {
	[index: string]: ClassTeacherData;
}
export interface IWEEK_GLOBAL_Object {
	allClasses: ClassObj[];
	teachersGuild: string[];
	refreshTable?: (() => void)[][][];
	tableFooterRefresher?: (() => void)[];
	forceUpdate?: () => void;
	Swapping: boolean;
	currentSolutionNumber: number;
	activateList: IActlistObj[][];
	availables: IAvailables;
	teacherSchedule: ITeacherSchedule;
}
export class WeekObj implements IWEEK_GLOBAL_Object {
	allClasses: ClassObj[] = [];
	teachersGuild: string[] = [];
	activateList: IActlistObj[][] = [];
	availables: IAvailables = {};
	refreshTable: refreshTableType = [];
	tableFooterRefresher: tableFooterRefresherType = [];
	teacherSchedule: ITeacherSchedule = {};
	forceUpdate: () => void = () => {};
	Swapping = false;
	currentSolutionNumber = 0;
	constructor(...args: any[]) {
		if (
			args &&
			args.length === 1 &&
			args[0].allClasses &&
			args[0].teachersGuild &&
			args[0].availables
		) {
			const week = args[0];
			this.allClasses = week.allClasses;
			this.teachersGuild = week.teachersGuild;
			this.availables = week.availables;
			if (!week.refreshTable) {
				this.refreshTable = new Array(week.allClasses.length)
					.fill(null)
					.map((_) =>
						Array(NUM_OF_DAYS)
							.fill(null)
							.map(() =>
								Array(NUM_OF_PERIODS_PER_DAY)
									.fill(null)
									.map(() => () => {})
							)
					);
			} else {
				this.refreshTable = week.refreshTable;
			}
		}
	}
	public addClass() {
		const cls = new ClassObj();
		this.allClasses.push(cls);
		this.refreshTable.push(cls.refreshTable());
		this.tableFooterRefresher.push(() => {});
	}
	public addTeacher(ind: number, m: number, teacher: string, Periods: number) {
		this.teachersGuild[ind] = teacher;
		this.allClasses[m].addTeacher(teacher, Periods);
	}
	public teacherScheduleInit() {
		this.teachersGuild.forEach((teacher) => {
			this.teacherSchedule[teacher] = [...Array(NUM_OF_DAYS)].map((e) =>
				Array(NUM_OF_PERIODS_PER_DAY).fill(null)
			);
			this.availables[teacher].forEach(([X, Y]: PosType) => {
				this.teacherSchedule[teacher][X][Y] = -1;
			});
		});
	}
}
export interface IClass {
	l: lCellObj[][];
	Name: string;
	teachers: IClassTeachers;
}

export interface ClassTeacherData {
	Periods: number;
	remPeriods: number;
	periodsHere: PosType[];
	emptyAvailables: PosType[];
}
export interface IWeekData {
	allClasses: ClassObj[];
	teachersGuild: string[];
	Swapping: boolean;
	currentSolutionNumber: number;
	activateList: IActlistObj[][];
	availables: IAvailables;
	teacherSchedule: ITeacherSchedule;
}
export type ISomeHowPutHimAtWorkerMsg = {
	week: IWeekData;
	nodes: callNodeType[];
	name: string;
};
export interface coreAlgoWorkerAnswer {
	type: "Done" | "Error";
	payload: IActlistObj[][];
	name: string;
}

export type blowoutFunction = (lst: callNodeType[]) => void | undefined;

export type blowoutFunctionSetupType = (
	week: IWeekData,
	lst: callNodeType[],
	callBack: (msg: coreAlgoWorkerAnswer) => void
) => void;
