<?php include 'db.php';
$items=$pdo->query("SELECT * FROM items ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
echo "<a href='add.php'>Add Item</a><br><br>";
echo "<table border=1><tr><th>ID</th><th>Title</th><th>Description</th><th>Actions</th></tr>";
foreach($items as $i){
 echo "<tr>
 <td>{$i['id']}</td>
 <td>{$i['title']}</td>
 <td>{$i['description']}</td>
 <td>
   <a href='edit.php?id={$i['id']}'>Edit</a> |
   <a href='delete.php?id={$i['id']}'>Delete</a>
 </td>
 </tr>";
}
echo "</table>";
?>