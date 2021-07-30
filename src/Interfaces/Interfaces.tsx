import { Theme } from "@material-ui/core";
export interface IActlistObj {
	Pos: [number, number],
	m: number,
	teacher: string,
};
export interface lCellObj  {
	currentTeacher:string,
	isCemented:boolean,
	Options:string[]
}
export interface TimeRemainingState {
	whatToSayIndex:number,
	total:number,
	days:number,
	hours:number,
	minutes:number,
	seconds:number
}
export interface I_installButtonProps{
	color? : any , className ?: any
}
export interface IBasicTableProps {
	School : IClass[],
	m: number;
	handleChange : any,
	cellInitializer : any;
	headRow: string[],
	headCol : string[],
	WEEK_GLOBAL_Object:IWEEK_GLOBAL_Object
}
enum Screen  {ETA , TABLE}
export interface INavProps {
	UI:Screen ,
	switchToTable : (event : any)=> void ,
	switchToETA : (event : any)=> void 
}
export interface IMyAppBarProps {
    UI:Screen ,
    switchToTable : (event : any)=> void ,
    switchToETA : (event : any)=> void ,
    toggleTheme : (event : any )=>void ,
    theme : Theme,
    darkThemed : boolean
}
export interface ICell{
	Pos : [number , number],
	data : lCellObj,
	cellInitializer : any,
	m:number,
	teacher : string,
	handleChange : (event : React.ChangeEvent<{ value: unknown }>) => (void),
	WEEK_GLOBAL_Object:IWEEK_GLOBAL_Object,
}
export interface IWEEK_GLOBAL_Object{
	allClasses : IClass[],
	teachersGuild: string[] ,
	refreshTable: (()=>void)[][][],
	forceUpdate: ()=>void,
	Swaping: boolean,
	currentSolutionNumber : number,
	activateList:{Pos:[number,number] , m : number , teacher : string }[][],
	availables : any,
	HandyAny:any
}
export interface IClass {
	l: lCellObj[][];
	Name: string;
	teachers: any;
	laps:any;
  }

