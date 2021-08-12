import VideoJS from "../components/VideoJS";
import { useState } from "react";

export default function Video() {
  const [loaded, setLoaded] = useState(false);
  const [percent, setPercent] = useState(0);
  const [src, setSrc] = useState("");

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];

    let reader = new FileReader();
    reader.onprogress = function (e) {
      setPercent(Math.round((e.loaded * 100) / e.total));
    };

    reader.onload = function (e) {
      let buffer = e.target.result;
      let videoBlob = new Blob([new Uint8Array(buffer)], { type: "video/mp4" });
      setSrc(URL.createObjectURL(videoBlob));

      setLoaded(true);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      {loaded ? (
        <VideoJS
          options={{
            ...videoJsOptions,
            sources: [
              {
                src: src,
                type: "video/mp4",
              },
            ],
          }}
        />
      ) : (
        <div
          className="flex flex-col items-center justify-center"
          style={{ height: "100vh", width: "100%" }}
        >
          <input
            type="file"
            className="py-3 px-6 mt-5 text-white rounded-lg bg-green-500 shadow-lg block md:inline-block"
            onChange={handleVideoUpload}
          />
          {percent ? "Loading: " + percent + "%" : ""}
        </div>
      )}
    </>
  );
}
