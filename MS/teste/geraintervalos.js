function createFila( nItensFila ){
    let FILA = [];
    for (i=0;i<nItensFila;i++){
        let ItemFila = new Object();
        ItemFila.horaChegada = i //horaChegada();
        ItemFila.tempoServico = 2*i + 1 //tempoServico();
        ItemFila.tempoEsperaFila = 0;
        ItemFila.tempoOcioso = 0;
        FILA.push(ItemFila);
    }
    return FILA.sort((a, b) => a.horaChegada - b.horaChegada)
}

function horaChegada(  ){
    // TODO: Sortear os tempos, utilizar a entrada do usuário para as distribuições
    // TODO: Desativar os campos quando iniciada a simulação
    return 1;
}

function tempoServico(){
    // TODO: Sortear os tempos, utilizar a entrada do usuário para as distribuições
    return 1;
}

function criaServidor(){
    let servidor = new Object()
    servidor.isFull = false
    servidor.tempoLivre = 0
    servidor.momentoFicaLivre = 0
    servidor.itemFila = null
    return servidor
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

function verResultados(){
    alert("Criar modal com resultados")
}

function comecar() {
    $("#formulario :input").attr("disabled", true)
    tabela.hidden=false
    $('#botao').html('Resultados')
    $('#botao').addClass('btn-primary')
    $('#botao').addClass('btn-success')
    $("#bfCaptchaEntry").click(verResultados())

    const nItensFila = parseInt($('#nClientes').val())
    let fila = createFila(nItensFila)
    let S1 = criaServidor()
    let S2 = criaServidor()
    let tempoTotalEsperaFila = 0
    let clientesEsperaram = 0
    let tempoTotalSimulacao = 0
    let tempoMedioSistema = 0
    let tempo = 0
    let i = 1;

    while ( fila.length !== 0 ){
        if ( S1.momentoFicaLivre <= S2.momentoFicaLivre ){
                // Servidor 1 termina primeiro
                S1.itemFila = fila.shift()
                S1.itemFila.tempoEsperaFila = tempo - S1.itemFila.horaChegada  > 0 ? tempo - S1.itemFila.horaChegada : 0
                S1.momentoFicaLivre = tempo + S1.itemFila.tempoServico
                addOnTable( i + " - S1", S1.itemFila.horaChegada, S1.itemFila.tempoEsperaFila, S1.itemFila.tempoServico, tempo )
                i += 1
        } else {
            // Servidor 2 termina primeiro
            S2.itemFila = fila.shift()
            S2.itemFila.tempoEsperaFila = tempo - S2.itemFila.horaChegada  > 0 ? tempo - S2.itemFila.horaChegada : 0
            S2.momentoFicaLivre = tempo + S2.itemFila.tempoServico
            addOnTable( i + " - S2", S2.itemFila.horaChegada, S2.itemFila.tempoEsperaFila, S2.itemFila.tempoServico, tempo )
            i += 1        
        }
        fila[0].tempoOcioso = tempo;
        tempo = (S1.momentoFicaLivre <= S2.momentoFicaLivre) ?  S1.momentoFicaLivre : S2.momentoFicaLivre
        fila[0].tempoOcioso = tempo - fila[0].tempoOcioso
        if ( fila[0] > 0 )
            this.clientesEsperaram++;
    }
    tempo = (S1.momentoFicaLivre >= S2.momentoFicaLivre) ?  S1.momentoFicaLivre : S2.momentoFicaLivre

}

// function geraSaidaUniforme() {
//     xNSaida = (xNSaida * aSaida) % mSaida;
//     return xNSaida / mSaida;
// }
// function geraSaidaConstante() {
//     let saida = $("#constante-saida").val() ;
//     if(saida){
//         return saida;
//     }
//     return  3;
// }
// function geraSaidaExponencial() {
//     let U = geraSaidaUniforme();
//     return (-1 / LAMBDA) * log(1 - U);
// }

// function geraHoraSaida() {
//     let distribuicaoSaida = $("input[name='tipoSaida']:checked").val();
//     let tempoEntreSaida;
//     aSaida = $("#a-saida").val() | ADEFAULT;
//     mSaida = $("#m-saida").val() | MDEFAULT;
//     switch (distribuicaoSaida) {
//         case 'uniforme':
//             tempoEntreSaida = geraSaidaUniforme();
//             break;
//         case 'constante':
//             tempoEntreSaida = geraSaidaConstante();
//             break;
//         case 'exponencial':
//             tempoEntreSaida = geraSaidaExponencial();
//             break;
//         default:
//             let message = "distribuição de saida não definido";
//             alert(message);
//             throw message;
//     }
//     tempoTotalServico += tempoEntreSaida * MULTIPLICADORTEMPO;
//     return tempoEntreSaida * MULTIPLICADORTEMPO;
// }

