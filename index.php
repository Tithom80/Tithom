<!DOCTYPE html>
<html lang="fr">
<head>
<title>Tithom Productions Acceuil</title>
<meta charset="utf-8">

<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/png" href="favicon.png">
<link rel="stylesheet" href="style/style.css">
<link rel="stylesheet" href="style/form.css">
</head>
<body>
<?php include_once('header.php'); ?>

<div class="content">
  <div id="day">
    <p id="date">Bienvenue, nous sommes le <?php echo date('d/m/Y h:i'); ?>.</p> 
    <p id="horaires"></p>
  </div>
  <div id="root"></div>
  <p>Production Audiovisuelle</p>
  <canvas id="canvas1"></canvas>
  <canvas id="canvas2"></canvas>
  
  
  
  <!--<div class="video-gallery">

      <div class="video-gallery__video">
        <iframe width="600" height="300" src="https://www.youtube.com/embed/GF4oGzPXkg8" title="Exode haïtien Thomas Sarrasin-Partage YouTube.mov" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        <p>Exode haïtien Thomas Sarrasin</p>
      </div>


    </div>-->
    
  </div>
  <?php include_once('footer.php'); ?>

<script src="src/script.js"></script>
<script src="src/particleTitle.js"></script>
</body>
</html>