/* eslint-disable no-throw-literal */
import React from "react";
import { useState } from "react";
//import { IBasicTableProps } from "../Components/BasicTable";
import {
	IActlistObj,
	IClass,
	IWEEK_GLOBAL_Object,
} from "../Interfaces/Interfaces";
import { someHowPutHimAt } from "./CoreAlgo";
import {
	contains,
	controledPush,
	createEdgeIN,
	emptyObjArray,
	guard,
	guardPeriodsList,
	Key,
	listMinusAnother,
	loopOverClass,
	stringGuard,
	withoutPos,
} from "./util";

export function fill(week: IWEEK_GLOBAL_Object) {
	const availables = week.availables;
	const teachersGuild = week.teachersGuild;
	const allClasses: IClass[] = week.allClasses;
	let table: any = emptyObjArray(allClasses.length);
	allClasses.forEach((Class, m) => {
		loopOverClass((x, y) => {
			// scanning the teachers in the class
			Object.keys(Class.teachers).forEach((teacher) => {
				let [periods, PosList] = [
					Class.teachers[teacher].remPeriods,
					Class.teachers[teacher].emptyAvailables,
				];
				if (contains(availables[teacher], [x, y]) && periods > 0) {
					Class.l[x][y].Options.forEach((teacherAtThisPos) => {
						createEdgeIN(
							table[m],
							teacher,
							teacherAtThisPos,
							[x, y],
							teachersGuild
						);
					});
					Class.l[x][y].Options.push(teacher);
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					PosList = guard(PosList, [x, y]);
				}
			});
		});
		CementNoOtherOptionButToPutHere(allClasses, m, teachersGuild, week);
		Class.laps = table[m];
	});
}
export function teacherScheduleInit(
	week: IWEEK_GLOBAL_Object,
	availables: any
) {
	week.HandyAny.teacherSchedule = {};
	week.teachersGuild.forEach((teacher) => {
		week.HandyAny.teacherSchedule[teacher] = {};
		availables[teacher].forEach((Pos: [number, number]) => {
			const [X, Y] = Pos;
			week.HandyAny.teacherSchedule[teacher][X * 10 + Y] = -1;
		});
		loopOverClass((i, j) => {
			if (week.HandyAny.teacherSchedule[teacher][i * 10 + j] !== -1) {
				week.HandyAny.teacherSchedule[teacher][i * 10 + j] =
					Number.NEGATIVE_INFINITY;
			}
		});
	});
}
export function randomFiller(week: IWEEK_GLOBAL_Object) {
	const allClasses = week.allClasses;
	// random filler

	for (let m = allClasses.length - 1; m >= 0; m--) {
		const Class = allClasses[m];
		loopOverClass((i: number, j: number) => {
			if (
				Class.l[i][j].currentTeacher === "" &&
				Class.l[i][j].Options.length !== 0 &&
				!Class.l[i][j].isCemented
			) {
				const aOptions: string[] = actualOptions([i, j], m, week);
				if (aOptions.length > 0) {
					const teacher = aOptions[Math.floor(Math.random() * aOptions.length)];
					putHimAt(week, m, teacher, [i, j], "put");
				}
			}
		});
	}
}
export function useForceUpdate() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [value, setValue] = useState(0); // integer state
	return () => setValue((value) => value + 1); // update the state to force render
}
export function actualOptions(
	Pos: [number, number],
	m: number,
	week: IWEEK_GLOBAL_Object,
	command: "unfiltered" | "filtered" = "unfiltered"
) {
	const [X, Y] = Pos;
	const options = week.allClasses[m].l[X][Y].Options;
	const res = options.filter((teacher) => {
		return (
			week.HandyAny.teacherSchedule[teacher][X * 10 + Y] === -1 &&
			week.allClasses[m].teachers[teacher].remPeriods > 0
		);
	});
	if (command === "filtered" && res.length === 0) {
		return options;
	}
	return res;
}
// ------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------

export const teacherHasNoMoreemptyAvailables = (
	teacher: string,
	teachersList: any
): boolean => {
	if (teachersList[teacher] === undefined)
		console.log(`teachersList[${teacher}] = undefined`, teachersList);
	return teachersList[teacher].remPeriods < 1;
};

