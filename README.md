<h1>js client</h1>
<p>javascript client that communicate with aicup kernel</p>
<h2>how to run</h2>
<ol>
<li>first make sure you have nodejs installed on your computer.<br />you can download it from the official website : https://nodejs.org/en/download</li>
  <li>download the repository and unzip it then open the terminal and use <kbd>cd</kbd> command to go to the project's directory </li>
  <li>run <kbd>npm install</kbd> to install all the project's dependencies</li>
  <li>run the kernel web-server and then set server_ip and server_port of the web-server in config.js file</li>
  <li>put your code and logic for the game in functions inside main.js</li>
  <li>finally run <kbd>npm start</kbd> to run the client</li>
</ol>
<h2>description</h2>
<p>game object is passed to both initilizer and turn function in main.js and you should write your code withing these functions .
<br />
game object has some methods which are all marked as <code>async</code> so they return a promise and you should use <code>await</code> keyword everywhere you use them .
</p>
<p>game object methods list :</p>
<table>
  <tr>
    <th>method name</th>
    <th>description</th>
    <th>success result example</th>
    <th>exception (error) result example</th>
    <th>usage example</th>
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
<td>
  {
    "error" : "error message"
  }
</td>
<td>
  <code>let owners = await game.get_owners()</code>
</td>
  </tr>
    <tr>
<td>put_one_troop(node_id)</td>
<td>this method is used to put one troop inside the <i>node_id</i></td>
    
<td>{
 "message":"troop added successfully"
}</td>
<td>
    {
    "error" : "you are not the owner of this node"
    } 
</td>
<td>
  <code>let response = await game.put_one_troop(4)</code>
</td>
  </tr>
</table>

