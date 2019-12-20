var nAleatorios = []
var stream = new Random()

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
    
    for (i = 1; i < nItensFila; i++) {
        FILA[i].horaChegada += FILA[i - 1].horaChegada
    }

    return FILA
}

function horaChegada( i ){
    switch ( $("#dTec").val() ){
        case 'U':
            let a = ($("#a").val())
            let b = ( $("#b").val() )
            return Math.abs(( a + (b - a) * nAleatorios[i] ))

        case 'C':
            return Math.abs(((i+1) * ($("#vdcTec").val())))

        case 'E':
            let lambda = ( $("#vdcTec").val() )
            return stream.exponential( 1/lambda )

        default:
            alert("Erro!!");
            throw message;
    }
}

function tempoServico( i ){
    
    switch ( $("#dTs").val() ){
        case 'U':
            let a = ( $("#a1").val() )
            let b = ( $("#b1").val() )
            return  1 + Math.abs(( a + (b - a) * nAleatorios[i] ))
        
        case 'C':
            return Math.abs(((i+1) * ($("#vdcTs").val())))

        case 'E':
            let mi = ( $("#vdcTs").val() )
            return stream.exponential( 1/mi )

        default:
            alert("Erro!!");
            throw message;
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
    let fila = createFila(nItensFila)
    let S1 = criaServidor()
    let lambda = null
    let mi = null
    let ro = null
    let tamanhoFila = 0
    let tempoFila = 0
    
    mi = $("#vdcTs").val()
    lambda = $("#vdcTec").val()
    if ( lambda != null && mi != null ){
        ro = lambda/mi
        if ( ro == 0 || ro >= 1 ){
            alert("Não pode ser aplicado o MM1")
            return
        }
    }

    let tempo = 0
    let i = 1

    while ( fila.length !== 0 ){
        S1.itemFila = fila.shift()
        S1.itemFila.tempoEsperaFila = (tempo - S1.itemFila.horaChegada) > 0 ? tempo - S1.itemFila.horaChegada : 0
        S1.momentoFicaLivre = tempo + S1.itemFila.tempoServico
        i += 1
        tempo = S1.momentoFicaLivre
        tempoFila += S1.itemFila.tempoEsperaFila
        tempoServico += S1.itemFila.tempoServico
        addOnTable( i ,
            ( S1.itemFila.horaChegada).toFixed(2),
             S1.itemFila.tempoEsperaFila.toFixed(2),
            S1.itemFila.tempoServico.toFixed(2),
            (S1.itemFila.tempoServico + S1.itemFila.tempoEsperaFila).toFixed(2))
    }

    if ( lambda != null && mi != null ){
        let l = (lambda/(mi - lambda ))
        addOnModal("L",l.toFixed(2))
        lq = l - ro
        addOnModal("Lq", lq.toFixed(2) )
        addOnModal("Ls", ro.toFixed(2) )
        addOnModal("W", (l / lambda).toFixed(2) )
        addOnModal("Wq", (lq / lambda).toFixed(2))
        addOnModal("Ws", (ro / lambda).toFixed(2) )
    }
    addOnModal("L  calculado", nItensFila)
    addOnModal("Lq calculado", (nItensFila/tempo).toFixed(2) )
    addOnModal("Ls calculado", (nItensFila/tempo).toFixed(2) )
    addOnModal("W  calculado", tempo.toFixed(2))
    addOnModal("Wq calculado", (tempoFila/nItensFila).toFixed(2) )
    addOnModal("Ws calculado", (tempoServico/nItensFila).toFixed(2) )
}

