// dependencies
import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
// contexts
import { SocketContext, UserContext, AlertContext } from "../states/contexts";
import apiUrl from "../states/apiUrl";
// components
import VideoJS from "../components/VideoJS";
import Sidebar from "../components/sideBar";

export default function Video({ match }) {
  // contexts
  const { socket, setupSocket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);
  // states
  const [loaded, setLoaded] = useState(false);
  const [percent, setPercent] = useState(0);
  const [src, setSrc] = useState("");
  const [roomId] = useState(match.params.id);
  const [roomName, setRoomName] = useState("");
  const [audience, setAudience] = useState([]);
  // history
  const history = useHistory();

  const handleJoinRoom = (paramSocket) => {
    const tempSocket = paramSocket ? paramSocket : socket;

    if (tempSocket) {
      tempSocket.emit("joinRoom", { RoomId: roomId });
      tempSocket.on("joinRoomconf", ({ conf }) => {
        if (conf) {
          tempSocket.off("joinRoomconf");
          console.log("room joined");
          setAlert({
            type: "success",
            title: "",
            content: "Binge🍿 with your friends🎉",
          });
          tempSocket.on("welcomeFriends", handleWelcomeFriends);
          tempSocket.on("byeFriend", handleByeFriend);
        } else {
          setAlert({
            type: "danger",
            title: "Error!",
            icon: true,
            content: "Room doesn't exist",
          });
          tempSocket.off("joinRoomconf");
          history.push("/");
        }
      });
    } else {
      setupSocket(handleJoinRoom);
    }
  };

  const handleWelcomeFriends = ({ name, currentUsers }) => {
    if (name !== user)
      setAlert({
        type: "success",
        title: name,
        content: "joined 🎉",
      });
    setAudience(currentUsers);
  };

  const handleByeFriend = ({ name, currentUsers }) => {
    if (name !== user)
      setAlert({
        type: "danger",
        title: name,
        content: "left 👋",
      });
    setAudience(currentUsers);
  };

  useEffect(() => {
    if (!user) {
      history.push("/");
      setAlert({
        type: "danger",
        title: "Error!",
        icon: true,
        content: "Enter name",
      });
    } else {
      handleJoinRoom();

      fetch(`${apiUrl}/room?id=${roomId}`).then((res) => {
        res
          .json()
          .then((body) => {
            setRoomName(body.data);
          })
          .catch((err) => console.log(err));
      });
    }
    // eslint-disable-next-line
  }, [roomId, socket]);

  const videoJsOptions = {
    controls: true,
    fill: true,
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];

    let reader = new FileReader();
    reader.onprogress = function (e) {
      setPercent(Math.round((e.loaded * 100) / e.total));
    };

    reader.onload = function (e) {
      let buffer = e.target.result;
      let videoBlob = new Blob([new Uint8Array(buffer)], { type: "video/mp4" });
      setSrc(URL.createObjectURL(videoBlob));

      setLoaded(true);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div
      className="flex flex-col items-center justify-center bg-darkBg"
      style={{ height: "100vh", width: "100%" }}
    >
      <Sidebar name={roomName} propAudience={audience} />
      {loaded ? (
        <div className="h-full w-full p-10 px-20">
          <div className="h-full w-full">
            <VideoJS
              options={{
                ...videoJsOptions,
                sources: [
                  {
                    src: src,
                    type: "video/mp4",
                  },
                ],
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <input
            type="file"
            className="py-3 px-6 mt-5 text-white rounded-lg bg-green-500 shadow-lg block md:inline-block"
            onChange={handleVideoUpload}
          />
          <span className="text-white">
            {percent ? "Loading: " + percent + "%" : ""}
          </span>
        </>
      )}
    </div>
  );
}
