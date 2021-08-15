import { useRef, useState, useContext } from "react";
import Modal from "../components/modal";
import { useHistory } from "react-router-dom";
import { SocketContext, UserContext } from "../states/contexts";

export default function Home() {
  // contexts
  const { socket, setupSocket } = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);
  // states
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [name, setName] = useState(sessionStorage.getItem("Username"));
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  // refs
  const copySpan = useRef(null);
  // history
  const history = useHistory();

  function generateId(len) {
    var arr = new Uint8Array((len + 1 || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
  }

  const handleCheckRoom = (paramSocket) => {
    const tempSocket = paramSocket ? paramSocket : socket;
    if (!roomId && tempSocket) {
      let rId = generateId(8);
      let randRoom = `${rId.slice(0, 3)}-${rId.slice(3, 5)}r-${rId.slice(
        5,
        8
      )}`;
      tempSocket.emit("checkRoom", { RoomId: randRoom });
      tempSocket.on("checkRoomconf", ({ conf }) => {
        if (conf) {
          setRoomId(randRoom);
          tempSocket.off("checkRoomconf");
          console.log("room available");
        } else {
          tempSocket.off("checkRoomconf");
          setTimeout(handleCheckRoom, 1000);
        }
      });
    } else {
      console.log(roomId, tempSocket);
      setupSocket(handleCheckRoom);
    }
  };

  const handleCreateRoom = () => {
    socket.emit("createRoom", { RoomId: roomId, Name: roomName });
    socket.on("createRoomconf", ({ conf }) => {
      if (conf) {
        socket.off("createRoomconf");
        let range = document.createRange();
        range.selectNode(copySpan.current);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        history.push(`/${roomId}`);
      } else {
        socket.off("createRoomconf");
        setTimeout(handleCreateRoom, 1000);
      }
    });
  };

  const addUser = () => {
    sessionStorage.setItem("Username", name);
    if (!user || user === name) setUser(name);
    else window.location.reload();
  };

  return (
    <>
      <div
        className="flex items-center justify-center flex-col bg-darkBg"
        style={{ height: "100vh", width: "100vw" }}
      >
        {socket?.toString()}
        <input
          type="text"
          placeholder="Name"
          defaultValue={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="px-5 py-3 mb-3 relative bg-white rounded text-sm border-0 shadow outline-none ring-2 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <div>
          <button
            className="py-3 px-6 mr-2 text-white rounded-lg bg-green-500 shadow-lg hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
            onClick={() => {
              setShowModal1(true);
              addUser();
              handleCheckRoom();
            }}
            disabled={!name}
          >
            Create Room
          </button>
          <button
            className="py-3 px-6 text-white rounded-lg bg-green-500 shadow-lg hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
            onClick={() => {
              setShowModal2(true);
              addUser();
            }}
            disabled={!name}
          >
            Join
          </button>
        </div>
      </div>

      {showModal1 ? (
        <Modal setShowModal={setShowModal1}>
          <>
            <input
              type="text"
              placeholder="Room Name"
              className="px-5 py-3 w-full mb-3 mr-3 relative bg-white rounded text-sm border-0 shadow outline-none ring-2 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={(e) => {
                setRoomName(e.target.value);
              }}
              maxLength="30"
            />
            <div className="flex justify-evenly items-center">
              <span className="mr-2">
                <span className="font-bold">Room ID:</span>{" "}
                <span style={{ width: 25 }} ref={copySpan}>
                  {roomId}
                </span>
              </span>
              {roomId ? (
                <button
                  className="py-3 px-6 text-white rounded-lg bg-green-500 shadow-lg hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  onClick={() => {
                    handleCreateRoom();
                  }}
                  disabled={!roomName}
                >
                  Create Room
                </button>
              ) : (
                ""
              )}
            </div>
          </>
        </Modal>
      ) : (
        ""
      )}

      {showModal2 ? (
        <Modal setShowModal={setShowModal2} clearValue={setRoomId}>
          <>
            <input
              type="text"
              placeholder="Room ID"
              className="px-5 py-3 mb-3 mr-3 relative bg-white rounded text-sm border-0 shadow outline-none ring-2 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
            />
            <button
              className="py-3 px-6 text-white rounded-lg bg-green-500 shadow-lg hover:bg-green-600"
              onClick={() => {
                setupSocket();
                setTimeout(() => {
                  history.push(`/${roomId}`);
                }, 100);
              }}
            >
              Join
            </button>
          </>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
}
