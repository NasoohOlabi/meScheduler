import { Typography } from "@material-ui/core";
import React, { useState } from "react";
import "./App.css";
import { TimeRemainingState } from "./Interfaces/Interfaces";

// const HiastSchedule : number [] = [
//   900 , 1015 , 1025, 1140 , 1150, 1305 , 1350 , 1505 , 1515 , 1630
// ]
const HiastSchedule: number[] = [
	900, 1005, 1010, 1115, 1120, 1225, 1255, 1400, 1405, 1510,
];
const whatToSay: string[] = [
	"Good Morning",
	"First Period",
	"10 mins Break",
	"Second Period",
	"10 mins Break",
	"Third Period",
	"Lunch Break",
	"Forth Period",
	"10 mins Break",
	"Fifth Period",
	"Classes Are Over For Today",
];
const HScheduleDates: Date[] = HiastSchedule.map(function (x: number): Date {
	let d = new Date();
	d.setHours(Math.floor(x / 100));
	d.setMinutes(x % 100);
	d.setSeconds(0);
	return d;
});
function getTimeRemaining(
	whatToSayIndex: number,
	endtime: Date
): TimeRemainingState {
	let now: Date = new Date();
	let total: number = endtime.valueOf() - now.valueOf();
	const seconds = Math.floor((total / 1000) % 60);
	const minutes = Math.floor((total / 1000 / 60) % 60);
	const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
	const days = Math.floor(total / (1000 * 60 * 60 * 24));
	return {
		whatToSayIndex,
		total,
		days,
		hours,
		minutes,
		seconds,
	};
}
function whereAmI(list: Date[]): TimeRemainingState {
	let now = new Date();
	let index: number = 0;
	while (now.valueOf() - list[index].valueOf() > 0) {
		index = index + 1;
		if (index === list.length) {
			break;
		}
	}
	if (index === list.length) {
		let d: Date = list[0];
		d.setDate(now.getDay() + 1);
		return getTimeRemaining(index, d);
	} else return getTimeRemaining(index, list[index]);
}
function TimeRemainingStringify(x: TimeRemainingState): string {
	let output: string = ``;
	let h: string = x.hours.toString();
	let m: string =
		x.minutes < 10 ? `0` + x.minutes.toString() : x.minutes.toString();
	let s: string =
		x.seconds < 10 ? `0` + x.seconds.toString() : x.seconds.toString();
	if (x.hours !== 0 || x.minutes !== 0 || x.seconds !== 0) {
		output += whatToSay[x.whatToSayIndex] + "   ";
		if (x.whatToSayIndex + 1 < whatToSay.length) {
			if (x.hours !== 0) {
				output += h + `:` + m + `:` + s;
			} else if (x.minutes !== 0) {
				output += m + `:` + s;
			} else if (x.seconds !== 0) {
				output +=
					x.seconds + (x.seconds !== 1 ? `   Seconds` : `   Second`);
			}
			output += "   Until   " + whatToSay[x.whatToSayIndex + 1];
		}
	} else {
		output += whatToSay[x.whatToSayIndex + 1];
	}
	return output;
}

export function TimeRemaining(): JSX.Element {
	const [state, setState] = useState<TimeRemainingState>(
		whereAmI(HScheduleDates)
	);

	React.useEffect(
		() => {
			let ID: any = setInterval(() => {
				setState(whereAmI(HScheduleDates));
			}, 1000);
			return function cleanup() {
				clearInterval(ID);
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return (
		<div className="App-header">
			<Typography variant="h2" id="TimeRemaining" align="center">
				{TimeRemainingStringify(state)}
			</Typography>
		</div>
	);
}
