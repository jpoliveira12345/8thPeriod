<!DOCTYPE html>
<html lang="pt-br">
<head>
    <!-- Pode ser acessado em: http://jpveira.dx.am/atividadeAJAX/ -->
  <title>Formulário PHP</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="form.js"></script>
  <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> -->
</head>
<body>
    <form action="form.php" method="GET"> 
    <input class="in" type="text" onkeyup="loadDoc(this.value)">
    </form>
    <?php
        require 'getAluno.php';
        echo $arrayAlunos[0]->id;

    ?>
    <div id="demo">
    </div>
		

</body>
</html>