import { useState } from "react";
import Modal from "../components/modal";

export default function Home() {
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [name, setName] = useState("");

  return (
    <>
      <div
        className="flex items-center justify-center flex-col"
        style={{ height: "100vh", width: "100vw" }}
      >
        <input
          type="text"
          placeholder="Name"
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
            }}
            disabled={!name}
          >
            Create Room
          </button>
          <button
            className="py-3 px-6 text-white rounded-lg bg-green-500 shadow-lg hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
            onClick={() => {
              setShowModal2(true);
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
            <span className="mr-2">
              <span className="font-bold">Room ID:</span> 123asdas
            </span>
            <button className="py-3 px-6 text-white rounded-lg bg-green-500 shadow-lg hover:bg-green-600">
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
              className="px-3 py-3 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mr-5 pl-10"
            />
            <button className="py-3 px-6 text-white rounded-lg bg-green-500 shadow-lg hover:bg-green-600">
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
