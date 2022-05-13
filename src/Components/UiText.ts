/* eslint-disable @typescript-eslint/no-unused-vars */
const headRow = [
	"Period 1",
	"Period 2",
	"Period 3",
	"Period 4",
	"Period 5",
	"Period 6",
	"Period 7",
];
export const day = {
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
const headCol = [day[0], day[1], day[2], day[3], day[4]];

export const displayNamesMap: {
	[details: string]: string;
} = {
	"": "",
	"Rahaf Kayal": "t0",
	t0: "Rahaf Kayal",
	"Anas Shaban": "t1",
	t1: "Anas Shaban",
	"Nisreen Selo": "t2",
	t2: "Nisreen Selo",
	"Mayson Al-Monakel": "t3",
	t3: "Mayson Al-Monakel",
	"Eyad Al-Taba3": "t4",
	t4: "Eyad Al-Taba3",
	"Tawfiq Khabaz": "t5",
	t5: "Tawfiq Khabaz",
	"MHD Bardawel": "t6",
	t6: "MHD Bardawel",
	"A'yda Husain": "t7",
	t7: "A'yda Husain",
	"3rfan Kholendy": "t8",
	t8: "3rfan Kholendy",
	Laila: "t9",
	t9: "Laila",
	"Oydad A'airan": "t10",
	t10: "Oydad A'airan",
	"Abyear Hammoud": "t11",
	t11: "Abyear Hammoud",
	"Maram jadeed": "t12",
	t12: "Maram jadeed",
	"Eiman Taha": "t13",
	t13: "Eiman Taha",
	"Nermen Ash": "t14",
	t14: "Nermen Ash",
	"Saeed KabaKouly": "t15",
	t15: "Saeed KabaKouly",
	IT: "t16",
	t16: "IT",
	"Khaled Barakat": "t17",
	t17: "Khaled Barakat",
	"Mona Hasanyn": "t18",
	t18: "Mona Hasanyn",
	"Nour Hamad": "t19",
	t19: "Nour Hamad",
	"Fayes Wahba": "t20",
	t20: "Fayes Wahba",
	"Issam Kreeshan": "t21",
	t21: "Issam Kreeshan",
	"Reem Mukhalalaty": "t22",
	t22: "Reem Mukhalalaty",
	"Heba Kozon": "t23",
	t23: "Heba Kozon",
	"Nada Al-Safadi": "t24",
	t24: "Nada Al-Safadi",
	"Nour Refayi": "t25",
	t25: "Nour Refayi",
	Arts: "t26",
	t26: "Arts",
	PA: "t27",
	t27: "PA",
	Music: "t28",
	t28: "Music",
	"Hala Huobi": "t29",
	t29: "Hala Huobi",
};
export const ArabicDisplayNamesMap: {
	[details: string]: string;
} = {
	"": "",
	"رهف كيال": "t0",
	t0: "رهف كيال",
	"أنس شعبان": "t1",
	t1: "أنس شعبان",
	"نسرين سلو": "t2",
	t2: "نسرين سلو",
	"ميسون المنقل": "t3",
	t3: "ميسون المنقل",
	"إياد الطباع": "t4",
	t4: "إياد الطباع",
	"توفيق الخباز": "t5",
	t5: "توفيق الخباز",
	"محمد بردويل": "t6",
	t6: "محمد بردويل",
	"عايدة حسين": "t7",
	t7: "عايدة حسين",
	"عرفان خولندي": "t8",
	t8: "عرفان خولندي",
	ليلى: "t9",
	t9: "ليلى",
	"وداد عيران": "t10",
	t10: "وداد عيران",
	"عبير حمود": "t11",
	t11: "عبير حمود",
	"مرام جديد": "t12",
	t12: "مرام جديد",
	"إيمان طه": "t13",
	t13: "إيمان طه",
	"نيرمين العش": "t14",
	t14: "نيرمين العش",
	"سعيد قبى قولي": "t15",
	t15: "سعيد قبى قولي",
	معلوماتية: "t16",
	t16: "معلوماتية",
	"خالد بركات": "t17",
	t17: "خالد بركات",
	"منى حسنين": "t18",
	t18: "منى حسنين",
	"نور حمد": "t19",
	t19: "نور حمد",
	"فايز وهبة": "t20",
	t20: "فايز وهبة",
	"عصام كريشان": "t21",
	t21: "عصام كريشان",
	"ريم مخللاتي": "t22",
	t22: "ريم مخللاتي",
	"هبة كوزون": "t23",
	t23: "هبة كوزون",
	"ندى صفدي": "t24",
	t24: "ندى صفدي",
	"نور ريفاعي": "t25",
	t25: "نور ريفاعي",
	فنون: "t26",
	t26: "فنون",
	رياضة: "t27",
	t27: "رياضة",
	موسيقة: "t28",
	t28: "موسيقة",
	"هالة حبي": "t29",
	t29: "هالة حبي",
};

interface ITexts {
	randomFillerButton: string;
	doneButton: string;
	headRow: string[];
	headCol: string[];
	DataViewBtn: string;
	WeekBtn: string;
	classGroupName: string;
	classTeachers: string;
	teacherName: string;
	LangDirection: "ltr" | "rtl";
	addClass: string;
	NameMap: {
		[details: string]: string;
	};
};
const currentDevUiTextObj: ITexts = {
	randomFillerButton: "Random Filler",
	LangDirection: "ltr",
	doneButton: "Done",
	DataViewBtn: "Data",
	WeekBtn: "Week",
	addClass: "addClass",
	classTeachers: "Class Teachers",
	headRow,
	teacherName: "Teacher's Name",
	classGroupName: "Class Name",
	headCol,
	NameMap: displayNamesMap,
};
const arabicUiTextObj: ITexts = {
	randomFillerButton: "حل عشوائي",
	doneButton: "موافق",
	DataViewBtn: "بيانات",
	WeekBtn: "البرنامج",
	addClass: "إضافة صف",
	// addTeacher: "إضافة إستاذ",
	LangDirection: "rtl",
	classGroupName: "اسم الصف",
	classTeachers: "أساتذة الصف",
	teacherName: "إسم الإستاذ",
	headRow: [
		"الحصة الأولى",
		"الحصة الثانية",
		"الحصة الثالثة",
		"الحصة الرابعة",
		"الحصة الخامسة",
		"الحصة السادسة",
		"الحصة السابعة",
	],
	headCol: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],

	NameMap: ArabicDisplayNamesMap,
};
class textsObj implements ITexts {
	randomFillerButton!: string;
	doneButton!: string;
	headRow!: string[];
	headCol!: string[];
	DataViewBtn!: string;
	WeekBtn!: string;
	classGroupName!: string;
	classTeachers!: string;
	teacherName!: string;
	LangDirection!: "rtl" | "ltr";
	addClass!: string;
	NameMap!: { [details: string]: string; };
	lang: "en" | "ar"
	constructor(UiTexts: ITexts, lang: "en" | "ar") {
		this.randomFillerButton = UiTexts.randomFillerButton
		this.doneButton = UiTexts.doneButton
		this.headRow = UiTexts.headRow
		this.headCol = UiTexts.headCol
		this.DataViewBtn = UiTexts.DataViewBtn
		this.WeekBtn = UiTexts.WeekBtn
		this.classGroupName = UiTexts.classGroupName
		this.classTeachers = UiTexts.classTeachers
		this.teacherName = UiTexts.teacherName
		this.LangDirection = UiTexts.LangDirection
		this.addClass = UiTexts.addClass
		this.NameMap = UiTexts.NameMap
		this.lang = lang
	}
	changeLanguage = () => {
		if (this.lang === "en") {
			this.lang = "ar"
			this.randomFillerButton = arabicUiTextObj.randomFillerButton
			this.doneButton = arabicUiTextObj.doneButton
			this.headRow = arabicUiTextObj.headRow
			this.headCol = arabicUiTextObj.headCol
			this.DataViewBtn = arabicUiTextObj.DataViewBtn
			this.WeekBtn = arabicUiTextObj.WeekBtn
			this.classGroupName = arabicUiTextObj.classGroupName
			this.classTeachers = arabicUiTextObj.classTeachers
			this.teacherName = arabicUiTextObj.teacherName
			this.LangDirection = arabicUiTextObj.LangDirection
			this.addClass = arabicUiTextObj.addClass
			this.NameMap = arabicUiTextObj.NameMap
		}
		else {
			this.lang = "en"
			this.randomFillerButton = currentDevUiTextObj.randomFillerButton
			this.doneButton = currentDevUiTextObj.doneButton
			this.headRow = currentDevUiTextObj.headRow
			this.headCol = currentDevUiTextObj.headCol
			this.DataViewBtn = currentDevUiTextObj.DataViewBtn
			this.WeekBtn = currentDevUiTextObj.WeekBtn
			this.classGroupName = currentDevUiTextObj.classGroupName
			this.classTeachers = currentDevUiTextObj.classTeachers
			this.teacherName = currentDevUiTextObj.teacherName
			this.LangDirection = currentDevUiTextObj.LangDirection
			this.addClass = currentDevUiTextObj.addClass
			this.NameMap = currentDevUiTextObj.NameMap
		}

	}
}

export let texts = new textsObj(currentDevUiTextObj, "en")