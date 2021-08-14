// dependencies
import { useEffect, useState, useContext } from "react";
// contexts
import { SocketContext, UserContext } from "../states/contexts";
// components
import { popAlert } from "../components/alerts/Alert";
import logo from "../assets/logo.png";

function Sidebar({ name }) {
  // contexts
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  // states
  const [audience, setAudience] = useState([]);
  const [collapse, setCollapse] = useState(true);

  const handleWelcomeFriends = ({ name, currentUsers }) => {
    if (name !== user)
      popAlert.display({
        type: "success",
        title: name,
        content: "joined 🎉",
      });
    setAudience(currentUsers);
  };

  const handleByeFriend = ({ name, currentUsers }) => {
    if (name !== user)
      popAlert.display({
        type: "danger",
        title: name,
        content: "left 👋",
      });
    setAudience(currentUsers);
  };

  useEffect(() => {
    if (socket) {
      socket.on("welcomeFriends", handleWelcomeFriends);
      socket.on("byeFriend", handleByeFriend);
    }
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    const sidebar = document.getElementsByClassName("sliding-sidebar")[0];

    const checkclick = (e) => {
      if (!collapse && !sidebar.contains(e.target)) {
        setCollapse(true);
      }
    };
    document.addEventListener("click", checkclick);

    return () => document.removeEventListener("click", checkclick);
  }, [collapse]);

  const mouseEnterHandler = () => {
    setTimeout(() => {
      setCollapse(false);
    }, 300);
  };

  const mouseLeaveHandler = () => {
    setCollapse(true);
  };

  return (
    <>
      {/* actual sidebar */}
      <div
        className="sidebar w-16 h-screen bg-gray-900 fixed top-0 right-0 overflow-auto"
        onMouseEnter={() => mouseEnterHandler()}
      >
        <div className="flex items-center justify-center mt-10">
          <img
            src={logo}
            alt="Logo"
            style={{ height: "30px", width: "30px" }}
          />
        </div>

        <nav className="mt-10">
          {audience.map((user, i) => (
            <button
              key={"user" + i}
              className={
                "flex items-center justify-center " +
                (i !== 0 ? "mt-5 " : "") +
                "py-3 w-full focus:outline-none text-gray-400 hover:bg-gray-700"
              }
            >
              <div
                className="flex justify-center items-center"
                style={{ width: 20, height: 17 }}
              >
                <i className={user.icon}></i>
              </div>
            </button>
          ))}
          <div className="py-8"></div>
        </nav>
      </div>

      {/* sliding sidebar */}
      <div
        className={
          "sidebar sliding-sidebar w-64 bg-gray-900 fixed top-0 bottom-0 -right-64 overflow-auto z-20 transition duration-500 transform " +
          (collapse ? "" : "-translate-x-64")
        }
        onMouseLeave={() => mouseLeaveHandler()}
      >
        <div className="flex items-center justify-center mt-10">
          <div className="text-gray-100 text-2xl mb-2 ml-2 px-4 flex items-baseline">
            <div className="mr-2 flex items-center justify-center">
              <h1>{name}</h1>
              <img
                src={logo}
                alt="Logo"
                style={{ height: "30px", width: "30px" }}
              />
            </div>
          </div>
        </div>
        <div
          style={{ width: "100%" }}
          className="h-6 w-2/2 mt-10 mb-4 shadow-2xl"
        >
          <h3 className="text-center text-gray-400 text-lg">Audience</h3>
        </div>
        <hr className="border-gray-100 opacity-20" />
        <nav className="mt-10">
          {audience.map((user, i) => (
            <button
              key={"usersliding" + i}
              className={
                "flex items-center " +
                (i !== 0 ? "mt-5 " : "") +
                "py-2 px-8 w-full focus:outline-none text-gray-400 sm:hover:bg-gray-700 sm:hover:text-gray-100"
              }
            >
              <div
                className="flex justify-center items-center"
                style={{ width: 18, height: 17 }}
              >
                <i className={user.icon}></i>
              </div>
              <span className="mx-4 font-medium block">{user.name}</span>
            </button>
          ))}
          <div className="py-8"></div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
