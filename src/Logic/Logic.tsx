import React from "react";
import {useState} from "react";
//import { IBasicTableProps } from "../Components/BasicTable";
import {IClass, IWEEK_GLOBAL_Object } from '../Components/Week';
import {  contains, controledAdd, controledPush, createEdgeIN, emptyObjArray, guard, guardPeriodsList,  Key, listMinusAnother, loopOverClass, stringGuard , withoutPos , util , actionType} from "./util";
export type IActlistObj = {
	Pos : [number,number],
	m : number,
	teacher : string
}

// const isPos = (p : any)=>{
//     return (typeof p.push !== 'undefined' && p.length ===2 && typeof p[1]==="number" && typeof p[0] === 'number')
// }
// const isIActlistObj = (a : any) =>{
//     return (    Object.entries(a).length ===3 && isPos(a.Pos) && typeof a.m ==='number' && typeof a.teacher === 'string'   );
// }
// const isPosList = (p : any)=>{
//     if (typeof p.push === 'undefined' || typeof p.indexOf === 'undefined'){
//         return false
//     }
//     else
//     {
//         for (let i = 0 ; i< p.length ; i++){
//             if (!isPos(p[i])){
//                 return false
//             }
//         }
//     }
// }
// const castActListObj = ( a : any ) : IActlistObj=>{
//     if(isIActlistObj(a)){
//         return a;
//     }
//     else {
//         throw `casting ${JSON.stringify(a)} failed`
//     }
// }




/*

interface A {
	x:number,
	y:number
}
const isA =(a : any)=>{
	return ( Object.entries(a).length == 2 && typeof a.x == 'number' && typeof a.y == 'number');
}

*/
//I can move utility functions to a separate util Object in an another folder

