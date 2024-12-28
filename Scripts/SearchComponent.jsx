import React, {useState, useRef, useEffect} from "react";
import {VideoList} from "./VideoList.jsx";
import useVideoManagerStore from "./hooks/VideoManagerStore.js";

const SelectComponent = () => {
	const videosData = useVideoManagerStore(state => state.videosData);
	const [allVideos, setAllVideos] = useState({});
	const [searchResList, setSearchResList] = useState([]);
	const [query, setQuery] = useState("");
	const [showList, setShowList] = useState(false);
	const containerRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (event.target && !containerRef.current.contains(event.target)) setShowList(false);
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (!query) setSearchResList(Object.keys(videosData));
			const updatedResList = [...Object.keys(videosData)].filter(videoId => videosData[videoId].title.toLowerCase().includes(query));

			setSearchResList(updatedResList);
		}, 300);

		return () => clearTimeout(timeout);
	}, [query, videosData]);

	useEffect(() => {
		setAllVideos({playlistId: -1, playlistName: "Main", videos: searchResList});
	}, [searchResList]);

	return (
		<div ref={containerRef}>
			<input type="text" placeholder="Search Videos..." value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setShowList(true)} />
			{showList && <VideoList currentPlaylist={allVideos} videosData={videosData} options={{includeDeleteButtons: false, setShowList: setShowList, defaultPlay: false}} />}
		</div>
	);
};

export default SelectComponent;