// Pode ser acessado em: http://jpveira.dx.am/atividadeAJAX/
function loadDoc( str ) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", "getAluno.php?q=" + str, true);
    xmlhttp.onload = function (){
        if (xmlhttp.status == 200){
            console.log( xmlhttp.responseText );
            document.getElementById("demo").innerHTML = xmlhttp.responseText;
        }
        else{
            alert("Ocorreu um erro ao processar a requisição: " + xmlhttp.status + xmlhttp.responseText);
        }
    };

    xmlhttp.onerror = function (){
        alert("Ocorreu um erro ao processar a requisição");
    };

    xmlhttp.send();
}