import { Switch, Route } from "react-router-dom";
// pages
import Home from "./pages/home";
import Video from "./pages/video";

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/stage" exact component={Video} />
    </Switch>
  );
}

export default App;
