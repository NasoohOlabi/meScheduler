/* eslint-disable no-throw-literal */
import { Theme } from "@material-ui/core";
import { backtrack, takeOneOffTheStack } from "../Logic/CoreAlgo";
import { actionType, util } from "../Logic/util";

/**
 * obj : {
 * Pos: [number, number],
 * m: number,
 * teacher: string}
 */
export interface IActlistObj {
	Pos: [number, number];
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
	Pos: [number, number];
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
		/**
		 * To reduce calls to pivotTo that could potencially lock the queue
		 * What you may call decay
		 */
		gen?: number;
	};
	cycleClosingParentName?: string;
	Action?: actionType;
	week: IWEEK_GLOBAL_Object;
	Pivots: callNodeType[];
};
export type NodeProcessor = (vertix: callNodeType) => void;

export class argumentsQueue {
	queue: Queue<callNodeType> = new Queue<callNodeType>();
	_max: number = 50000;
	_accepting: boolean = true;
	_stats = { preCalls: 0, reCalls: 0, pivotToCalls: 0 };
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
		if (this._accepting) console.log(`Max wasn't reached!`);
		else {
			console.log(`Max was reached ;( `);
			this._accepting = true;
		}
		console.log(this);
		const total =
			this._stats.preCalls + this._stats.reCalls + this._stats.pivotToCalls;
		const obj = {
			...this._stats,
			total,
			stoped_at: this.queue.length(),
			sched: total + this.queue.length(),
		};
		console.log(JSON.stringify(obj));
		this._stats = { preCalls: 0, reCalls: 0, pivotToCalls: 0 };
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
			this._stats.preCalls++;
			pre_fn(vertix);
		} else if (vertix.callTo === "re") {
			if (vertix.Action !== undefined) {
				this._stats.reCalls++;
				re_fn(vertix);
			}
			// eslint-disable-next-line no-throw-literal
			else throw { ...vertix, message: "Action not specified for re call" };
		} else if (vertix.callTo === "pivotTo") {
			if (vertix.pivotArgs !== undefined) {
				this._stats.pivotToCalls++;
				pivot_fn(vertix);
			} else {
				throw { ...vertix, message: "callTo pivotTo with missing pivotArgs" };
			}
		} else if (vertix.callTo === "nothing") {
			console.warn(`considering nothing a solution : `, vertix);
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
enum Screen {
	ETA,
	TABLE,
}
export interface INavProps {
	UI: Screen;
	switchToTable: (event: any) => void;
	switchToETA: (event: any) => void;
}
export interface IMyAppBarProps {
	UI: Screen;
	switchToTable: (event: any) => void;
	switchToETA: (event: any) => void;
	toggleTheme: (event: any) => void;
	theme: Theme;
	darkThemed: boolean;
}
export interface ICell {
	Pos: [number, number];
	data: lCellObj;
	cellInitializer: any;
	m: number;
	teacher: string;
	handleChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
	WEEK_GLOBAL_Object: IWEEK_GLOBAL_Object;
}
export interface ITeacherSchedule {
	[details: string] : (number|null)[][];
}
export interface IAvailables {
	[details: string] : [number,number][];
}
export interface IWEEK_GLOBAL_Object {
	allClasses: IClass[];
	teachersGuild: string[];
	refreshTable: (() => void)[][][] | undefined;
	tableFooterRefresher: (() => void)[] | undefined;
	forceUpdate: () => void | undefined;
	Swaping: boolean;
	currentSolutionNumber: number;
	activateList: { Pos: [number, number]; m: number; teacher: string }[][];
	availables: IAvailables;
	teacherSchedule: ITeacherSchedule;
}
export interface IClass {
	l: lCellObj[][];
	Name: string;
	teachers: any;
}