// const teacherIsntAvailableAt = function(
// 	allClasses : IClass[] ,
// 	m : number,
// 	teacher : string ,
// 	Pos : [number , number] ,
// 	refreshTable? : (()=>void) [][][],
// 	doit : boolean = true
// ){
// 	if(doit){
// 		const [x , y] = Pos;
// 		for (let i = 0 ; i<allClasses.length ;i++){
// 			if ( allClasses[i].l[x][y].Options.includes(teacher) && allClasses[i].l[x][y].currentTeacher !== teacher && i!==m){
// 				// remove from options
// 				// allClasses[i].l[x][y].Options = removed( allClasses[i].l[x][y].Options , teacher);
// 				//remove Pos as an availability for the teacher
// 				allClasses[i].teachers[teacher].emptyAvailables= guardRemove (allClasses[i].teachers[teacher].emptyAvailables , [x,y]);
// 				if(refreshTable !== undefined){
// 					refreshTable[i][x][y]();
// 				}
// 			}
// 		}
// 	}
// 	else{
// 		const [x , y] = Pos;
// 		for (let i = 0 ; i<allClasses.length ;i++){
// 			if ( allClasses[i].l[x][y].Options.includes(teacher)){
// 				// remove from options
// 				// allClasses[i].l[x][y].Options.push(teacher);
// 				//remove Pos as an availability for the teacher
// 				allClasses[i].teachers[teacher].emptyAvailables.push([x,y]);
// 				if(refreshTable !== undefined){
// 					refreshTable[i][x][y]();
// 				}
// 			}
// 		}
// 	}
// }

export const putHimAt = function (
	week: IWEEK_GLOBAL_Object,
	m: number,
	teacher: string,
	Pos: [number, number],
	op: "put" | "remove"
) {
	const doit: boolean = op === "put";
	const allClasses = week.allClasses;
	const [X, Y] = Pos;
	const teachers = allClasses[m].teachers;
	if (doit) {
		if (
			!teacherHasNoMoreemptyAvailables(teacher, teachers) &&
			allClasses[m].l[X][Y].currentTeacher === "" &&
			week.HandyAny.teacherSchedule[teacher][X * 10 + Y] === -1
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
			week.HandyAny.teacherSchedule[teacher][X * 10 + Y] = m;
			if (week.refreshTable !== undefined) {
				week.refreshTable[m][X][Y]();
			}
		} else {
			console.warn(
				`Illegal put ${teacher} in ${week.allClasses[m].Name} in [${Pos[0]},${Pos[1]}]`
			);
		}
	} else {
		if (allClasses[m].l[X][Y].currentTeacher !== "") {
			const theTeacherBeingRemoved = allClasses[m].l[X][Y].currentTeacher;
			allClasses[m].l[X][Y].currentTeacher = "";
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
			week.HandyAny.teacherSchedule[theTeacherBeingRemoved][X * 10 + Y] = -1;
			if (week.refreshTable !== undefined) {
				week.refreshTable[m][X][Y]();
			}
		}
	}
};
export const CementNoOtherOptionButToPutHere = (
	School: IClass[],
	m: number,
	teachersGuild: string[],
	week: IWEEK_GLOBAL_Object
) => {
	const Class = School[m];
	Object.keys(Class.teachers).forEach((teacher) => {
		let [periods, PosList] = [
			Class.teachers[teacher].remPeriods,
			Class.teachers[teacher].emptyAvailables,
		];
		if (periods === PosList?.length) {
			const GuardedPosList = guardPeriodsList(PosList);
			GuardedPosList.forEach((Pos) => {
				putHimAt(week, m, teacher, Pos, "put");
				Class.l[Pos[0]][Pos[1]].isCemented = true;
			});
		}
	});
};
export const noOtherOptionButToPutHere = (
	School: IClass[],
	m: number,
	teachersGuild: string[],
	week: IWEEK_GLOBAL_Object
) => {
	const Class = School[m];
	Object.keys(Class.teachers).forEach((teacher) => {
		let [periods, PosList] = [
			Class.teachers[teacher].remPeriods,
			Class.teachers[teacher].emptyAvailables,
		];
		if (periods === PosList?.length) {
			const GuardedPosList = guardPeriodsList(PosList);
			GuardedPosList.forEach((Pos) => {
				putHimAt(week, m, teacher, Pos, "put");
			});
		}
	});
};
// const autoFill = function (
//   School: IClass[],
//   m: number,
//   teachersGuild: string[],
//   week: IWEEK_GLOBAL_Object
// ) {
//   let xxx = 0;
//   for (let x = 0; x < School[m].l.length; x++) {
//     for (let y = 0; y < School[m].l[x].length; y++) {
//       if (
//         School[m].l[x][y].Options.length === 1 &&
//         School[m].l[x][y].currentTeacher === ""
//       ) {
//         //do the change
//         someHowPutHimAt(m, School[m].l[x][y].Options[0], [x, y], week);

