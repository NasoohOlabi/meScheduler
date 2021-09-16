import { Theme } from "@material-ui/core";
export interface IActlistObj {
	Pos: [number, number],
	m: number,
	teacher: string,
};
export class Queue<T> {
	_store: T[] = [];
	Empty(): boolean {
		return this._store.length === 0
	}
	length(): number {
		return this._store.length
	}
	notEmpty(): boolean {
		return !this.Empty();
	}
	enqueue(val: T) {
	  this._store.push(val);
	}
	dequeue(): void {
	  this._store.shift();
	}
	front():T {
		return this._store[0];
	}
}
export class PivotsQueue {
	_store : Queue<(base:IActlistObj[])=>void> = new Queue<(base:IActlistObj[])=>void>();
	_max!: number;
	PivotsQueue(max : number){
		this._max = max;
	}
	Empty(): boolean {
		return this._store.Empty();
	}
	notEmpty(): boolean {
		return !this.Empty();
	}
	enqueue(val: (base:IActlistObj[])=>void ) : boolean {
		if (this._store.length() < this._max){
			this._store.enqueue(val);
			return true;
		}
		return false;
	}
	dequeue(): void {
	  this._store.dequeue();
	}
	run(base : IActlistObj[]):void {
		const front = this._store.front();
		this._store.dequeue();
		front(base)
		this._store.enqueue(front);
	}
}
export class PivotsCallStack{
	_store : ((base:IActlistObj[])=>void)[] = [];
	_max!: number;
	_accepting : boolean = true;
	_index : number = -1;
	constructor (...args: any[]){
		if (args.length === 1){
			this._max = args[0];
		}
		else if (args.length === 2){
			this._max = args[0];
			this.push(args[1]);
		}
	}
	Empty(): boolean {
		return  this._index === -1;
	}
	notEmpty(): boolean {
		return !this.Empty();
	}
	push(val: (base:IActlistObj[])=>void ) : boolean {
		if (this._store.length < this._max && this._accepting){
			this._store.push(val);
			this._index ++;
			return true;
		}
		return false;
	}
	_unlock () : void{
		this._index ++;
		if (this._index +1 === this._store.length)
			this._accepting = true;
	}
	pop(): void {
		if (this._accepting){
			this._store.pop();
			this._index--;
		}else{
			this._index--;
		}
	}
	run(base : IActlistObj[]):void {
		if (this.Empty()) return;
		this._accepting = false;
		const front = this._store[this._index];
		this.pop();
		front(base);
		this._unlock();
	}
}
export interface IMisc { 
	depth?: number,
	actList_Length?:number ,
	Pivots?: PivotsCallStack,
	baseLength? : number,
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
	tableFooterInitializer : any;
	headRow: string[],
	headCol : string[],
	WEEK_GLOBAL_Object:IWEEK_GLOBAL_Object
}
export interface ITableFooter{
	m: number;
	tableFooterInitializer : any;
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
	tableFooterRefresher : (()=>void)[],
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

