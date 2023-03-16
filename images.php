<!DOCTYPE html>
<html lang="fr">
<head>
<title>Tithom Productions Images</title>
<meta charset="utf-8">

<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/png" href="favicon.png">
<link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
        rel="stylesheet"
    >
<link rel="stylesheet" href="style/style.css">
<link rel="stylesheet" href="style/form.css">
</head>
<body>
<?php include_once('header.php'); ?>

<div class="content">
<p id="date">Bienvenue, nous sommes le <?php echo date('d/m/Y h:i'); ?>.</p>    

  <div id="root"></div>
  <p>Images</p>

  <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" >

    <figure class="image-gallery" >
        <img class="photo" src="img/DSC_4220.JPG" name="DSC_4220.JPG" width="200px" alt="image indisponible" class="img">
        <figcaption>"DSC_4220.JPG"</figcaption>
        <input type="checkbox" name="image[]" value="DSC_4220.JPG">
    </figure>

    <figure class="image-gallery" >
        <img class="photo" src="img/DSC_4204.JPG" name="DSC_4204.JPG" width="200px" alt="image indisponible" class="img">
        <figcaption>"DSC_4204.JPG"</figcaption>
        <input type="checkbox" name="image[]" value="DSC_4204.JPG">
        </figure>
    <figure class="image-gallery" >
        <img class="photo" src="img/DSC_4203.JPG" name="DSC_4203.JPG" width="200px" alt="image indisponible" class="img">
        <figcaption>"DSC_4203.JPG"</figcaption>
        <input type="checkbox" name="image[]" value="DSC_4203.JPG">
        </figure>
    <figure class="image-gallery" >
        <img class="photo" src="img/DSC_4202.JPG" name="DSC_4202.JPG" width="200px" alt="image indisponible" class="img">
        <figcaption>"DSC_4202.JPG"</figcaption>
        <input type="checkbox" name="image[]" value="DSC_4202.JPG">
        </figure>
    <figure class="image-gallery" >
        <img class="photo" src="img/DSC_4201.JPG" name="DSC_4201.JPG" width="200px" alt="image indisponible" class="img">
        <figcaption>"DSC_4201.JPG"</figcaption>
        <input type="checkbox" name="image[]" value="DSC_4201.JPG">
        </figure>

    <input type='submit' name='submit' value='Submit' />

  <?php 

    if(isset($_POST['submit'])) {

        $images = $_POST['image'];

        $fileName = 'images.txt';

        $file = fopen($fileName, 'w');

        foreach($images as $image) {

            fwrite($file, $image . PHP_EOL);

        }
        

        fclose($file);

    } 


  ?>

  <!-- Images used to open the lightbox -->
<div class="row">
  <div class="column">
    <img src="img/DSC_4202.JPG" onclick="openModal();currentSlide(1)" class="hover-shadow">
  </div>
  <div class="column">
    <img src="img/DSC_4203.JPG" onclick="openModal();currentSlide(2)" class="hover-shadow">
  </div>
  </div>

<!-- The Modal/Lightbox -->
<div id="myModal" class="modal">
  <span class="close cursor" onclick="closeModal()">&times;</span>
  <div class="modal-content">
    <div class="mySlides">
      <div class="numbertext">2 / 4</div>
      <img src="img/DSC_4202.JPG" style="width:10%">
    </div>

    <div class="mySlides">
      <div class="numbertext">3 / 4</div>
      <img src="img/DSC_4203.JPG" style="width:10%">
    </div>

    <div class="mySlides">
      <div class="numbertext">4 / 4</div>
      <img src="img/DSC_4204.JPG" style="width:10%">
    </div>

    <!-- Next/previous controls -->
    <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
    <a class="next" onclick="plusSlides(1)">&#10095;</a>

    <!-- Caption text -->
    <div class="caption-container">
      <p id="caption"></p>
    </div>

    <!-- Thumbnail image controls -->
    <div class="column">
      <img class="demo" src="img/DSC_4202.JPG" width="200px" onclick="currentSlide(1)" alt="Nature">
    </div>

    <div class="column">
      <img class="demo" src="img/DSC_4203.JPG" width="200px" onclick="currentSlide(2)" alt="Snow">
    </div>
  </div>
</div>
  <div class='selected-images'>

    <h3>Selected Images:</h3>

    <?php 

      $fileName = 'images.txt';

      $file = fopen($fileName, 'r');

      while(!feof($file)) { 

          $line = fgets($file);  

          if(!empty($line)) { ?> 

              <p><?php echo $line; ?></p>  

      <?php }  

      }  fclose($file); 
      
      if(isset($_POST['confirmer'])) {
        //echo "bouton ok<br>";
        $fileName = 'commander.txt';
        $comFile = 'images.txt';

        $commande = fopen($comFile,"r");
        $file = fopen($fileName, 'a+');

        while(!feof($commande)) { 

            $line = fgets($commande);  

            if(!empty($line)) {  
              //echo "vous venez de commander la photo :$line<br>";
              fwrite($file, $line . PHP_EOL);
              }  

      }  
      fclose($file);
      fclose($commande);
  
      } 
      ?> 
          <input type='submit' name='confirmer' value='Confirmer' />

</form>
    
  </div>
  
</div>
<?php include_once('footer.php'); ?>
<script type="text/javascript" src="src/script.js">

</script>
</body>
</html