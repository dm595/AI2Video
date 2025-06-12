const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/generate', (req, res) => {
  const text = req.body.text || "Texto por defecto";
  console.log("Texto recibido:", text);

  // Llama a Python pasándole el texto (escapado)
  exec(`python3 video_generator.py "${text.replace(/"/g, '\\"')}"`, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send("Error generando video");
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(`Stdout: ${stdout}`);

    // Envía el video generado
    res.sendFile(path.join(__dirname, 'rendered_video.mp4'));
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
