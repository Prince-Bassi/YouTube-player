import React, {useState, useEffect, useRef} from "react";
import useVideoManagerStore from "../hooks/VideoManagerStore.js";
import usePlaylistStore from "../hooks/PlaylistStore.js";

const Item = ({id, title}) => {
	return (
		<div>
			<input type="checkbox" id={`selectCheck${id}`} name={id}/>
			<label htmlFor={`selectCheck${id}`}>{title}</label>
		</div>
	);
};

const SelectComponent = ({submitOptions, listType, submitFunc, setSelectFormVisible}) => {
	const videosData = useVideoManagerStore((state) => state.videosData);
	const playlistData = usePlaylistStore(state => state.playlistData);
	const [itemList, setItemList] = useState({});
	const submitButtonRef = useRef(null);
	const formRef = useRef(null);

	useEffect(() => {
		const items = {};
		switch(listType) {
			case "videos":
				for (const [id, videoData] of Object.entries(videosData)) {
					items[id] = videoData.title;
				}
				break;
			case "playlists":
				for (const [id, data] of Object.entries(playlistData)) {
					items[id] = data.playlistName;
				}
				break;
			default:
				console.log("Invalid listType");
		}

		setItemList(items);
	}, []);

	return (
		<form ref={formRef} onSubmit={(event) => {
			event.preventDefault();
			submitButtonRef.current.disabled = true;
                                   	
			const formData = new FormData(formRef.current);
			const itemIds = [];

			for (const [key, value] of formData.entries()) {
				itemIds.push(key);
			}

			submitFunc(itemIds, submitOptions);
			setSelectFormVisible(false);
		}}>
			{Object.keys(itemList).map(id => (
				<Item key={id} id={id} title={itemList[id]} />
			))}
			<button onClick={() => setSelectFormVisible(false)}>Cancel</button>
			<button ref={submitButtonRef} type="submit">Submit</button>
		</form>
	);
};

export default SelectComponent;