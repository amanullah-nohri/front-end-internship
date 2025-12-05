<?php include 'db.php';
$id=$_GET['id'];
$item=$pdo->query("SELECT * FROM items WHERE id=$id")->fetch(PDO::FETCH_ASSOC);
if($_POST){
 $stmt=$pdo->prepare("UPDATE items SET title=?, description=? WHERE id=?");
 $stmt->execute([$_POST['title'],$_POST['description'],$id]);
 header("Location: index.php"); exit;
}
?>
<form method="POST">
 <input name="title" value="<?php echo $item['title']; ?>"><br>
 <textarea name="description"><?php echo $item['description']; ?></textarea><br>
 <button>Update</button>
</form>