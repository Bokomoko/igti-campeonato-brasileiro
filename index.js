import fs from 'fs';

const times = {};

function maisUmResultado(umTime, resultado) {
  times[umTime][resultado]++;
}
function maisPontos(umTime, pontos) {
  if (!(umTime in times)) {
    times[umTime] = {
      time: umTime,
      pontos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      partidas: 0,
      golsPro: 0,
      golsContra: 0,
    };
  }
  times[umTime].pontos += pontos;
  times[umTime].partidas += 1;
  return;
}

function maisGolsContra(umTime, qtdeGols) {
  times[umTime].golsContra += qtdeGols;
  return;
}

function maisGolsPro(umTime, qtdeGols) {
  times[umTime].golsPro += qtdeGols;
}

// aqui começa o programa principal

// carrega as rodadas

const qualAno = process.argv[2] || "2006";
const diretorio = './resultado/';
const rodadas = JSON.parse(
  fs.readFileSync(`${diretorio}/${qualAno}/${qualAno}.json`)
);

for (let rodada of rodadas) {
  for (let partida of rodada.partidas) {
    if (partida.placar_visitante > partida.placar_mandante) {
      maisPontos(partida.visitante, 3);
      maisPontos(partida.mandante, 0);
      maisUmResultado(partida.visitante, 'vitorias');
      maisUmResultado(partida.mandante, 'derrotas');
    } else if (partida.placar_mandante > partida.placar_visitante) {
      maisPontos(partida.mandante, 3);
      maisPontos(partida.visitante, 0);
      maisUmResultado(partida.mandante, 'vitorias');
      maisUmResultado(partida.visitante, 'derrotas');
    } else {
      maisPontos(partida.mandante, 1);
      maisPontos(partida.visitante, 1);
      maisUmResultado(partida.visitante, 'empates');
      maisUmResultado(partida.mandante, 'empates');
    }
    maisGolsPro(partida.mandante, partida.placar_mandante);
    maisGolsPro(partida.visitante, partida.placar_visitante);
    maisGolsContra(partida.mandante, partida.placar_visitante);
    maisGolsContra(partida.visitante, partida.placar_mandante);
  }
}

const classificacao = Object.values(times).map((umTime) => {
  umTime.chave =
    (umTime.pontos + '').padStart(3, '0') +
    (umTime.vitorias + '').padStart(2, '0') +
    (umTime.partidas + '').padStart(2, '0') +
    (umTime.golsPro - umTime.golsContra + 100 + '').padStart(3, '0') +
    (umTime.golsPro + '').padStart(3, '0');
  umTime.saldoDeGols = umTime.golsPro - umTime.golsContra;
  return umTime;
});

classificacao.sort((maior, menor) => menor.chave.localeCompare(maior.chave));

console.log(`\nResultado do campeonato Brasileiro em ${qualAno}`)
console.table(classificacao);
