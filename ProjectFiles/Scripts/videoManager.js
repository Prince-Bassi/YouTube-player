class VideoManager {
       constructor() {
              this.videoPlayer = document.body.querySelector(".video .player");
              this.videosData = {};
              // this.displayVideo("1");
              this.getAllVideos();
       }

       addVideo(id) {
              fetch("/addVideo", {
                     method: "POST",
                     headers: {
                            "Content-Type": "application/json"
                     },
                     body: JSON.stringify({id: id})
              })
              .then(response => response.text())
              .then(data => {
                     console.log(data);     
              })
       }

       getAllVideos() {
              fetch("/getAllVideos", {
                     method: "GET"
              })
              .then(response => response.json())
              .then(data => {
                     data = JSON.parse(data); //For some reason, data is still text
                     
                     for (const videoData of data) {
                            this.videosData[videoData.id] = videoData;
                     }
                     console.log(this.videosData);
              })
              .catch(err => console.error(err));
       }

       displayVideo(id) {
              fetch("/getVideo", {
                     method: "POST",
                     headers: {
                            "Content-Type": "application/json"
                     },
                     body: JSON.stringify({videoId: id})
              })
              .then(response => response.text())
              .then(data => {
                     console.log(data);     
              });
       }
}

const videoManager = new VideoManager();

export default videoManager;