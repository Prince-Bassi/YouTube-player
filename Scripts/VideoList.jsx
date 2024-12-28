import React, { useEffect,useState } from "react";
import useVideoManagerStore from "./hooks/VideoManagerStore.js";
import usePlaylistStore from "./hooks/PlaylistStore.js";

export const Video = ({id, title, clickFunc}) => {
       return (
              <div onClick={() => clickFunc(id)}>
                     {/*Image*/}
                     {title} 
              </div>
       );
};
 
export const VideoList = ({currentPlaylist, videosData, options}) => {
       const deleteVideo = useVideoManagerStore(state => state.deleteVideo);
       const displayVideo = useVideoManagerStore(state => state.displayVideo);
       const playlistData = usePlaylistStore(state => state.playlistData);
       const [videos, setVideos] = useState([]);
       const deleteFromPlaylist = usePlaylistStore(state => state.deleteFromPlaylist);

       useEffect(() => { //Default video is first one
              if (videos && videos.length && options.defaultPlay) displayVideo(videos[0]);
       }, [videos]);

       useEffect(() => {
              if (currentPlaylist) setVideos(currentPlaylist.videos);
       }, [videosData, currentPlaylist, playlistData]);

       return (
              <>
                     <div className="extraVidBody">
                            {videos && videos.map(id => (
                                   <div key={id}>
                                          <Video id={id} title={videosData[id] && videosData[id].title} clickFunc={(id) => {
                                                 displayVideo(id);
                                                 if (options.setShowList) options.setShowList(false);
                                          }} />
                                          {options.includeDeleteButtons && (currentPlaylist.playlistId === -1 && 
                                                 <button onClick={() => deleteVideo(id)}>Delete</button> ||
                                                 <button onClick={() => deleteFromPlaylist(currentPlaylist.playlistId, [id])}>Delete</button>
                                          )}
                                   </div>
                            ))}
                     </div>
              </>
       );
};