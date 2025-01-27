import {create} from "zustand";

const useVideoManagerStore = create((set) => ({
       title: "",
       currentVideo: "",
       videosData: {},
       currentVideoId: -1,
       player: null,

       updatePlayer: (playerElem, onPlayerReady, onPlayerStateChange) => {
              const loadScript = () => {
                     const script = document.createElement("script");
                     script.src = "https://www.youtube.com/iframe_api";
                     script.async = true;
                     document.body.appendChild(script);
              };

              loadScript();

              window.onYouTubeIframeAPIReady = () => {
                     const newPlayer = new window.YT.Player(playerElem, {
                            height: "500",
                            width: "500",
                            events: {
                                   onReady: onPlayerReady,
                                   onStateChange: onPlayerStateChange
                            }
                     });
                     set({player: newPlayer});
              };
       },

       updateVideosData: async () => {
              try {
                     const response = await fetch("/getAllVideos", {method: "GET"});
                     const data = await response.json();
                     
                     set((state) => {
                            const updatedVideosData = {...state.videosData};
                            for (let videoData of data) {
                                   videoData.thumbnails = JSON.parse(videoData.thumbnails);
                                   updatedVideosData[videoData.id] = videoData;
                            }

                            console.log("In updateVideosData", updatedVideosData);
                            return ({videosData: updatedVideosData});
                     });
              }
              catch (err) {
                     console.error(err);
              }
       },

       displayVideo: async (id) => {
              if (!id || id == -1) {
                     console.log("Invalid videoId for displaying. Id:", id);
                     return;
              }
              
              if (typeof id === "string") id = +id;

              try {
                     const response = await fetch("/getVideo", {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({id: id})
                     });
                     const data = await response.json();
                     const videoData = data[0];
       
                     if (!Object.keys(videoData).length) {
                            set({title: "default", currentVideo: "default"}); //Default player (Not made yet)
                            return;
                     }
                     set({title: videoData.title, currentVideo: videoData.videoId, currentVideoId: id});
              }
              catch (err) {
                     console.error(err);
              }
       },

       deleteVideo: (id) => {
              return new Promise(async (resolve, reject) => {
                     if (!confirm("Delete video?")) return;
                     if (typeof id === "string") id = +id;

                     try {
                            const response = await fetch("/deleteVideo", {
                                   method: "DELETE",
                                   headers: {"Content-Type": "application/json"},
                                   body: JSON.stringify({id: id})
                            });
                            const data = await response.text();
                            console.log(data);
              
                            if (data === `Deleted Video ${id}`) {
                                   set((state) => {
                                          const updatedVideosData = structuredClone(state.videosData); //Make a deep copy because this is always annoying
                                          delete updatedVideosData[`${id}`];
              
                                          return ({videosData: updatedVideosData});
                                   });
                                   resolve();
                            }
                     }
                     catch (err) {
                            reject();
                            console.error(err);
                     }
              });
       }
}));

export default useVideoManagerStore;