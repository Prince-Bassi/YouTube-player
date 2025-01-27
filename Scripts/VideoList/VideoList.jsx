import React, {useEffect, useState, useRef} from "react";
import useVideoManagerStore from "../hooks/VideoManagerStore.js";
import usePlaylistStore from "../hooks/PlaylistStore.js";
import * as style from "./VideoList.module.scss";

export const Video = ({id, title, imageURL, clickFunc}) => {
       return (
              <div
                     className={style.video}
                     onClick={() => clickFunc(id)}>
                     <img className={style.image} src={imageURL} alt={title} title={title} />
                     <div>{title}</div>
              </div>
       );
};
 
export const VideoList = ({_className, currentPlaylist, videosData, options}) => {
       const deleteVideo = useVideoManagerStore(state => state.deleteVideo);
       const displayVideo = useVideoManagerStore(state => state.displayVideo);
       const currentVideoId = useVideoManagerStore(state => state.currentVideoId);
       const player = useVideoManagerStore(state => state.player);

       const playlistData = usePlaylistStore(state => state.playlistData);
       const deleteFromPlaylist = usePlaylistStore(state => state.deleteFromPlaylist);
       const updatePlaylistData = usePlaylistStore(state => state.updatePlaylistData);
       const setLoopMode = usePlaylistStore(state => state.setLoopMode);

       const [videos, setVideos] = useState([]);
       const currentVideoIdRef = useRef(currentVideoId);

       useEffect(() => {
              if (currentPlaylist?.videos) setVideos(currentPlaylist.videos.map(id => +id));
       }, [videosData, currentPlaylist, playlistData]);

       useEffect(() => { //Default video is first one
              if (videos && videos.length && options.defaultPlay) {
                     let id = sessionStorage.getItem("videoId");
                     displayVideo(id || videos[0]);
                     setLoopMode(null);
                     sessionStorage.removeItem("videoId");
              }
       }, [videos]);

       const _deleteVideo = async (id) => { //updating the playlist data as well
              await deleteVideo(id);
              updatePlaylistData();
       };

       const setSessionVideoId = (event) => {
              sessionStorage.setItem("videoId", currentVideoId);
       };

       useEffect(() => {
              window.addEventListener("beforeunload", setSessionVideoId);
              return () => {
                     window.removeEventListener("beforeunload", setSessionVideoId);
              };
       }, []);

       const checkNextVid = (event) => {
              const loopMode = usePlaylistStore.getState().loopProps[0];
              if (event.data === window.YT.PlayerState.ENDED && loopMode !== "video") {
                     if (videos.at(-1) === currentVideoIdRef.current && loopMode === "playlist") {
                            displayVideo(videos[0]);
                     }
                     else if (videos.at(-1) !== currentVideoIdRef.current) {
                            const nextIndex = videos.indexOf(currentVideoIdRef.current) + 1;
                            displayVideo(videos[nextIndex]);
                     }
              }               
       };

       useEffect(() => {
              currentVideoIdRef.current = currentVideoId;
       }, [currentVideoId]);

       useEffect(() => {
              if (player) player.addEventListener("onStateChange", checkNextVid);
              return () => {
                     if (player) player.removeEventListener("onStateChange", checkNextVid);
              };
       }, [player]);

       return (
              <div className={_className || style.videoList}>
                     {videos && videos.map(id => (
                            <div
                                   className={`${style.videoCont} ${currentVideoId == id && options.showCurr ? style.curr : ""}`}
                                   key={id}>
                                   <Video id={id}
                                          title={videosData[id] && videosData[id].title}
                                          imageURL={videosData[id] && videosData[id].thumbnails.medium}
                                          clickFunc={(id) => {
                                                 displayVideo(id);
                                                 setLoopMode(null);
                                                 if (options.setShowList) options.setShowList(false);
                                          }}
                                   />
                                   {options.includeDeleteButtons && 
                                          <button className={style.delete}
                                                 onClick={() => {
                                                        if (currentPlaylist.playlistId === -1) _deleteVideo(id);
                                                        else deleteFromPlaylist(currentPlaylist.playlistId, [id]);
                                                 }}>
                                                 <i className="fa fa-trash"></i>
                                          </button>
                                   }
                            </div>
                     ))}
              </div>
       );
};