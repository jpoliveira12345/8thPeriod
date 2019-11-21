var ADEFAULT = 65539;
var MDEFAULT = 1073741824;
var LAMBDA = 10;
var MULTIPLICADORTEMPO = 1000;
var aChegada;
var xNChegada;
var mChegada;
var aSaida;
var xNSaida;
var mSaida;

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

