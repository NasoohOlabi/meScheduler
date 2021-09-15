import {  IWEEK_GLOBAL_Object , IActlistObj , IMisc, PivotsCallStack} from "../Interfaces/Interfaces";
import {  putHimAt } from "./Logic";
import { util, actionType, equals, notInBase_copy, loopOverClass } from "./util";

function conflicts(base:IActlistObj[],Step:{ Pos: [number, number]; m: number; teacher: string }) {
	for (let i = 0 ; i < base.length ; i++){
			if (equals(base[i].Pos,Step.Pos) && base[i].m === Step.m){
				return true;  
			}
			else if (base[i].teacher === Step.teacher && equals(base[i].Pos,Step.Pos)){
				return true;
			}
	}
	return false;
}
function preStrictConflicts(base:IActlistObj[],Step:{ Pos: [number, number]; m: number; teacher: string }) {
	for (let i = 0 ; i < base.length ; i++){
			if (equals(base[i].Pos,Step.Pos) && base[i].m === Step.m){
				return true;  
			}
			else if (base[i].teacher === Step.teacher){
				return true;
			}
	}
	return false;
}

function enoughSolutions (offset : number | undefined , week:IWEEK_GLOBAL_Object) : boolean{
	return ( week.activateList.length - (offset||0) ) > 5;
}

/**
 * Pre assume r = -1 and action is "cycle" and findes teacher
 */
