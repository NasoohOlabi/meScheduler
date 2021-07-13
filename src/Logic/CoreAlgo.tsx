import {IClass, IWEEK_GLOBAL_Object } from '../Components/Week';
import { putHimAt} from "./Logic";
import {  util , actionType} from "./util";
export type IActlistObj = {
	Pos : [number,number],
	m : number,
	teacher : string
}

export const someHowPutHimAt = (
	m : number,
	teacher : string ,
	Pos : [number , number] ,
	week : IWEEK_GLOBAL_Object,
	freeze :boolean = true
):void=>{
	//short hands
	const allClasses = week.allClasses;
	const Class = allClasses[m];
	const [x,y] = Pos;

	/*
				* discription*
	for each teacher available here in the original list in this cell
	for each pos in the shared postihions
	if the other teacher is in a pos in the shared one's just do a simple switch or promt for choice
	this should be enough?!
	?!
	*/



	if(Class.l[x][y].currentTeacher ==='' ){
		putHimAt(week,m,teacher,Pos,true);
		return
	} 
	else if(Class.l[x][y].currentTeacher !== teacher && Class.l[x][y].Options.includes(teacher)){
		week.Swaping = true;

		
	
		const delegate = (
			teacher:string ,
			Pos:[number,number] ,
			m : number, week : IWEEK_GLOBAL_Object ,
			base : {teacher:string , Pos:[number,number] , m : number}[],
			)=>{
				const pickAction = util.pickAction;
				const situationInt = util.situationInt;
				const [X,Y]=Pos;
				const S = util.situation(teacher,Pos,m,week);
				const [_, a ,r] = S;
				switch (situationInt(S)) {
					case 1:
						putHimAt(week,m,teacher,Pos,true);
						break;
					case 2:
						// Pivot
						const takeHisPlace =  week.allClasses[r].l[X][Y].Options
						takeHisPlace.forEach(
							(t)=>{
								someHowPutHimAt(m,t,Pos,week)
							}
						);
						break;
					case 3:

						break;
					case 4:
						break;
					case 5:
						break;
					case 6:
						break;
					case 7:
						break;
					case 8:
						break;
					default:
						break;
				}
				// if (reason ===0){
				// 	re(teacher,Pos,m,week,[],a , 4)
				// }
				// if (reason === -1){
				// 	const err = {name:"illegal"}
				// 	throw err
				// }
				// else{
				// 	const takeHisPlace =  week.allClasses[reason].l[X][Y].Options
				// 	takeHisPlace.forEach(
				// 		(t)=>{
				// 			re(t,Pos,reason,week,[],pickAction(t,reason,week) ,4)
				// 		}
				// 	);
				// 	re(teacher,Pos,m,week,[],a ,4)
				// }
		}
		const re = (
				teacher:string,
				Pos:[number,number],
				m : number,
				week : IWEEK_GLOBAL_Object,
				base : {Pos:[number,number],
				m : number , teacher : string }[],
				action : actionType,
				depth :number
			)=>{
			// here we work under the assumtion that reason is -1
			// recursion base condition
			if (week.activateList.length >5){
				// the numbers of solutions is less than 5. which is enough
				return;
			}
			if (depth ===0){
				// a safe guard
				return
			}
			//short-hands
			const solutions = week.activateList;
			const step = {Pos , teacher , m }
			base.push(step);
				const [X,Y] = Pos;
				const oldTeacher = week.allClasses[m].l[X][Y].currentTeacher;
				if (oldTeacher === ''){
					if (action === "shift"){
						// Done 
						week.activateList.push(util.copyInstructions(base))
					}
					// if cycle then this empty slot is useless 
				}
				else
				{
					const edges : [number,number][] = week.availables[oldTeacher];
					const notHandled : [number,number][] = edges.filter(
						(Pos1)=>{
							// check if this Pos1 is a valid answer to our problem by repeating the conditions above for starters
							// if true then execute what's inside the privious if statement and
							// return false so that it's removed
							const a1 = {Pos:Pos1 , teacher: oldTeacher , m };
							const [X1,Y1] = Pos1;
							const t1 = week.allClasses[m].l[X1][Y1].currentTeacher;
							if (
								(action === "shift" && t1==='')||
								(action === "cycle" && base[0] !== undefined && base[0].teacher=== t1)
								){
								base.push(a1);
								solutions.push(util.copyInstructions(base));
								// <- here
								// remove the a1 from the acc because it is a reference and you don't what to fuck up your recursion
								base.pop()
								return false;
							}
							else{
								return true;
							}
						}
					);
					const requirePivoting = notHandled.filter(
						(Pos1)=>{
							// recursive call :
							const r = week.HandyAny.teacherSchedule[oldTeacher][(Pos1[0]*10) +Pos1[1]] 
							if (r===m){
								return false
							}
							else if (r === 0){
								re ( oldTeacher , Pos1 , m , week , base ,action , depth-1);
								return false
							}
							return true
						}
					);
				}
			// remove the a from the base because it is a reference and you don't what to fuck up your recursion
			base.pop()
		}
		if (!freeze){
			Done(allClasses,m,week)({})
		}

		week.forceUpdate();
	}
}
export const Done = (
	School : IClass[] , 
	m : number,
	week : IWEEK_GLOBAL_Object)=>{
	return (e : any)=>{

	const sol = week.activateList[week.currentSolutionNumber];
	if (sol === undefined){
		return
	}
	for(let i = 0 ; i< sol.length;i++){
	  if(sol[i].teacher ===''){
		putHimAt(week,m,School[m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher,sol[i].Pos,false);  
	  }
	}
	for(let i = 0 ; i< sol.length;i++){
	  if (!(sol[i].teacher ==='')){
		if(School[m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher !== ''){
		  putHimAt(week,m,School[m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher,sol[i].Pos,false);  
		}
	  }
	}
	for(let i = 0 ; i< sol.length;i++){
		if (!(sol[i].teacher ==='')){
		  putHimAt(week,m,sol[i].teacher,sol[i].Pos);
		}
	  }
	
	week.Swaping = false;
	week.activateList = [];
	week.currentSolutionNumber = 0;   
	week.forceUpdate();           
	}
}


