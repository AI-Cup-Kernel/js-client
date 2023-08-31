export async function initilizer(game) {
  let strategic_nodes_with_score;
  try {
    let sn = await game.get_strategic_nodes();
    //make an array of strategic nodes with their corresponding score
    strategic_nodes_with_score = sn.strategic_nodes.map((node, index) => ({
      nodeNumber: node,
      score: sn.score[index],
    }));
    //sort the array by node's score
    strategic_nodes_with_score.sort((a, b) => b.score - a.score);
  } catch (err) {
    console.log("can not get strategic nodes because : ", err);
  }
  try {
    console.log("turn : ", await game.get_turn_number());
  } catch (err) {}
  let nodes_owners;
  try {
    nodes_owners = await game.get_owners();
  } catch {}

  //now let's try to put a troop in strategic nodes first and return to stop
  for (let node of strategic_nodes_with_score) {
    //check if the node has no owner
    if (nodes_owners[node.nodeNumber] == -1) {
      try {
        let response = await game.put_one_troop(node.nodeNumber);
        console.log("one troop added to this strategic node : ", node);
        return;
      } catch (err) {
        console.log(
          "can not put the troop in this strategic node because : ",
          err
        );
      }
    }
  }
  //now if the attemp to put troop on strategic nodes failed , the code below continues

  //let's try to add a troop in an adjacent node of mine to make an army next to each other
  let adj_nodes, my_id;
  try {
    adj_nodes = await game.get_adj();
    my_id = (await game.get_player_id()).player_id;
  } catch (err) {}
  for (let node in nodes_owners) {
    if (nodes_owners[node] == my_id) {
      let adj_my_node_arr = adj_nodes[node];
      for (let nodeNum of adj_my_node_arr) {
        if (nodes_owners[nodeNum] == -1) {
          try {
            let response = await game.put_one_troop(nodeNum);
            console.log(
              "one troop added to this adjacent node of mine : ",
              nodeNum
            );
            return;
          } catch (err) {
            console.log(
              "can not put the troop in this adjacent node because : ",
              err
            );
          }
        }
      }
    }
  }
  //if the previous attemp faild let's add troop in a random node with no owner
  for (let nodeNum in nodes_owners) {
    if (nodes_owners[nodeNum] == -1) {
      try {
        let response = await game.put_one_troop(nodeNum);
        console.log("one troop added to random empty node : ", nodeNum);
        return;
      } catch (err) {
        console.log(
          "can not put the troop in this random node because : ",
          err
        );
      }
    }
  }
  /*if all the previous attemps faild , means all the nodes has owner , so let's add troop in a first matched node of mine .
  here for example you can write your code in a way that it first try to add troops in a strategic node then to a random node of yours rather than just the first node .
  in this way you can protect your nodes better
  */
  for (let nodeNum in nodes_owners) {
    if (nodes_owners[nodeNum] == my_id) {
      try {
        let response = await game.put_one_troop(nodeNum);
        console.log("one troop added to my first matched node : ", nodeNum);
        return;
      } catch (err) {
        console.log(
          "can not put the troop in my first matched node because : ",
          err
        );
      }
    }
  }
}

export async function turn(game) {
  /*first let's put troops to the second matched node of mine .
again this is just for demonstration purposes only , if you want to compete with others you should write a better algorithm .
for example you should try to put more troops in your strategic nodes and make your other nodes equally strong as well
*/
  let nodes_owners, my_id, adj_nodes;
  try {
    nodes_owners = await game.get_owners();
    adj_nodes = await game.get_adj();
    my_id = (await game.get_player_id()).player_id;
  } catch {}
  let i = 0;
  for (let nodeNum in nodes_owners) {
    if (nodes_owners[nodeNum] == my_id) {
      i++;
      if (i == 2) {
        try {
          let my_free_troops = (await game.get_number_of_troops_to_put())
            .number_of_troops;
          console.log("free troops", my_free_troops);
          await game.put_troop(nodeNum, my_free_troops);
          console.log(`${my_free_troops} troops added to node ${nodeNum}`);
          break;
        } catch (err) {
          console.log("can not add troops");
        }
      }
    }
  }

  try {
    console.log(await game.next_state());
  } catch (err) {
    console.log("can not go to the next state of the game because : ", err);
  }

  //now let's attack the first matched node that is for enemy with the first matched node of mine
  let attaker_node, target_node;
  attaker_node = target_node = null;
  for (let nodeNum in nodes_owners) {
    if (nodes_owners[nodeNum] == my_id) {
      attaker_node = nodeNum;
      break;
    }
  }
  //find an enemy's adjacent node to attack
  for (let nodeNum of adj_nodes[attaker_node]) {
    if (nodes_owners[nodeNum] != my_id && nodes_owners[nodeNum] != -1) {
      target_node = nodeNum;
      break;
    }
  }
  //check if we can find desired target_node and then attack !
  if (target_node && attaker_node) {
    try {
      let response = await game.attack(attaker_node, target_node, 1, 0.5);
      console.log("attak result : ", response);
    } catch (err) {
      console.log("attacking failed because", err);
    }
  }

  try {
    console.log(await game.next_state());
  } catch (err) {
    console.log("can not go to the next state of the game because : ", err);
  }

  //in the last state you can move troops between your adjacent nodes (write the code by your self it's easy :) )
  /*
  HINT : you can use get_reachable(node_id) method to get array of nodes that can be reached through node_id
  and this way you can find your destination node
  and then you can use move_troops(source,destination,troops_count)
  */
}
