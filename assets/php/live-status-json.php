<?php
$status = $_GET['status']; // true or false
$data = array("isLive" => $status === "true");
file_put_contents("../../data/json/live-status.json", json_encode($data, JSON_PRETTY_PRINT));
echo "تم تحديث الحالة إلى: " . ($status === "true" ? "LIVE ✅" : "NO LIVE ❌");
?>