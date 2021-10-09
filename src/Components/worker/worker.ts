/* eslint-disable no-throw-literal */

import { PosType, TeacherType_nullValue } from "../../types";

export const heavyLoad = async (arg: string) => {
	const equals = (a: number[], b: number[]) => {
		if (a.length === b.length) {
			for (let i = 0; i < a.length; i++) {
				if (!(a[i] === b[i])) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	};
	const contains = (a: PosType[], Pos: PosType) => {
		for (let i = 0; i < a.length; i++) {
			if (equals(a[i], Pos)) {
				return true;
			}
		}
		return false;
	};
	const withoutPos = (lst: PosType[], Pos: PosType) => {
		return lst.filter((p) => !equals(Pos, p));
	};
	const getHisActPeriods = (Class: IClass, teacher: string): PosType[] => {
		let result: PosType[] = [];
		loopOverClass((i, j) => {
			if (Class.l[i][j].currentTeacher === teacher) {
				result.push([i, j]);
			}
		});
		return result;
	};
	const loopOverClass = (f: (i: number, j: number) => void, n = 5, m = 7) => {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < m; j++) {
				f(i, j);
			}
		}
	};

	const copyInstruction = (
		obj: IActlistObj
	): { Pos: PosType; m: number; teacher: string } => {
		const res = Object();
		res.Pos = [];
		res.Pos.push(obj.Pos[0]);
		res.Pos.push(obj.Pos[1]);
		res.m = obj.m;
		res.teacher = obj.teacher;
		return res;
	};
	const copyInstructions = (
		objects: IActlistObj[]
	): { Pos: PosType; m: number; teacher: string }[] => {
		const res: any = [];
		objects.forEach((object) => {
			res.push(copyInstruction(object));
		});
		return res;
	};
	const pickAction = (
		teacher: string,
		m: number,
		week: IWEEK_GLOBAL_Object
	): actionType => {
		try {
			if (week.allClasses[m].teachers[teacher].remPeriods > 0) {
				return "shift";
			} else {
				return "cycle";
			}
		} catch {
			alert(`week.allClasses[${m}].teachers[${teacher}] is undefined`);
			// eslint-disable-next-line no-throw-literal
			throw "undefined teacher";
		}
	};
	const situation = (
		teacher: string,
		Pos: PosType,
		m: number,
		week: IWEEK_GLOBAL_Object
	): { currTeacher: string; action: actionType; r: number } => {
		const [x, y] = Pos;
		const ot = week.allClasses[m].l[x][y].currentTeacher;
		const a = pickAction(teacher, m, week);
		const tmp = week.teacherSchedule[teacher][x][y];
		if (tmp !== null) {
			const r: number = tmp;
			return { currTeacher: ot, action: a, r };
		} else {
			throw {
				teacher,
				Pos,
				m,
				week,
				message:
					"Trying to get the situation for an imposible case of teacher not in the school in the first case his schedule reads null! ",
			};
		}
	};
	function situationInt(s: {
		currTeacher: string;
		action: actionType;
		r: number;
	}) {
		const { currTeacher: t, action: a, r } = s;
		if (t === TeacherType_nullValue) {
			if (a === "shift") {
				if (r === -1) {
					return 1;
				} else {
					return 2;
				}
			} else {
				if (r === -1) {
					return 3;
				} else {
					return 4;
				}
			}
		} else {
			if (a === "shift") {
				if (r === -1) {
					return 5;
				} else {
					return 6;
				}
			} else {
				if (r === -1) {
					return 7;
				} else {
					return 8;
				}
			}
		}
	}

	type actionType = "shift" | "cycle";

	/**
	 * obj : {
	 * Pos: PosType,
	 * m: number,
	 * teacher: string}
	 */
	interface IActlistObj {
		Pos: PosType;
		m: number;
		teacher: string;
	}
	class Queue<T> {
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
	type callNodeType = {
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
	type NodeProcessor = (vertix: callNodeType) => void;

	class argumentsQueue {
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
				this._stats.preCalls +
				this._stats.reCalls +
				this._stats.pivotToCalls;
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
				else
					throw { ...vertix, message: "Action not specified for re call" };
			} else if (vertix.callTo === "pivotTo") {
				if (vertix.pivotArgs !== undefined) {
					this._stats.pivotToCalls++;
					pivot_fn(vertix);
				} else {
					throw {
						...vertix,
						message: "callTo pivotTo with missing pivotArgs",
					};
				}
			} else if (vertix.callTo === "nothing") {
				console.warn(`considering nothing a solution : `, vertix);
				if (vertix.Pivots.length !== 0) {
					takeOneOffTheStack(vertix);
				} else {
					const solution = backtrack(vertix);
					vertix.week.activateList.push(copyInstructions(solution));
				}
			}
		}
	}

	interface lCellObj {
		currentTeacher: string;
		isCemented: boolean;
		Options: string[];
	}
	interface ITeacherSchedule {
		[details: string]: (number | null)[][];
	}
	interface IAvailables {
		[details: string]: PosType[];
	}
	interface IWEEK_GLOBAL_Object {
		allClasses: IClass[];
		teachersGuild: number[];
		refreshTable: (() => void)[][][] | undefined;
		tableFooterRefresher: (() => void)[] | undefined;
		forceUpdate: () => void | undefined;
		Swaping: boolean;
		currentSolutionNumber: number;
		activateList: { Pos: PosType; m: number; teacher: string }[][];
		availables: IAvailables;
		teacherSchedule: ITeacherSchedule;
	}
	interface IClass {
		l: lCellObj[][];
		Name: string;
		teachers: any;
	}

	async function randomFiller(week: IWEEK_GLOBAL_Object) {
		const allClasses = week.allClasses;
		for (let m = allClasses.length - 1; m >= 0; m--) {
			const Class = allClasses[m];
			loopOverClass((i: number, j: number) => {
				if (
					Class.l[i][j].currentTeacher === TeacherType_nullValue &&
					Class.l[i][j].Options.length !== 0 &&
					!Class.l[i][j].isCemented
				) {
					const aOptions: string[] = actualOptions([i, j], m, week);
					if (aOptions.length > 0) {
						const teacher =
							aOptions[Math.floor(Math.random() * aOptions.length)];
						putHimAt(week, m, teacher, [i, j], "put");
					}
				}
			});
		}
	}
	function actualOptions(
		Pos: PosType,
		m: number,
		week: IWEEK_GLOBAL_Object,
		command: "unfiltered" | "filtered" = "unfiltered"
	) {
		const [X, Y] = Pos;
		const options = week.allClasses[m].l[X][Y].Options;
		const res = options.filter((teacher) => {
			return (
				week.teacherSchedule[teacher][X][Y] === -1 &&
				week.allClasses[m].teachers[teacher].remPeriods > 0
			);
		});
		if (command === "filtered" && res.length === 0) {
			return options;
		}
		return res;
	}
	const teacherHasNoMoreemptyAvailables = (
		teacher: string,
		teachersList: any
	): boolean => {
		if (teachersList[teacher] === undefined)
			console.log(`teachersList[${teacher}] = undefined`, teachersList);
		return teachersList[teacher].remPeriods < 1;
	};
	const putHimAt = function (
		week: IWEEK_GLOBAL_Object,
		m: number,
		teacher: string,
		Pos: PosType,
		op: "put" | "remove"
	) {
		const doit: boolean = op === "put";
		const allClasses = week.allClasses;
		const [X, Y] = Pos;
		const teachers = allClasses[m].teachers;
		if (doit) {
			if (
				!teacherHasNoMoreemptyAvailables(teacher, teachers) &&
				allClasses[m].l[X][Y].currentTeacher === TeacherType_nullValue &&
				week.teacherSchedule[teacher][X][Y] === -1
			) {
				allClasses[m].l[X][Y].currentTeacher = teacher;
				teachers[teacher].remPeriods--;
				teachers[teacher].periodsHere.push(Pos);
				Object.keys(teachers).forEach((teacher) => {
					teachers[teacher].emptyAvailables = withoutPos(
						teachers[teacher].emptyAvailables,
						Pos
					);
				});
				week.teacherSchedule[teacher][X][Y] = m;
				if (week.refreshTable !== undefined) {
					week.refreshTable[m][X][Y]();
				}
			} else {
				console.warn(
					`Illegal put ${teacher} in ${week.allClasses[m].Name} in [${Pos[0]},${Pos[1]}]`
				);
			}
		} else {
			if (allClasses[m].l[X][Y].currentTeacher !== TeacherType_nullValue) {
				const theTeacherBeingRemoved = allClasses[m].l[X][Y].currentTeacher;
				allClasses[m].l[X][Y].currentTeacher = TeacherType_nullValue;
				teachers[theTeacherBeingRemoved].remPeriods++;
				teachers[theTeacherBeingRemoved].periodsHere = withoutPos(
					teachers[theTeacherBeingRemoved].periodsHere,
					Pos
				);
				// allClasses[m].l[X][Y].Options = removed(allClasses[m].l[X][Y].Options,teacher);
				Object.keys(teachers).forEach((t) => {
					if (contains(week.availables[t], Pos)) {
						teachers[t].emptyAvailables.push(Pos);
					}
				});
				week.teacherSchedule[theTeacherBeingRemoved][X][Y] = -1;
				if (week.refreshTable !== undefined) {
					week.refreshTable[m][X][Y]();
				}
			}
		}
	};
	const fastForward = async (week: IWEEK_GLOBAL_Object) => {
		console.time("fast");
		week.allClasses.forEach((Class: IClass, m: number) => {
			const empties: PosType[] = [];
			loopOverClass((u: number, v: number) => {
				if (
					Class.l[u][v].currentTeacher !== TeacherType_nullValue ||
					Class.l[u][v].isCemented
				)
					return;
				else empties.push([u, v]);
			});
			empties.forEach((Pos: PosType) => {
				const [u, v] = Pos;
				const teachers = Class.l[u][v].Options.sort(
					() => 0.5 - Math.random()
				);
				let ind = 0;
				while (
					Class.l[u][v].currentTeacher === TeacherType_nullValue &&
					ind < teachers.length
				) {
					const teacher = Class.l[u][v].Options[ind];
					someHowPutHimAt(m, teacher, [u, v], week, false);
					ind++;
				}
			});
		});
		console.timeEnd("fast");
	};

	function conflicts(
		...args:
			| [callNodeType]
			| [IActlistObj[], { Pos: PosType; m: number; teacher: string }]
	) {
		if (args.length === 1) {
			const vertix = args[0];
			if (
				vertix.week.allClasses[vertix.m].l[vertix.Pos[0]][vertix.Pos[1]]
					.isCemented
			) {
				return true;
			}
			for (let i = 0; i < vertix.Pivots.length; i++) {
				if (
					equals(vertix.Pivots[i].Pos, vertix.Pos) &&
					vertix.Pivots[i].m === vertix.m
				) {
					return true;
				} else if (
					vertix.Pivots[i].teacher === vertix.teacher &&
					equals(vertix.Pivots[i].Pos, vertix.Pos)
				) {
					return true;
				}
			}
			let tmp: callNodeType | null;
			if (vertix.parent !== undefined) tmp = vertix.parent;
			else
				throw {
					...vertix,
					message: "Parent is undefined!",
					where: "in conflicts",
				};
			while (tmp !== null) {
				if (equals(tmp.Pos, vertix.Pos) && tmp.m === vertix.m) {
					return true;
				} else if (
					tmp.teacher === vertix.teacher &&
					equals(tmp.Pos, vertix.Pos)
				) {
					return true;
				}
				if (tmp.parent !== undefined) {
					tmp = tmp.parent;
				} else {
					throw {
						...tmp,
						message: "Parent is undefined!",
						where: "in conflicts",
					};
				}
			}
			return false;
		} else if (args.length === 2) {
			const base = args[0];
			const Step = args[1];
			for (let i = 0; i < base.length; i++) {
				if (equals(base[i].Pos, Step.Pos) && base[i].m === Step.m) {
					return true;
				} else if (
					base[i].teacher === Step.teacher &&
					equals(base[i].Pos, Step.Pos)
				) {
					return true;
				}
			}
			return false;
		}
	}

	function preStrictConflicts(vertix: callNodeType) {
		let tmp: callNodeType | null;
		if (
			vertix.week.allClasses[vertix.m].l[vertix.Pos[0]][vertix.Pos[1]]
				.isCemented
		) {
			return true;
		}
		if (vertix.parent !== undefined) tmp = vertix.parent;
		else throw { ...vertix, message: `Parent is undefined` };
		while (tmp !== null) {
			if (equals(tmp.Pos, vertix.Pos) && tmp.m === vertix.m) {
				return true;
			} else if (tmp.teacher === vertix.teacher) {
				return true;
			}
			if (tmp.parent !== undefined) tmp = tmp.parent;
		}
		return false;
	}

	const MAX_CALLS = 5;
	let q: argumentsQueue = new argumentsQueue();

	function enoughSolutions(week: IWEEK_GLOBAL_Object): boolean {
		return week.activateList.length > MAX_CALLS;
	}
	function takeOneOffTheStack(vertix: callNodeType) {
		const debt = {
			...vertix.Pivots[vertix.Pivots.length - 1],
			parent: vertix,
			Pivots: [...vertix.Pivots],
		};
		debt.Pivots.pop();
		q.enqueue(debt);
	}
	/**
	 * Schedule re calls in another Class to free up the vertix.Pos in the vertix.m Class
	 * @param vertix Dummy vertix used for The Position [number,number] we need empty in next_m
	 * @param AfterReChainNode This will be added to the call stack and will be executed after any vertix generated by this pivot call finds a solution
	 */
	function pivotTo(vertix: callNodeType) {
		// should schedule the re calles to the queue
		if (vertix.pivotArgs === undefined) {
			throw { ...vertix, message: "call to pivotTo with missing pivotArgs" };
		} else if (!conflicts(vertix)) {
			const gen: number =
				vertix.pivotArgs.gen === undefined ? 1 : vertix.pivotArgs.gen + 1;
			const m = vertix.pivotArgs.next_m;
			const nextNode = vertix.pivotArgs.AfterReChainNode;
			const [X, Y] = vertix.Pos;
			const augmentedParent = vertix.pivotArgs.beforeReChainNode;
			const NewStack =
				vertix.pivotArgs.beforeReChainNode === null
					? [...vertix.Pivots]
					: [...vertix.pivotArgs.beforeReChainNode.Pivots];
			if (nextNode !== undefined) NewStack.push(nextNode);
			// const teachers = removed(vertix.week.allClasses[m].l[X][Y].Options, vertix.week.allClasses[m].l[X][Y].currentTeacher);
			const replacementTeachers = vertix.week.allClasses[m].l[X][Y].Options;
			const requirePivoting = replacementTeachers.filter(
				(replacementTeacher: string) => {
					if (
						replacementTeacher ===
						vertix.week.allClasses[m].l[X][Y].currentTeacher
					)
						return false;
					const s = situation(
						replacementTeacher,
						vertix.Pos,
						m,
						vertix.week
					);
					if (
						s.r === -1 ||
						(replacementTeacher ===
							vertix.week.allClasses[vertix.m].l[X][Y].currentTeacher &&
							s.r === vertix.m)
					) {
						q.enqueue({
							callTo: "re",
							parent: augmentedParent,
							teacher: replacementTeacher,
							Pos: vertix.Pos,
							m,
							week: vertix.week,
							cycleClosingParentName: replacementTeacher,
							Action: s.action,
							Pivots: [...NewStack],
						});
						return false;
					} else if (s.r === vertix.m) {
						return false;
					} else return true;
				}
			);
			if (replacementTeachers.length - 1 - requirePivoting.length >= 2)
				// doesn't require pivoting .length >=2
				return;
			else {
				// sample a random decreasing number of elements with each generation
				requirePivoting
					.sort(() => 0.5 - Math.random())
					.slice(0, Math.ceil(requirePivoting.length / gen));
				requirePivoting.forEach((replacementTeacher): void => {
					const s = situation(
						replacementTeacher,
						vertix.Pos,
						m,
						vertix.week
					);
					pivotTo({
						...vertix,
						Pivots: [...NewStack], // if augmentedParent is null [] would have got to the next gen
						callTo: "pivotTo",
						pivotArgs: {
							next_m: s.r,
							AfterReChainNode: {
								callTo: "re",
								parent: undefined,
								teacher: replacementTeacher,
								Pos: vertix.Pos,
								m,
								week: vertix.week,
								cycleClosingParentName: replacementTeacher,
								Action: s.action,
								Pivots: [...NewStack],
							},
							beforeReChainNode: augmentedParent,
							gen,
						},
					});
				});
			}
		}
	}
	/**
	 * back track and return the path to the root
	 * @param vertix leaf
	 */
	function backtrack(vertix: callNodeType): IActlistObj[] {
		let tmp: callNodeType | null = vertix;
		const solution: IActlistObj[] = [];
		while (tmp !== null) {
			solution.push({ teacher: tmp.teacher, Pos: tmp.Pos, m: tmp.m });
			if (tmp.parent === undefined) {
				throw { ...tmp, message: "parent undefined" };
			} else {
				tmp = tmp.parent;
			}
		}
		return solution;
	}
	/**
	 *
	 * @param vertix arguments for the pre call
	 */
	function pre(vertix: callNodeType) {
		const teacher = vertix.teacher;
		const m = vertix.m;
		const week = vertix.week;
		const solutions = week.activateList;
		if (!conflicts(vertix)) {
			const edges: PosType[] =
				week.allClasses[m].teachers[teacher].periodsHere ||
				getHisActPeriods(week.allClasses[m], teacher);
			const q_lenBefore = q.length();
			const localQueue = new argumentsQueue();
			edges.forEach((edge) => {
				const [edgeX, edgeY] = edge;
				const teachers = week.allClasses[m].l[edgeX][edgeY].Options;
				teachers.forEach((t) => {
					if (t === teacher) return;
					const newNode: callNodeType = {
						teacher: t,
						Pos: edge,
						m,
						week,
						callTo: "nothing",
						parent: vertix,
						Pivots: [...vertix.Pivots],
					};
					if (preStrictConflicts(newNode)) return;
					const s = situation(t, edge, m, week);
					if (s.action === "shift" && s.r === -1) {
						// push to solutions
						if (newNode.Pivots.length !== 0) {
							takeOneOffTheStack(newNode);
						} else {
							solutions.push(backtrack(newNode));
						}
					} else if (s.action === "cycle" && s.r === -1) {
						newNode.callTo = "pre";
						q.enqueue(newNode);
					} else if (s.action === "cycle" && s.r !== -1) {
						localQueue.enqueue({
							...newNode,
							callTo: "pivotTo",
							pivotArgs: {
								next_m: s.r,
								AfterReChainNode: {
									...newNode,
									callTo: "pre",
									parent: undefined,
								},
								beforeReChainNode: vertix,
							},
						});
					} else if (s.action === "shift" && s.r !== -1) {
						localQueue.enqueue({
							...newNode,
							callTo: "pivotTo",
							pivotArgs: {
								next_m: s.r,
								beforeReChainNode: vertix,
								AfterReChainNode: newNode,
							},
						});
					}
				});
			});
			const q_lenAfter = q.length();
			if (q_lenAfter - q_lenBefore < 3) {
				while (localQueue.notEmpty()) {
					// q.enqueue(localQueue.front())
					localQueue.callFront(re, pre, pivotTo);
					localQueue.dequeue();
				}
			}
		}
	}
	/**
	 * re Assumes that this step has r===-1
	 * @param vertix
	 * @returns
	 */
	function re(vertix: callNodeType) {
		const Pos = vertix.Pos;
		const m = vertix.m;
		const Action = vertix.Action;
		const week = vertix.week;
		const teacher = vertix.teacher;
		const solutions = week.activateList;
		const Pivots = [...vertix.Pivots];
		const S = situation(teacher, Pos, m, week);
		const oldTeacher = S.currTeacher;
		if (vertix.teacher === oldTeacher) return;
		const cyclingActionSatisfied = (aboutToBeSquashed: string) => {
			if (
				Action === "cycle" &&
				vertix.cycleClosingParentName === undefined
			) {
				throw {
					...vertix,
					message:
						"re is a cycle and the vertix.cycleClosingParentName is undefined!",
				};
			} else {
				return (
					Action === "cycle" &&
					vertix.cycleClosingParentName === aboutToBeSquashed
				);
			}
		};
		const localQueue = new argumentsQueue();
		const q_lenBefore = q.length();
		const madePivots: number = Pivots.length;
		if (!conflicts(vertix)) {
			if (
				((Action === "shift" && S.currTeacher === TeacherType_nullValue) ||
					cyclingActionSatisfied(S.currTeacher)) &&
				!conflicts(vertix)
			) {
				if (vertix.Pivots.length === 0) {
					solutions.push(backtrack(vertix));
				} else {
					// q.enqueue({...vertix.Pivots[vertix.Pivots.length-1] ,  parent: vertix})
					// vertix.Pivots.pop();
					takeOneOffTheStack(vertix);
				}
			} else {
				if (oldTeacher === TeacherType_nullValue) return;
				const edges: PosType[] = week.availables[oldTeacher].filter(
					(edge: PosType) => {
						let tmp: callNodeType | null = vertix;
						while (tmp !== null) {
							if (equals(tmp.Pos, edge)) return false;
							if (tmp.parent !== undefined) tmp = tmp.parent;
							// eslint-disable-next-line no-throw-literal
							else throw { ...tmp, message: "Parent is undefined!!" };
						}
						return true;
					}
				); // used Position filtered out
				edges.forEach((p): void => {
					const newSituation = situation(oldTeacher, p, m, week);
					const newNode: callNodeType = {
						teacher: oldTeacher,
						Pos: p,
						m,
						Pivots,
						week,
						parent: vertix,
						callTo: "nothing",
						cycleClosingParentName: vertix.cycleClosingParentName,
						Action,
					};
					if (
						((Action === "shift" &&
							newSituation.currTeacher === TeacherType_nullValue) ||
							cyclingActionSatisfied(newSituation.currTeacher)) &&
						newSituation.r === -1 &&
						!conflicts(newNode)
					) {
						if (newNode.Pivots.length === 0) {
							solutions.push(backtrack(newNode));
						} else {
							// q.enqueue({...vertix.Pivots[vertix.Pivots.length-1] ,  parent: vertix})
							// vertix.Pivots.pop();
							takeOneOffTheStack(newNode);
						}
					} else {
						if (newSituation.r === m) {
							// this condition should be equivilant to currentTeacher===oldTeacher
						} else if (newSituation.r === -1) {
							// this means that it's possible for the old teacher to be put in this Pos
							// but we still have to find a place to put the (current teacher at Pos1) in.
							q.enqueue({
								...newNode,
								callTo: "re",
							});
						} else {
							localQueue.enqueue({
								...newNode,
								callTo: "pivotTo",
								pivotArgs: {
									next_m: newSituation.r,
									beforeReChainNode: vertix,
									AfterReChainNode: {
										//<- re calls check if the called for is it self a solution
										...newNode,
										callTo: "re",
										parent: undefined,
									},
								},
							});
						}
					}
				});
			}
		}
		const q_lenAfter = q.length();
		if (q_lenAfter - q_lenBefore < 3 && madePivots < 3) {
			while (localQueue.notEmpty()) {
				// q.enqueue(localQueue.front())
				localQueue.callFront(re, pre, pivotTo);
				localQueue.dequeue();
			}
		}
	}
	const delegate = (
		teacher: string,
		Pos: PosType,
		m: number,
		week: IWEEK_GLOBAL_Object
	) => {
		const S = situation(teacher, Pos, m, week);
		/**
		 * {teacher,Pos,m,week,parent:null,callTo:'nothing',Pivots:[]}
		 */
		const rootVertix: callNodeType = {
			teacher,
			Pos,
			m,
			week,
			parent: null,
			callTo: "nothing",
			Pivots: [],
		};
		switch (situationInt(S)) {
			case 1: // t==='' & r===-1 & a ==='shift'
				console.log("->" + 1);
				week.Swaping = false;
				putHimAt(week, m, teacher, Pos, "put");
				break;
			case 2: // t==='' & r!==-1 & a ==='shift'
				console.log("->" + 2);
				// Pivot
				q.enqueue({
					...rootVertix,
					pivotArgs: { next_m: S.r, beforeReChainNode: rootVertix },
					callTo: "pivotTo",
				});
				break;
			case 3: // t==='' & r===-1 & a ==='cycle'
				console.log("->" + 3);
				// pre(teacher,Pos,m,week,[])
				q.enqueue({ ...rootVertix, callTo: "pre" });
				break;
			case 4: // t==='' & r!==-1 & a ==='cycle'
				console.log("->" + 4);
				q.enqueue({
					...rootVertix,
					callTo: "pivotTo",
					pivotArgs: {
						next_m: S.r,
						AfterReChainNode: {
							...rootVertix,
							parent: undefined,
							callTo: "pre",
						},
						beforeReChainNode: null,
					},
				});
				break;
			case 5: // t!=='' & r===-1 & a ==='shift'
				console.log("->" + 5);
				// re(teacher, Pos, m, week, [], S.action );
				q.enqueue({ ...rootVertix, callTo: "re", Action: S.action });
				break;
			case 6: // t!=='' & r!==-1 & a ==='shift'
				console.log("->" + 6);
				q.enqueue({
					...rootVertix,
					callTo: "pivotTo",
					pivotArgs: {
						next_m: S.r,
						AfterReChainNode: {
							...rootVertix,
							callTo: "re",
							Action: S.action,
						},
						beforeReChainNode: null,
					},
				});
				break;
			case 7: // t!=='' & r===-1 & a ==='cycle'
				console.log("->" + 7);
				q.enqueue({
					...rootVertix,
					callTo: "re",
					Action: S.action,
					cycleClosingParentName: rootVertix.teacher,
				});
				break;
			case 8: // t!=='' & r!==-1 & a ==='cycle'
				console.log("->" + 8);
				q.enqueue({
					...rootVertix,
					callTo: "pivotTo",
					pivotArgs: {
						next_m: S.r,
						AfterReChainNode: {
							...rootVertix,
							callTo: "re",
							parent: undefined,
							cycleClosingParentName: rootVertix.teacher,
							Action: S.action,
						},
						beforeReChainNode: null,
					},
				});
				break;
		}
		while (q.notEmpty() && !enoughSolutions(week)) {
			q.callFront(re, pre, pivotTo);
			q.dequeue();
		}
		q.unlock();
		q.eraseAll();
	};

	const Done = (m: number, week: IWEEK_GLOBAL_Object) => {
		return () => {
			const sol = week.activateList[week.currentSolutionNumber];
			if (sol === undefined) {
				week.Swaping = false;
				week.activateList = [];
				week.currentSolutionNumber = 0;
				week.forceUpdate && week.forceUpdate();
				return;
			}
			for (let i = 0; i < sol.length; i++) {
				putHimAt(week, sol[i].m, sol[i].teacher, sol[i].Pos, "remove");
			}
			for (let i = 0; i < sol.length; i++) {
				putHimAt(week, sol[i].m, sol[i].teacher, sol[i].Pos, "put");
			}

			week.Swaping = false;
			week.activateList = [];
			week.currentSolutionNumber = 0;
			week.forceUpdate && week.forceUpdate();
		};
	};
	const someHowPutHimAt = (
		m: number,
		teacher: string,
		Pos: PosType,
		week: IWEEK_GLOBAL_Object,
		freeze: boolean = true
	): void => {
		/*
	* discription*
	for each teacher available here in the original list in this cell
	for each pos in the shared postihions
	if the other teacher is in a pos in the shared one's just do a simple switch or promt for choice
	this should be enough?!
	?!
	*/
		//short hands
		week.Swaping = true;
		// week.HandyAny.beforeAction = [];
		// for (let i = 0; i < week.allClasses.length; i++) {
		// 	let acc = 0;
		// 	// Object.keys(week.allClasses[i].teachers).forEach(
		// 	// 	(teacher)=>{
		// 	// 	  acc = acc + week.allClasses[i].teachers[teacher].remPeriods;
		// 	// 	}
		// 	//   );
		// 	loopOverClass((u, v) => {
		// 		if (week.allClasses[i].l[u][v].currentTeacher === "") acc += 1;
		// 	});
		// 	week.HandyAny.beforeAction.push(acc);
		// }
		// week.HandyAny.test = () => {
		// 	if (week.HandyAny.beforeAction.length !== 0) {
		// 		console.log(week.HandyAny.beforeAction);
		// 	} else {
		// 		console.log("nothing");
		// 	}
		// 	week.HandyAny.beforeAction = [];
		// 	for (let i = 0; i < week.allClasses.length; i++) {
		// 		let acc = 0;
		// 		// Object.keys(week.allClasses[i].teachers).forEach(
		// 		// 	(teacher)=>{
		// 		// 	  acc = acc + week.allClasses[i].teachers[teacher].remPeriods;
		// 		// 	}
		// 		//   );
		// 		loopOverClass((u, v) => {
		// 			if (week.allClasses[i].l[u][v].currentTeacher === "") acc += 1;
		// 		});
		// 		week.HandyAny.beforeAction.push(acc);
		// 	}
		// 	console.log("became");
		// 	console.log(week.HandyAny.beforeAction);
		// };
		//   console.time('delegate')
		delegate(teacher, Pos, m, week);
		//   console.timeEnd('delegate')
		// if (week.activateList.length > 0) {
		// 	const ms: number[] = [];
		// 	week.activateList[week.currentSolutionNumber].forEach((step) => {
		// 		let in_ms = false;
		// 		for (let i = 0; i < ms.length; i++) {
		// 			if (ms[i] === step.m) {
		// 				in_ms = true;
		// 				break;
		// 			}
		// 		}
		// 		if (!in_ms) {
		// 			ms.push(step.m);
		// 		}
		// 	});
		// 	week.HandyAny.validate = (week: IWEEK_GLOBAL_Object) => {
		// 		ms.forEach((m) => {
		// 			let dict: any = {};
		// 			const Class = week.allClasses[m];
		// 			loopOverClass((i, j) => {
		// 				const t = Class.l[i][j].currentTeacher;
		// 				if (dict[t] === undefined) {
		// 					dict[t] = 1;
		// 				} else {
		// 					dict[t] += 1;
		// 				}
		// 			});
		// 			Object.keys(dict).forEach((key) => {
		// 				if (key !== "" && dict[key] > Class.teachers[key].Periods) {
		// 					console.log(`m : ${m} and the teacher is ${key}`);
		// 					// eslint-disable-next-line no-throw-literal
		// 					throw "shit";
		// 				}
		// 			});
		// 			console.log("allz good validated!!");
		// 		});
		// 		loopOverClass((i: number, j: number) => {
		// 			for (let mi = 0; mi < week.allClasses.length; mi++) {
		// 				let dict: any = {};
		// 				if (dict[week.allClasses[mi].l[i][j].currentTeacher] !== undefined) {
		// 					console.log(
		// 						`${
		// 							week.allClasses[mi].l[i][j].currentTeacher
		// 						} is at two places at once ${mi} and ${
		// 							dict[week.allClasses[mi].l[i][j].currentTeacher]
		// 						}`
		// 					);
		// 					throw "damit";
		// 				} else {
		// 					dict[week.allClasses[mi].l[i][j].currentTeacher] = mi;
		// 				}
		// 			}
		// 		});
		// 	};
		// 	week.HandyAny.runTests = () => {
		// 		console.log(
		// 			week.activateList[week.currentSolutionNumber].map((item) =>
		// 				JSON.stringify(item)
		// 			)
		// 		);
		// 		week.HandyAny.test();
		// 		week.HandyAny.validate(week);
		// 	};
		// }
		if (!freeze) {
			Done(m, week)();
		}

		week.forceUpdate && week.forceUpdate();
	};

	console.log(`got the week`, arg);
	const week = ((week: string): IWEEK_GLOBAL_Object => JSON.parse(week))(arg);
	randomFiller(week);
	fastForward(week);
	console.log("Worker: Posting message back to main script");
	return JSON.stringify(week);
};
