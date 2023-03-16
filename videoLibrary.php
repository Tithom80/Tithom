<!DOCTYPE html>
<html lang="fr">
<head>
<title>Tithom Productions</title>
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

    <h1>Video Library</h1>
    <form>
        <input type="text" placeholder="Search...">
        <input type="submit" value="Search">
    </form>
    <div class="video-list">
        <div class="video">
            <img src="https://example.com/thumbnail1.jpg" alt="Video Thumbnail">
            <h3>Video Title 1</h3>
            <p>Video description 1</p>
        </div>
        <div class="video">
            <img src="https://example.com/thumbnail2.jpg" alt="Video Thumbnail">
            <h3>Video Title 2</h3>
            <p>Video description 2</p>
        </div>
        <div class="video">
            <img src="https://example.com/thumbnail3.jpg" alt="Video Thumbnail">
            <h3>Video Title 3</h3>
            <p>Video description 3</p>
        </div>
        <div class="video">
            <img src="https://example.com/thumbnail4.jpg" alt="Video Thumbnail">
            <h3>Video Title 4</h3>
            <p>Video description 4</p>
        </div>
    </div>
    <?php include_once('footer.php'); ?>
</body>
</html>