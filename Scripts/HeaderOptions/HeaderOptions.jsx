import React, {useState, useEffect} from "react";
import * as style from "./HeaderOptions.module.scss";

const HeaderOptions = ({setShowForm}) => {
	const [showMenu, setShowMenu] = useState(false);

	const handleOutsideClick = (event) => {
		if (!event.target.closest(style.options)) setShowMenu(false);
	};

	useEffect(() => {
		document.addEventListener("click", handleOutsideClick);

		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	return (
		<div className={`${style.options} ${showMenu ? style.active : ""}`} onClick={(event) => {event.stopPropagation();setShowMenu(!showMenu)}}>
                 	<i className="fa fa-ellipsis-v"></i>
                 	{showMenu && <div className={`${style.optionsMenu} fadeIn`}>
                  	<button onClick={() => {setShowForm("video");setShowMenu(false)}}>Add Video</button>
                  	<button onClick={() => {setShowForm("playlist");setShowMenu(false)}}>Add Playlist</button>
                 	</div>}
          	</div>
	);
};

export default HeaderOptions;