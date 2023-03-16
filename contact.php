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
<?php
// define variables and set to empty values
$nameErr = $emailErr = $telErr = $adresseErr = "";
$uname = $email = $tel = $adresse = "";
$navigateur = $_SERVER['HTTP_USER_AGENT'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty($_POST["name"])) {
    $nameErr = "Votre nom est requit";
  } else {
    $uname = test_input($_POST["name"]);
    // check if name only contains letters and whitespace
    if (!preg_match("/^[a-zA-Z-' ]*$/",$uname)) {
      $nameErr = "Seuls les lettres et les espaces sont autorisés";
    }
  }
  
  if (empty($_POST["email"])) {
    $emailErr = "vous devez entrer un email";
  } else {
    $email = test_input($_POST["email"]);
    // check if e-mail address is well-formed
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $emailErr = "format d'email invalide";
    }
  }
    
  if (empty($_POST["tel"])) {
    $telErr = "vous devez entrer un numéro de téléphone";
  } else {
    $tel = test_input($_POST["tel"]);
    // check if URL address syntax is valid (this regular expression also allows dashes in the URL)
    if (!preg_match("/^\+[0-9]{3}[0-9]{3}[0-9]{4}$/",$tel)){
      $telErr = "Numéro de téléphone invalide";
    }
  }
  if (empty($_POST["adresse"])) {
    $adresseErr = "Adresse invalide";
  } else {
    $adresse = test_input($_POST["adresse"]);
    if (!preg_match("/^[0-9]{4} [a-zA-Z-' ]+$/",$adresse) && !preg_match("/^[0-9]{4} [a-zA-Z-' ]+$/",$adresse) && !preg_match("/^[0-9]{4} [a-zA-Z-' ]+$/",$adresse)){
      $adresseErr = "Adresse invalide";
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

<?php include_once('header.php'); ?>

<div class="content">
<p>Aujourd'hui nous sommes le <?php echo date('d/m/Y h:i'); ?>.</p>
  <p>Production Audiovisuelle</p>
  <h3 id="adresseCarte" >Adresse : Rte de la Croix 33<br> 1921 Martigny-Combe<br> Téléphone : 0779801328</h3>
  <p id="horaires"></p>
  <div id="formulaire">
    <form method="post" class="form" id="form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
      <label for="name" class="label">Nom : </label>
        <input id="name" class="case" type="text" name="name" placeholder="Jean Dupont" value="<?php echo $uname;?>"/><br>
        <span class="error">*</span>
      <label for="email" class="label">E-mail : </label>
        <input id="email" class="case" type ="email" name="email" placeholder="dupont.jean@mail.com" value="<?php echo $email;?>"/><br>
        <span class="error">*</span>
      <label for="tel" class="label">Tél. : </label>
        <input id="tel" class="case" type ="tel" name="tel" placeholder="0793332211" value="<?php echo $tel;?>"/><br>
      <label for="adresse" class="label">Adresse : </label>
        <input id="adresse" class="case" type="adresse" name="adresse" placeholder="1900 ville" value="<?php echo $adresse;?>"/><br>
      <input type="submit" id="button" value="S'inscrire">
    </form>
  </div>
  <div id="affichage">
  <?php
    echo "<h4>Votre inscription :</h4>";
    echo $uname;
    echo "<br>";
    echo $email;
    echo "<br>";
    echo $tel;
    echo "<br>";
    echo $adresse;
    echo "<br>";
    
    $date = date('d/m/Y H:i');
    $fileName = "VisiteursInscrits.txt";
    $myfile = fopen("VisiteursInscrits.txt", "a+") or die("Unable to open file!");
    $myTxt = "Date d'inscription : {$date} \n Nom : {$uname} \n Adresse Mail : {$email} \n Numéro de téléphone : {$tel} \n Localité : {$adresse}\n";
    $myStr = fread($myfile,filesize("VisiteursInscrits.txt"));
    $visitorNbr = nombreDinscrits($fileName);
    
	function nombreDinscrits($fileName) {
	    $file = fopen($fileName, "r");
	    $lineCount = 0;
	
	    while(!feof($file)) {
	        fgets($file);
	        $lineCount++;
	    }
	
	    fclose($file);
	    $lineCount = ($lineCount-1)/5;
	
	    return $lineCount;
	    
	}
  
	function checkName($uname, $myStr, $visitorNbr, $myTxt, $myfile){
	  if (empty($_POST["name"])) {     
	    echo 'Vous devez entrer un nom, svp<br>';
	    //echo $myStr;
	    fclose($myfile);
		} else if(empty($_POST["email"])){
		  echo 'Vous devez entrer un email, svp<br>';
		    fclose($myfile);
		} else if(empty($_POST["tel"])){
		  echo 'Vous devez entrer un numéro de téléphone, svp<br>';
		    fclose($myfile);
		} else if(empty($_POST["adresse"])){
		  echo 'Vous devez entrer une adresse, svp<br>';
		    fclose($myfile);
		} else if(str_contains($myStr, $uname)){
		  echo "Vous êtes $visitorNbr utilisateurs déjà inscrit, merci!<br>";
		    fclose($myfile);
		}else{
		    echo "<p>Données bien enregistrées, comme $visitorNbr autres utilisateurs, merci</p><br>";
		    fwrite($myfile, $myTxt);
		    fclose($myfile);
		  }
		}
	checkName($uname, $myStr, $visitorNbr, $myTxt, $myfile);
	?>
  <?php
  $dbUrl = "Utilisateurs";
  $validateur = "arthur12345";
      try
      { 
        $mysqlConnection = new PDO('mysql:host=localhost;dbname=phpmyadmin;charset=utf8', 'phpmyadmin', $validateur);
      }
      catch (Exception $e)
      {
        die('Erreur : ' . $e->getMessage());
      }
      // Si tout va bien, on peut continuer
      echo "connection sql acceptée<br>";
            
    // On récupère tout le contenu de la table recipes   
    $sqlQuery = "SELECT * FROM $dbUrl";
    $sqlAdduser = "INSERT INTO $dbUrl(`id`, `date`, `username`, `e_mail`, `telephone`, `adresse`) VALUES (NULL, CURRENT_TIMESTAMP(), ?, ?, ?, ?)";
    $pre = $mysqlConnection->prepare($sqlQuery);
    $prew = $mysqlConnection->prepare($sqlAdduser);
    //echo "inscription préparées<br>";

    $pre->execute();
    $utilisateurs = $pre->fetchAll();
    // Check if the username already exists in the database
    $sqlQuery = "SELECT * FROM Utilisateurs WHERE username = '$uname'";
    $result = $mysqlConnection->query($sqlQuery);
    
    if ($result > 0) {
    // Username already exists in the database
    echo "Vous êtes déjà dans notre base de donée, merci!";
    } else {
    // Username does not exist in the database, insert it
    $sqlAdduser = "INSERT INTO Utilisateurs(`id`, `date`, `username`, `e_mail`, `telephone`, `adresse`) VALUES (NULL, CURRENT_TIMESTAMP(), ?, ?, ?, ?)";
    $prew = $mysqlConnection->prepare($sqlAdduser);
    $prew->execute([$uname, $email, $tel, $adresse]);

    echo "Vous avez intégré notre base de donée, merci " . $uname;
}
    
    // On affiche chaque utilisateur une à une
    foreach ($utilisateurs as $user) {
    ?>
    <p><?php echo $user['username']; ?></p>
<?php
}
?>  
  </div>
</div>

<?php include_once('footer.php'); ?>

<script type="text/javascript" src="src/script.js">

</script>

</body>
</html>
