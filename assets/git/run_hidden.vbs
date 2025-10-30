Option Explicit

Dim fso, scriptFolder, batPath, wsh
Set fso = CreateObject("Scripting.FileSystemObject")
scriptFolder = fso.GetParentFolderName(WScript.ScriptFullName)
batPath = scriptFolder & "\auto_update.bat"

Set wsh = CreateObject("WScript.Shell")
wsh.Run Chr(34) & batPath & Chr(34), 0, False

Set wsh = Nothing
Set fso = Nothing
