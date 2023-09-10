import React from "react";
import ReactDOM from "react-dom";
// import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { GlobalStateProvider } from './globalState/globalState';

ReactDOM.render(
	<React.StrictMode>
		{/* <BrowserRouter> */}
		<GlobalStateProvider children={(<App/>)}>
			{/* <App/> */}
		</GlobalStateProvider>
		{/* </BrowserRouter> */}
	</React.StrictMode>,
	document.getElementById("root")
);
