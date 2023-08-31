<h1>js client</h1>
<p>javascript client that communicate with aicup kernel</p>
<h2>how to run</h2>
<ol>
<li>first make sure you have nodejs installed on your computer.<br />you can download it from the official website : https://nodejs.org/en/download</li>
  <li>download the repository and unzip it then open the terminal and use <kbd>cd</kbd> command to go to the project's directory </li>
  <li>run <kbd>npm install</kbd> to install all the project's dependencies</li>
  <li>run the kernel web-server and then set server_ip and server_port of the web-server in config.js file</li>
  <li>put your code and logic for the game in functions inside main.js ( a sample code already exist in this file you can check it to learn how your code should be )</li>
  <li>finally run <kbd>npm start</kbd> to run the client</li>
</ol>
<h2>description</h2>
<p>game object is passed to both initilizer and turn function in main.js and you should write your code withing these functions .
<br />
game object has some methods which are all marked as <code>async</code> so they return a promise and you should use <code>await</code> keyword everywhere you use them .
<br />
all of the methods will <code>throw exception</code> if there is an error , so it's better to wrap each of the method in <code>try catch</code> blocks to handle the errors and prevent the program from crashing .
</p>
<h2>game object methods list :</h2>
<table>
  <tr>
    <th>method name</th>
    <th>description</th>
    <th>success result example</th>
  </tr>
  <tr>
<td>get_owners()</td>
    <td> this method is used to get the owners of all nodes.<br />-1 means node has no owner.<br />other numbers are the player_id of the owner.</td>
    
<td><pre>{
  "1" : -1,
  "2" : -1,
  "3 : 0,
  "4" : 1,
  "5" : -1,
}</pre></td>
  </tr>


<tr>
   <td>get_strategic_nodes()</td>
   <td> this method is used to get the list of strategic nodes and their coresponding score <br />so for example the score of the node in index 2 is the value of score array in index 2</td>
   <td>
      <pre>{
   score: [ 2, 1, 5, 4, 1, 3 ],
   strategic_nodes: [ 3, 4, 7, 20, 29, 40 ]
}</pre>
   </td>
</tr>

<tr>
   <td>get_turn_number()</td>
   <td> this method return the current turn number</td>
   <td>
      <pre>{
    turn_number: 5
}</pre>
   </td>
</tr>


<tr>
   <td>get_adj()</td>
   <td>return an object with the node's as key and array of adjecent nodes with that node</td>
   <td>
      <pre>{
  '0': [ 1, 2 ],
  '1': [ 0, 2, 3 ],
  '2': [ 0, 1, 3 ],
  '3': [ 1, 2, 4 ],
  '4': [ 3, 5, 6 ],
  '5': [ 4, 6, 8, 7, 14, 13 ],
  '6': [ 4, 5, 7, 21 ],
}</pre>
   </td>
</tr>

<tr>
   <td>get_number_of_troops_to_put()</td>
   <td>the number of troops that you own but you havn't place them on any node</td>
   <td>
      <pre>{
number_of_troops: 12
}</pre>
   </td>
</tr>

<tr>
<td>put_one_troop(node_id)</td>
<td>this method is used to put one troop inside the <i>node_id</i></td>
    
<td>{
 message : "troop added successfully"
}</td>
  </tr>

<tr>
<td>put_troop(node_id , number)</td>
<td>this method is used to put <i>number</i> troop inside the <i>node_id</i></td>
    
<td>{
 message : "troop added successfully"
}</td>
  </tr>
  
</table>

