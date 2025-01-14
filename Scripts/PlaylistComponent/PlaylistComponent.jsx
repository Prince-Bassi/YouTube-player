import React, {useEffect, useState} from "react";
import useVideoManagerStore from "../hooks/VideoManagerStore.js";
import usePlaylistStore from "../hooks/PlaylistStore.js";
import {VideoList} from "../VideoList/VideoList.jsx";
import SelectComponent from "../SelectComponent/SelectComponent.jsx";
import * as style from "./PlaylistComponent.module.scss";

const PlaylistComponent = () => {
	const videosData = useVideoManagerStore((state) => state.videosData);
	const updateVideosData = useVideoManagerStore((state) => state.updateVideosData);

	const playlistData = usePlaylistStore(state => state.playlistData);
	const currentPlaylistId = usePlaylistStore((state) => state.currentPlaylistId);
	const updatePlaylistData = usePlaylistStore(state => state.updatePlaylistData);
	const updateCurrentPlaylist = usePlaylistStore(state => state.updateCurrentPlaylist);
	const deletePlaylist = usePlaylistStore(state => state.deletePlaylist);
	const addToPlaylist = usePlaylistStore(state => state.addToPlaylist);

      const [playlistIds, setPlaylistIds] = useState([]);
      const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
      const [currentPlaylist, setCurrentPlaylist] = useState({});
      const [selectFormVisible, setSelectFormVisible] = useState(false);

	useEffect(() => {
		updateVideosData();
		updatePlaylistData();
	}, []);

	useEffect(() => {
		setPlaylistIds([-1, ...Object.keys(playlistData)]);
	}, [playlistData]);

	useEffect(() => {
		if (currentPlaylistId === -1) { //When no playlist selected
			// let id = sessionStorage.getItem("playlistId");
			// console.log("playlistId", id);
			// if (id && playlistIds.length) {
			// 	updateCurrentPlaylist(id);
			// 	console.log(playlistIds, id)
			// 	setCurrentPlaylistIndex(playlistIds.indexOf(id));
			// }
			// else {
			setCurrentPlaylist({playlistId: -1, playlistName: "All Videos", videos: Object.keys(videosData)});
			// }
			// sessionStorage.removeItem("playlistId");
		}
		else if (currentPlaylistId) {
			setCurrentPlaylist(playlistData[currentPlaylistId]);
		}
	}, [playlistData, videosData, currentPlaylistId]);

	const setSessionPlaylistId = (event) => {
		sessionStorage.setItem("playlistId", currentPlaylistId);
	};

	useEffect(() => {
		window.addEventListener("beforeunload", setSessionPlaylistId);

		return () => {
			window.removeEventListener("beforeunload", setSessionPlaylistId);
		};
	}, [currentPlaylistId]);
      
	return (
		<>
			{selectFormVisible && 
				<SelectComponent 
					listType="videos"
					setSelectFormVisible={setSelectFormVisible}
					submitFunc={addToPlaylist}
					submitOptions={{playlistId: currentPlaylistId}} />
			}
			<aside className={style.container}>
				<div className={style.header}>
	                  	<button
	                  		style={{borderRight: "1px solid var(--lightgray)"}}
	                  		className={style.arrow}
	                  		disabled={currentPlaylistIndex === 0}
	                  		onClick={() => {
	                  			updateCurrentPlaylist(playlistIds[currentPlaylistIndex-1]);
	                  			setCurrentPlaylistIndex(currentPlaylistIndex-1)
	                  		}}>
	                  		<i className="fa fa-angle-double-left"></i>
	                  	</button>
	                  	
	                  	<div className={style.info}>
	                  		<div className={style.title}>{currentPlaylist?.playlistName}</div>
						<div className={style.pageNum}>{currentPlaylistIndex+1}/{playlistIds.length}</div>

						<button
							title="Loop"
							className={`${style.loop} ${style.button}`}>
							<i className="fa fa-repeat"></i>
						</button>
						<button
							title="Shuffle"
							className={`${style.shuffle} ${style.button}`}>
							<i className="fa fa-random"></i>
						</button>

		                  	{currentPlaylistId !== -1 && 
			                  	<>
			                  		<button
			                  			title="Delete Playlist"
			                  			className={`${style.delete} ${style.button}`}
			                  			onClick={() => deletePlaylist(currentPlaylistId)}>
			                  			<i className="fa fa-trash"></i>
			                  		</button>
			                  		<button
			                  			title="Add Video"
			                  			className={`${style.add} ${style.button}`}
			                  			onClick={() => setSelectFormVisible(true)}>
			                  			<i className="fa fa-plus"></i>
			                  		</button>
			                  	</>
			                  }
	                  	</div>

		                  <button
		                  	style={{borderLeft: "1px solid var(--lightgray)"}}
		                  	className={style.arrow}
		                  	disabled={currentPlaylistIndex === playlistIds.length - 1}
		                  	onClick={() => {
		                  		updateCurrentPlaylist(playlistIds[currentPlaylistIndex+1]);
		                  		setCurrentPlaylistIndex(currentPlaylistIndex+1);
		                  	}}>
		                  	<i className="fa fa-angle-double-right"></i>
		                  </button>
		           	</div>
				<VideoList
					currentPlaylist={currentPlaylist}
					videosData={videosData}
					options={{includeDeleteButtons: true, defaultPlay: true, showCurr: true}} />
			</aside>
		</>
	);
};

export default PlaylistComponent;