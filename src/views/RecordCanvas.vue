<template>
  <div>
    <canvas width="300" height="300"></canvas>
    <button @click="roll">Get</button>
  </div>
</template>
<script lang="ts" setup>

    const roll = () => {
      interface CanvasElement extends HTMLCanvasElement {
        captureStream(frameRate?: number): MediaStream;
      }
      const canvas = <CanvasElement> document.querySelector('canvas');
      const ctx = canvas.getContext("2d");
        var colors = ["red", "blue", "yellow", "orange", "black", "white", "green"];
        function draw (){
           ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
           ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        draw();

        var videoStream = canvas.captureStream(30);

        var mediaRecorder = new MediaRecorder(videoStream);

        var chunks = [];
        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        };

        mediaRecorder.onstop = function(e) {
            var blob = new Blob(chunks, { 'type' : 'video/mp4' });
            chunks = [];
            var videoURL = URL.createObjectURL(blob);
            var tag = document.createElement('a');
            tag.href = videoURL;
            tag.download = 'sample.mp4';
            document.body.appendChild(tag);
            tag.click();
            document.body.removeChild(tag);
        };
          mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        };

        mediaRecorder.start();
        setInterval(draw, 300);
        setTimeout(function (){ mediaRecorder.stop(); }, 5000);
    }
</script>
<style scoped>
canvas {
  box-shadow: 0 0 10px gray;
  display: block;
}
body {
  text-align: center;
}
button {
  margin-top: 20px;
}
</style>