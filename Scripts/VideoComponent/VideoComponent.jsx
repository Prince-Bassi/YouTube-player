import React, { useEffect } from "react";
import useVideoManagerStore from "../hooks/VideoManagerStore.js";
import * as style from "./VideoComponent.module.scss";

const VideoComponent = ({defaultVideoId}) => {
       const playerHtml = useVideoManagerStore((state) => state.playerHtml);
       const displayVideo = useVideoManagerStore((state) => state.displayVideo);
       
       return (
              <section>
                     {playerHtml && 
                            <iframe
                                   className={style.player}
                                   src={playerHtml}
                                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                   allowFullScreen>       
                            </iframe>
                     }
              </section>
       );
};

export default VideoComponent;