export type PosType = [number, number];

export const TeacherType_nullValue: string = "";
export const TeacherType_WildCard: string = "*";

export type refreshTableType = (() => void)[][][];
export type tableFooterRefresherType = (() => void)[];
export type availablesType = PosType[][];
export type teacherScheduleType = (number | null)[][];
