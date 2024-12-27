import {create} from "zustand";

const useVideoManagerStore = create((set) => ({
       title: "",
       playerHtml: "",
       videosData: {},

       updateVideosData: async () => {
              try {
                     const response = await fetch("/getAllVideos", {method: "GET"});
                     const data = await response.json();
                     
                     set((state) => {
                            const updatedVideosData = {...state.videosData};
                            for (const videoData of data) {
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
              if (!id) {
                     console.log("Invalid videoId for displaying");
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
                            set({title: "default", playerHtml: "default"}); //Default player (Not made yet)
                            return;
                     }
                     set({title: videoData.title, playerHtml: videoData.html});
              }
              catch (err) {
                     console.error(err);
              }
       },

       deleteVideo: async (id) => {
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
                     }
              }
              catch (err) {
                     console.error(err);
              }
       }
}));

export default useVideoManagerStore;