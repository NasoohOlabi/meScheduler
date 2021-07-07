import {IClass, IWEEK_GLOBAL_Object } from '../Components/Week';
import { putHimAt , teacherHasNoMoreemptyAvailables, threeTeachersOptionsList} from "./Logic";
import {  controledAdd, controledPush, Key, util , actionType} from "./util";
export type IActlistObj = {
	Pos : [number,number],
	m : number,
	teacher : string
}

export const someHowPutHimAt = (
	allClasses : IClass[] , 
	m : number,
	teacher : string ,
	Pos : [number , number] ,
	teachersGuild : string[],
	week : IWEEK_GLOBAL_Object,
	doit : boolean = true,
	freeze :boolean = true
):void=>{
	//short hands
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
		putHimAt(week,m,teacher,Pos,doit);
		return
	} 
	else if(Class.l[x][y].currentTeacher !== teacher && Class.l[x][y].Options.includes(teacher)){
		week.Swaping = true;

		const oldTeacher = Class.l[x][y].currentTeacher;
		const N_teacher_NoemptyAvailables = teacherHasNoMoreemptyAvailables(teacher,Class.teachers);
		const oldTeacherAvailables : [number,number][]= week.availables[oldTeacher];
		const newTeacherAvailables : [number,number][]= week.availables[teacher];
				
		//if the oldTeacher has a free period 
		for (let i = 0 ; i< oldTeacherAvailables.length ; i++){
			const [X , Y] : [number,number] = oldTeacherAvailables[i];
			if(Class.l[X][Y].currentTeacher === ''){
				if (N_teacher_NoemptyAvailables){
					newTeacherAvailables.forEach((Pos)=>{
						const [u , v] = Pos;
						if(Class.l[u][v].currentTeacher === teacher){
							controledPush(week.activateList,
								[
									{Pos:[X,Y] , m , teacher:oldTeacher},
									{Pos:[u,v] , m , teacher:''} ,
									{Pos:[x,y] , m , teacher:teacher}
								]
							);
						}
					});
				}else{
					controledPush(week.activateList , [{Pos:[X,Y] , m , teacher:oldTeacher},{Pos:[x,y] , m , teacher:teacher}]);
				}
			}
		}

		
		//Swap
		const sharedList = Class.laps[Key(teacher,oldTeacher,teachersGuild)] || [];
		sharedList.forEach((Pos:[number,number])=>{
			const [sharedX , sharedY] : [number,number] = Pos;
			if(Class.l[sharedX][sharedY].currentTeacher === teacher ){
				controledPush(week.activateList,[{Pos:[sharedX,sharedY] , m , teacher:oldTeacher} , {Pos:[x,y] , m , teacher:teacher}]);
			}
		});

		//NO RECURSION AND LIMIT activateList to 100
		//list teacher position
		// remove teacher from them 
		//look for another teacher to fill the spot
		controledAdd(
			week.activateList,
			
			threeTeachersOptionsList(
				teacher,oldTeacher , oldTeacherAvailables ,m,[x,y],week
			)
		);

		// for teacher in options find where he at and then
		// for teacher in options where he was at try and put any of the other
		// in his spot by a recursive call and then append the result actlist of that call
		// to put
		// acc is already in week
		
		// const reason =(teacher : string , Pos : [number,number] , m:number , week : IWEEK_GLOBAL_Object)=>{
		// 	const[X,Y] = Pos;
		// 	const comp = week.HandyAny.teacherSchedule[teacher][(X*10)+Y];
		// 	if (comp === 0){
		// 		// if (week.allClasses[m].teachers[teacher].remPeriods >0 ){
		// 		// 	return "shift"
		// 		// }else{
		// 		// 	return "cycle"
		// 		// }
		// 		return true
		// 	}
		// 	else if (comp === -1){
		// 		// eslint-disable-next-line no-throw-literal
		// 		throw {name: 'illegal'};
		// 		// return "teacher has other commitments"
		// 	}
		// 	else{
		// 		return comp
		// 	}
		// }
		
		const pickAction = util.pickAction;
		
		const delegate = (
			teacher:string ,
			Pos:[number,number] ,
			m : number, week : IWEEK_GLOBAL_Object ,
			base : {teacher:string , Pos:[number,number] , m : number}[],
			// acc : {Pos:[number,number] , m : number , teacher : string }[] ,
			// action : actionType 
			)=>{
				const [X,Y]=Pos;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const [ _ , a , reason] = util.situation(teacher,Pos,m,week);
				if (reason ===0){
					re(teacher,Pos,m,week,[],a , 4)
				}
				if (reason === -1){
					const err = {name:"illegal"}
					throw err
				}
				else{
					const takeHisPlace =  week.allClasses[reason].l[X][Y].Options
					takeHisPlace.forEach(
						(t)=>{
							re(t,Pos,reason,week,[],pickAction(t,reason,week) ,4)
						}
					);
					re(teacher,Pos,m,week,[],a ,4)
				}
		}
		const re = (teacher:string , Pos:[number,number] , m : number, week : IWEEK_GLOBAL_Object , base : {Pos:[number,number] , m : number , teacher : string }[] , action : actionType , depth :number )=>{
			// here we work under the assumtion that reason is 0
			// recursion base condition
			if (week.activateList.length >5){
				return;
			}
			if (depth ===0){
				return
			}
			// const Rea
			// if ()
			//short-hands
			const solutions = week.activateList;
			const a = {Pos , teacher , m }
			base.push(a);
				const [X,Y] = Pos;
				const ot = week.allClasses[m].l[X][Y].currentTeacher;
				if (ot === ''){
					if (action === "shift"){

					}
					// if cycle then this empty slot is useless 
				}
				else
				{
					const edges : [number,number][] = week.availables[ot];
					const notHandled : [number,number][] = edges.filter(
						(Pos1)=>{
							// check if this Pos1 is a valid answer to our problem by repeating the conditions above for starters
							// if true then execute what's inside the privious if statement and
							// return false so that it's removed
							const a1 = {Pos:Pos1 , teacher: ot , m };
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
							const r = week.HandyAny.teacherSchedule[ot][(Pos1[0]*10) +Pos1[1]] 
							if (r===m){
								return false
							}
							else if (r === 0){
								re ( ot , Pos1 , m , week , base ,action , depth-1);
								return false
							}
							return true
						}
					);
					if (depth === 0){
						requirePivoting.forEach(
							(p)=>{
								// I don't know what I'm doing here
								// fix it
								delegate(ot,p,m,week,base)
							}
						);
					}
				}
			// <- here
			// remove the a from the base because it is a reference and you don't what to fuck up your recursion
			base.pop()
		}



		//
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
		putHimAt(week,m,School[m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher,sol[i].Pos,false,false);  
	  }
	}
	for(let i = 0 ; i< sol.length;i++){
	  if (!(sol[i].teacher ==='')){
		if(School[m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher !== ''){
		  putHimAt(week,m,School[m].l[sol[i].Pos[0]][sol[i].Pos[1]].currentTeacher,sol[i].Pos,false,false);  
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


