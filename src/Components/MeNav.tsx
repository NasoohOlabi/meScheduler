import React from "react";
import "../App.css";
//import {Button,Navbar,NavDropdown, FormControl, Form, Nav} from "react-bootstrap";
//import ReactPWAInstallProvider from "react-pwa-install";
import { InstallButton } from "./A2HS";
import { AppBar, Typography, Toolbar } from "@material-ui/core";
import classes from "*.module.css";
import { INavProps } from "../Interfaces/Interfaces";

export function MeNav(props: INavProps) {
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6" className={classes.title}>
					My Scheduler
				</Typography>
				<InstallButton />
			</Toolbar>
		</AppBar>
	);
}

/*
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="../public/index.html">Me Scheduler</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick = {props.switchToETA}>Home</Nav.Link>
            <Nav.Link onClick={props.switchToTable} >Week</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item  >Week</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <ReactPWAInstallProvider enableLogging>
                <InstallButton />
                </ReactPWAInstallProvider>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
    </Navbar>*/
