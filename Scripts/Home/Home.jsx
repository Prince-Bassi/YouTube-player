import React, {useState} from "react";
import _VideoComponent from "../VideoComponent/VideoComponent.jsx";
import _AddForm from "../AddForm/AddForm.jsx";
import _PlaylistComponent from "../PlaylistComponent/PlaylistComponent.jsx";
import _SearchComponent from "../SearchComponent/SearchComponent.jsx";
import HeaderOptions from "../HeaderOptions/HeaderOptions.jsx";
import * as style from "./Home.module.scss";

const AddForm = React.memo(_AddForm);
const VideoComponent = React.memo(_VideoComponent);
const PlaylistComponent = React.memo(_PlaylistComponent);
const SearchComponent = React.memo(_SearchComponent);

const Home = () => {
       const [showForm, setShowForm] = useState(null);
       return (
              <>
                     {showForm && <AddForm showForm={showForm} setShowForm={setShowForm} />}
                     <header className={style.homeHeader}>
                            <div className={style.headingCont}>
                                   <img className={style.logo} src="/Assets/logo.png" alt="Logo" />
                                   <h2>Cheap YouTube</h2>
                            </div>
                            <SearchComponent />
                            <HeaderOptions setShowForm={setShowForm} />
                     </header>
                     <div className={style.body}>
                            <VideoComponent />
                            <PlaylistComponent />
                     </div>
              </>
       );
};

export default Home;