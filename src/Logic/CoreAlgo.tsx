import { IClass, IWEEK_GLOBAL_Object } from "../Components/Week";
import { actualOptions, putHimAt } from "./Logic";
import { util, actionType, withoutPos, equals } from "./util";

export type IActlistObj = {
	Pos: [number, number];
	m: number;
	teacher: string;
};

// function sleep(milliseconds: number) {
// 	const date = Date.now();
// 	let currentDate = null;
// 	do {
// 	 currentDate = Date.now();
// 	} while (currentDate - date < milliseconds);
// }
function conflicts(base:{ Pos: [number, number]; m: number; teacher: string }[],Step:{ Pos: [number, number]; m: number; teacher: string }) {
    for (let i = 0 ; i < base.length ; i++){
            if (equals(base[i].Pos,Step.Pos) && base[i].m === Step.m)
                return true   
    }
    return false
}
// a good design patten is to have the next function throw and error in case of a conflict
// so I won't use it the way it is since it have unpredictiable nor stable matter
// function baseSetPush (base:{ Pos: [number, number]; m: number; teacher: string }[],Step:{ Pos: [number, number]; m: number; teacher: string }){
//     if (!conflicts(base,Step)){
//         base.push(Step)
//     }
// }
function re(
	teacher: string,
	Pos: [number, number],
	m: number,
	week: IWEEK_GLOBAL_Object,
	base: { Pos: [number, number]; m: number; teacher: string }[],
	action: actionType,
	misc: { depth?: number, oldM?: number ,actList_Length?:number } = {}
) {
	// put the teacher in and start eating the edges to find your solutions
	// edges are places to move the current teacher elsewhere
	// here we work under the assumtion that reason is -1
	// recursion base condition
    // unpack misc
	const oldM = (misc.oldM === 0)?0:(misc.oldM || m);
	const depth = misc.depth || 5;
    const ActList_Length_beforeDisRe : number = misc.actList_Length || 0;
    const Action : actionType = (m !== oldM)?util.situation(teacher, Pos, m, week).action:action;
    const enoughSolutions = () => week.activateList.length-ActList_Length_beforeDisRe > 5 ;
    console.log(
	 `teacher ${teacher}
     Pos ${JSON.stringify(Pos)}
     m ${m}
     base ${JSON.stringify(base).replaceAll('],[','\n--------\n').replaceAll('[{',
     '\n{').replaceAll('}]','}\n')}
     ---------------------------------
     actionStack ${Action}
     aug_misc ${JSON.stringify({preproOldM:misc.oldM,oldM,depth,ActList_Length_beforeDisRe})}
     actlist${JSON.stringify(week.activateList.slice(ActList_Length_beforeDisRe)).replaceAll('],[','\n--------\n').replaceAll('[{',
     '\n{').replaceAll('}]','}\n')}`
	);
    
    const step = { Pos, teacher, m };
    
	if (depth !== 0 && !enoughSolutions() && !conflicts(base,step)) {
	 // a safe guard
	 //short-hands
	 const solutions = week.activateList;
	 base.push(step);
	 const [X, Y] = Pos;
	 const oldTeacher = week.allClasses[m].l[X][Y].currentTeacher;
	 if (oldTeacher === "") {
		if (Action === "shift") {
			// Done
			solutions.push(util.copyInstructions(base));
		}
		// if cycle then this empty slot is useless
	 } else {
		const edges: [number, number][] = withoutPos(
			week.availables[oldTeacher],
			Pos
		);
		const requireWork: [number, number][] = edges.filter((Pos1) => {
			// check if this Pos1 is a valid answer to our problem by repeating the conditions above for starters
			// if true then execute what's inside the privious if statement and
			// return false so that it's removed
			if ( enoughSolutions() ) return false;
			const [X1, Y1] = Pos1;
			const t1 = week.allClasses[m].l[X1][Y1].currentTeacher;
            const a1 = { Pos: Pos1, teacher: oldTeacher, m };
			if (
            ((Action === "shift" && t1 === "") ||
			 (Action === "cycle" &&
				base[0] !== undefined &&
				base[0].teacher === t1)) && 
                !conflicts(base,a1)
             ) {
			 base.push(a1);
			 solutions.push(util.copyInstructions(base));
			 // remove the a1 from the base because it is a reference and you don't what to fuck up your recursion
			 base.pop();
			 return false;
			} else {
			 return true;
			}
		});
		const requirePivoting = requireWork.filter((Pos1) => {
			// looking for a place for the oldTeacher to call re with
			// and try a solution where he is at Pos1
			if (enoughSolutions()) return false;
			const S1 = util.situation(oldTeacher, Pos1, m, week);
			if (S1.r === m) {
			 // this condition should be equivilant to currentTeacher===oldTeacher
			 return false;
			} else if (S1.r === -1) {
			 // this means that it's possible for the old teacher to be put in this Pos
			 // but we still have to find a place to put the (current teacher at Pos1) in.
			 re(oldTeacher, Pos1, m, week, base, Action, {
				depth: depth - 1,
				oldM,
			 });
			 return false;
			}
			return true;
		});
		requirePivoting.forEach((p) => {
			// const [x,y] = p;
			if (enoughSolutions()) return false;
			const s = util.situation(oldTeacher, p, m, week);
			const teachersToFillTheOtherPlace = actualOptions(p, m, week);
			teachersToFillTheOtherPlace.forEach((replacementTeacher) => {
			 re(replacementTeacher, p, s.r, week, base, Action, {
				depth: depth - 1,
				oldM: m,
			 });
			});
		});
	 }
	}
	// remove the a from the base because it is a reference and you don't what to fuck up your recursion
	base.pop();
}

