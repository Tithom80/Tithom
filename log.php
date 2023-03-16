<!DOCTYPE html>
<html lang="fr">
<head>
<title>Tithom Productions Admin Log</title>
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
<?php
// define variables and set to empty values
$nameErr = $emailErr =  "";
$uname = $email =  "";
$isLogged = false;
$header="header.php";

$navigateur = $_SERVER['HTTP_USER_AGENT'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty($_POST["name"])) {
    $nameErr = "Name is required";
  } else {
    $uname = test_input($_POST["name"]);
    // check if name only contains letters and whitespace
    if (!preg_match("/^[a-zA-Z-' ]*$/",$uname)) {
      $nameErr = "Only letters and white space allowed";
    }
  }
  
  if (empty($_POST["email"])) {
    $emailErr = "Email is required";
  } else {
    $email = test_input($_POST["email"]);
    // check if e-mail address is well-formed
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $emailErr = "Invalid email format";
    }
    
  }

}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
<body>


<div>
	<?php include_once($header); ?>
</div>
<div class="content">
<p>Aujourd'hui nous sommes le <?php echo date('d/m/Y h:i'); ?>.</p>    

  <div id="root"></div>
  <p>Magasin de proximité, produits faits maison</p>
  <form method="post" class="form" id="form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
      <label for="name" class="label">Nom : </label>
        <input id="name" class="case" type="text" name="name" placeholder="Jean Dupont" value="<?php echo $uname;?>"/><br>
        <span class="error">*</span>
      <label for="email" class="label">E-mail : </label>
        <input id="email" class="case" type ="email" name="email" placeholder="dupont.jean@mail.com" value="<?php echo $email;?>"/><br>
        <input type="submit" id="button" value="Se connecter">
  </form>
  </div>
  <div id="affichage">
  <?php
    echo "<h2>Vous avez écrit :</h2>";
    echo $uname;
    echo "<br>";
    echo $email;
    echo "<br>";
    
    $myfile = fopen("VisiteursInscrits.txt", "r") or die("Unable to open file!");
    $myTxt = "Nom : {$uname} \n Adresse Mail : {$email} \n ";
    $myStr = fread($myfile,filesize("VisiteursInscrits.txt"));
    
    if (empty($_POST["name"])) {     
      echo 'Vous devez entrer un nom, merci<br>';
      fclose($myfile);
	 }else if(empty($_POST["email"])){
    	echo 'Vous devez entrer une adresse mail, merci<br>';
      fclose($myfile);
  	 }else if(str_contains($myStr, $uname)&& str_contains($myStr, $email)) {
  	 	$isLogged = true;
      echo "<p>vous êtes bien inscrit<p><br>";
      fclose($myfile);
  	 }else{
  	 	$isLogged = false;
      echo "<p>Inscrivez-vous sur notre page de contact<p><br>";
      fclose($myfile);
  }
  if($isLogged) {
  		$logh ='loggedfooter.php';
    	echo "<p>Vous êtes connecté<p>";
    
    }else {
    	$logh ='footer.php';
    	echo "<p>Vous n'êtes pas connecté<p>";
    }
    echo "<br>";
    
    ?> 
  </div>

<?php include_once($logh); ?>

<script type="text/javascript" src="src/script.js">

</script>
</body>
</html>
