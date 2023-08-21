import axios from "axios";
export class Game {
  constructor(token, server_ip, server_port) {
    this.token = token;
    this.server_ip = server_ip;
    this.server_port = server_port;
    this.ax = axios.create({
      baseURL: `http://${this.server_ip}:${this.server_port}/`,
      headers: { "'x-access-token'": token },
    });
  }
  handle_output(response) {
    console.log(response);
    return true;
  }
  async get_owners() {
    try {
      const res = await this.ax.get("get_owners");
      return this.handle_output(res);
    } catch (err) {
      console.log("error in get_owners : ", err);
    }
  }
}