export const someHowPutHimAt = (
	m: number,
	teacher: string,
	Pos: [number, number],
	week: IWEEK_GLOBAL_Object,
	freeze: boolean = true
): void => {
	//short hands
	const allClasses = week.allClasses;
	const Class = allClasses[m];
	const [x, y] = Pos;
	/*
				* discription*
	for each teacher available here in the original list in this cell
	for each pos in the shared postihions
	if the other teacher is in a pos in the shared one's just do a simple switch or promt for choice
	this should be enough?!
	?!
	*/
	if (Class.l[x][y].currentTeacher === "") {
	 putHimAt(week, m, teacher, Pos, true);
	 return;
	} else if (
	 Class.l[x][y].currentTeacher !== teacher &&
	 Class.l[x][y].Options.includes(teacher)
	) {
	 week.Swaping = true;
	 const delegate = (
		teacher: string,
		Pos: [number, number],
		m: number,
		week: IWEEK_GLOBAL_Object
	 ) => {
		const situationInt = util.situationInt;
		const [X, Y] = Pos;
		const S = util.situation(teacher, Pos, m, week);
		switch (situationInt(S)) {
			case 1: // t=='' & r==-1 & a =='shift
			 console.log("->" + 1);
			 putHimAt(week, m, teacher, Pos, true);
			 break;
			case 2: // t=='' & r!=-1& a =='shift
			 console.log("->" + 2);
			 // Pivot
			 const takeHisPlace = week.allClasses[S.r].l[X][Y].Options;
			 takeHisPlace.forEach((t) => {
				// someHowPutHimAt(m,t,Pos,week) there could be an inf recursion
				// here I assumed re would work and thus already assigned the the first teacher
				re(t, Pos, S.r, week, [{ Pos, m, teacher }], S.action , {
					oldM: m,
				});
			 });
			 break;
			case 3: // t=='' & r==-1 & a =='cycle'
			 console.log("->" + 3);
			 // use re functionality
			 re(teacher, Pos, m, week, [], S.action);
			 break;
			case 4: // t=='' & r!=-1 & a =='cycle'
			 console.log("->" + 4);
			 re(teacher, Pos, m, week, [], S.action);
			 const pivot = week.activateList.length;
			 const takeHisPlace_4 = week.allClasses[S.r].l[X][Y].Options;
			 takeHisPlace_4.forEach((t) => {
				// someHowPutHimAt(m,t,Pos,week) there could be an inf recursion
				// here I assumed re would work and thus already assigned the the first teacher
				re(t, Pos, S.r, week, [{ Pos, m, teacher }], S.action , {
					oldM: m,
				});
			 });
			 week.activateList = util.ruffleShuffle(week.activateList, pivot);
			 break;
			case 5: // t!='' & r==-1 & a =='shift'
			 console.log("->" + 5);
			 re(teacher, Pos, m, week, [], S.action );
			 break;
			case 6: // t!='' & r!=-1 & a =='shift'
			 console.log("->" + 6);
			 re(teacher, Pos, m, week, [], S.action );
			 const pivo = week.activateList.length;
			 const takeHisPlace6 = week.allClasses[S.r].l[X][Y].Options;
			 takeHisPlace6.forEach((t) => {
				// someHowPutHimAt(m,t,Pos,week) there could be an inf recursion
				// here I assumed re would work and thus already assigned the the first teacher
				re(t, Pos, S.r, week, [], S.action , { oldM: m });
			 });
			 week.activateList = util.ruffleShuffle(week.activateList, pivo);
			 break;
			case 7: // t!='' & r==-1 & a =='cycle'
			 console.log("->" + 7);
			 re(teacher, Pos, m, week, [], S.action );
			 break;
			case 8: // t!='' & r!=-1 & a =='cycle'
			 console.log("->" + 8);
			 re(teacher, Pos, m, week, [], S.action );
			 const pivot8 = week.activateList.length;
			 const takeHisPlace8 = week.allClasses[S.r].l[X][Y].Options;
			 console.log("Second re is Starting...");
			 takeHisPlace8.forEach((tempT) => {
				// someHowPutHimAt(m,t,Pos,week) there could be an inf recursion
				// here I assumed re would work and thus already assigned the the first teacher
				re(tempT, Pos, S.r, week, [], S.action, { oldM: m , actList_Length:pivot8 });
			 });
			 if (week.activateList.length === pivot8)
				alert("shit ruffleShuffle will return empty list");
			 week.activateList = util.ruffleShuffle(week.activateList, pivot8);
			 break;
			default:
			 alert("impossible");
			 break;
		}
	 };

	 delegate(teacher, Pos, m, week);

	 if (!freeze) {
		Done(allClasses, m, week)({});
	 }

	 week.forceUpdate();
	}
};
export const Done = (
	School: IClass[],
	m: number,
	week: IWEEK_GLOBAL_Object
) => {
	return (e: any) => {
	 const sol = week.activateList[week.currentSolutionNumber];
	 if (sol === undefined) {
		return;
	 }
	 for (let i = 0; i < sol.length; i++) {
		if (sol[i].teacher === "") {
			putHimAt(
			 week,
			 m,
			 School[m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher,
			 sol[i].Pos,
			 false
			);
		}
	 }
	 for (let i = 0; i < sol.length; i++) {
		if (!(sol[i].teacher === "")) {
			if (School[m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher !== "") {
			 putHimAt(
				week,
				m,
				School[m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher,
				sol[i].Pos,
				false
			 );
			}
		}
	 }
	 for (let i = 0; i < sol.length; i++) {
		if (!(sol[i].teacher === "")) {
			putHimAt(week, m, sol[i].teacher, sol[i].Pos);
		}
	 }

	 week.Swaping = false;
	 week.activateList = [];
	 week.currentSolutionNumber = 0;
	 week.forceUpdate();
	};
};

/*
<sc<script></script><script>alert('hi');</sc<script></script><script>
<<ss >script>alert('hi');<<ss >/script>
*/
