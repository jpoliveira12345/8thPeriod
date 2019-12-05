var nAleatorios = []
var SEED = 7
var MODULO = 32165 
var MULTIPLICADOR = 16807

function createFila( nItensFila ){
    let FILA = [];
    for (i=0;i<nItensFila;i++){
        let ItemFila = new Object();
        ItemFila.horaChegada = horaChegada( i );
        ItemFila.tempoServico =  tempoServico( i );
        ItemFila.tempoEsperaFila = 0;
        ItemFila.tempoOcioso = 0;
        FILA.push(ItemFila);
    }
    return FILA.sort((a, b) => a.horaChegada - b.horaChegada)
}

function horaChegada( i ){
    switch ( $("#dTec").val() ){
        case 'U':
            let a = parseInt($("#a").val())
            let b = parseInt( $("#b").val() )
            return Math.abs(parseInt( a + (b - a) * nAleatorios[i] ))

        case 'C':
            return Math.abs(parseInt((i+1) * parseInt($("#vdcTec").val())))

        case 'E':
            let lambda = parseInt( $("#vdcTec").val() )
            return MULTIPLICADOR * (1 + Math.abs(parseInt(( -1 / lambda ) * ( Math.log( 1 - (nAleatorios[i] / MODULO) ) ))))

        default:
            alert("Erro!!");
            throw message;
    }
}

function tempoServico( i ){
    
    switch ( $("#dTs").val() ){
        case 'U':
            let a = parseInt( $("#a1").val() )
            let b = parseInt( $("#b1").val() )
            return  1 + Math.abs(parseInt( a + (b - a) * nAleatorios[i] ))
        
        case 'C':
            return Math.abs(parseInt((i+1) * parseInt($("#vdcTs").val())))

        case 'E':
            let lambda = parseInt( $("#vdcTs").val() )
            return MULTIPLICADOR * (1 + Math.abs(parseInt( -1 / lambda ) * ( Math.log( 1 - (nAleatorios[i] / MODULO) ) )))

        default:
            alert("Erro!!");
            throw message;
    }
}

function geraVrAleatorios( n ){
    for ( i = 0; i < n ; i++){
        if ( i == 0 )
            nAleatorios[i] =  parseFloat(SEED)
        else
            nAleatorios[i] =  Math.abs((MULTIPLICADOR * nAleatorios[ i-1 ])  % MODULO)
    }
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

function addOnModal( propriedade, valor ){
    var tabela = document.getElementById("tabela-modal")
    var row = tabela.insertRow(-1);
    
    var cell1 = row.insertCell(0);
    cell1.innerHTML = propriedade;
    
    var cell2 = row.insertCell(1);
    cell2.innerHTML = valor;
}

function comecar() {
    $("#formulario :input").attr("disabled", true)
    tabela.hidden=false
    $('#botao').html('Resultados')
    $('#botao').addClass('btn-primary')
    $('#botao').addClass('btn-success')
    $('#botao').attr('data-toggle', 'modal');
    $('#botao').attr('data-target', '#modalCart');
    const nItensFila = parseInt($('#nClientes').val())
    geraVrAleatorios(nItensFila)
    let fila = createFila(nItensFila)
    let S1 = criaServidor()
    let S2 = criaServidor()
    let tempoTotalEsperaFila = 0
    let clientesEsperaram = 0
    let tempoTotalSimulacao = 0
    let tempoTotalServico = 0
    let tempoTotalSistema = 0
    let tempo = 0
    let i = 1;

    while ( fila.length !== 0 ){
        if ( S1.momentoFicaLivre <= S2.momentoFicaLivre ){
            // Servidor 1 termina primeiro
            S1.itemFila = fila.shift()
            S1.itemFila.tempoEsperaFila = tempo - S1.itemFila.horaChegada  > 0 ? tempo - S1.itemFila.horaChegada : 0
            S1.momentoFicaLivre = tempo + S1.itemFila.tempoServico
            tempoTotalEsperaFila += S1.itemFila.tempoEsperaFila
            if ( S1.itemFila.tempoEsperaFila > 0 ) clientesEsperaram++
            tempoTotalServico += S1.itemFila.tempoServico
            tempoTotalSistema += S1.itemFila.tempoServico + S1.itemFila.tempoEsperaFila
            addOnTable( i + " - S1", S1.itemFila.horaChegada, S1.itemFila.tempoEsperaFila, S1.itemFila.tempoServico, S1.itemFila.tempoServico + S1.itemFila.tempoEsperaFila)
            i += 1
        } else {
            // Servidor 2 termina primeiro
            S2.itemFila = fila.shift()
            S2.itemFila.tempoEsperaFila = tempo - S2.itemFila.horaChegada  > 0 ? tempo - S2.itemFila.horaChegada : 0
            S2.momentoFicaLivre = tempo + S2.itemFila.tempoServico
            tempoTotalEsperaFila += S2.itemFila.tempoEsperaFila
            if ( S2.itemFila.tempoEsperaFila > 0 ) clientesEsperaram++
            tempoTotalServico += S2.itemFila.tempoServico
            tempoTotalSistema += S2.itemFila.tempoServico + S2.itemFila.tempoEsperaFila
            addOnTable( i + " - S2", S2.itemFila.horaChegada, S2.itemFila.tempoEsperaFila, S2.itemFila.tempoServico, S2.itemFila.tempoServico + S2.itemFila.tempoEsperaFila )
            i += 1        
        }
        tempo = (S1.momentoFicaLivre <= S2.momentoFicaLivre) ?  S1.momentoFicaLivre : S2.momentoFicaLivre
        if ( fila[0] != undefined ){
            fila[0].tempoOcioso = tempo;
            fila[0].tempoOcioso = tempo - fila[0].tempoOcioso
        }
        if ( fila[0] != undefined && fila[0].tempoOcioso > 0 )
            this.clientesEsperaram++;
    }
    tempo = (S1.momentoFicaLivre >= S2.momentoFicaLivre) ?  S1.momentoFicaLivre : S2.momentoFicaLivre
    tempoTotalSimulacao = tempo
    addOnModal("Tempo total da simulação",tempoTotalSimulacao)
    addOnModal("Tempo médio de espera na fila",tempoTotalEsperaFila/nItensFila)
    addOnModal("Tempo médio de serviço",tempoTotalServico/nItensFila)
    addOnModal("Tempo médio no sistema",tempoTotalSistema/nItensFila)
    addOnModal("Clientes que esperam",clientesEsperaram)
}

