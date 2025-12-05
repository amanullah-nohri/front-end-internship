<?php include 'db.php';
if($_POST){
 $stmt=$pdo->prepare("INSERT INTO items(title,description,created_at) VALUES(?,?,datetime('now'))");
 $stmt->execute([$_POST['title'],$_POST['description']]);
 header("Location: index.php"); exit;
}
?>
<form method="POST">
 <input name="title" placeholder="Title"><br>
 <textarea name="description"></textarea><br>
 <button>Add</button>
</form>