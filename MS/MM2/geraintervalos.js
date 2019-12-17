var nAleatorios = []
var MODULO = 32165
var MULTIPLICADOR = 16807
var quantidadeServidores = 2

function createFila(nItensFila) {
    let FILA = [];
    for (i = 0; i < nItensFila; i++) {
        let ItemFila = new Object();
        ItemFila.horaChegada = horaChegada(i);
        ItemFila.tempoServico = tempoServico(i);
        ItemFila.tempoEsperaFila = 0;
        ItemFila.tempoOcioso = 0;
        FILA.push(ItemFila);
    }
    //faz com que a chegada do próximo seja somente após horaChegada unidades de tempo depois da chegada anterior   
    for (i = 1; i < nItensFila; i++) {
        FILA[i].horaChegada += FILA[i - 1].horaChegada
    }

    return FILA
}

function horaChegada(i) {
    switch ($("#dTec").val()) {
        case 'U':
            let a = parseInt($("#a").val())
            let b = parseInt($("#b").val())
            return Math.abs(parseInt(a + (b - a) * nAleatorios[i] / MODULO))

        case 'C':
            return Math.abs(parseInt($("#vdcTec").val()))

        case 'E':
            let lambda = parseInt($("#vdcTec").val())
            return (-1 / lambda) * Math.log(1 - nAleatorios[i] / MODULO)

        default:
            alert("Erro!!");
            throw message;
    }
}

function tempoServico(i) {

    switch ($("#dTs").val()) {
        case 'U':
            let a = parseInt($("#a1").val())
            let b = parseInt($("#b1").val())
            return Math.abs(parseInt(a + (b - a) * nAleatorios[i] / MODULO))

        case 'C':
            return Math.abs(parseInt($("#vdcTs").val()))

        case 'E':
            let lambda = parseInt($("#vdcTs").val())
            return (-1 / lambda) * Math.log(1 - nAleatorios[i] / MODULO)

        default:
            alert("Erro!!");
            throw message;
    }
}

function geraVrAleatorios(n) {
    for (i = 0; i < n; i++) {
        if (i == 0)
            nAleatorios[i] = parseFloat(Date.now() % MODULO)
        else
            nAleatorios[i] = Math.abs((MULTIPLICADOR * nAleatorios[i - 1]) % MODULO)
    }
}

function criaServidor() {
    let servidor = new Object()
    servidor.isFull = false
    servidor.tempoLivre = 0
    servidor.momentoFicaLivre = 0
    servidor.itemFila = null
    return servidor
}