export function fill(week:IWEEK_GLOBAL_Object) {
	const availables = week.availables
	const teachersGuild = week.teachersGuild
	const allClasses : IClass[] = week.allClasses
	let table : any = emptyObjArray(allClasses.length);
	allClasses.forEach((Class,i)=>{
		for (let x = 0; x < Class.l.length; x++) {
			for (let y = 0; y < Class.l[x].length; y++) {
				// scanning the teachers in the class
				Object.keys(Class.teachers).forEach((teacher)=>{
					let [periods , PosList]= [Class.teachers[teacher].remPeriods,Class.teachers[teacher].emptyAvailables];
					if( contains(availables[teacher],[x,y]) && periods>0) {
						Class.l[x][y].Options.forEach((teacherAtThisPos)=>{
							createEdgeIN(table[i],teacher,teacherAtThisPos,[x,y],teachersGuild);
						});
						Class.l[x][y].Options.push(teacher);
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						PosList = guard (PosList , [x,y]);
					}
				});
			}
		}
		CementNoOtherOptionButToPutHere(allClasses , i , teachersGuild , week);
		Class.laps = table[i];
	});
};
export function teacherScheduleInit(week : IWEEK_GLOBAL_Object , availables : any){
	week.HandyAny.teacherSchedule = {}
	week.teachersGuild.forEach(
		(teacher)=>{
			week.HandyAny.teacherSchedule[teacher] = {}
			availables[teacher].forEach(
				(Pos : [number,number])=>{
					const [X,Y] = Pos;
					week.HandyAny.teacherSchedule[teacher][ (X*10 + Y)] = 0
				}
			);
			loopOverClass(
				(i,j)=>{
					if(week.HandyAny.teacherSchedule[teacher][ (i*10 + j) ] !== 0){
						week.HandyAny.teacherSchedule[teacher][ (i*10 + j) ] =-1
					}
				}
			);
			
		}
	);
}
export function randomFiller(week:IWEEK_GLOBAL_Object){
	const allClasses = week.allClasses;
	const teachersGuild = week.teachersGuild;
	// random filler

	allClasses.forEach((Class,m)=>{
		for(let i = 0 ; i < Class.l.length ; i++){
			for(let j = 0 ; j<Class.l[i].length ; j++){
				if(Class.l[i][j].Options.length !== 0){
					const aOptions : string[] = actualOptions([i,j],m,week);
					if (aOptions[0] !== undefined){
						const teacher = aOptions[0];    
						putHimAt(week,m,teacher,[i,j]);
						autoFill(allClasses,m,teachersGuild,week);
						noOtherOptionButToPutHere(allClasses , m , teachersGuild, week);
					}
				}
			}
		}
	})
}
export function useForceUpdate(){

// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [value, setValue] = useState(0); // integer state
	return () => setValue(value => value + 1); // update the state to force render
};
export function actualOptions(Pos : [number,number],m : number, week : IWEEK_GLOBAL_Object){
	const[X,Y] = Pos;
	const options = week.allClasses[m].l[X][Y].Options;
	const res = options.filter((teacher)=>{
		return ( week.HandyAny.teacherSchedule[teacher][(X*10)+Y]===0 && week.allClasses[m].teachers[teacher].remPeriods > 0 );
	  })
	if ( res.length === 0 ){
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

const teacherHasNoMoreemptyAvailables = (teacher : string , teachersList : any) : boolean=>{
	return teachersList[teacher].remPeriods < 1
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
	week: IWEEK_GLOBAL_Object , 
	m : number,
	teacher : string ,
	Pos : [number , number] ,
	doit : boolean = true ,
	stateIsChangeing = true
	){
	const allClasses = week.allClasses;
	const [X,Y] = Pos;
	const teachers = allClasses[m].teachers;
	if (doit) {
		if (!teacherHasNoMoreemptyAvailables(teacher,teachers) && allClasses[m].l[Pos[0]][Pos[1]].currentTeacher === '' && week.HandyAny.teacherSchedule[teacher][(X*10)+Y]===0){
			allClasses[m].l[Pos[0]][Pos[1]].currentTeacher = teacher;
			teachers[teacher].remPeriods--;
			teachers[teacher].periodsHere.push(Pos)
			Object.keys(teachers).forEach(
				(teacher)=>{
					teachers[teacher].emptyAvailables = withoutPos(teachers[teacher].emptyAvailables , Pos)
				}
			);
			week.HandyAny.teacherSchedule[teacher][ (X*10 + Y) ] = m;
		}
		if (week.refreshTable !== undefined){
			week.refreshTable[m][Pos[0]][Pos[1]]();
		}
	}
	else {
		if ( allClasses[m].l[Pos[0]][Pos[1]].currentTeacher !== ''){
			allClasses[m].l[Pos[0]][Pos[1]].currentTeacher = '';
			teachers[teacher].remPeriods++;
			teachers[teacher].periodsHere = withoutPos(teachers[teacher].periodsHere,Pos)
			// allClasses[m].l[Pos[0]][Pos[1]].Options = removed(allClasses[m].l[Pos[0]][Pos[1]].Options,teacher);
			week.HandyAny.teacherSchedule[teacher][ (X*10 + Y)+'' ] = 0;
			Object.keys(teachers).forEach(
				(teacher)=>{
					if ( contains(week.availables[teacher] , Pos) ){
						teachers[teacher].emptyAvailables.push(Pos)
					}
				}
			);
			// positionFilled(Pos , allClasses[m]);
		}
		
		if (week.refreshTable !== undefined){
			week.refreshTable[m][Pos[0]][Pos[1]]();
		}
	} 

};
export const CementNoOtherOptionButToPutHere  = (School : IClass[],m :number , teachersGuild : string[] ,week:IWEEK_GLOBAL_Object )=>{
	const Class = School[m];
	Object.keys(Class.teachers).forEach((teacher)=>{
		let [periods , PosList]= [Class.teachers[teacher].remPeriods,Class.teachers[teacher].emptyAvailables];
		if ( periods === PosList?.length){
			const GuardedPosList = guardPeriodsList(PosList);
			GuardedPosList.forEach((Pos)=>{
				putHimAt(week,m, teacher ,Pos );
				Class.l[Pos[0]][Pos[1]].isCemented = true;
			});
		}
	});
};
export const noOtherOptionButToPutHere  = (School : IClass[],m :number , teachersGuild : string[] ,week:IWEEK_GLOBAL_Object )=>{
	const Class = School[m];
	Object.keys(Class.teachers).forEach((teacher)=>{
		let [periods , PosList]= [Class.teachers[teacher].remPeriods,Class.teachers[teacher].emptyAvailables];
		if ( periods === PosList?.length){
			const GuardedPosList = guardPeriodsList(PosList);
			GuardedPosList.forEach((Pos)=>{
				putHimAt(week,m, teacher ,Pos);
			});
		}
	});
};
const autoFill = function(
	School : IClass[],
	m : number,
	teachersGuild : string[],
	week : IWEEK_GLOBAL_Object,
){
	let xxx = 0;
		for (let x = 0 ; x < School[m].l.length ; x++){
			for ( let y = 0 ; y < School[m].l[x].length ; y++){
				if ( School[m].l[x][y].Options.length === 1 && School[m].l[x][y].currentTeacher === '' ){
				//do the change
				someHowPutHimAt(School , m , School[m].l[x][y].Options[0] , [x,y] ,teachersGuild, week );
				
				//alert(`here in [${x},${y}] calling with ${School[i].l[x][y].Options[0]}  who ${(teacherHasNoMoreemptyAvailables(School[i].l[x][y].Options[0] ,School[i].teachers)?'has NOOOOO more':'has more')}`);
				//go back to the start to see if your changes affected what you have already checked
				
				//do a clean if the teacher has no more periods
				// debuging risky over looping infinite loop
				if (xxx < 100){
					x=0;y=0;
					xxx++;
				}
				else{
					alert(`OK here is the deal infinite loop \n Again `);
				}
				}            
			}
			
	}
}
export const SwitchEventHander = (Pos : [ number , number], School : IClass[] , m : number, teachersGuild: string[], week:IWEEK_GLOBAL_Object ) => { 
	return(event: React.ChangeEvent<{ value: unknown }>) =>{
		let teacher : string = stringGuard(event.target.value);  
		someHowPutHimAt(School,m,teacher,Pos,teachersGuild, week);
		//clean teacher name from other places
		//auto fill when only one name remain in a place
		autoFill(School,m,teachersGuild,week);
		//must be put here algorithm
		//I have to see if 
		noOtherOptionButToPutHere(School , m , teachersGuild, week);    
	}
}

const threeTeachersOptionsList = (
	teacher:string , oldTeacher : string ,    
	oldTeacherAvailables : [number,number][] ,
	m : number ,
	Pos : [number,number] ,
	week : IWEEK_GLOBAL_Object
	) : IActlistObj[][]=>{
	//const week = week;
	const allClasses = week.allClasses;
	const teachersGuild = week.teachersGuild;
	const [x,y] = Pos;
	const Class = allClasses[m];
	// Pos where we can put old teacher in but not the new
	const opthree :[number,number][]= listMinusAnother(oldTeacherAvailables,Class.laps[Key(teacher,oldTeacher,teachersGuild)]);
	let result  : IActlistObj[][] = [];
	opthree.forEach((rPos)=>{
		const middleTeachers:string[] = Class.l[rPos[0]][rPos[1]].Options;
		if (middleTeachers !== undefined){
			middleTeachers.forEach(
				(middleTeacher:string)=>{
					if(contains(Class.laps[Key(teacher,middleTeacher,teachersGuild)] , [x,y])){
						// intersection between oldteacher and middle teacher and lets call it -> N
						const N = Class.laps[Key(oldTeacher,middleTeacher,teachersGuild)];
							if(N !== undefined){
								N.forEach((pos:[number,number])=>{
									if(Class.l[pos[0]][pos[1]].currentTeacher === middleTeacher){
										controledPush (result,[
											{teacher , Pos:[x,y] , m} ,
											{teacher:oldTeacher , Pos:pos , m} ,
											{teacher:middleTeacher , Pos :rPos ,m}
										]);
									}
								}
							);
						}   
					}
				}
			)
		}
		else{
			alert(`Class.l[${rPos[0]}][${rPos[1]}] + ${Class.l[rPos[0]][rPos[1]]}`);
		}
	})
	return result;                
}
const someHowPutHimAt = (
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

// this is a tripple swap
// intersection( sth [Key (teacher1 , teacher2 )] , sth [Key (teacher3 , teacher2 )] , sth [Key (teacher1 , teacher3 )])



