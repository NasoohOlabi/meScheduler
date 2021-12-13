package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type lCellObj struct {
	CurrentTeacher string   `json:"currentTeacher"`
	IsCemented     bool     `json:"isCemented"`
	Options        []string `json:"Options"`
}

type classTeacher struct {
	RemPeriods      int       `json:"remPeriods"`
	Periods         int       `json:"Periods"`
	PeriodsHere     [][][]int `json:"periodsHere"`
	EmptyAvailables [][][]int `json:"emptyAvailables"`
}
type IClass struct {
	L        [][]lCellObj            `json:"l"`
	Name     string                  `json:"Name"`
	Teachers map[string]classTeacher `json:"teachers"`
}
type Step struct {
	Pos     []int  `json:"Pos"`
	Teacher string `json:"teacher"`
	M       int    `json:"m"`
}

type WEEK_Object struct {
	AllClasses            []IClass             `json:"allClasses"`
	TeachersGuild         []string             `json:"teachersGuild"`
	Swaping               bool                 `json:"Swaping"`
	CurrentSolutionNumber int                  `json:"currentSolutionNumber"`
	ActivateList          [][]Step             `json:"activateList"`
	Availables            map[string]([][]int) `json:"availables"`
	TeacherSchedule       map[int]int          `json:"teacherSchedule"`
}

func main() {
	fmt.Printf("online!")
	// Open our jsonFile
	jsonFile, err := os.Open("file.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened users.json")

	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()
	// read our opened jsonFile as a byte array.
	byteValue, _ := ioutil.ReadAll(jsonFile)

	// we initialize our Users array
	var week WEEK_Object

	// we unmarshal our byteArray which contains our
	// jsonFile's content into 'users' which we defined above
	json.Unmarshal(byteValue, &week)

	fmt.Print(week.CurrentSolutionNumber)

	for key, value := range week.AllClasses[0].L[0] {
		fmt.Printf("\n%d : %s", key, value.CurrentTeacher)
	}
}
