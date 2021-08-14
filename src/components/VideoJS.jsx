import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoJS = ({ options }) => {
  const videoRef = useRef(null);

  const VideoHtml = () => (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
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
      // options.sources.map((source) => {
      //   URL.revokeObjectURL(source.src);
      //   return null;
      // });
    };
  }, [options]);

  return <VideoHtml />;
};
export default VideoJS;
