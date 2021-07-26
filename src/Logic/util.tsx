import { IClass , IWEEK_GLOBAL_Object,lCellObj} from "../Interfaces/Interfaces";
import { IActlistObj } from "./Logic";
// testing git here
export const equals  = ( a : number[] , b : number[]) => {
	if (a.length === b.length){
	  for (let i = 0 ; i<a.length ; i++){
		if (!(a[i]===b[i])) {
		  return false;
		}
	  }
	  return true;
	}
	else {
	  return false;
	}
}
export const contains  = ( a : number[][] ,Pos : [number , number]) => {

	for (let i = 0 ; i<a.length ; i++){
	if (equals(a[i] , Pos)) {
		return true;
	}
	}
	return false;

}
export const guard = (a : any , Pos:[number,number] ) : [number,number][]=>{
	if (a === undefined){
		let b : [number,number][] = [Pos,];
		return b;
	}
	else{
		a.push(Pos)
		return a;
	}
}
export const guardRemove = (a : any , Pos:[number,number] ) : [number,number][]=>{
if (a === undefined){
	let b : [number,number][] = [Pos,];
	return b;
}
else{
	a = a.filter((item:any) => !equals(item , Pos));
	return a;
}
};
export const guardPeriodsList = (l : any) : [number,number][]=>{
return l;
};
// const positionFilled = (Pos : [number,number] , Class : IClass)=>{
//     for (let i = 0 ; i < Class.teachers.length ; i++){
//         if ( contains(guardPeriodsList(Class.teachers[i][2]) , Pos)){
//         Class.teachers[i][2] = guardRemove(Class.teachers[i][2] , Pos);
//         }
//     }
// };


// for (let i = 0 ; i<Class.teachers.length ; i++){
//   if( Class.teachers[i][1] === Class.teachers[i][2]?.length){
//     let teacher : string = Class.teachers[i][0];
//     let periods : [number,number][] = guardPeriodsList(Class.teachers[i][2]);
//     for (let j=0 ; j< periods.length ; j++){
//       if( Class.l[periods[j][0]][periods[j][1]][1].includes(teacher) ) {
//         someHowPutHimAt(Class , teacher , [periods[j][0],periods[j][1]]);
//       }
//     }
//   }
// }
export const withoutPos =( lst : [number,number][] , Pos : [number,number])=>{
	return lst.filter(  p=>!equals(Pos,p) )
}
export const removed = ( S : string[] , s : string) => {
	return (S.slice(0,S.indexOf(s)).concat(S.slice(S.indexOf(s)+1)));
	//return S.splice(S.indexOf(s),0,data);
}
// export async function AsyncFill() {
//     try{
//         await fill();
//         //the loging isn't working
//         console.log(allClasses);
//         alert('DONE!');
//     }catch(err){
//         console.log(err);
//     }
	
// }

// export function asyncFill( allClasses : IClass[] , availables : any) {
//     console.log("asyncFill is executing...");
//     return new Promise ((resolve,reject)=>{for (let i = 0; i < allClasses.length; i++) {
//         console.log("in the new Promsie returned by async...");
//         // each class
//         let Class = allClasses[i];
//         // scanning the grid
//         for (let x = 0; x < Class.l.length; x++) {
//         for (let y = 0; y < Class.l[x].length; y++) {
//             // scanning the teachers in the class
//             for (let j = 0; j < Class.teachers.length; j++) {
//             let teacher : string = Class.teachers[j][0];
//             //is the teacher available at that day
//             if( contains(availables[teacher],[x,y]) && Class.teachers[j][1]>0) {
//                 Class.l[x][y][1].push(teacher);
//                 Class.teachers[j][2] = guard (Class.teachers[j][2] , [x,y]);
//             }
//             }
//             Class.l[x][y].push(Class.l[x][y][1]);
//         }
//         }
//         noOtherOptionButToPutHere(Class);
//         console.log([allClasses,availables]);
//         //resolve([allClasses,availables]);
//     }});
// };
export const Key = (s1 : string , s2 : string , teachersGuild : string[])=>{
	const i1 = teachersGuild.indexOf(s1);
	const i2 = teachersGuild.indexOf(s2);
	const s : string = (i1>i2)? ( i1.toString() + 'x' + i2.toString() ) : ( i2.toString() + 'x' + i1.toString() ); 
	return s;
}
export const defineOrPush = (table : any , hash : string , Pos: [number,number])=>{
	if(table[hash] === undefined){
		table[hash] = [Pos,];
	} 
	else{
		table[hash].push(Pos);
	}
}
export const createEdgeIN = (table:any , s1 : string , s2 : string , Pos : [number, number] , teachersGuild : string[])=>{
	// table[indes s1 , index s2] = pos
	let hash = Key(s1,s2,teachersGuild);
	defineOrPush(table,hash,Pos);
	// table[i2][i1].push(Pos);

}

export const emptyObjArray = (n:number)=>{
	let g = [];
	for (let i = 0 ; i<n ; i++){
		g.push({});
	}

	return g
}

