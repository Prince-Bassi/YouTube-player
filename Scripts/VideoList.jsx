import React, { useEffect } from "react";
import useVideoManagerStore from "./hooks/VideoManagerStore.js";

const VideoList = () => {
       const deleteVideo = useVideoManagerStore((state) => state.deleteVideo);
       const displayVideo = useVideoManagerStore((state) => state.displayVideo);
       const videosData = useVideoManagerStore((state) => state.videosData);

       return (
              <aside>
                     <div className="extraVidHeader">
                            <span>More Videos</span>
                            {/* <!-- Add a different symbol --> */}
                            <a href="#" ><i className="fa fa-plus"></i></a>
                     </div>
                     <div className="extraVidBody">
                            {Object.keys(videosData).map(id => (
                                   <div key={id}>
                                          <div onClick={() => displayVideo(id)}>
                                                 {/*Image*/}
                                                 {videosData[id].title} 
                                          </div>
                                          <button onClick={() => deleteVideo(id)}>Delete</button>
                                   </div>                                   
                            ))}
                     </div>
              </aside>
       );
};

export default VideoList;