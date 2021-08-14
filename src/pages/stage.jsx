// dependencies
import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
// contexts
import { SocketContext, UserContext } from "../states/contexts";
import apiUrl from "../states/apiUrl";
// components
import { popAlert } from "../components/alerts/Alert";
import VideoJS from "../components/VideoJS";
import Sidebar from "../components/sideBar";

export default function Stage({ match }) {
  // contexts
  const { socket, setupSocket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  // states
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [percent, setPercent] = useState(0);
  const [src, setSrc] = useState("");
  const [roomId] = useState(match.params.id);
  const [roomName, setRoomName] = useState("");
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
          popAlert.display({
            type: "success",
            title: "",
            content: "Binge🍿 with your friends🎉",
          });
        } else {
          popAlert.display({
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

  useEffect(() => {
    if (!user) {
      history.push("/");
      popAlert.display({
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

    return () => {
      if (socket) {
        socket.emit("leaveRoom", { RoomId: roomId });
      }
    };
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

      setVideoLoaded(true);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div
      className="flex flex-col items-center justify-center bg-darkBg"
      style={{ height: "100vh", width: "100%" }}
    >
      <Sidebar name={roomName} />

      {videoLoaded ? (
        <div className={"h-full w-full p-10 px-20"}>
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
        ""
      )}

      <div
        className={`flex flex-col justify-center items-center ${
          videoLoaded ? "hidden" : ""
        }`}
      >
        <input
          type="file"
          className="py-3 px-6 mt-5 text-white rounded-lg bg-green-500 shadow-lg block md:inline-block"
          onChange={handleVideoUpload}
        />
        <span className="text-white">
          {percent ? "Loading: " + percent + "%" : ""}
        </span>
      </div>
    </div>
  );
}
