const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  let totalFatura = 0;
  let creditos = 0;
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  const formato = new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    minimumFractionDigits: 2
  }).format;

  for (let apre of fatura.apresentacoes) {
    const peca = pecas[apre.id];
    const total = calcularTotal(apre, peca);
    creditos += calcularCreditos(apre, peca);

    faturaStr += gerarLinha(apre, peca, total, formato);
    totalFatura += total;
  }

  faturaStr += `Valor total: ${formato(totalFatura / 100)}\n`;
  faturaStr += `Créditos acumulados: ${creditos} \n`;
  return faturaStr;
}

function calcularTotal(apre, peca) {
  let total = 0;
  switch (peca.tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) {
        total += 10000 + 500 * (apre.audiencia - 20);
      }
      total += 300 * apre.audiencia;
      break;
    default:
      throw new Error(`Peça desconhecida: ${peca.tipo}`);
  }
  return total;
}

function calcularCreditos(apre, peca) {
  let creditos = Math.max(apre.audiencia - 30, 0);
  if (peca.tipo === "comedia") {
    creditos += Math.floor(apre.audiencia / 5);
  }
  return creditos;
}

function gerarLinha(apre, peca, total, formato) {
  return `  ${peca.nome}: ${formato(total / 100)} (${apre.audiencia} assentos)\n`;
}

// Leitura dos arquivos e execução
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
