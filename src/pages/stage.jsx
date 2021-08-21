// dependencies
import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
// contexts
import { SocketContext, UserContext, RoomContext } from "../states/contexts";
import apiUrl from "../states/apiUrl";
// components
import { popAlert } from "../components/alerts/Alert";
import VideoJS from "../components/VideoJS";
import Sidebar from "../components/sideBar";
// pages
import Loading from "./loading";

function Stage({ match }) {
  // contexts
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const { setRoomData } = useContext(RoomContext);
  // states
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [percent, setPercent] = useState(0);
  const [fileName, setFilename] = useState("");
  const [src, setSrc] = useState("");
  const [roomId] = useState(match.params.id);
  const [roomName, setRoomName] = useState("");
  // history
  const history = useHistory();

  useEffect(() => {
    const handleJoinRoom = () => {
      if (socket) {
        socket.emit("joinRoom", { RoomId: roomId });
        socket.on("joinRoomconf", ({ conf }) => {
          if (conf) {
            socket.off("joinRoomconf");
            // console.log("room joined");
            setRoomData({ id: roomId, inRoom: true });
            popAlert.display({
              type: "success",
              title: "",
              content: "Binge🍿 with your friends🎉",
            });
          } else {
            setRoomData({ id: null, inRoom: false });
            popAlert.display({
              type: "danger",
              title: "Error!",
              icon: true,
              content: "Room doesn't exist",
            });
            socket.off("joinRoomconf");
            history.push("/");
          }
        });
      }
    };

    if (!user) {
      setRoomData({ id: match.params.id, inRoom: false });
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
        setRoomData({ id: null, inRoom: false });
      }
    };
    // eslint-disable-next-line
  }, [roomId]);

  const videoJsOptions = {
    controls: true,
    fill: true,
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    setFilename(event.target.files[0].name);

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
              roomId={roomId}
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
        <label className="w-64 flex flex-col items-center px-4 py-6 border-4 border-green-400 rounded-md shadow-md tracking-wide uppercase cursor-pointer hover:bg-green-400 hover:text-white text-green-400 ease-linear transition-all duration-150">
          <i className="fas fa-theater-masks fa-3x"></i>
          <span className="mt-2 text-base leading-normal">
            {fileName ? fileName.substring(0, 20) : "Select a movie"}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleVideoUpload}
            disabled={fileName ? true : false}
          />
        </label>

        <span className="text-white">
          {percent ? "Loading: " + percent + "%" : ""}
        </span>
      </div>
    </div>
  );
}

export default function StageWrapper({ match }) {
  const { socket } = useContext(SocketContext);
  return <>{socket ? <Stage match={match} /> : <Loading match={match} />}</>;
}