//         //alert(`here in [${x},${y}] calling with ${School[i].l[x][y].Options[0]}  who ${(teacherHasNoMoreemptyAvailables(School[i].l[x][y].Options[0] ,School[i].teachers)?'has NOOOOO more':'has more')}`);
//         //go back to the start to see if your changes affected what you have already checked

//         //do a clean if the teacher has no more periods
//         // debuging risky over looping infinite loop
//         if (xxx < 100) {
//           x = 0;
//           y = 0;
//           xxx++;
//         } else {
//           alert(`OK here is the deal infinite loop \n Again `);
//         }
//       }
//     }
//   }
// };
export const SwitchEventHander = (
	Pos: [number, number],
	School: IClass[],
	m: number,
	teachersGuild: string[],
	week: IWEEK_GLOBAL_Object
) => {
	return (event: React.ChangeEvent<{ value: unknown }>) => {
		let teacher: string = stringGuard(event.target.value);
		console.clear();
		someHowPutHimAt(m, teacher, Pos, week);
		//clean teacher name from other places
		//auto fill when only one name remain in a place
		// autoFill(School,m,teachersGuild,week);
		//must be put here algorithm
		//I have to see if
		// noOtherOptionButToPutHere(School , m , teachersGuild, week);
	};
};

export const threeTeachersOptionsList = (
	teacher: string,
	oldTeacher: string,
	oldTeacherAvailables: [number, number][],
	m: number,
	Pos: [number, number],
	week: IWEEK_GLOBAL_Object
): IActlistObj[][] => {
	//const week = week;
	const allClasses = week.allClasses;
	const teachersGuild = week.teachersGuild;
	const [x, y] = Pos;
	const Class = allClasses[m];
	// Pos where we can put old teacher in but not the new
	const opthree: [number, number][] = listMinusAnother(
		oldTeacherAvailables,
		Class.laps[Key(teacher, oldTeacher, teachersGuild)]
	);
	let result: IActlistObj[][] = [];
	opthree.forEach((rPos) => {
		const middleTeachers: string[] = Class.l[rPos[0]][rPos[1]].Options;
		if (middleTeachers !== undefined) {
			middleTeachers.forEach((middleTeacher: string) => {
				if (
					contains(Class.laps[Key(teacher, middleTeacher, teachersGuild)], [
						x,
						y,
					])
				) {
					// intersection between oldteacher and middle teacher and lets call it -> N
					const N = Class.laps[Key(oldTeacher, middleTeacher, teachersGuild)];
					if (N !== undefined) {
						N.forEach((pos: [number, number]) => {
							if (Class.l[pos[0]][pos[1]].currentTeacher === middleTeacher) {
								controledPush(result, [
									{ teacher, Pos: [x, y], m },
									{ teacher: oldTeacher, Pos: pos, m },
									{ teacher: middleTeacher, Pos: rPos, m },
								]);
							}
						});
					}
				}
			});
		} else {
			alert(`Class.l[${rPos[0]}][${rPos[1]}] + ${Class.l[rPos[0]][rPos[1]]}`);
		}
	});
	return result;
};

// this is a tripple swap
// intersection( sth [Key (teacher1 , teacher2 )] , sth [Key (teacher3 , teacher2 )] , sth [Key (teacher1 , teacher3 )])
