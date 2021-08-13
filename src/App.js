import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import io from "socket.io-client";
//contexts
import { SocketContext, UserContext } from "./contexts/contexts";
// pages
import Home from "./pages/home";
import Video from "./pages/video";

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(sessionStorage.getItem("Username"));

  const setupSocket = (user) => {
    console.log("setup");
    if (user && !socket) {
      const newSocket = io("https://binge-watch-api.herokuapp.com/", {
        query: {
          Username: user,
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 1000);
        console.log("Socket Disconnected");
      });

      newSocket.on("connect", () => {
        console.log("Socket Connected");
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket(user);
    // eslint-disable-next-line
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/:id" component={Video} />
        </Switch>
      </UserContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