function pre(
	teacher: string,
	Pos: [number, number],
	m: number,
	week: IWEEK_GLOBAL_Object,
	base: IActlistObj[],
	misc: IMisc = {}
){
	if (misc.depth === 0)	return;
	const depth = misc.depth || 5;
	if (misc.Pivots === undefined)
		misc.Pivots = new PivotsCallStack(5);
	const pivots : PivotsCallStack = misc.Pivots || new PivotsCallStack(5);
	const step = { Pos, teacher, m };
	const solutions = week.activateList;
	if (depth !== 0 && !enoughSolutions(misc.actList_Length,week) && !conflicts(base,step)) {
		base.push(step);
		const edges : [number,number][]= util.getHisActPeriods(week.allClasses[m],teacher);
		edges.forEach(
			(edge)=>{
				const [edgeX,edgeY] = edge;
				const teachers = util.removed(week.allClasses[m].l[edgeX][edgeY].Options , teacher);
				teachers.forEach(t => {
					if (preStrictConflicts(base,{teacher:t,Pos:edge,m}))
						return;
					const s = util.situation(t,edge,m,week);
					if (s.action === 'shift' && s.r === -1){
						// push to solutions
						base.push({Pos:edge,teacher:t,m});
						if (pivots !== undefined && pivots.notEmpty()){
							pivots.run(base);
						}
						else{
							solutions.push(util.copyInstructions(base));
						}
						base.pop();
					}
					else if (s.action === 'cycle' && s.r === -1){
						pre(t,edge,m,week,base, {...misc, depth:depth-1})
					}
					else if (s.action === 'cycle' && s.r !== -1 && depth > 1){
						if( 
							pivots.push((base)=>{
								pivotTo(s.r,edge,base,week,{...misc , depth: depth-1})
							})
						){
							pre(t,edge,m,week,base, {...misc, depth: depth-1});
							pivots.pop();
						}
					}
					else if (s.action === 'shift' && s.r !== -1 && depth > 1){
						if( 
							pivots.push((base)=>{
								pivotTo(s.r,edge,base,week,{...misc , depth: depth-1})
							})
						){
							base.push({Pos:edge,teacher:t,m});
							if (pivots !== undefined && pivots.notEmpty()){
								pivots.run(base);
							}
							else{
								solutions.push(util.copyInstructions(base));
							}
							base.pop();
							pivots.pop()
						}
					}
				}
				);
			}
		);
		// week.allClasses[step.m].l[step.Pos[0]][step.Pos[1]].currentTeacher = oldTeacher
		base.pop();
	}
}
function re(
	teacher: string,
	Pos: [number, number],
	m: number,
	week: IWEEK_GLOBAL_Object,
	base: IActlistObj[],
	Action: actionType,
	misc: IMisc = {},
) {
	if (misc.depth === 0)	return;
	const depth = misc.depth || 5;
	const cycleCloser : number = (misc.baseLength === undefined)?0:misc.baseLength;
	misc.depth = depth;
	if (misc.Pivots === undefined)
		misc.Pivots = new PivotsCallStack(5);
	const pivots : PivotsCallStack = misc.Pivots || new PivotsCallStack(5);
	if (enoughSolutions(misc.actList_Length,week)) return;
	const step = { Pos, teacher, m };
	const [X, Y] = Pos;
	const oldTeacher = week.allClasses[m].l[X][Y].currentTeacher;
	const solutions = week.activateList;
	
	if (depth !== 0 && !enoughSolutions(misc.actList_Length,week) && !conflicts(base,step)) {
		// a safe guard
		//short-hands
		base.push(step);
		week.allClasses[step.m].l[step.Pos[0]][step.Pos[1]].currentTeacher = step.teacher
		if (oldTeacher === "") {
			if (Action === "shift") {
				// Done
				if (pivots !== undefined && pivots.notEmpty()){
					pivots.run(base);
				}
				else{
					solutions.push(util.copyInstructions(base));
				}
			}
			// if cycle then this empty slot is useless
		} else {
			const edges: [number, number][] = notInBase_copy(
				week.availables[oldTeacher],
				m,
				base
			);
			const requireWork: [number, number][] = edges.filter((Pos1) => {
				// check if this Pos1 is a valid answer to our problem by repeating the conditions above for starters
				// if true then execute what's inside the privious if statement and
				// return false so that it's removed
				if ( enoughSolutions(misc.actList_Length,week) ) return false;
				const [X1, Y1] = Pos1;
				const t1 = week.allClasses[m].l[X1][Y1].currentTeacher;
				const a1 = { Pos: Pos1, teacher: oldTeacher, m };
				if (
					(
						(Action === "shift" && t1 === "") ||
						(
							Action === "cycle" &&
							base[cycleCloser] !== undefined &&
							base[cycleCloser].teacher === t1
							)
					) && 
					!conflicts(base,a1)
				) {
				base.push(a1);
				if (pivots !== undefined && pivots.notEmpty()){
					pivots.run(base);
				}
				else{
					solutions.push(util.copyInstructions(base));
				}
				base.pop();
				return false;
				} else {
				return true;
				}
			});
			if (depth > 1){
				const requirePivoting = requireWork.filter((Pos1) => {
					// looking for a place for the oldTeacher to call re with
					// and try a solution where he is at Pos1
					if (enoughSolutions(misc.actList_Length,week)) return false;
					const S1 = util.situation(oldTeacher, Pos1, m, week);
					if (S1.r === m) {
						// this condition should be equivilant to currentTeacher===oldTeacher
					return false;
					} else if (S1.r === -1) {
						// this means that it's possible for the old teacher to be put in this Pos
						// but we still have to find a place to put the (current teacher at Pos1) in.
						re(oldTeacher, Pos1, m, week, base, Action, {...misc,
							depth: depth - 1,
						});
						return false;
					}
					return true;
				});
				if (pivots._accepting && depth > 2)
				requirePivoting.forEach((p) => {
					const s = util.situation(oldTeacher, p, m, week);
					if (
						pivots.push((base : IActlistObj[])=>{
							pivotTo(s.r,p,base,week,{...misc , depth : depth-1})
						})
					){
						re(oldTeacher, p, m, week, base, Action, {...misc, depth : depth-1});
						pivots.pop()
					}
				});
			}
		}
		// remove the a from the base because it is a reference and you don't what to fuck up your recursion
		week.allClasses[step.m].l[step.Pos[0]][step.Pos[1]].currentTeacher = oldTeacher
		base.pop();
	}
}
const delegate = (
	teacher: string,
	Pos: [number, number],
	m: number,
	week: IWEEK_GLOBAL_Object
 ) => {
	const situationInt = util.situationInt;
	const S = util.situation(teacher, Pos, m, week);
	switch (situationInt(S)) {
		case 1: // t==='' & r===-1 & a ==='shift'
			console.log("->" + 1);
			week.Swaping = false;
			putHimAt(week, m, teacher, Pos, {doit:true});
			break;
		case 2: // t==='' & r!==-1 & a ==='shift'
			console.log("->" + 2);
			// Pivot
			pivotTo(S.r,Pos,[{Pos,m,teacher}],week);
			break;
		case 3: // t==='' & r===-1 & a ==='cycle'
			console.log("->" + 3);
			pre(teacher,Pos,m,week,[])
			break;
		case 4: // t==='' & r!==-1 & a ==='cycle'
			console.log("->" + 4);
			pre(teacher, Pos, m, week, [] , 
				{Pivots: new PivotsCallStack(5,
					(base:IActlistObj[])=>{
						pivotTo(S.r,Pos,base,week,{actList_Length:week.activateList.length});
					}
			)}); 
			break;
		case 5: // t!=='' & r===-1 & a ==='shift'
			console.log("->" + 5);
			re(teacher, Pos, m, week, [], S.action );
			break;
		case 6: // t!=='' & r!==-1 & a ==='shift'
			console.log("->" + 6);
			re(teacher, Pos, m, week, [], S.action , {Pivots : new PivotsCallStack(5,(base : IActlistObj[])=>{
				pivotTo(S.r,Pos,base,week,{actList_Length : week.activateList.length});
			})});
			break;
		case 7: // t!=='' & r===-1 & a ==='cycle'
			console.log("->" + 7);
			re(teacher, Pos, m, week, [], S.action );
			break;
		case 8: // t!=='' & r!==-1 & a ==='cycle'
			console.log("->" + 8);
			re(teacher, Pos, m, week, [], S.action , {Pivots : new PivotsCallStack(5,(base : IActlistObj[])=>{
				pivotTo(S.r,Pos,base,week,{actList_Length : week.activateList.length});
			})});
			break;
		default:
			alert("impossible");
			break;
	}
};
function pivotTo(m:number, Pos : [number,number], base : IActlistObj[] ,week : IWEEK_GLOBAL_Object, misc : IMisc = {}){
	const [X,Y] = Pos;
	if (misc.depth === 1 ) return; // re needs at least two steps to empty a Pos
	util.removed(week.allClasses[m].l[X][Y].Options, week.allClasses[m].l[X][Y].currentTeacher).forEach((replacementTeacher : string)=>{
		// the wrong action seems to be getting throw
		const s = util.situation(replacementTeacher,Pos,m,week);
		if (s.r === -1){
			re(replacementTeacher,Pos,m,week,base,s.action,{...misc , baseLength : base.length}) ;
		}
	});
	// if non of the teachers worked then do sth
}


