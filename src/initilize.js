import axios from "axios";
import express from "express";
import { Game } from "./game.js";
import { config } from "../config.js";
import { initilizer, turn } from "../main.js";
//getting server ip

const server_ip = config.server_ip;
const server_port = config.server_port;

async function ready(url, token) {
  try {
    const response = await axios.get(url, {
      headers: {
        "x-access-token": token,
      },
    });
    console.log("ready successfull");
  } catch (err) {
    console.log(err?.response?.data);
  }
}

//make login request to the server
async function main() {
  let token, id, my_port, randomPass;
  try {
    /* generating random password to be used as a token in server
    (every server request from now on should contain this random password as a token in the header) 
    */
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    randomPass = random(100_000, 999_999);
    const requestData = new FormData();
    requestData.append("token", randomPass);
    const { data } = await axios({
      method: "post",
      url: `http://${server_ip}:${server_port}/login`,
      data: requestData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("login successfull");
    token = data.token;
    id = data.id;
    my_port = data.port;
  } catch (err) {
    console.log("error while logging in to the server : ", err.response?.data || "make sure kernel server is running");
    return false;
  }
  //generate game object
  const game = new Game(token, server_ip, server_port);
  //create a server for receiving kernel requests
  const app = express();
  app.use((req, res, next) => {
    if (!req.headers["x-access-token"]) {
      return res.status(401).send("Token is missing!");
    } else {
      if (Number(req.headers["x-access-token"]) != randomPass) {
        return res.status(401).send("Invalid token!");
      }
    }
    next();
  });
  app.get("/init", async (req, res) => {
    console.log("initilizer started");
    game.my_turn = true;
    res.send("ok");
    await initilizer(game);
  });
  app.get("/turn", async (req, res) => {
    console.log("turn started");
    game.my_turn = true;
    res.send("ok");
    await turn(game);
  });
  app.get("/end", (req, res) => {
    console.log("turn ended");
    game.my_turn = false;
    res.send("ok");
  });

  app.listen(my_port, async () => {
    console.log(`server app listening on port ${my_port}`);
    await ready(`http://${server_ip}:${server_port}/ready`, token);
  });
}
main();
