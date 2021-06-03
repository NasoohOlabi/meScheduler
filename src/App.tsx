import React from 'react';
import './App.css';
import {TimeRemaining} from "./ETAScreen";
import MyAppBar from "./Components/AppBar";
import {lightTheme , darkTheme} from "./theme/themes";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import ReactPWAInstallProvider from "react-pwa-install";
import {WeekView} from './Components/Week';


enum Screen  {ETA , TABLE}

const HomeScreen : Screen = Screen.TABLE;




function Body (props : {UI:Screen} ) : JSX.Element{
  let comp = (props.UI === Screen.ETA) ?<TimeRemaining/>:<WeekView />;
  return (
        comp
  );
}


function App() :JSX.Element {
  const [screen , setScreen] = React.useState(HomeScreen);
  const [dark , setDark] = React.useState(true);

  const switchToETA = (event : any) =>{
    if (screen !== Screen.ETA){
      setScreen(Screen.ETA);
    }
  }

  const toggleTheme = (event : any)=>{
    setDark(!dark);
  }
 
  const switchToTable = (event : any) =>{
    if (screen !== Screen.TABLE){
      setScreen(Screen.TABLE);
    }
  }

  let theme = ()=> (dark)?{...darkTheme} :  {...lightTheme};

  return (
    <div>
    <ThemeProvider theme={theme()}   >
      <CssBaseline />
      <ReactPWAInstallProvider enableLogging>
      <MyAppBar theme={theme()}  UI={screen} toggleTheme={toggleTheme} darkThemed={dark} switchToTable={switchToTable} switchToETA = {switchToETA} />
      </ReactPWAInstallProvider>
      <Body UI={screen} />
    </ThemeProvider>
    </div>
  );
}


export default App;
