function createFila( nItensFila ){
    let FILA = [];
    for (i=0;i<nItensFila;i++){
        let ItemFila = new Object();
        ItemFila.horaChegada = horaChegada();
        ItemFila.tempoServico = tempoServico();
        FILA.push(ItemFila);
    }
    return FILA.sort((a, b) => b.horaChegada - a.horaChegada)
}

function horaChegada(  ){
    // TODO: Sortear os tempos, utilizar a entrada do usuário para as distribuições
    // TODO: Desativar os campos quando iniciada a simulação
}

function tempoServico(){
    // TODO: Sortear os tempos, utilizar a entrada do usuário para as distribuições
}

function criaServidor(){
    let servidor = new Object();
    servidor.
    return servidor;
}

function init(servidor, duracaoAtendimento){
    servidor.duracaoAtendimento = duracaoAtendimento;
}

function addOnTable( cliente, horaChegada, tempoFila, tempoServico, tempoSistema ){
    var tabela = document.getElementById("tabela")
    var row = tabela.insertRow(-1);

    var cell1 = row.insertCell(0);
    cell1.innerHTML = cliente;
    
    var cell2 = row.insertCell(1);
    cell2.innerHTML = horaChegada;

    var cell3 = row.insertCell(2);
    cell3.innerHTML = tempoFila;

    var cell4 = row.insertCell(3);
    cell4.innerHTML = tempoServico;

    var cell5 = row.insertCell(4);
    cell5.innerHTML = tempoSistema;
}

function comecar(button) {
    button.innerHTML = "FINALIZAR SIMULAÇÃO"
    button.setAttribute( "onClick", "javascript: finalizar(this);" );
    ES = estado.LIVRE;
    FILA = [];
    horarioLivreInicio = Date.now();
    horarioLivreTotal = 0;
    window.setTimeout(geraChegada, geraHoraChegada());
    fim = false;
    totalPessoas = 0;
    horarioInicioSimulacao = Date.now();
    pessoasQueNaoEsperaram = 0;
    tempoTotalFila = 0;
    tempoTotalServico = 0;
    xNChegada = 1;
    xNSaida = 1;
    clienteID = 0;
}

function finalizar(button) {
    fim = true;
    button.innerHTML = "INICIAR SIMULAÇÃO"
    button.setAttribute( "onClick", "javascript: comecar(this);" );
}

function geraChegada() {
    if (fim === false) {
        let pessoa = new ItemFila(Date.now(), geraHoraSaida());
        FILA.push(pessoa);
        if (ES == estado.LIVRE) {
            ES = estado.OCUPADO;
            pessoasQueNaoEsperaram++;
            horarioLivreTotal += Date.now() - horarioLivreInicio
            processaSaida();
        }

        totalPessoas++;
        window.setTimeout(geraChegada, geraHoraChegada());
    } else {
        if (FILA.length == 0) {
            geraTabelaFinal();
        }

    }
}

function processaSaida() {
    let chegada;
    if (FILA.length > 0) {
        chegada = FILA.shift();
        window.setTimeout(processaSaida, chegada.tempoServico + 1);
        window.setTimeout(geraSaida, chegada.tempoServico, chegada);

    } else {
        ES = estado.LIVRE;
        horarioLivreInicio = Date.now();
    }
}
function geraSaida(pessoa) {
    let now = Date.now();
    let tempoParcialSitema = now - pessoa.chegada;
    if (tempoParcialSitema < pessoa.tempoServico) {
        console.error("deu ruim");
    }
    let tempoParcialFila = Math.round((tempoParcialSitema - pessoa.tempoServico)/1000);
    tempoTotalFila += tempoParcialFila; 
    let tempoServico = Math.round(pessoa.tempoServico/1000);

    addOnTable(clienteID++, new Date(pessoa.chegada).toUTCString(),tempoParcialFila, tempoServico, tempoParcialFila + tempoServico )
    if (FILA.length == 0 && fim === true) {
        geraTabelaFinal();
    }
}


function geraTabelaFinal(){
    let tempoMedioEspera = tempoTotalFila / tempoTotal;
    let probClienteEsperar = pessoasQueEsperaram * 100 / totalPessoas;
    let probOpLivrem =  horarioLivreTotal * 100 / tempoTotal;
    // let tempoMedioEspera = tempoTotalServico / tempoTotal;
    let tempoMedioSistema = (tempoTotalFila + tempoTotalServico) / tempoTotal;

    $("#conteudo").append("<p>","Tempo médio de espera: ", tempoMedioEspera,"</p>")
    $("#conteudo").append("<p>","Probabilidade do cliente Esperar: ", tempoMedioEspera,"</p>")
    $("#conteudo").append("<p>","Probabilidade do operador estar livre: ", tempoMedioEspera,"</p>")
    $("#conteudo").append("<p>","Tempo médio de serviço: ", tempoMedioEspera,"</p>")
    $("#conteudo").append("<p>","Tempo médio no sistema: ", tempoMedioEspera,"</p>")
    $("#conteudo").append("<br>")
}

function geraChegadaUniforme() {
    xNChegada = (xNChegada * aChegada) % mChegada;
    //return xNChegada / mChegada;
    return parseInt(Math.random() * 10);
}
function geraChegadaConstante() {
    let chegada =  $("#constante-chegada").val();
    if(chegada){
        return chegada;
    }
    return 7;
}
function geraChegadaExponencial() {
    let U = geraSaidaUniforme();
    return (-1 / LAMBDA) * log(1 - U);
}

function geraHoraChegada() {
    let distribuicaoChegada = $("input[name='tipoChegada']:checked").val();
    let tempoEntreChegada;
    aChegada = $("#a-chegada").val() | ADEFAULT;
    mChegada = $("#m-chegada").val() | MDEFAULT;
    switch (distribuicaoChegada) {
        case 'uniforme':
            tempoEntreChegada = geraChegadaUniforme();
            break;
        case 'constante':
            tempoEntreChegada = geraChegadaConstante();
            break;
        case 'exponencial':
            tempoEntreChegada = geraChegadaExponencial();
            break;
        default:
            let message = "distribuição de chegada não definido";
            alert(message);
            throw message;
    }

    // console.log("tempo entre chegadas ", tempoEntreChegada);
    return tempoEntreChegada * MULTIPLICADORTEMPO;
}

function geraSaidaUniforme() {
    xNSaida = (xNSaida * aSaida) % mSaida;
    return xNSaida / mSaida;
}
function geraSaidaConstante() {
    let saida = $("#constante-saida").val() ;
    if(saida){
        return saida;
    }
    return  3;
}
function geraSaidaExponencial() {
    let U = geraSaidaUniforme();
    return (-1 / LAMBDA) * log(1 - U);
}

function geraHoraSaida() {
    let distribuicaoSaida = $("input[name='tipoSaida']:checked").val();
    let tempoEntreSaida;
    aSaida = $("#a-saida").val() | ADEFAULT;
    mSaida = $("#m-saida").val() | MDEFAULT;
    switch (distribuicaoSaida) {
        case 'uniforme':
            tempoEntreSaida = geraSaidaUniforme();
            break;
        case 'constante':
            tempoEntreSaida = geraSaidaConstante();
            break;
        case 'exponencial':
            tempoEntreSaida = geraSaidaExponencial();
            break;
        default:
            let message = "distribuição de saida não definido";
            alert(message);
            throw message;
    }
    tempoTotalServico += tempoEntreSaida * MULTIPLICADORTEMPO;
    return tempoEntreSaida * MULTIPLICADORTEMPO;
}

