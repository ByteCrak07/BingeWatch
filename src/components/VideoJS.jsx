import { useContext, useEffect, useRef } from "react";
import videojs from "video.js";
// context
import { SocketContext, UserContext } from "../states/contexts";

const VideoJS = ({ options, roomId }) => {
  // contexts
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  // refs
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    let player;
    if (videoElement) {
      player = videojs(videoElement, options, () => {
        console.log("player is ready");
      });
    }

    const playHandler = () => {
      console.log("playing");

      socket.emit("video-play", { RoomId: roomId });
    };

    const pauseHandler = () => {
      console.log("paused");

      socket.emit("video-pause", { RoomId: roomId });
    };

    const seekHandler = () => {
      console.log("seeked");

      socket.emit("video-seek", {
        RoomId: roomId,
        time: videoElement.currentTime,
      });
    };

    videoElement.addEventListener("play", playHandler);
    videoElement.addEventListener("pause", pauseHandler);
    videoElement.addEventListener("seeked", seekHandler);

    // check socket event for video playback
    socket.on("client-play", (name) => {
      console.log("play", name);

      player.play();
    });

    socket.on("client-pause", (name) => {
      console.log("pause", name);
      player.pause();
    });

    socket.on("client-seek", (name, time) => {
      console.log("seek", name);
      videoElement.removeEventListener("play", playHandler);
      videoElement.removeEventListener("pause", pauseHandler);
      videoElement.removeEventListener("seeked", seekHandler);
      setTimeout(() => {
        if (name !== user) videoElement.currentTime = time;
        setTimeout(() => {
          videoElement.addEventListener("play", playHandler);
          videoElement.addEventListener("pause", pauseHandler);
          videoElement.addEventListener("seeked", seekHandler);
        }, 200);
      }, 100);
    });

    const checkKey = (e) => {
      if (e.key === " ") {
        if (videoElement.paused) videoElement.play();
        else videoElement.pause();
      }
      if (e.key === "ArrowLeft") {
        videoElement.currentTime = videoElement.currentTime - 5;
      }
      if (e.key === "ArrowRight") {
        videoElement.currentTime = videoElement.currentTime + 5;
      }
      if (e.key === "ArrowUp") {
        if (parseInt(videoElement.volume * 10) < 10)
          videoElement.volume = videoElement.volume + 0.1;
      }
      if (e.key === "ArrowDown") {
        if (parseInt(videoElement.volume * 10) > 1) {
          videoElement.volume = videoElement.volume - 0.1;
        } else {
          videoElement.volume = 0;
        }
      }
      if (e.key === "f") {
        const fullScreenBtn = document.getElementsByClassName(
          "vjs-fullscreen-control"
        )[0];
        fullScreenBtn.click();
      }
    };
    document.addEventListener("keydown", checkKey);

    return () => {
      if (player) {
        player.dispose();
      }
      document.removeEventListener("keydown", checkKey);
    };
    // eslint-disable-next-line
  }, [options]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-theme-forest vjs-big-play-centered"
      />
    </div>
  );
};
export default VideoJS;
