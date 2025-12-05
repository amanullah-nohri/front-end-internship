<?php include 'db.php';
$id=$_GET['id'];
$pdo->exec("DELETE FROM items WHERE id=$id");
header("Location: index.php"); exit;
?>