<?php
// استلام الحالة من الرابط (true/false)
$status = $_GET['status'] ?? 'false';

// إعداد البيانات لتتخزن فى JSON
$data = array("isLive" => $status === "true");

// كتابة البيانات داخل ملف live-status.json
file_put_contents("../../data/json/live-status.json", json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// إرسال رسالة تأكيد
echo "تم تحديث الحالة إلى: " . ($status === "true" ? "LIVE ✅" : "NO LIVE ❌");
?>
