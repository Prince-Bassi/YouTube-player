import {create} from "zustand";

const usePlaylistStore = create((set, get) => ({
	currentPlaylistId: -1,
	playlistData: {},
	loopProps: [null, ""],
	shuffle: false,

	toggleShuffle: (val) => set(state => {
		const updatedVal = val === undefined ? !state.shuffle : val;

		if (state.loopProps[0]) return {shuffle: updatedVal, loopProps: [null, ""]};
		else return {shuffle: updatedVal};
	}),

      setLoopMode: (mode) => {
      	set(state => {
      		let style = "";
      		switch (mode) {
      			case "video":
      				style = "loopVideo";
      				break;
      			case "playlist":
      				style = "active";
      		}
      		return {loopProps: [mode, style]};
      	});
      },

	updateCurrentPlaylist: (playlistId) => set({currentPlaylistId: playlistId}),

	updatePlaylistData: async () => {
		try {
			const response = await fetch("/getPlaylistData", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({reqType: "fullPlaylistsData"})
			});
			const data = await response.json();

			set((state) => {
				const updatedPlaylistData = {...state.playlistData};
				for (const playlist of data) {
					let videos = playlist.videos.filter(elem => elem !== null);

					updatedPlaylistData[playlist.playlistId] = {
						playlistId: playlist.playlistId,
						playlistName: playlist.playlistName,
						videos: videos
					};
				}
				console.log("In updatePlaylistData", updatedPlaylistData);

				return {playlistData: updatedPlaylistData};
			});

		}
		catch (err) {
			console.error(err);
		}
	},

	addPlaylist: (playlistName) => {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await fetch("/addPlaylist", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({playlistName: playlistName})
				});

				const data = await response.json();
				
				if (data.playlistId) {
					console.log(data.message);
					set((state) => {
						const updatedPlaylistData = {...state.playlistData};
						updatedPlaylistData[data.playlistId] = {playlistName: playlistName, videos: []};

						console.log("In addPlaylist", updatedPlaylistData);
						return {playlistData: updatedPlaylistData};
					});

					resolve();
				}
			}
			catch (err) {
				console.error(err);
				reject();
			}
		});
	},

	deletePlaylist: async (playlistId) => {
		try {
			if (!confirm("Delete Playlist?")) return;//Just for development

			const response = await fetch("/deletePlaylist", {
				method: "DELETE",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({playlistId: playlistId})
			});

			const data = await response.text();
			console.log(data);
			
			if (data === "Playlist removed") {
				const state = get();
				if (state.currentPlaylistId === playlistId) state.updateCurrentPlaylist(-1);

				set((state) => {
					const updatedPlaylistData = structuredClone(state.playlistData); 
					delete updatedPlaylistData[playlistId];

					console.log("In deletePlaylist", updatedPlaylistData);
					return {playlistData: updatedPlaylistData};
				});
			}
		}
		catch (err) {
			console.error(err);
		}
	},

	addToPlaylist: async (videoIds, {playlistId}) => {
		try {
			playlistId = +playlistId;
			videoIds = videoIds.map(id => +id);

			const state = get();
			videoIds = videoIds.filter(id => state.playlistData[playlistId] && !state.playlistData[playlistId].videos.includes(id));
			if (!videoIds.length) {
				console.log("Videos Already in playlist");
				return;
			}

			const response = await fetch("/updatePlaylist", {
				method: "PATCH",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({"add": {playlistId: playlistId, videoIds: videoIds}})
			});

			const data = await response.text();
			console.log(data);

			if (data === "Process completed") {
				set((state) => {
					const updatedPlaylistData = {...state.playlistData};

					for (const id of videoIds) {
						if (updatedPlaylistData[playlistId].videos.includes(id)) continue;

						updatedPlaylistData[playlistId].videos.push(id);
					}

					console.log("In addToPlaylist", updatedPlaylistData);
					return {playlistData: updatedPlaylistData};
				});
			}	
		}
		catch (err) {
			console.error(err);
		}
	},

	deleteFromPlaylist: async (playlistId, videoIds) => {
		try {
			if (!confirm(`Delete Videos from Playlist?`)) return;//Just for development
			playlistId = +playlistId;
			videoIds = videoIds.map(id => +id);

			const state = get();
			videoIds = videoIds.filter(id => state.playlistData[playlistId] && state.playlistData[playlistId].videos.includes(id));
			if (!videoIds.length) {
				console.log("Videos not in playlist");
				return;
			}

			const response = await fetch("/updatePlaylist", {
				method: "PATCH",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({"remove": {playlistId: playlistId, videoIds: videoIds}})
			});

			const data = await response.text();
			console.log(data);

			if (data === "Process completed") {
				set((state) => {
					const updatedPlaylistData = {...state.playlistData};

					for (const id of videoIds) {
						if (!updatedPlaylistData[playlistId].videos.includes(id)) continue;
						updatedPlaylistData[playlistId].videos = updatedPlaylistData[playlistId].videos.filter(vId => vId !== id);
					}

					console.log("In deleteFromPlaylist", updatedPlaylistData);
					return {playlistData: updatedPlaylistData};
				});
			}	
		}
		catch (err) {
			console.error(err);
		}
	},
}));

export default usePlaylistStore;