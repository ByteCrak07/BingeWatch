import { useContext, useEffect, useRef } from "react";
import videojs from "video.js";
import "videojs-event-tracking";
// context
import { SocketContext, UserContext } from "../states/contexts";
// alert
import { popAlert } from "./alerts/Alert";

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
      player = videojs(
        videoElement,
        { ...options, plugins: { eventTracking: true } },
        () => {
          console.log("player is ready");
        }
      );
    }

    // play btn
    const playBtn = document.querySelector(
      ".vjs-play-control.vjs-control.vjs-button"
    );

    // play state
    let playing = false;

    // handlers
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

    // play/pause
    const playPauseEmit = () => {
      if (playing) {
        pauseHandler();
        playing = false;
      } else {
        playHandler();
        playing = true;
      }
    };

    const checkPlayKey = (e) => {
      if (e.key === " ") {
        playPauseEmit();
      }
    };
    document.addEventListener("keydown", checkPlayKey);

    if (videoElement)
      videoElement.onclick = () => {
        console.log("klik");
        playPauseEmit();
      };

    if (playBtn)
      playBtn.onclick = () => {
        playPauseEmit();
      };

    //  player.on("tracking:firstplay", (e, data) => console.log(e, data));

    // required video listeners
    videoElement.onended = () => {
      playing = false;
    };

    const onSeekedHandler = (e) => {
      seekHandler();
    };
    videoElement.addEventListener("seeked", onSeekedHandler);

    // socket listeners
    socket.on("client-play", (name) => {
      console.log("play", name);
      playing = true;

      player.play();

      popAlert.display({
        type: "success",
        title: name,
        content: `${
          videoElement.currentTime === 0
            ? "Started the show"
            : "Resumed the show"
        }`,
      });
    });

    socket.on("client-pause", (name) => {
      console.log("pause", name);
      playing = false;

      player.pause();

      popAlert.display({
        type: "success",
        title: name,
        content: `Paused the show`,
      });
    });

    socket.on("client-seek", (name, time) => {
      console.log("seek", name);

      videoElement.removeEventListener("seeked", onSeekedHandler);
      setTimeout(() => {
        if (name !== user) videoElement.currentTime = time;
        setTimeout(() => {
          videoElement.addEventListener("seeked", onSeekedHandler);
        }, 1000);
      }, 0);
    });

    // keyboard controls
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
