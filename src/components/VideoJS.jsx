import { useEffect, useRef } from "react";
import videojs from "video.js";

const VideoJS = ({ options }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    let player;
    if (videoElement) {
      player = videojs(videoElement, options, () => {
        console.log("player is ready");
      });
    }

    videoElement.onplay = () => {
      console.log("playing");
    };

    videoElement.onpause = () => {
      console.log("paused");
    };

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
