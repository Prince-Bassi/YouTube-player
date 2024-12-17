import React, { useEffect } from "react";
import { useVideoManager } from "./hooks/VideoManagerContext.js";

const VideoComponent = () => {
       const { title, playerHtml, updateVideosData, displayVideo, videosData, deleteVideo } = useVideoManager();

       console.log(videosData);
       useEffect(() => {
              updateVideosData();
              displayVideo(5);
       }, []);
       
       return (
              <section className="video">
                     <div className="player" dangerouslySetInnerHTML={{__html: playerHtml}}></div>
                     <div className="title">{title}</div>
                     <div className="channelName"></div>
              </section>
       );
}

export default VideoComponent;