import React, {useRef, useEffect, useState} from "react";
import useVideoManagerStore from "../hooks/VideoManagerStore.js";
import usePlaylistStore from "../hooks/PlaylistStore.js";
import PopUp from "../PopUp/PopUp.jsx";
import * as style from "./AddForm.module.scss";

const AddForm = ({showForm, setShowForm}) => {
       const formRef = useRef(null);
       const submitRef = useRef(null);

       const updateVideosData = useVideoManagerStore((state) => state.updateVideosData);
       const addPlaylist = usePlaylistStore(state => state.addPlaylist);

       const handleSubmit = async (event) => {
              try {
                     event.preventDefault();
                     const dataToFetch = showForm === "playlist" ? "playlistName" : "videoId";

                     submitRef.current.disabled = true;

                     const formData = new FormData(formRef.current);
                     const data = formData.get(dataToFetch);

                     if (!data) {
                            submitRef.current.disabled = false;
                            return;
                     }

                     if (showForm === "playlist") {
                            await addPlaylist(data);
                            setShowForm(null);
                     }
                     else if (showForm === "video") {
                            await handleVideoSubmit(data);
                            setShowForm(null);
                     }

                     formRef.current.reset();
                     submitRef.current.disabled = false;
              }
              catch (err) {
                     console.error(err);
                     submitRef.current.disabled = false;
              }
       };

       const handleVideoSubmit = (videoId) => {
              return new Promise(async (resolve, reject) => {
                     try {
                            const response = await fetch("/addVideo", {
                                   method: "POST",
                                   headers: {"Content-Type": "application/json"},
                                   body: JSON.stringify({videoId: videoId})
                            });
                            const data = await response.text();
                            console.log(data);
                            updateVideosData();
                            resolve();
                     }
                     catch (err) {
                            reject();
                            console.error(err);
                     }
              });
       };

       const handleOutsideClick = (event) => {
              if (formRef.current && !formRef.current.contains(event.target)) setShowForm(null);
       };

       useEffect(() => {
              window.addEventListener("click", handleOutsideClick);

              return () => {
                     window.removeEventListener("click", handleOutsideClick);
              };
       }, []);

       return (
              <PopUp Tag="form" title={`Add ${showForm}`} onClose={() => setShowForm(null)}
                     confirmInfo={{confirmText: "Add", onConfirm: handleSubmit, buttonRef: submitRef}}
                     ref={formRef}
              >
                     {showForm === "playlist" ?
                            <input type="text" placeholder="Playlist Name..." name="playlistName" /> :
                            <input type="text" placeholder="Video ID..." name="videoId" />
                     }
              </PopUp>
       );
};

export default AddForm;