export const someHowPutHimAt = (
	m: number,
	teacher: string,
	Pos: [number, number],
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
	week.HandyAny.beforeAction = [];
	for(let i = 0 ; i< week.allClasses.length ; i++){
		let acc = 0;
		// Object.keys(week.allClasses[i].teachers).forEach(
		// 	(teacher)=>{
		// 	  acc = acc + week.allClasses[i].teachers[teacher].remPeriods;
		// 	}
		//   );
		loopOverClass((u,v)=>{
			if(week.allClasses[i].l[u][v].currentTeacher === '')
				acc +=1;
		});
		week.HandyAny.beforeAction.push(acc);
	}
	week.HandyAny.test = ()=>{
		if(week.HandyAny.beforeAction.length !== 0){
			console.log(week.HandyAny.beforeAction);
		}else{
			console.log('nothing');
		}
		week.HandyAny.beforeAction = [];
		for(let i = 0 ; i< week.allClasses.length ; i++){
			let acc = 0;
			// Object.keys(week.allClasses[i].teachers).forEach(
			// 	(teacher)=>{
			// 	  acc = acc + week.allClasses[i].teachers[teacher].remPeriods;
			// 	}
			//   );
			loopOverClass((u,v)=>{
				if(week.allClasses[i].l[u][v].currentTeacher === '')
					acc +=1;
			});
			week.HandyAny.beforeAction.push(acc);
		}
		console.log('became');
		console.log(week.HandyAny.beforeAction);
	}
	delegate(teacher, Pos, m, week);
	if (week.activateList.length > 0){
		const ms : number[] = [];
		week.activateList[week.currentSolutionNumber].forEach((step)=>{
			let in_ms = false;
			for(let i = 0 ; i < ms.length ; i++){
				if(ms[i] === step.m){
					in_ms = true;
					break;
				}
			}
			if ( !in_ms ){
				ms.push(step.m);
			}
		});
		week.HandyAny.validate = (week : IWEEK_GLOBAL_Object)=>{
			ms.forEach((m)=>{
				let dict : any = {};
				const Class = week.allClasses[m];
				loopOverClass((i,j)=>{
					const t = Class.l[i][j].currentTeacher;
					if (dict[t] === undefined){
						dict[t] = 1;
					}else{
						dict[t] +=1;
					}
				});
				Object.keys(dict).forEach((key)=>{
					if (key !== '' && dict[key] > Class.teachers[key].Periods){
						console.log(`m : ${m} and the teacher is ${key}`);
						// eslint-disable-next-line no-throw-literal
						throw "shit"
					}
				});
				console.log('allz good validated!!');
			})
		}
		week.HandyAny.runTests = ()=>{
			console.log(week.activateList[week.currentSolutionNumber].map((item)=>JSON.stringify(item)));
			week.HandyAny.test();
			week.HandyAny.validate(week);
		}
	}
	if (!freeze) {
		Done(m, week)({});
	}

	week.forceUpdate();
	
};
export const Done = (
	m: number,
	week: IWEEK_GLOBAL_Object
) => {
	const School = week.allClasses;
	return (e: any) => {
	const sol = week.activateList[week.currentSolutionNumber];
	if (sol === undefined) {
		week.Swaping = false;
		week.activateList = [];
		week.currentSolutionNumber = 0;
		week.forceUpdate();
		return;
	}
	for (let i = 0; i < sol.length; i++) {
		if (sol[i].teacher === "") {
			putHimAt(
			week,
			sol[i].m,
			School[sol[i].m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher,
			sol[i].Pos,
			{doit:false}
			);
		}
	}
	for (let i = 0; i < sol.length; i++) {
		if (!(sol[i].teacher === "")) {
			if (School[sol[i].m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher !== "") {
			putHimAt(
				week,
				sol[i].m,
				School[sol[i].m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher,
				sol[i].Pos,
				{doit:false,override:true}
			);
			}
		}
	}
	for (let i = 0; i < sol.length; i++) {
		if (!(sol[i].teacher === "")) {
			putHimAt(week, sol[i].m, sol[i].teacher, sol[i].Pos,{override:true});
		}
	}

	week.HandyAny.runTests();
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
// const peek = (s: string , value : any)=>{
// 	console.log(`${s} : ${JSON.stringify(value)}`);
// }
// const printBase = (base : any)=>{
// 	console.log(`base ${JSON.stringify(base).replaceAll('],[','\n--------\n').replaceAll('[{',
// 	'\n{').replaceAll('}]','}\n')}`);
// }
// const printActlist = (week : IWEEK_GLOBAL_Object , ActList_Length_beforeDisRe : number)=>{
// 	console.log(`actlist${JSON.stringify(week.activateList.slice(ActList_Length_beforeDisRe)).replaceAll('],[','\n--------\n').replaceAll('[{',
// 	'\n{').replaceAll('}]','}\n')}`);
// }
// const guard_oldM = (oldM : number | undefined , m : number) : number => (oldM === 0)?0:(oldM || m);

