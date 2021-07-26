//import { Card, Typography } from "@material-ui/core";
import React,{useEffect, } from "react";
import "../App.css";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Paper } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import {BasicTable} from "./BasicTable";
import {fill,SwitchEventHander,useForceUpdate,teacherScheduleInit,randomFiller} from '../Logic/Logic';
import {emptyNumMatrix,newGrid} from '../Logic/util';
import {IClass , IWEEK_GLOBAL_Object} from '../Interfaces/Interfaces'
//import greenlet from 'greenlet'



var day = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  "-1": "All Day",
  "All Day": -1,
};

const teachersGuild : string[]= [
  'Rahaf Kayal',
  'Anas Shaban',
  'Nisreen Selo',
  'Mayson Al-Monakel',
  'Eyad Al-Taba3',
  'Tawfiq Khabaz',
  'MHD Bardawel',
  "A'yda Husain",
  '3rfan Kholendy',
  'Laila',
  "Oydad A'airan",
  'Abyear Hammoud',
  'Maram jadeed',
  'Eiman Taha',
  'Nermen Ash',
  'Saeed KabaKouly',
  'IT',
  'Khaled Barakat',
  'Mona Hasanyn',
  'Nour Hamad',
  'Fayes Wahba',
  'Issam Kreeshan',
  'Reem Mukhalalaty',
  'Heba Kozon',
  'Nada Al-Safadi',
  'Nour Refayi',
  'Arts',
  "PA",
  'Music',
  'Hala Huobi',
];

