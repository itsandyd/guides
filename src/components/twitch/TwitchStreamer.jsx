import React from "react";

const TwitchStream = ({ channel }) => {
  const src = `https://player.twitch.tv/?channel=${encodeURIComponent(
    channel
  )}&parent=www.guidesforgamers.com`;

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
      }}
    >
      <iframe
        src={src}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; fullscreen"
      ></iframe>
    </div>
  );
};

export default TwitchStream;
