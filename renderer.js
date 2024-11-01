const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const { exec } = require('child_process');
document.getElementById('selectFolderBtn').addEventListener('click', async () => {
  const folderPath = await ipcRenderer.invoke('select-folder');
  document.getElementById('folderPath').value = folderPath;
});

document.getElementById('savePathBtn').addEventListener('click', () => {
    const folderPath = document.getElementById('folderPath').value;
    if (folderPath) {
      ipcRenderer.send('save-path', folderPath);
    } else {
      alert('Please select a folder first.');
    }
});

document.getElementById('logo').addEventListener('click', () => {
  document.getElementById("logo").style.animation="logoanim 2.2s linear infinite"
});


document.getElementById('file').addEventListener('click', async () => {
  const filePath = await ipcRenderer.invoke('select-file');
  
  if (filePath) {
    const fileExtension = path.extname(filePath).toLowerCase();
    if (fileExtension === '.zip') {
      try {
        const zip = new AdmZip(filePath);
        const tempDir = path.join(__dirname, 'temp');
        fs.mkdirSync(tempDir, { recursive: true });
        zip.extractAllTo(tempDir, true);
        const files = fs.readdirSync(tempDir);
        const ffxFiles = files.filter(file => path.extname(file).toLowerCase() === '.ffx');
        const destinationDir = path.join(readConfig(), 'Presets', 'AEPM');
        ffxFiles.forEach(file => {
          const sourcePath = path.join(tempDir, file);
          const destinationPath = path.join(destinationDir, file);
          fs.copyFileSync(sourcePath, destinationPath);
        });
        fs.rmSync(tempDir, { recursive: true, force: true });
        alert(`Successfully unpacked and copied ${ffxFiles.length} .ffx file(s) to AEPM Presets.`);
      } catch (error) {
        alert('Error unpacking zip file: ' + error);
      }
    } else if (fileExtension === '.ffx') {
      try {
        const destinationPath = path.join(readConfig(), 'Presets', 'AEPM', path.basename(filePath));
        fs.copyFileSync(filePath, destinationPath);
        alert('Successfully copied presets to AEPM Presets');
      } catch (error) {
        alert('Error copying .ffx file: ' + error);
      }
    } else {
      alert('Unsupported file type. Please upload a .zip or .ffx file.');
    }
  } else {
    alert('No file selected.');
  }
});


document.getElementById('sae').addEventListener('click', async () => {
  const afterFXPath = path.join(readConfig(), "AfterFX.exe");
  if (!fs.existsSync(afterFXPath)) {
    alert('AfterFX.exe not found at the specified path: ' + afterFXPath);
    return;
  }
  exec(`"${afterFXPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening AfterFX: ${error}`);
      alert(`Error opening AfterFX: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      alert(`Error: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    alert('After Effects opened successfully with the specified presets folder.');
  });
})

document.getElementById('mng').addEventListener('click', async () => {
  var folderPath=path.join(readConfig(), "Presets", "AEPM");
  const get = (dir) => {
    if (!fs.existsSync(folderPath))
    {
      fs.mkdirSync(folderPath, { recursive: true })
    }
    try {
      var files = fs.readdirSync(dir)
      return files.filter(file => file.endsWith('.ffx'))
    } catch (error) {
      alert("Error: ", error)
      return []
    }
  }
  var ffx=get(folderPath)
  var l=document.getElementById("mngm")
  document.getElementById("main").style.animation="m2out 1s forwards";
  l.style.display="block"
  l.style.animation="mnin 2s forwards";
  l.innerHTML=''
  document.body.style="overflow-y:visible;"
  if (ffx.length===0)
  {
    l.innerHTML='<b><code>No presets imported yet. Only presets imported via AEPM will be shown here.</code></b>'
  } else {
    ffx.forEach(file => {
      var icotrash=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>`
      var lit = document.createElement("p")
      lit.innerHTML=`<div class="itm"><div class="itmg"></div><div class="itmbg"></div><div class="itmtitle">${file}</div><div class="itmbody"><div class="itmdel" id="itmdel">${icotrash} Delete</div></div></div>`
      l.appendChild(lit)
      lit.querySelector('.itmdel').onclick = () => {
        var filePath = path.join(folderPath, file); 
        delf(filePath,lit,file); 
        
      };
    })
  }
  var btm=document.createElement("div");
  btm.innerHTML=`<p align="center"><button class="backbtn" id="backbtn2" onclick="home2()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e1e1e1" class="size-6" class="svgIcon"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg></button></p>`
  l.appendChild(btm)
});

function readConfig() {
    const configPath = path.join(__dirname, 'src', 'config.cfg');
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const lines = configContent.split('\n');
      const folderPathLine = lines.find(line => line.startsWith('ae='));
      if (folderPathLine) {
        return folderPathLine.split('=')[1].trim(); 
      }
    }
    return null; 
}

document.getElementById('settingsicon').addEventListener('click', async () => {
  var folderPath=readConfig()
  document.getElementById('folderPath').value = folderPath; 
});

function delf(filePath, lit, file) {
  if (confirm(`Are you sure you want to delete 'AEPM/'${file}`))
  {
    fs.unlinkSync(filePath)
    lit.remove();
  }
}


if (!readConfig().includes("Support Files"))
{
  alert("Please select your After Effecs path in the settings.")
  document.getElementById("settings").style.display="block"
  document.getElementById("settings").style.animation="settingsanim 1.25s ease-out"
}