import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import IntroPage from "./pages/IntroPage/IntroPage";
import ChatPage from "./pages/ChatPage/ChatPage";

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