function init(servidor, duracaoAtendimento) {
    servidor.duracaoAtendimento = duracaoAtendimento;
}
function addOnTable(cliente, horaChegada, tempoFila, tempoServico, tempoSistema) {
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

function addOnModal(propriedade, valor) {
    var tabela = document.getElementById("tabela-modal")
    var row = tabela.insertRow(-1);

    var cell1 = row.insertCell(0);
    cell1.innerHTML = propriedade;

    var cell2 = row.insertCell(1);
    cell2.innerHTML = valor;
}

function comecar() {
    $("#formulario :input").attr("disabled", true)
    tabela.hidden = false
    $('#botao').html('Resultados')
    $('#botao').addClass('btn-primary')
    $('#botao').addClass('btn-success')
    $('#botao').attr('data-toggle', 'modal');
    $('#botao').attr('data-target', '#modalCart');
    const nItensFila = parseInt($('#nClientes').val())
    geraVrAleatorios(nItensFila)
    let fila = createFila(nItensFila)
    let S = []
    let tempoTotalEsperaFila = 0
    let clientesEsperaram = 0
    let tempoTotalSimulacao = 0
    let tempoTotalServico = 0
    let tempoTotalSistema = 0
    let tempo = 0
    let i = 1;
    for (let j = 0; j < quantidadeServidores; j++) {
        S.push(criaServidor())
    }
    let Si = S[0];

    while (fila.length !== 0) {
        // S[iPrimeiro] é o primeiro servidor a terminar de servir
        let iPrimeiro = argminTempo(S)
        Si = S[iPrimeiro];

        tempo = Si.momentoFicaLivre
        Si.itemFila = fila.shift()
        Si.itemFila.tempoEsperaFila = tempo - Si.itemFila.horaChegada > 0 ? tempo - Si.itemFila.horaChegada : 0
        Si.momentoFicaLivre = tempo + Si.itemFila.tempoServico
        if (Si.itemFila.tempoEsperaFila > 0) {
            tempoTotalEsperaFila += Si.itemFila.tempoEsperaFila
            clientesEsperaram++
        }
        tempoTotalServico += Si.itemFila.tempoServico
        tempoTotalSistema += Si.itemFila.tempoServico + Si.itemFila.tempoEsperaFila
        addOnTable(i + " - S" + (iPrimeiro + 1), Si.itemFila.horaChegada, Si.itemFila.tempoEsperaFila, Si.itemFila.tempoServico, Si.itemFila.tempoServico + Si.itemFila.tempoEsperaFila)
        i++

    }
    // dada a aleatoriedade, o último a colocar em serviço, pode não ser o último a sair
    // assim, justifica-se a procurar tal item usando argmaxTempo()
    Si = S[argmaxTempo(S)]
    tempo = Si.momentoFicaLivre
    tempoTotalSimulacao = tempo
    addOnModal("Tempo total da simulação", tempoTotalSimulacao)
    addOnModal("Tempo médio de espera na fila", tempoTotalEsperaFila / nItensFila)
    addOnModal("Tempo médio de serviço", tempoTotalServico / nItensFila)
    addOnModal("Tempo médio no sistema", tempoTotalSistema / nItensFila)
    addOnModal("Clientes que esperam", clientesEsperaram)
}

function histograma() {
    const nItensFila = parseInt($('#nClientes').val())
    geraVrAleatorios(nItensFila)
    let umDecimo = 0, doisDecimos = 0, tresDecimos = 0, quatroDecimos = 0,
        cincoDecimos = 0, seisDecimos = 0, seteDecimos = 0, oitoDecimos = 0,
        noveDecimos = 0, umInteiro = 0, maiorqueUm = 0
    for (let i = 0; i < nItensFila; i++) {
        let tempo = tempoServico(i)
        if (tempo < .1) {
            umDecimo++
        }
        else if (tempo < .2) {
            doisDecimos++
        }
        else if (tempo < .3) {
            tresDecimos++
        }
        else if (tempo < .4) {
            quatroDecimos++
        }
        else if (tempo < .5) {
            cincoDecimos++
        }
        else if (tempo < .6) {
            seisDecimos++
        }
        else if (tempo < .7) {
            seteDecimos++
        }
        else if (tempo < .8) {
            oitoDecimos++
        }
        else if (tempo < .9) {
            noveDecimos++
        }
        else if (tempo < 1) {
            umInteiro++
        }
        else {
            maiorqueUm++
        }
    }
    console.log("um décimo", umDecimo)
    console.log("dois décimos ", doisDecimos)
    console.log("três décimos", tresDecimos)
    console.log("quatro décimos", quatroDecimos)
    console.log("cinco décimos", cincoDecimos)
    console.log("seis décimos", seisDecimos)
    console.log("sete décimos", seteDecimos)
    console.log("oito décimos", oitoDecimos)
    console.log("nove décimos", noveDecimos)
    console.log("um inteiro", umInteiro)
    console.log("maior que um", maiorqueUm)
}

function argminTempo(S) {
    let menor = 0
    for (let i = 0; i < S.length; i++) {
        if (S[i].momentoFicaLivre < S[menor].momentoFicaLivre) {
            menor = i
        }
    }
    return menor
}
function argmaxTempo(S) {
    let maior = 0
    for (let i = 0; i < S.length; i++) {
        if (S[i].momentoFicaLivre > S[maior].momentoFicaLivre) {
            maior = i
        }
    }
    return maior
}