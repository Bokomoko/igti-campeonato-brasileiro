import fs from 'fs';

const times = {};

function maisPontos(umTime, pontos) {
  if (!(umTime in times)) {
    times[umTime] = {
      pontos: 0,
      partidas: 0,
      golsPro: 0,
      golsContra: 0,
      time: umTime,
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
const rodadas = JSON.parse(fs.readFileSync('./2003.json'));

for (let rodada of rodadas) {
  for (let partida of rodada.partidas) {
    if (partida.placar_visitante > partida.placar_mandante) {
      maisPontos(partida.visitante, 3);
      maisPontos(partida.mandante, 0);
    } else if (partida.placar_mandante > partida.placar_visitante) {
      maisPontos(partida.mandante, 3);
      maisPontos(partida.visitante, 0);
    } else {
      maisPontos(partida.mandante, 1);
      maisPontos(partida.visitante, 1);
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
    (umTime.partidas + '').padStart(2, '0') +
    (umTime.golsPro - umTime.golsContra + 100 + '').padStart(3, '0') +
    (umTime.golsPro + '').padStart(2, '0');
  return umTime;
});

classificacao.sort((maior, menor) => menor.chave.localeCompare(maior.chave));

console.table(classificacao);
