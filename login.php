<?php if (isset($_POST['email']) &&  isset($_POST['password'])) {// Validation du formulaire
    foreach ($users as $user) {
        if (
            $user['email'] === $_POST['email'] &&
            $user['password'] === $_POST['password']
        ) {
            $loggedUser = [
                'email' => $user['email'],
            ];
        } else {
            $errorMessage = sprintf('Les informations envoyées ne permettent pas de vous identifier : (%s/%s)',
                $_POST['email'],
                $_POST['password']
            );
        }
    }
}
?>

<!--
   Si utilisateur/trice est non identifié(e), on affiche le formulaire
-->
<?php if(!isset($loggedUser)): ?>
<form id="formulaire" class="adresseCarte" action="index.php" method="post">
    <!-- si message d'erreur on l'affiche -->
    <?php if(isset($errorMessage)) : ?>
        <div class="error" role="alert">
            <?php echo $errorMessage; ?>
        </div>
    <?php endif; ?>
    <div class="email">
        <label for="email" class="label">Email</label>
        <input type="email" class="case" id="email" name="email" placeholder="you@exemple.com">
    </div>
    <div class="pass">
        <label for="password" class="label">Mot de passe</label>
        <input type="password" class="case" id="password" name="password">
    </div><br>
    <button type="submit" class="button" value="Envoyer">Valider</button>
</form>
<!-- 
    Si utilisateur/trice bien connectée on affiche un message de succès
-->
<?php else: ?>
    <div class="alert alert-success" role="alert">
        Bonjour <?php echo $loggedUser['email']; ?> et bienvenue sur le site !
    </div>
<?php endif; ?>