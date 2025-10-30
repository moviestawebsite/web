Option Explicit

Dim fso, scriptFolder, batPath, wsh
Set fso = CreateObject("Scripting.FileSystemObject")
' مجلد الملف الحالي (مكان هذا الـ .vbs)
scriptFolder = fso.GetParentFolderName(WScript.ScriptFullName)
' اسم ملف الـ .bat اللي عايز تشغّله (لو احتجت تغيّره هنا)
batPath = scriptFolder & "\auto_update.bat"

Set wsh = CreateObject("WScript.Shell")
' المعامل الأول: مسار الملف بين علامات اقتباس
' المعامل الثاني (0) => تشغيل بدون نافذة
' المعامل الثالث (False) => لا ينتظر انتهاء الـ bat (لو عايز ينتظر خلي True)
wsh.Run Chr(34) & batPath & Chr(34), 0, False

' تنظيف
Set wsh = Nothing
Set fso = Nothing
