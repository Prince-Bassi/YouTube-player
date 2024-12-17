import React, {useRef, useEffect} from "react";
import useVideoManagerStore from "./hooks/VideoManagerStore.js";

const AddForm = () => {
       const addFormRef = useRef(null);
       const submitButtonRef = useRef(null);
       const updateVideosData = useVideoManagerStore((state) => state.updateVideosData);

       useEffect(() => {
              const addFormElem = addFormRef.current;
              const submitButtonElem = submitButtonRef.current;

              addFormElem.addEventListener("submit", (event) => {
                     event.preventDefault();
                     submitButtonElem.disabled = true;
                     
                     const formData = new FormData(addFormElem);
                     const videoId = formData.get("videoId");

                     if (!videoId) {
                            submitButtonElem.disabled = false;
                            return;
                     }
                     
                     fetch("/addVideo", {
                            method: "POST",
                            headers: {
                                   "Content-Type": "application/json"
                            },
                            body: JSON.stringify({videoId: videoId})
                     })
                     .then(response => response.text())
                     .then(data => {
                            console.log(data);
                            updateVideosData();
                            addFormElem.reset();
                            submitButtonElem.disabled = false;
                     })
                     .catch(err => console.error(err));
              });
       }, []);

       return (
              <form ref={addFormRef} className="addForm">
                     <input type="text" placeholder="Video ID..." name="videoId" />
                     <button ref={submitButtonRef} type="submit" className="submitButton">Add</button>
              </form>
       );
};

export default AddForm;