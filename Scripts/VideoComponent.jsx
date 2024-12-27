import React, { useEffect } from "react";
import useVideoManagerStore from "./hooks/VideoManagerStore.js";

const VideoComponent = ({defaultVideoId}) => {
       const title = useVideoManagerStore((state) => state.title);
       const playerHtml = useVideoManagerStore((state) => state.playerHtml);
       const displayVideo = useVideoManagerStore((state) => state.displayVideo);
       
       return (
              <section className="video">
                     <div className="player" dangerouslySetInnerHTML={{__html: playerHtml}}></div>
                     <div className="title">{title}</div>
                     <div className="channelName"></div>
              </section>
       );
};

export default VideoComponent;