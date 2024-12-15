import React, {useEffect, useLayoutEffect, useRef, useState} from "react";

const VideoComponent = () => {
       const videoContainerRef = useRef(null);
       const videoPlayerRef = useRef(null);
       const titleElemRef = useRef(null);
       const [title, setTitle] = useState("");
       const [playerHtml, setPlayerHtml] = useState("");
       const [videosData, setVideosData] = useState({});

       // FUNCTIONS

       const getAllVideos = () => {
              fetch("/getAllVideos", {
                     method: "GET"
              })
              .then(response => response.json())
              .then(data => {
                     for (const videoData of data) {
                            videosData[videoData.id] = videoData;
                     }
                     console.log(videosData, "d");
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

                     setTitle(data.title);
                     setPlayerHtml(data.html);
              });
       };

       useEffect(() => {
              getAllVideos();
              displayVideo(2);
       }, []);
       

       return (
              <section ref={videoContainerRef} className="video">
                     <div ref={videoPlayerRef} className="player" dangerouslySetInnerHTML={{__html: playerHtml}}></div>
                     <div ref={titleElemRef} className="title">{title}</div>
                     <div className="channelName"></div>
              </section>
       );
}

export default VideoComponent;