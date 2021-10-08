import { PosType, string, TeacherType_nullValue } from "../types";
import { ClassTeacherData, IClass } from "./Interfaces";
import { IClassTeachers, lCellObj } from "./Interfaces";

export const NUM_OF_DAYS = 5;
export const NUM_OF_PERIODS_PER_DAY = 7;

class cellClass implements lCellObj {
	currentTeacher: string = TeacherType_nullValue;
	isCemented: boolean = false;
	Options: string[] = [];
}
class TeacherClass implements ClassTeacherData {
	Periods: number;
	remPeriods: number;
	emptyAvailables: PosType[] = [];
	periodsHere: PosType[] = [];
	constructor(Periods: number) {
		this.Periods = Periods;
		this.remPeriods = Periods;
	}
}
export default class ClassObj implements IClass {
	l: lCellObj[][] = Array(NUM_OF_DAYS).fill(
		Array(NUM_OF_PERIODS_PER_DAY).fill(new cellClass())
	);
	Name: string = "";
	teachers: IClassTeachers = {};
	/**
	 * refreshTable
	 */
	public refreshTable(): (() => void)[][] {
		return Array(NUM_OF_DAYS).fill(
			Array(NUM_OF_PERIODS_PER_DAY).fill(() => {})
		);
	}
	public addTeacher(teacher: string, Periods: number) {
		this.teachers[teacher] = new TeacherClass(Periods);
	}
}
