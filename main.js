export async function initilizer(game) {
  let sn_response = await game.get_strategic_nodes();
  let strategic_nodes = sn_response.strategic_nodes;
  let score = sn_response.score;
  let owners = await game.get_owners();
  let player_id = (await game.get_player_id()).player_id;
  console.log("player id : ", player_id);
  for (let i of strategic_nodes) {
    if (owners[i] == -1) {
      let res = await game.put_one_troop(i);
      console.log(res);
      return;
    }
  }
  for (let i of Object.keys(owners)) {
    if (owners[i] == -1) {
      let res = await game.put_one_troop(i);
      console.log(res);
      return;
    }
  }
  let list_of_my_nodes = [];
  for (let i of Object.keys(owners)) {
    if (owners[i] == player_id) {
      list_of_my_nodes.push(i);
    }
  }
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  let randIndex = random(0, list_of_my_nodes.length - 1);
  let res = await game.put_one_troop(list_of_my_nodes[randIndex]);
  console.log(res);
}

export async function turn(game) {
  let troops_count_to_put = (await game.get_number_of_troops_to_put())
    .number_of_troops;
  let owners = await game.get_owners();
  let player_id = (await game.get_player_id()).player_id;
  let list_of_my_nodes = [];
  for (let i of Object.keys(owners)) {
    if (owners[i] == player_id) {
      list_of_my_nodes.push(i);
    }
  }
  //put the given troops inside a random node of mine
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  let randIndex = random(0, list_of_my_nodes.length - 1);
  let res = await game.put_troop(
    list_of_my_nodes[randIndex],
    troops_count_to_put
  );
  console.log(res);
  await game.next_state();
  //find the node with the most troop that I own
  let max_troops = 0;
  let max_node = -1;
  let nodes_troops_count = await game.get_number_of_troops();
  for (let i of Object.keys(owners)) {
    if (owners[i] == player_id) {
      if (nodes_troops_count[i] > max_troops) {
        max_troops = nodes_troops_count[i];
        max_node = i;
      }
    }
  }
  // find a neighbor of that node that I don't own and attack it
  let adj = await game.get_adj();
  for (let i of adj[max_node]) {
    if (owners[i] != player_id) {
      try {
        let res = await game.attack(max_node, i, 1 , 0.5);
        console.log(res);
        break;
      } catch (err) {}
    }
  }
  await game.next_state();
  let state = await game.get_state();
  console.log(state);
  //get the node with the most troops that I own
  max_troops = 0;
  max_node = -1;
  owners = await game.get_owners();
  nodes_troops_count = await game.get_number_of_troops();

  for (let i of Object.keys(owners)) {
    if (owners[i] == player_id) {
      if (nodes_troops_count[i] > max_troops) {
        max_troops = nodes_troops_count[i];
        max_node = i;
      }
    }
  }
  let reachable = (await game.get_reachable(max_node)).reachable;
  console.log("reachabe : ", reachable);
  let destination = reachable[random(0, reachable.length)];
  try{
      let result = await game.move_troop(max_node, destination, 1);
      console.log(result);
  }catch(err){}
}
