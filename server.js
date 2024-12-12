require("dotenv").config();

const express = require("express");
const path = require("path");
const mysql = require("mysql");
const { google } = require("googleapis");
const app = express();
const PORT = 8080;

const db = mysql.createConnection({
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME
});

const youtube = google.youtube({
       version: 'v3',
       auth: process.env.API_KEY
});

app.use(express.static(path.join(__dirname, 'ProjectFiles')));
app.use(express.urlencoded({extended: true}))
app.use(express.json());

function getYoutubeResponse(part, id) {
       const youtubeResponse = youtube.videos.list({
              part: part,
              id: id,
       });

       return youtubeResponse;
}

app.get("/", (req, res) => {
       res.sendFile(path.join(__dirname, 'ProjectFiles/Layouts', 'index.html'));
});

app.get("/getAllVideos", (req, res, next) => {
       db.query("SELECT * FROM videos;", (err, results, fields) => {
              if (err) next(err);

              res.status(200).json(results);
       });
});

app.post("/getVideo", (req, res, next) => {
       const youtubeResponse = youtube.videos.list({
              part: "snippet,player,contentDetails",
              id: req.body,
       });
       
       youtubeResponse.then((data) => {
              res.status(200).json(data);
       })
       .catch(err => next(err));
});

app.post("/addVideo", (req, res, next) => {
       const videoId = req.body.id;
       const part = "snippet,player";

       if (videoId) {
              getYoutubeResponse(part, videoId).then(data => {
                     const videoData = data.data.items[0];
                     const params = [videoId, videoData.player.embedHtml, videoData.snippet.title];
                     
                     db.query("INSERT INTO videos (videoId, html, title) VALUES (?, ?, ?);", params, (err, results) => {
                            if (err) next(err);

                            res.status(200).send("Video added");
                     });
              })
              .catch(err => next(err));
       }
       else {
              next(new Error("Video ID not Found"))
       }
});

app.use((err, req, res, next) => {
       console.error(err);
       res.status(err.statusCode || 500).send(err.message || "Something unexpected happened");
});

app.listen(PORT, (err) => {
       if (err) console.error(err);
       console.log("Server running on PORT:", PORT);
});