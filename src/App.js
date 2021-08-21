// dependencies
import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import io from "socket.io-client";
// contexts
import { SocketContext, UserContext, RoomContext } from "./states/contexts";
import apiUrl from "./states/apiUrl";
// components
import Alert from "./components/alerts/Alert";
// pages
import Home from "./pages/home";
import Stage from "./pages/stage";
// fns
import { VideoJSfn } from "./components/VideoJS";

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(sessionStorage.getItem("Username"));
  const [roomData, setRoomData] = useState({ id: null, inRoom: false });

  const setupSocket = (callback) => {
    let sessionUser = sessionStorage.getItem("Username");
    if (sessionUser && !socket) {
      const newSocket = io(`${apiUrl}/`, {
        query: {
          Username: sessionUser,
        },
      });

      newSocket.on("disconnect", () => {
        console.log("Socket Disconnected");
        newSocket.off("connect");

        // reconnecting
        newSocket.on("connect", () => {
          console.log("Socket Reconnected");
          if (window.location.pathname.length > 11)
            newSocket.emit("joinRoom", {
              RoomId: window.location.pathname.slice(-11),
            });
          if (VideoJSfn.emitVideoReady) {
            VideoJSfn.emitVideoReady();
          }
        });
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
          <RoomContext.Provider value={{ roomData, setRoomData }}>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/:id" component={Stage} />
            </Switch>
          </RoomContext.Provider>
        </UserContext.Provider>
      </SocketContext.Provider>
      <Alert />
    </>
  );
}

export default App;
