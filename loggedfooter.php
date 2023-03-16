<div class="footer"> 
<?php
$fileName =  "VisiteursInscrits.txt";
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
	?>
<div id="count">
<?php 
	$visitorNbr = nombreDinscrits($fileName);
	echo "<p>$visitorNbr personnes sont actuellement inscrites</p>";?>
</div>
<div id="downloadList" class="lien">
<a href="VisiteursInscrits.txt" download="Visitor_list">Download list of visitors</a> 
</div>
<div id="downloadImages" class="lien">
<a href="commander.txt" download="SelectedImages_list">Download list of selected images</a> 
</div>
<div id="downloadImages" class="lien">
<a href="info.php" download="sitePhpInfo">Download infos</a> 
</div>
<div class="botnav">
 <a href="mesprods.php">mesprods</a>
 <a href="draw.php">draw</a>
 <a href="commander.txt">liste images</a>
 <a href="contact.php">Contact</a>
 <a href="index.php">Home</a>
 <a href="log.php">login</a>
 <a href="info.php">PHP infos</a>
 <a href="VisiteursInscrits.txt">Liste visiteurs</a>
</div>
</div>

  