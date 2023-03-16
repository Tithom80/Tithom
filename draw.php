<!DOCTYPE html>
<html lang="fr">
<head>
<title>Tithom Productions Contact</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/png" href="favicon.png">
<link rel="stylesheet" href="style/style.css">
<link rel="stylesheet" href="style/form.css">
</head>
  <title>Drawing App</title>
  <style>
    #canevas {
      border: 1px solid black;
    }
  </style>
</head>
<body>
	<?php include_once('header.php'); ?>
<div class="check">
  <input type= "checkbox" id="drawing" checked>
  <label for="drawing">Drawing</label>
</div>
<div class="check">
  <input type="checkbox" id="erase" >
  <label for="erase">Erase</label>
</div>
<div class="pick">
  <input type="color" id="colorPicker">
</div>
  <canvas id="canvas" width="400" height="400"></canvas>

  <button id="exportButton">Export as NFT</button>

  <script>
    // Get the canvas element
    var canvas = document.getElementById('canevas');

    // Make sure we don't execute when canvas isn't supported
    if (canvas.getContext) {

      // Get the 2d context
      var ctx = canvas.getContext('2d');

      // Get the drawing checkbox
      var drawingCheckbox = document.getElementById('drawing');

      // Get the erase checkbox
      var eraseCheckbox = document.getElementById('erase');

      // Get the color picker
      var colorPicker = document.getElementById('colorPicker');

      // Create a new path when the mouse is pressed
      var isDrawing = false;
      canvas.onmousedown = function(e) {
        if (drawingCheckbox.checked) {
          ctx.beginPath();
          ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
          isDrawing = true;
        } else if (eraseCheckbox.checked) {
          ctx.clearRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, 10, 10);  
        }  
      }

      // Draw a line to the mouse position when the mouse is moved or erase when erase is checked  
      canvas.onmousemove = function(e) {  
        if (drawingCheckbox.checked && isDrawing) {  
          ctx.strokeStyle = colorPicker.value;  
          ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);  
          ctx.stroke();  
        } else if (eraseCheckbox.checked) {  
          ctx.clearRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, 10, 10);  
        }  
      }  

      // Stop drawing when the mouse is released and export as NFT when export button is clicked   
      canvas.onmouseup = function(e) {  
        if (drawingCheckbox.checked) {  
          ctx.closePath();  
          isDrawing = false;  

          document.getElementById("exportButton").onclick = function(){   
            const dataURL = canvas.toDataURL();   

            const xhr = new XMLHttpRequest();   

            xhr.open("POST", "export_nft_endpoint");   

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");   

            xhr.onreadystatechange = function () {   

              if (xhr.readyState === 4 && xhr.status === 200) {   

                alert("NFT exported successfully!");   

              } else if (xhr.readyState === 4 && xhr.status !== 200) {   

                alert("Failed to export NFT!");   

              }   

            };   

            xhr.send(encodeURI("dataURL=" + dataURL));    

          };    

        }    

      }    

    } else {    

      alert('Sorry, canvas is not supported on your browser!');    

    }    
    
  </script>    
  <?php include_once('loggedfooter.php'); ?>
</body>    
</html>