// nome jeito de importar módulos 
import fs from 'fs';

// objeto que conterá o resultado por time
const times = {};

// função que conta mais 1 certo resultado
//  por exemplo maisUmResultado("Flamengo","derrotas") ..
//  significa que o flamengo se laskou mais uma vez kkkk
// sorry, tinha que escolher um time para o exemplo
function maisUmResultado(umTime, resultado) {
  times[umTime][resultado]++;
}

// função que soma mais pontos (3 , 1 ou 0 ) ao
// resultado do time
// adicionar 0 é um truque para "adicionar"
// um novo time ao objetão que tem todos os times
function maisPontos(umTime, pontos) {
  if (!(umTime in times)) { // se o time não estiver lá
    times[umTime] = { // adicionamos o time com tudo zerado
      time: umTime,  // adicionas o nome do time para usar depois no array
      pontos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      partidas: 0,
      golsPro: 0,
      golsContra: 0,
    };
  }
  times[umTime].pontos += pontos; // mais tantos pontos (3 = vit, 1 = emp, 0= derrta)
  times[umTime].partidas += 1; // contamos mais uma partida jogada
  return;
}

// função que soma a qtde de gols ao total de gols contra de um dado time
function maisGolsContra(umTime, qtdeGols) {
  times[umTime].golsContra += qtdeGols; // soma os gols tomados ao total 
  return;
}

// função que soma a qtde de gols ao total de gols feitos por um dado time
function maisGolsPro(umTime, qtdeGols) {
  times[umTime].golsPro += qtdeGols;
}

// aqui começa o programa principal

// carrega as rodadas
// se não for informado o ano, assume-se que é 2006
const qualAno = process.argv[2] || "2006";
// diretorio onde os dados (os arquivos .json) estão guardados
const diretorio = './resultado/';
// calcula o nome do arquivo e carrega ele num array de objetos
const rodadas = JSON.parse(
  fs.readFileSync(`${diretorio}/${qualAno}/${qualAno}.json`)
);

// para cada rodada entre as inúmeras rodadas (no plural)....
for (let rodada of rodadas) {
  // para cada partida da rodada 
  for (let partida of rodada.partidas) {
    // se o placar do visitante for maior que do mandante ...
    if (partida.placar_visitante > partida.placar_mandante) {
      // visitante ganhou! vamos dar 3 pontos para ele
      maisPontos(partida.visitante, 3);
      // mandante perdeu! Dá nota zero pra ele!
      // esse truque é usado para "inserir" o time na const times
      // a medida que vamos encontrando os times nas rodadas
      maisPontos(partida.mandante, 0);
      // contamos a vitória para um e a derrota para o outro
      maisUmResultado(partida.visitante, 'vitorias');
      maisUmResultado(partida.mandante, 'derrotas');
    } else if (partida.placar_mandante > partida.placar_visitante) {
      // mesma coisa que o anterior só que ao inverso
      // não vou comentar de novo né? 
      maisPontos(partida.mandante, 3);
      maisPontos(partida.visitante, 0);
      maisUmResultado(partida.mandante, 'vitorias');
      maisUmResultado(partida.visitante, 'derrotas');
    } else {
      // se chegou aqui então foi empate!
      // um ponto para cada 1
      maisPontos(partida.mandante, 1);
      maisPontos(partida.visitante, 1);
      // mais um empate para cada um
      maisUmResultado(partida.visitante, 'empates');
      maisUmResultado(partida.mandante, 'empates');
    }
    // agora somamos os gols de cada um
    // os gols pro de um é gols contra do outro e vice-versa
    maisGolsPro(partida.mandante, partida.placar_mandante);
    maisGolsPro(partida.visitante, partida.placar_visitante);
    maisGolsContra(partida.mandante, partida.placar_visitante);
    maisGolsContra(partida.visitante, partida.placar_mandante);
  }
}

// quando chegamos nesse ponto, o objeto times tem todos os dados 
// sumarizados por time -> pontos, partidas, vitorias, empates, gols pro, gols contra

// agora vamos classificar pra ver que foi que vencer a bagaça!!!!
// mas antes, temos que converter o objeto times em um array
// para isso usamos Object.values() 
// por isso adicionamos ao objeto time o próprio nome para não perdermos
// essa info quando converter de objeto para array, sacou a manha??
const classificacao = Object.values(times).map((umTime) => {
  // truque!!! manha !! criamos uma "chave" de classificação para dar um sort só 
  umTime.chave =
    String(umTime.pontos).padStart(3, '0') +
    String(umTime.vitorias).padStart(2, '0') +
    String(umTime.partidas).padStart(2, '0') +
    String(umTime.golsPro - umTime.golsContra + 100).padStart(3, '0') +
    String(umTime.golsPro).padStart(3, '0');
  // truque dentro do truque !! para evitar saldo de gols negativo esculhambar
  // o sort adicionamos 100 ao saldo de gols de todos os times
  // assim um time com saldo de gols -8 terá 092 e não -8 na chave
  
  // aproveitamos para calcular o saldo de goals
  umTime.saldoDeGols = umTime.golsPro - umTime.golsContra;
  return umTime;
});

// agora sim ! vamos de fato fazer o sort
classificacao.sort((maior, menor) => menor.chave.localeCompare(maior.chave));

// agora exibir o resultado ... o \n pula uma linha e taca o título 
console.log(`\nResultado do campeonato Brasileiro em ${qualAno}`)
// exibe bonitinho em formato de tabela
// a tela do terminal tem que ficar bem larga ok ? Ou com letrinha pequena
console.table(classificacao);
/// e aqui acaba mais um programa. Obrigado pela paciência e compreensão
