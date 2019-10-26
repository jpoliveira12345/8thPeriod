<?php
// Pode ser acessado em: http://jpveira.dx.am/atividadeAJAX/
    define("HOST", "fdb22.awardspace.net");
    define("USER", "3173922_ppi");
    define("PASSWORD", "101010aaa,");
    define("DATABASE", "3173922_ppi");

    class Aluno{
        public $id;
        public $nome;
        public $email;
        public $estadoCivil;
    }

    function getAluno( $q )
    {
        $conn = new mysqli(HOST, USER, PASSWORD, DATABASE);
        if ($q == "" || $q == null )
            return null;
        if ($conn->connect_error)
            throw new Exception('Falha na conexão com o MySQL: ' . $conn->connect_error);
        $arrayAlunos = null;

        $SQL = "SELECT * FROM `ALUNO_PPI` ";

        $result = $conn->query($SQL);
        if (! $result)
            throw new Exception('Ocorreu uma falha ao gerar o relatorio de testes: ' . $conn->error);

        if ($result->num_rows > 0)
        {
            while ($row = $result->fetch_assoc())
            {   
                $hint = "";
                $aluno = new Aluno();
                $aluno->id            = $row["ALUNO_ID"];
                $aluno->nome          = $row["ALUNO_NOME"];
                $aluno->email         = $row["ALUNO_IDADE"];
                $aluno->estadoCivil   = $row["ALUNO_MATRICULA"];

                if ($q !== "") {
                    $q = strtolower($q);
                    if (stristr($q, substr($aluno->nome, 0, strlen($q)))) {
                        if ($hint === "") {
                            $hint = $aluno->nome;
                        } else {
                            $hint .= " , $aluno->nome";
                        }
                    }
                }

                $arrayAlunos[] = $aluno;
            }
        }
        return $hint === "" ? "no suggestion" : $hint;
    }

    try{
        $q = $_REQUEST["q"];
        // echo $q;
        echo getAluno($q);  
    }
    catch (Exception $e){
        $msgErro = $e->getMessage();
    }
?>