export const emptyNumMatrix = (x:number,y:number,z:number)=>{
	let g : any= [];
	for (let i = 0 ; i<x ; i++){
		g.push([]);
		for(let j = 0 ; j<y;j++){
			g[i].push([]);
			for(let k = 0 ; k < z ; k++){
				g[i][j].push(0);
			}
		}
	}
	return g
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function periods(list : [string , number][] , teacher : string){
	for (let i = 0 ; i< list.length ; i++){
	if ( list[i][0] === teacher ){
		return list[i][1];
	}
	}
	return 0;
}

export const stringGuard = ( arg : unknown) : string=>{
	if (typeof arg === "string"){
		return arg;
	}
	else{
		return '';
		//do sth
	}
}
export const castPosList =(l:any):[number,number][]=>{
	return ((l !== undefined)? l : [] );
}
export const getHisActPeriods = (Class : IClass,teacher:string)=>{
	let result : [number,number][] = [];
	for (let i = 0 ; i<Class.l.length;i++){
		for (let j = 0 ; j<Class.l[0].length;j++){
			if(Class.l[i][j].currentTeacher === teacher){
				result.push([i,j]);
			}
		}
	}
	return result
}
export const listMinusAnother = (a : [number,number][] , b :[number,number][]):[number,number][]=>{
	const result: [number,number][] = [];
	for (let i = 0 ; i<a.length;i++){
		if(!contains(b,a[i])){
			result.push(a[i]);
		}
	}
	return result;
}
export const controledPush = (a:IActlistObj[][],sth :IActlistObj[] ,n:number = 50)=>{
	if(a.length<n){
		a.push(sth);
	}
}
export const controledAdd = (a:IActlistObj[][],sth : IActlistObj[][]  ,n:number = 50)=>{
	if(a.length<n){
		for (let i = 0  ; i < sth.length ; i++){
			a.push(sth[i])
		}
	}
}
export const loopOverClass = (f : (i:number,j:number)=>void,n=5,m=7)=>{
	for(let i = 0 ; i<n ; i++ ){
		for(let j = 0 ; j<m ; j++ ){
			f(i,j);
		}        
	}
}


function cel ():lCellObj{
	return {currentTeacher:'',isCemented:false,Options:[]}
}
function seven_cels ():lCellObj[]{
	const acc = []
	for (let i = 0 ; i<7 ;i++){
		acc.push(cel())
	}
	return acc
}
export const newGrid = ():lCellObj[][]=>{
	const acc = []
	for (let i = 0 ; i<5 ; i++){
		acc.push(seven_cels())
	}
	return acc;	
}
const copyInstruction = ( obj : {Pos:[number,number] , m : number , teacher : string } )
		: {Pos:[number,number] , m : number , teacher : string }  =>{
			const res = Object();
			res.Pos = [];
			res.Pos.push(obj.Pos[0]);
			res.Pos.push(obj.Pos[1]);
			res.m = obj.m;
			res.teacher = obj.teacher;
			return res
		}
const copyInstructions = (objects : {Pos:[number,number] , m : number , teacher : string }[])
: {Pos:[number,number] , m : number , teacher : string }[] =>{
	const res : any = []
	objects.forEach(
		(object)=>{
			res.push(copyInstruction(object));
		}
	);
	return res;
}
const pickAction=(teacher:string ,m : number, week:IWEEK_GLOBAL_Object):actionType=>{
	try{
		if (week.allClasses[m].teachers[teacher].remPeriods >0 ){
			return "shift"
		}else{
			return "cycle"
		}
	}
	catch{
		alert(`week.allClasses[${m}].teachers[${teacher}] is undefined`)
		throw "undefined teacher"
	}
}
const situation = (teacher: string, Pos:[number,number] , m :number , week:IWEEK_GLOBAL_Object):{currTeacher:string,action:actionType,r:number}=>{
	const ot = week.allClasses[m].l[Pos[0]][Pos[1]].currentTeacher;
	const a = pickAction(teacher,m,week);
	const r = week.HandyAny.teacherSchedule[teacher][(Pos[0]*10) +Pos[1]] 
	return {currTeacher:ot,action:a,r}
}
function situationInt( s : {currTeacher:string,action:actionType,r:number} ){
	const {currTeacher:t,action:a,r} = s;
	if(t === ''){
		if(a === 'shift'){
			if(r === -1){
				return 1;
			}
			else{
				return 2;
			}
		}
		else{
			if(r === -1){
				return 3;
			}
			else{
				return 4;
			}
		}
	}
	else{
		if(a === 'shift'){
			if(r === -1){
				return 5;
			}
			else{
				return 6;
			}
		}
		else{
			if(r === -1){
				return 7;
			}
			else{
				return 8;
			}
		}
	}
}

function ruffleShuffle (arr: {Pos:[number,number] , m : number , teacher : string }[][],pivot : number):{Pos:[number,number] , m : number , teacher : string }[][]{
	// a = [0,1,2,3,4,5,6]
	// b = [0,1,2,3,4,5,6]
	if(pivot>arr.length ||pivot<0){
		alert("Fuck!! went wrong. ruffleShuffle returned empty list")
	}
	const res = [];
	for (let i = 0 ; i<pivot ;i++){
		for(let j = pivot; j<arr.length;j++){
			res.push(arr[i].concat(arr[j]))
		}
	}
	return res;
}

export type actionType = "shift" | "cycle"
export const util = {
	copyInstructions,
	copyInstruction,
	pickAction,
	situation,
	situationInt,
	ruffleShuffle
}
