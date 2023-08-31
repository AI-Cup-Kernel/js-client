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

  //now let's try to put a troop in strategic nodes first and return
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
  //now if the attemp to put troop on strategic nodes failed the code below continues

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
  /*if all the previous attemps faild means all the nodes has owner so let's add troop in a first matched node of mine
  here for example you can write your code in a way that it first try to add troop in a strategic node then to a random node of yours rather than just the first node
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

export async function turn(game) {}