var grade7class1: IClass = {
  l: newGrid() ,
  Name: "grade7class1",
  teachers: {
    "PA": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nour Refayi": {
        "remPeriods": 5,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Music": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Heba Kozon": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Arts": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "IT": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Oydad A'airan": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Khaled Barakat": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mona Hasanyn": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Hala Huobi": {
        "remPeriods": 6,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Abyear Hammoud": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nour Hamad": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps : 0,
};
var grade7class2: IClass = {
  l: newGrid(),
  Name: "grade7class2",
  teachers: {
    "PA": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nour Refayi": {
        "remPeriods": 5,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Music": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Heba Kozon": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Arts": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "IT": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Oydad A'airan": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Khaled Barakat": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mona Hasanyn": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Hala Huobi": {
        "remPeriods": 6,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Abyear Hammoud": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nour Hamad": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps:0
};
var grade8class1: IClass = {
  l: newGrid(),
  Name: "grade8class1",
  
  teachers: {
    "PA": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Maram jadeed": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Heba Kozon": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Rahaf Kayal": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Anas Shaban": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Music": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Khaled Barakat": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Hala Huobi": {
        "remPeriods": 6,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Arts": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "IT": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mona Hasanyn": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Abyear Hammoud": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nour Hamad": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps:0
};
var grade8class2: IClass = {
  l: newGrid(),
  Name: "grade8class2",
  
  teachers: {
    "PA": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Maram jadeed": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Heba Kozon": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Rahaf Kayal": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Anas Shaban": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Music": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Khaled Barakat": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Hala Huobi": {
        "remPeriods": 6,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Arts": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "IT": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mona Hasanyn": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Abyear Hammoud": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nour Hamad": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps:0
};
var grade9class1: IClass = {
  l: newGrid(),
  Name: "grade9class1",
  
  teachers: {
    "PA": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Maram jadeed": {
        "remPeriods": 6,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Music": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nisreen Selo": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Eiman Taha": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Arts": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "IT": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nermen Ash": {
        "remPeriods": 6,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mona Hasanyn": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Abyear Hammoud": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mayson Al-Monakel": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps:0
};
var grade9class2: IClass = {
  l: newGrid(),
  Name: "grade9class2",
  
  teachers: {
    "PA": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Maram jadeed": {
        "remPeriods": 6,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Music": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nisreen Selo": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Eiman Taha": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Arts": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "IT": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nermen Ash": {
        "remPeriods": 6,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mona Hasanyn": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Abyear Hammoud": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mayson Al-Monakel": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps:0
};
var grade10class1: IClass = {
  l: newGrid(),
  Name: "grade10class1",
  
  teachers: {
    "PA": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Oydad A'airan": {
        "remPeriods": 6,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Rahaf Kayal": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Arts": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nour Hamad": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nisreen Selo": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Eiman Taha": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "IT": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mona Hasanyn": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nada Al-Safadi": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Eyad Al-Taba3": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Abyear Hammoud": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps:0
};
var grade10class2: IClass = {
  l: newGrid(),
  Name: "grade10class2",
  
  teachers: {
    "PA": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Oydad A'airan": {
        "remPeriods": 6,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Rahaf Kayal": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Arts": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nour Hamad": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nisreen Selo": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Eiman Taha": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "IT": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mona Hasanyn": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nada Al-Safadi": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Eyad Al-Taba3": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Abyear Hammoud": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps:0
};
var grade11class1: IClass = {
  l: newGrid(),
  Name: "grade11class1",
  
  teachers: {
    "PA": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Issam Kreeshan": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Saeed KabaKouly": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Rahaf Kayal": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Arts": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Eiman Taha": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "IT": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mona Hasanyn": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nisreen Selo": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Eyad Al-Taba3": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nermen Ash": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Fayes Wahba": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Tawfiq Khabaz": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps:0
};
var grade11class2: IClass = {
  l: newGrid(),
  Name: "grade11class2",
  
  teachers: {
    "PA": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Issam Kreeshan": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Saeed KabaKouly": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Rahaf Kayal": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Arts": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Eiman Taha": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "IT": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Mona Hasanyn": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nisreen Selo": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Eyad Al-Taba3": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nada Al-Safadi": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Fayes Wahba": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Tawfiq Khabaz": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps:0
};
var grade12class1: IClass = {
  l: newGrid(),
  Name: "grade12class1",
  
  teachers: {
    "MHD Bardawel": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Issam Kreeshan": {
        "remPeriods": 5,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Saeed KabaKouly": {
        "remPeriods": 5,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "A'yda Husain": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Reem Mukhalalaty": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "3rfan Kholendy": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Laila": {
        "remPeriods": 1,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Fayes Wahba": {
        "remPeriods": 2,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Tawfiq Khabaz": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nisreen Selo": {
        "remPeriods": 3,
        "periodsHere": [],
"emptyAvailables":[]
    },
    "Nermen Ash": {
        "remPeriods": 4,
        "periodsHere": [],
"emptyAvailables":[]
    }
},
  laps:0
};
export var allClasses = [
  grade7class1,
  grade7class2,
  grade8class1,
  grade8class2,
  grade9class1,
  grade9class2,
  grade10class1,
  grade10class2,
  grade11class1,
  grade11class2,
  grade12class1,
];
export const availables : any = {
  "MHD Bardawel": [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  Music: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  PA: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
  ],
  Arts: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  IT: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
  ],
  "Mona Hasanyn": [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "Eyad Al-Taba3": [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 0],
    [2, 1],
    [3, 0],
    [3, 1],
    [4, 0],
    [4, 1],
  ],
  "A'yda Husain": [
    [1, 0],
    [3, 0],
    [3, 1],
  ],
  "Fayes Wahba": [
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "Abyear Hammoud": [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  "Tawfiq Khabaz": [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
  ],
  "Mayson Al-Monakel": [
    [2, 4],
    [2, 5],
    [2, 6],
    [4, 0],
    [4, 1],
    [4, 2],
  ],
  "Nour Hamad": [
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "Reem Mukhalalaty": [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  "Oydad A'airan": [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "Maram jadeed": [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "Issam Kreeshan": [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
  ],
  "Saeed KabaKouly": [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  'Heba Kozon': [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
  ],
  "Khaled Barakat": [
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "Nisreen Selo": [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "3rfan Kholendy": [
    [2, 5],
    [2, 6],
    [4, 5],
    [4, 6],
  ],
  "Eiman Taha": [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "Rahaf Kayal": [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  "Anas Shaban": [
    [0, 4],
    [0, 5],
    [0, 6],
    [2, 4],
    [2, 5],
    [2, 6],
  ],
  "Nour Refayi": [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  "Hala Huobi": [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "Nada Al-Safadi": [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  "Nermen Ash": [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  Laila: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
};

//sth##########################################################################################################

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    table: {
      minWidth: 650,
    },
  })
);
const headRow = [
  "Period 1",
  "Period 2",
  "Period 3",
  "Period 4",
  "Period 5",
  "Period 6",
  "Period 7",
];
const headCol = [day[0], day[1], day[2], day[3], day[4]];



// let init = greenlet( async () => {
//   console.log("defining p ...")
//   const p  = await asyncFill(allClasses , availables);
//   console.log("immediatly post def ...")
//   //p.then((value : any)=>{[allClasses, availables]=value})
// });



export function WeekView( theme :any ): JSX.Element {
  const classes = useStyles();
  const forceUpdate = useForceUpdate();
  const School = React.useRef(allClasses);
  //initializing with nums works because you can't triger the switchEventHandler unless all Cells has mounted thus refreshTable becomes a (()=>void)[][][]
  const refreshTable = React.useRef(emptyNumMatrix(allClasses.length,allClasses[0].l.length,allClasses[0].l[0].length)).current;
  const WEEK_GLOBAL_Object : IWEEK_GLOBAL_Object = React.useRef({allClasses, teachersGuild , refreshTable , forceUpdate , Swaping:false ,currentSolutionNumber : 0, activateList : [],availables, HandyAny:{} }).current;

  const handleChange = ( School : IClass[])=>{
    return (Pos : [ number , number] , m : number)=>{
      return SwitchEventHander(Pos , School  , m , teachersGuild, WEEK_GLOBAL_Object);
    }
  };

  const initCell = ( m : number )=>{
    return (Pos : [number,number] )=>{
      return ( cellRefresher : any)=>{
        WEEK_GLOBAL_Object.refreshTable[m][Pos[0]][Pos[1]] = cellRefresher;
      }
    }
  }
  // const updateMatrix (allClasses.length)*(class.l.length)*(class.l[0].length)

  useEffect ( ()=>{
    
    //(async ()=>{await init()})(); 
    console.clear();
    teacherScheduleInit(WEEK_GLOBAL_Object , availables);
    fill(WEEK_GLOBAL_Object);
    randomFiller(WEEK_GLOBAL_Object);
    forceUpdate();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          {allClasses.map((Class,i) => {
            return (
              <Paper key ={i} className={classes.paper}>
                <BasicTable 
                  // theme = {props.theme}
                  School = {School.current} 
                  m={i}
                  headCol={headCol} 
                  headRow={headRow}
                  cellInitializer = {initCell(i)}
                  handleChange = {handleChange(School.current)}
                  WEEK_GLOBAL_Object = {WEEK_GLOBAL_Object}
                />
              </Paper>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
}





/*
let unavailables = {
  'MHD Bardawel': [
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  Music: [
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
  ],
  PA: [
    [1, 5],
    [4, 6],
    [1, 6],
    [4, 5],
  ],
  Arts: [
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
  ],
  IT: [
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  'Mona Hasanyn': [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
  ],
  'Eyad Al-Taba3': [
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "A'yda Husain": [
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  'Fayes Wahba': [
    [2, 0],
    [2, 1],
    [2, 2],
    [4, 0],
    [4, 1],
    [4, 2],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  'Abyear Hammoud': [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  'Tawfiq Khabaz': [
    [0, 5],
    [0, 6],
    [4, 5],
    [4, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  'Mayson Al-Monakel': [
    [2, 2],
    [2, 3],
    [2, 0],
    [2, 1],
    [4, 4],
    [4, 3],
    [4, 5],
    [4, 6],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  'Nour Hamad': [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
  ],
  'Reem Mukhalalaty': [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  "Oydad A'airan": [
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  'Maram jadeed': [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  'Issam Kreeshan': [
    [1, 5],
    [1, 6],
    [2, 5],
    [2, 6],
    [3, 5],
    [3, 6],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  'Saeed KabaKouly': [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  'Heba Kozon': [
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
  ],
  'Khaled Barakat': [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
  ],
  'Nisreen Selo': [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
  ],
  '3rfan Kholendy': [
    [2, 2],
    [2, 3],
    [2, 0],
    [2, 1],
    [2, 4],
    [4, 2],
    [4, 3],
    [4, 0],
    [4, 1],
    [4, 4],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
  'Eiman Taha': [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
  ],
 'Rahaf Kayal': [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  'Anas Shaban': [
    [0, 2],
    [0, 3],
    [0, 0],
    [0, 1],
    [2, 2],
    [2, 3],
    [2, 0],
    [2, 1],
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  'Nour Refayi': [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  'Hala Huobi': [],
  'Nada Al-Safadi': [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  'Nermen Ash': [
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
  Laila: [
    [1, 3],
    [1, 1],
    [1, 2],
    [3, 3],
    [3, 1],
    [3, 2],
    [4, 0],
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
  ],
};
*/
