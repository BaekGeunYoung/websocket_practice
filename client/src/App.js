import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import IntroPage from "./IntroPage";
import ChatPage from "./ChatPage";

function App() {
  return (
      <div className={"page-layout"}>
        <BrowserRouter>
          <Switch>
            <Route exact path={"/"} component={IntroPage}/>
            <Route exact path={"/chat"} component={ChatPage}/>
          </Switch>
        </BrowserRouter>
      </div>
  );
}

export default App;
