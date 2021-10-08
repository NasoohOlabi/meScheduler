/* eslint-disable no-throw-literal */
import {
	IActlistObj,
	IClass,
	IWEEK_GLOBAL_Object,
} from "../Interfaces/Interfaces";
import { PosType, TeacherType_nullValue, TeacherType_WildCard } from "../types";

// testing git here

export const equals = (a: PosType, b: PosType) => {
	return a[0] === b[0] && a[1] === b[1];
};
export const contains = (a: PosType[], Pos: PosType) => {
	for (let i = 0; i < a.length; i++) {
		if (equals(a[i], Pos)) {
			return true;
		}
	}
	return false;
};
export const withoutPos = (lst: PosType[], Pos: PosType) => {
	return lst.filter((p) => !equals(Pos, p));
};
export const removed = (S: string[], s: string) => {
	return S.slice(0, S.indexOf(s)).concat(S.slice(S.indexOf(s) + 1));
};
export const stringGuard = (arg: unknown): string => {
	if (typeof arg === "string") {
		return arg;
	} else {
		return "";
		//do sth
	}
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
export const listMinusAnother = (a: PosType[], b: PosType[]): PosType[] => {
	const result: PosType[] = [];
	for (let i = 0; i < a.length; i++) {
		if (!contains(b, a[i])) {
			result.push(a[i]);
		}
	}
	return result;
};
export const notInBase_copy = (
	a: PosType[],
	m: number,
	base: IActlistObj[]
): PosType[] => {
	const result: PosType[] = [];
	a.forEach((Pos) => {
		let notInBase = true;
		for (let j = 0; j < base.length; j++) {
			if (equals(base[j].Pos, Pos) && base[j].m === m) {
				notInBase = false;
				break;
			}
		}
		if (notInBase) result.push(Pos);
	});
	return result;
};
export const loopOverClass = (
	f: (i: number, j: number) => void,
	n = 5,
	m = 7
) => {
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

function ruffleShuffle(
	arr: { Pos: PosType; m: number; teacher: string }[][],
	pivot: number
): { Pos: PosType; m: number; teacher: string }[][] {
	// a = [0,1,2,3,4,5,6]
	// b = [0,1,2,3,4,5,6]
	if (pivot > arr.length || pivot < 0) {
		alert("Fuck!! went wrong. ruffleShuffle returned empty list");
	}
	const res = [];
	for (let i = 0; i < pivot; i++) {
		for (let j = pivot; j < arr.length; j++) {
			res.push(arr[i].concat(arr[j]));
		}
	}
	return res;
}
export type actionType = "shift" | "cycle";
function stepMatch(a: IActlistObj, wild: IActlistObj | undefined): boolean {
	if (wild === undefined) return false;
	const skipTeacherMatching = wild.teacher === TeacherType_WildCard;
	const skipPosMatching = equals(wild.Pos, [-1, -1]);
	return (
		(a.Pos === wild.Pos || skipPosMatching) &&
		(a.teacher === wild.teacher || skipTeacherMatching) &&
		a.m === wild.m
	);
}
export const util = {
	copyInstructions,
	copyInstruction,
	pickAction,
	situation,
	situationInt,
	ruffleShuffle,
	stepMatch,
	getHisActPeriods,
	removed,
};
