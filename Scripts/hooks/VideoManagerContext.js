import React, {createContext, useContext, useState, useCalback} from "react";

const VideoManagerContext = createContext();

export const VideoManager = ({children}) => {
       const [title, setTitle] = useState("");
       const [playerHtml, setPlayerHtml] = useState("");
       const [videosData, setVideosData] = useState({});

       const updateVideosData = () => {
              fetch("/getAllVideos", {
                     method: "GET"
              })
              .then(response => response.json())
              .then(data => {
                     const updatedVideosData = {...videosData};
                     for (const videoData of data) {
                            updatedVideosData[videoData.id] = videoData;
                     }
                     setVideosData(updatedVideosData);
              })
              .catch(err => console.error(err));
       };

       const displayVideo = (id) => {
              fetch("/getVideo", {
                     method: "POST",
                     headers: {
                            "Content-Type": "application/json"
                     },
                     body: JSON.stringify({id: id})
              })
              .then(response => response.json())
              .then(data => {
                     data = data[0];

                     if (data) {
                            setTitle(data.title);
                            setPlayerHtml(data.html);
                     }
                     else {
                            setTitle(""); //Default state of the player (Yet to be made)
                            setPlayerHtml("");
                     }
              });
       };

       const deleteVideo = (id) => {
              fetch("/deleteVideo", {
                     method: "DELETE",
                     headers: {
                            "Content-Type": "application/json"
                     },
                     body: JSON.stringify({id: id})
              })
              .then(response => response.text())
              .then(data => {
                     console.log(data);
                     if (data === `Deleted Video ${id}`) {
                            const updatedVideosData = videosData;
                            delete updatedVideosData[`${id}`];
                            setVideosData(updateVideosData);
                     }
              })
              .catch(err => console.error(err));
       };

       return (
              <VideoManagerContext.Provider value={{title, playerHtml, videosData, updateVideosData, displayVideo, deleteVideo}}>
                     {children}
              </VideoManagerContext.Provider>
       );
};

export const useVideoManager = () => {
       return useContext(VideoManagerContext);
};