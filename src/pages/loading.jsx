import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { UserContext, RoomContext } from "../states/contexts";

export default function Loading({ match }) {
  // contexts
  const { user } = useContext(UserContext);
  const { setRoomData } = useContext(RoomContext);
  // history
  const history = useHistory();

  useEffect(() => {
    setRoomData({ id: match.params.id, inRoom: false });
    if (!user) history.push("/");
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center bg-darkBg text-white"
      style={{ height: "100vh", width: "100%" }}
    >
      Loading...
    </div>
  );
}
