import { useEffect, useRef } from "react";
import videojs from "video.js";
// import "video.js/dist/video-js.css";
// import "@videojs/themes/dist/forest/index.css";

const VideoJS = ({ options }) => {
  const videoRef = useRef(null);

  const VideoHtml = () => (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-theme-forest vjs-big-play-centered"
      />
    </div>
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    let player;
    if (videoElement) {
      player = videojs(videoElement, options, () => {
        console.log("player is ready");
      });
    }
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [options]);

  return <VideoHtml />;
};
export default VideoJS;
