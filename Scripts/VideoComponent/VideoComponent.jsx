import React, {useEffect, useRef, useState, useCallback} from "react";
import useVideoManagerStore from "../hooks/VideoManagerStore.js";
import usePlaylistStore from "../hooks/PlaylistStore.js";
import * as style from "./VideoComponent.module.scss";

const VideoComponent = () => {
       const currentVideo = useVideoManagerStore(state => state.currentVideo);
       const displayVideo = useVideoManagerStore(state => state.displayVideo);
       const updatePlayer = useVideoManagerStore(state => state.updatePlayer);
       const player = useVideoManagerStore(state => state.player);

       const playerRef = useRef(null);
       const [playerReady, setPlayerReady] = useState(null);

       useEffect(() => {
              updatePlayer(playerRef.current, onPlayerReady, onPlayerStateChange);
       }, []);

       useEffect(() => {
              if (currentVideo && playerReady) player.loadVideoById(currentVideo);
       }, [currentVideo, playerReady]);

       const checkLoop = (event) => {
              const loopMode = usePlaylistStore.getState().loopProps[0];

              if (loopMode === "video") event.target.playVideo();
              // else displayVideo(nextVideoId);
       };

       const onPlayerReady = (event) => {
              setPlayerReady(true);
       };

       const onPlayerStateChange = (event) => {
              switch (event.data) {
                     case window.YT.PlayerState.PAUSE:
                            console.log("PAUSE");
                            break;
                     case window.YT.PlayerState.PLAYING:
                            console.log("PLAYING");
                            break;
                     case window.YT.PlayerState.ENDED:
                            checkLoop(event);
                            break;
              }
       };

       return (
              <section>
                     <div ref={playerRef} className={style.player}></div>
              </section>
       );
};

export default VideoComponent;