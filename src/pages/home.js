import { useState } from "react";
import Modal from "../components/modal";

export default function Home() {
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  return (
    <>
      <div
        className="flex items-center justify-center"
        style={{ height: "100vh", width: "100vw" }}
      >
        <button
          className="py-3 px-6 mr-2 text-white rounded-lg bg-green-500 shadow-lg  hover:bg-green-600"
          onClick={() => {
            setShowModal1(true);
          }}
        >
          Create Room
        </button>
        <button
          className="py-3 px-6 text-white rounded-lg bg-green-500 shadow-lg  hover:bg-green-600"
          onClick={() => {
            setShowModal2(true);
          }}
        >
          Join
        </button>
      </div>

      {showModal1 ? (
        <Modal setShowModal={setShowModal1}>
          <>
            <span className="mr-2">
              <span className="font-bold">Room ID:</span> 123
            </span>
            <button className="py-3 px-6 text-white rounded-lg bg-green-500 shadow-lg  hover:bg-green-600">
              Join
            </button>
          </>
        </Modal>
      ) : (
        ""
      )}

      {showModal2 ? (
        <Modal setShowModal={setShowModal2}>
          <>
            <input
              type="text"
              placeholder="Room ID"
              className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mr-5 pl-10"
            />
            <button className="py-3 px-6 text-white rounded-lg bg-green-500 shadow-lg  hover:bg-green-600">
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
