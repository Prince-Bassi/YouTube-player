import React from "react";
import VideoComponent from "./VideoComponent.jsx";
import AddForm from "./AddForm.jsx";
import PlaylistComponent from "./PlaylistComponent.jsx";

const Home = () => {
       return (
              <>
                     <header>
                            <h2>Cheap YouTube</h2>
                            <AddForm />
                     </header>
                     <VideoComponent />
                     <PlaylistComponent />
              </>
       );
};

export default Home;