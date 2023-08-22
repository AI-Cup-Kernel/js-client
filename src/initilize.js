import axios from "axios";
import { Game } from "./game.js";
import { config } from "../config.js";
//getting server ip

const server_ip = config.server_ip;
const server_port = config.server_port;

//make login request to the server
async function main() {
  let token, id, my_port;
  try {
    /* generating random password to be used as a token in server
    (every server request from now on should contain this random password as a token in the header) 
    */
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    const randomPass = random(100_000, 999_999);
    const requestData = new FormData();
    requestData.append("token", randomPass);
    const { data } = await axios({
      method: "post",
      url: `http://${server_ip}:${server_port}/login`,
      data: requestData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    token = data.token;
    id = data.id;
    my_port = data.my_port;
  } catch (err) {
    console.log("error while logging in to the server : ", err.response?.data);
  }

  //generate game object
  const game = new Game(token, server_ip, server_port);
  try {
    const owners = await game.get_owners();
    console.log(owners);
  } catch (err) {}
}
main();
