
<?php
// Variables for target directory, file name and extention
$targetDir = "./images/";
$fileName  = "selected_images";
$fileExt   = ".txt";

if (isset($_POST['uploadFile'])) {
    $selectedImagesString = $_POST['uploadFile'];

    // Open a file to save the images
    $imageFile = fopen($targetDir . $fileName . $fileExt, 'w') or die("Can't open file");

    //Save selected images to the file
    fwrite($imageFile, $selectedImagesString);

    // Close the file       
    fclose($imageFile);

    echo 'Success'; // Return success message   
} else {  
    echo 'Error'; // Return error message  
} 
?>
