import React, {useRef, useEffect} from "react";
import useVideoManagerStore from "./hooks/VideoManagerStore.js";
import usePlaylistStore from "./hooks/PlaylistStore.js";

function handleVideoSubmit(addVideoFormRef, videoSubmitRef, updateVideosData) {
       try {
              const addVideoFormElem = addVideoFormRef.current;
              const videoSubmitElem = videoSubmitRef.current;

              addVideoFormElem.addEventListener("submit", async (event) => {
                     event.preventDefault();
                     videoSubmitElem.disabled = true;
                                   
                     const formData = new FormData(addVideoFormElem);
                     const videoId = formData.get("videoId");

                     if (!videoId) {
                            videoSubmitElem.disabled = false;
                            return;
                     }
                     
                     const response = await fetch("/addVideo", {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({videoId: videoId})
                     });

                     const data = await response.text();
                     console.log(data);

                     updateVideosData();
                     addVideoFormElem.reset();
                     videoSubmitElem.disabled = false;
              });
       }
       catch (err) {
              console.error(err);
       }
}

const AddForm = () => {
       const addPlaylistFormRef = useRef(null);
       const playlistSubmitRef = useRef(null);

       const addVideoFormRef = useRef(null);
       const videoSubmitRef = useRef(null);

       const updateVideosData = useVideoManagerStore((state) => state.updateVideosData);
       const addPlaylist = usePlaylistStore(state => state.addPlaylist);
       const playlistIds = usePlaylistStore(state => state.playlistIds);

       useEffect(() => {
              handleVideoSubmit(addVideoFormRef, videoSubmitRef, updateVideosData);

              //Playlist
              const addPlaylistFormElem = addPlaylistFormRef.current;
              const playlistSubmitElem = playlistSubmitRef.current;

              addPlaylistFormElem.addEventListener("submit", async (event) => {
                     event.preventDefault();
                     playlistSubmitElem.disabled = true;
                                   
                     const formData = new FormData(addPlaylistFormElem);
                     const playlistName = formData.get("playlistName");

                     if (!playlistName) {
                            playlistSubmitElem.disabled = false;
                            return;
                     }

                     addPlaylist(playlistName);
                     
                     addPlaylistFormElem.reset();
                     playlistSubmitElem.disabled = false;
              });
       }, []);

       return (
              <>
                     <form ref={addPlaylistFormRef}>
                            <input type="text" placeholder="Playlist Name..." name="playlistName" />
                            <button ref={playlistSubmitRef} type="submit">Add</button>
                     </form>
                     <form ref={addVideoFormRef} className="addForm">
                            <input type="text" placeholder="Video ID..." name="videoId" />
                            <button ref={videoSubmitRef} type="submit" className="submitButton">Add</button>
                     </form>
              </>
       );
};

export default AddForm;