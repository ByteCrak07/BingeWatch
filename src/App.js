// dependencies
import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import io from "socket.io-client";
// contexts
import { SocketContext, UserContext } from "./states/contexts";
import apiUrl from "./states/apiUrl";
// components
import Alert from "./components/alerts/Alert";
// pages
import Home from "./pages/home";
import Stage from "./pages/stage";

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(sessionStorage.getItem("Username"));

  const setupSocket = (callback) => {
    console.log("setup");
    let sessionUser = sessionStorage.getItem("Username");
    if (sessionUser && !socket) {
      const newSocket = io(`${apiUrl}/`, {
        query: {
          Username: sessionUser,
        },
      });

      newSocket.on("disconnect", () => {
        console.log("Socket Disconnected");
      });

      newSocket.on("connect", () => {
        console.log("Socket Connected");
      });

      setSocket(newSocket);
      setUser(sessionUser);

      if (callback)
        setTimeout(() => {
          callback(newSocket);
        }, 100);
    }
  };

  useEffect(() => {
    setupSocket();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <SocketContext.Provider value={{ socket, setupSocket }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/:id" component={Stage} />
          </Switch>
        </UserContext.Provider>
      </SocketContext.Provider>
      <Alert />
    </>
  );
}

export default App;
