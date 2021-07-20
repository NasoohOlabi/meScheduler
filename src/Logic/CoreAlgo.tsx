import {IClass, IWEEK_GLOBAL_Object } from '../Components/Week';
import { actualOptions, putHimAt} from "./Logic";
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
	console.clear();
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
			)=>{
				const situationInt = util.situationInt;
				const [X,Y]=Pos;
				const S = util.situation(teacher,Pos,m,week);
				switch (situationInt(S)) {
					case 1: // t=='' & r==-1 & a =='shift
						console.log("->"+1);
						putHimAt(week,m,teacher,Pos,true);
						break;
					case 2: // t=='' & r!=-1& a =='shift
						console.log("->"+2);
						// Pivot
						const takeHisPlace =  week.allClasses[S.r].l[X][Y].Options
						takeHisPlace.forEach(
							(t)=>{
								// someHowPutHimAt(m,t,Pos,week) there could be an inf recursion
								// here I assumed re would work and thus already assigned the the first teacher
								re(t,Pos,S.r,week,[{Pos,m,teacher}],[S.action],{oldM : m});
							}
						);
						break;
					case 3:// t=='' & r==-1 & a =='cycle'
						console.log("->"+3);
						// use re functionality
						re(teacher,Pos,m,week,[],[S.action])
						break;
					case 4: // t=='' & r!=-1 & a =='cycle'
						console.log("->"+4);
						re(teacher,Pos,m,week,[],[S.action])
						const pivot = week.activateList.length;
						const takeHisPlace_4 =  week.allClasses[S.r].l[X][Y].Options
						takeHisPlace_4.forEach(
							(t)=>{
								// someHowPutHimAt(m,t,Pos,week) there could be an inf recursion
								// here I assumed re would work and thus already assigned the the first teacher
								re(t,Pos,S.r,week,[{Pos,m,teacher}],[S.action],{oldM : m});
							}
						);
						week.activateList = util.ruffleShuffle(week.activateList,pivot);
						break;
					case 5:	// t!='' & r==-1 & a =='shift'
						console.log("->"+5);
						re(teacher,Pos,m,week,[],[S.action])
						break;
					case 6: // t!='' & r!=-1 & a =='shift'
						console.log("->"+6);
						re(teacher,Pos,m,week,[],[S.action])
						const pivo = week.activateList.length
						const takeHisPlace6 =  week.allClasses[S.r].l[X][Y].Options
						takeHisPlace6.forEach(
							(t)=>{
								// someHowPutHimAt(m,t,Pos,week) there could be an inf recursion
								// here I assumed re would work and thus already assigned the the first teacher
								re(t,Pos,S.r,week,[],[S.action],{oldM : m});
							}
						);
						week.activateList = util.ruffleShuffle(week.activateList,pivo)
						break;
					case 7: // t!='' & r==-1 & a =='cycle'
						console.log("->"+7);
						re(teacher,Pos,m,week,[],[S.action] )
						break;
					case 8: // t!='' & r!=-1 & a =='cycle'
						console.log("->"+8);
						re(teacher,Pos,m,week,[],[S.action])
						const pivot8 = week.activateList.length
						const takeHisPlace8 =  week.allClasses[S.r].l[X][Y].Options
						takeHisPlace8.forEach(
							(t)=>{
								// someHowPutHimAt(m,t,Pos,week) there could be an inf recursion
								// here I assumed re would work and thus already assigned the the first teacher
								re(t,Pos,S.r,week,[],[S.action],{oldM : m});
							}
						);
						week.activateList = util.ruffleShuffle(week.activateList,pivot8)
						break;
					default:
						alert('impossible')
						break;
				}
			}
		const re = (
				teacher:string,
				Pos:[number,number],
				m : number,
				week : IWEEK_GLOBAL_Object,
				base : {Pos:[number,number],m : number , teacher : string}[],
				actionStack : actionType[],
				misc : {depth? : number , oldM? : number} = {depth:5,oldM:-1534}
			)=>{
			// put the teacher in and start eating the edges to find your solutions
			// edges are places to move the current teacher elsewhere
			// here we work under the assumtion that reason is -1
			// recursion base condition
			const oldM = misc.oldM!==-1534?misc.oldM : m;
			const depth = misc.depth?misc.depth:5;
			if (m !== oldM){
				actionStack.push(util.situation(teacher,Pos,m,week).action);
			}
			const Act_StackTop = actionStack[actionStack.length-1];
			if (depth ===0 || week.activateList.length>5){
				// a safe guard
				return
			}
			console.log(`teacher ${teacher}, Pos ${JSON.stringify(Pos)}, m ${m}, \nbase ${JSON.stringify(base)}, \nactionStack ${JSON.stringify(actionStack)}, \nmisc ${JSON.stringify(misc)}\nactlist${JSON.stringify(week.activateList)}`);
			prompt('next?')
			// unpack misc
			//short-hands
			const solutions = week.activateList;
			const step = {Pos , teacher , m }
			base.push(step);
				const [X,Y] = Pos;
				const oldTeacher = week.allClasses[m].l[X][Y].currentTeacher;
				if (oldTeacher === ''){
					if (Act_StackTop === "shift"){
						// Done 
						week.activateList.push(util.copyInstructions(base))
					}
					// if cycle then this empty slot is useless 
				}
				else
				{
					const edges : [number,number][] = week.availables[oldTeacher];
					const requireWork : [number,number][] = edges.filter(
						(Pos1)=>{
							// check if this Pos1 is a valid answer to our problem by repeating the conditions above for starters
							// if true then execute what's inside the privious if statement and
							// return false so that it's removed
							const [X1,Y1] = Pos1;
							const t1 = week.allClasses[m].l[X1][Y1].currentTeacher;
							if (
								(Act_StackTop === "shift" && t1==='')||
								(Act_StackTop === "cycle" && base[0] !== undefined && base[0].teacher=== t1)
								){
								const a1 = {Pos:Pos1 , teacher: oldTeacher , m };
								base.push(a1);
								solutions.push(util.copyInstructions(base));
								// remove the a1 from the base because it is a reference and you don't what to fuck up your recursion
								base.pop()
								return false;
							}
							else{
								return true;
							}
						}
					);
					const requirePivoting = requireWork.filter(
						(Pos1)=>{
							// looking for a place for the oldTeacher to call re with
							// and try a solution where he is at Pos1
							const S1 = util.situation(oldTeacher,Pos1,m,week)
							if (S1.r===m){
								// this condition should be equivilant to currentTeacher===oldTeacher
								return false
							}
							else if (S1.r === -1){
								// this means that it's possible for the old teacher to be put in this Pos
								// but we still have to find a place to put the (current teacher at Pos1) in.
								re ( oldTeacher , Pos1 , m , week , base ,actionStack , {depth:depth-1,oldM});
								return false
							}
							return true
						}
					);
					requirePivoting.forEach(
						(p)=>{
							// const [x,y] = p;
							const s = util.situation(oldTeacher,p,m,week);
							const teachersToFillTheOtherPlace = actualOptions(p,m,week);
							teachersToFillTheOtherPlace.forEach(
								(replacementTeacher)=>{
									re(replacementTeacher,p,s.r,week,base,actionStack,{depth : depth-1,oldM : m});
								}
							);
						}
					);
				}
			// remove the a from the base because it is a reference and you don't what to fuck up your recursion
			if (m !== oldM){
				actionStack.pop();
			}
			base.pop()
		}

		delegate(teacher,Pos,m,week)

		if (!freeze){
			Done(allClasses,m,week)({})
		}

		week.forceUpdate();
	}
}
export const Done = (
	School : IClass[], 
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


/*
<sc<script></script><script>alert('hi');</sc<script></script><script>
<<ss >script>alert('hi');<<ss >/script>
*/