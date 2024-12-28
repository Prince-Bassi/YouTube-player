import React, {useEffect, useState} from "react";
import useVideoManagerStore from "./hooks/VideoManagerStore.js";
import usePlaylistStore from "./hooks/PlaylistStore.js";
import {VideoList} from "./VideoList.jsx";
import SelectComponent from "./SelectComponent.jsx";

const PlaylistComponent = () => {
	const videosData = useVideoManagerStore((state) => state.videosData);
	const updateVideosData = useVideoManagerStore((state) => state.updateVideosData);

	const playlistData = usePlaylistStore(state => state.playlistData);
	const currentPlaylistId = usePlaylistStore((state) => state.currentPlaylistId);
	const updatePlaylistData = usePlaylistStore(state => state.updatePlaylistData);
	const updateCurrentPlaylist = usePlaylistStore(state => state.updateCurrentPlaylist);
	const deletePlaylist = usePlaylistStore(state => state.deletePlaylist);
	const addPlaylist = usePlaylistStore(state => state.addPlaylist);
	const removeFromPlaylist = usePlaylistStore(state => state.removeFromPlaylist);
	const addToPlaylist = usePlaylistStore(state => state.addToPlaylist);

	const [currentPlaylist, setCurrentPlaylist] = useState({});
	const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(null);
      const [navPlaylistIds, setNavPlaylistIds] = useState([]);
      const [playlistIds, setPlaylistIds] = useState([]);
      const [selectFormVisible, setSelectFormVisible] = useState(false);

	useEffect(() => { //Initial render
		updateVideosData();
		updatePlaylistData();
	}, []);

	useEffect(() => { //Changing playlist
		const playlistKeys = Object.keys(playlistData);
            if (playlistKeys.length) setPlaylistIds([-1 , ...playlistKeys]);      

		if (currentPlaylistId === -1) { //When no playlist selected
			setCurrentPlaylist({playlistId: -1, playlistName: "Main", videos: Object.keys(videosData)});
		}
		else if (currentPlaylistId) {
			setCurrentPlaylist(playlistData[currentPlaylistId]);
		}
	}, [playlistData, currentPlaylistId, videosData]);

	useEffect(() => {
		if (currentPlaylist && currentPlaylist.videos) {
			setCurrentPlaylistIndex(playlistIds.findIndex(id => id == currentPlaylistId));
		}
	}, [currentPlaylist]);

	useEffect(() => {
		if (currentPlaylistIndex || currentPlaylistIndex === 0) {
           		let backPlaylistIndex = currentPlaylistIndex;
                 	let forwardPlaylistIndex = currentPlaylistIndex;

                  if (backPlaylistIndex-1 >= 0) backPlaylistIndex--;
                 	if (forwardPlaylistIndex+1 < playlistIds.length) forwardPlaylistIndex++;

                 	setNavPlaylistIds([playlistIds[backPlaylistIndex], playlistIds[forwardPlaylistIndex]]);
            }
      }, [currentPlaylistIndex]);

      

	return (
		<aside>
			{selectFormVisible && <SelectComponent listType="videos" setSelectFormVisible={setSelectFormVisible} submitFunc={addToPlaylist} submitOptions={{playlistId: currentPlaylistId}}/>}
			<div className="extraVidHeader">
                  	<button onClick={() => updateCurrentPlaylist(navPlaylistIds[0])}>\..</button>
                  	<span>{currentPlaylist && currentPlaylist.playlistName}</span>
                 		<button onClick={() => updateCurrentPlaylist(navPlaylistIds[1])}>../</button>
                  	<div>{currentPlaylistIndex+1}/{playlistIds.length}</div>
                  	{currentPlaylistId !== -1 && 
                  	<>
                  		<button onClick={() => deletePlaylist(currentPlaylistId)}>Delete Playlist</button>
                  		<button onClick={() => setSelectFormVisible(true)}><i className="fa fa-plus"></i></button>
                  	</>}
	           	</div>
			<VideoList currentPlaylist={currentPlaylist} videosData={videosData} options={{includeDeleteButtons: true, defaultPlay: true}} />
		</aside>
	);
};

export default PlaylistComponent;