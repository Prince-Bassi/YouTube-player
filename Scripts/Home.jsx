import React from "react";
import VideoComponent from "./VideoComponent.jsx";
import AddForm from "./AddForm.jsx";
import PlaylistComponent from "./PlaylistComponent.jsx";
import SearchComponent from "./SearchComponent.jsx";

const Home = () => {
       return (
              <>
                     <header>
                            <h2>Cheap YouTube</h2>
                            <AddForm />
                            <SearchComponent />
                     </header>
                     <VideoComponent />
                     <PlaylistComponent />
              </>
       );
};

export default Home;