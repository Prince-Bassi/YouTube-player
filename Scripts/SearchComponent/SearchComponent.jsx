import React, {useState, useRef, useEffect} from "react";
import {VideoList} from "../VideoList/VideoList.jsx";
import useVideoManagerStore from "../hooks/VideoManagerStore.js";
import * as style from "./SearchComponent.module.scss";

const SearchComponent = () => {
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
		<div className={style.container} ref={containerRef}>
			<input
				className={style.input}
				type="text"
				placeholder="Search Videos..."
				onChange={(event) => setQuery(event.target.value.toLowerCase())}
				onFocus={() => setShowList(true)} />

			{showList && 
				<VideoList
					_className={style.list}
					currentPlaylist={allVideos}
					videosData={videosData}
					options={{
						includeDeleteButtons: false,
						setShowList: setShowList,
						defaultPlay: false,
						showCurr: false}}
				/>
			}
		</div>
	);
};

export default SearchComponent;