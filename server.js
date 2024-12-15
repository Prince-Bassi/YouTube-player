require("dotenv").config();

const path = require('path');
const express = require('express');
const mysql = require("mysql");
const { google } = require("googleapis");
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const PORT = 8080;
const app = express();
const compiler = webpack(webpackConfig);

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

function getYoutubeResponse(part, id) {
       const youtubeResponse = youtube.videos.list({
              part: part,
              id: id,
       });

       return youtubeResponse;
}

async function getVideoFromDB(id) {
       return new Promise((resolve, reject) => {
              const query = (typeof id === "number") ? "SELECT * FROM videos WHERE id = ?;" : "SELECT * FROM videos WHERE videoId = ?;";
              db.query(query, [id], (err, results, fields) => {
                     if (err) reject(err);
       
                     resolve(results);
              });
       });
}

app.use(express.static(path.join(__dirname, 'ProjectFiles')));
app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(
       webpackDevMiddleware(compiler, {
              publicPath: webpackConfig.output.publicPath,
              stats: { colors: true },
       })
);

app.use(webpackHotMiddleware(compiler));

app.get('/', (req, res) => {
       res.sendFile(path.join(__dirname, 'ProjectFiles', 'index.html'));
});

app.get("/getAllVideos", (req, res, next) => {
       db.query("SELECT * FROM videos;", (err, results, fields) => {
              if (err) next(err);

              res.status(200).json(results);
       });
});

app.post("/getVideo", async (req, res, next) => {
       const results = await getVideoFromDB(req.body.id);
       res.status(200).json(results);
});

app.post("/addVideo", async (req, res, next) => {
       const videoId = req.body.videoId;
       const part = "snippet,player";

       if (videoId) {
              const results = await getVideoFromDB(videoId);
              if (results.length > 0) {
                     res.status(200).send("Video is already in the database");
                     return;
              }

              await getYoutubeResponse(part, videoId).then(data => {
                     if (!data.data.items.length) {
                            res.status(200).send("Invalid ID");
                            return;
                     } 

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