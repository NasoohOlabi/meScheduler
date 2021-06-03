import { useReactPWAInstall } from "react-pwa-install";
import myLogo from "./Square71x71Logo.scale-200.png";
import { Button } from '@material-ui/core';
//import { Banner, StaticBanner } from 'material-ui-banner';

interface IProps{
  color? : any , className ?: any
}

export function InstallButton(props : IProps) : JSX.Element {
    const { pwaInstall, supported, isInstalled } = useReactPWAInstall();
   
    const handleClick = () => {
      pwaInstall({
        title: "My Scheduler",
        logo: myLogo,
        features: (
          <ul>
            <li>Cool feature 1</li>
            <li>Cool feature 2</li>
            <li>Even cooler feature</li>
            <li>Works offline</li>
          </ul>
        ),
        description: "This is a very good app that does a lot of useful stuff. ",
      })
        .then(() => alert("App installed successfully or instructions for install shown"))
        .catch(() => alert("User opted out from installing"));
    };
    const IB : JSX.Element = (
        <Button onClick={handleClick} color={props.color} className={props.className} >
            Install
        </Button>
    );
    return (
      <div>
        {(supported() && !isInstalled)? IB : null }
      </div>
    );
    }
     /*
export function InstallBanner() : JSX.Element {




    return (

        <StaticBanner/>

    );
}*/