#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs");
const path = require("path");

// ─── Configurações ────────────────────────────────────────────────────────────
const MAX_ERROS = 6;
const ARQUIVO_RANKING = path.join(__dirname, "ranking.json");

// ─── Banco de Palavras ─────────────────────────────────────────────────────────
const bancoPalavras = {
  Tecnologia: [
    { palavra: "JAVASCRIPT", dica: "Linguagem de programação da web" },
    { palavra: "ALGORITMO", dica: "Sequência de instruções para resolver um problema" },
    { palavra: "VARIAVEL", dica: "Espaço na memória para guardar um valor" },
    { palavra: "FRAMEWORK", dica: "Estrutura que facilita o desenvolvimento de software" },
    { palavra: "RECURSAO", dica: "Função que chama a si mesma" },
    { palavra: "COMPILADOR", dica: "Transforma código fonte em código executável" },
    { palavra: "INTERFACE", dica: "Ponto de interação entre sistemas" },
  ],
  Animais: [
    { palavra: "ORNITORRINCO", dica: "Mamífero que bota ovos e tem bico de pato" },
    { palavra: "CAPIVARA", dica: "Maior roedor do mundo, muito comum no Brasil" },
    { palavra: "PINGUIM", dica: "Ave que não voa e vive em regiões frias" },
    { palavra: "GAVIAO", dica: "Ave de rapina com visão aguçada" },
    { palavra: "ARIRANHA", dica: "Lontra gigante ameaçada de extinção" },
    { palavra: "TAMANDUÁ", dica: "Animal que se alimenta de formigas" },
    { palavra: "JAGUATIRICA", dica: "Felino selvagem brasileiro" },
  ],
  Frutas: [
    { palavra: "MARACUJA", dica: "Fruta usada em sucos e sobremesas, sabor azedo-doce" },
    { palavra: "JABUTICABA", dica: "Fruta roxa que nasce direto no tronco da árvore" },
    { palavra: "PITANGA", dica: "Frutinha vermelha típica do Nordeste do Brasil" },
    { palavra: "CARAMBOLA", dica: "Fruta que tem formato de estrela quando cortada" },
    { palavra: "GRAVIOLA", dica: "Fruta tropical com polpa branca e espinhos na casca" },
    { palavra: "CUPUACU", dica: "Fruta amazônica parente do cacau" },
    { palavra: "CAMBUCI", dica: "Fruta verde de sabor ácido típica da Mata Atlântica" },
  ],
};

const categorias = Object.keys(bancoPalavras);

// ─── Arte ASCII da Forca ───────────────────────────────────────────────────────
function desenharForca(erros) {
  const partes = [
    "     O    ",
    "    /|\\   ",
    "    / \\   ",
  ];
  const forcas = [
    `
  +---+
  |   |
      |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`,
  ];
  return forcas[erros] || forcas[MAX_ERROS];
}

// ─── Normalização ──────────────────────────────────────────────────────────────
function normalizarLetra(letra) {
  return letra
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ─── Seleção aleatória ─────────────────────────────────────────────────────────
function sortearItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// ─── Exibição da palavra ───────────────────────────────────────────────────────
function exibirPalavra(palavra, letrasAcertadas) {
  return palavra
    .split("")
    .map((letra) => (letrasAcertadas.includes(normalizarLetra(letra)) ? letra : "_"))
    .join(" ");
}

// ─── Verificar vitória ─────────────────────────────────────────────────────────
function verificarVitoria(palavra, letrasAcertadas) {
  return palavra
    .split("")
    .every((letra) => letrasAcertadas.includes(normalizarLetra(letra)));
}

// ─── Calcular pontuação ────────────────────────────────────────────────────────
function calcularPontuacao(palavra, erros, usouDica, tentativasRestantes) {
  const baseLetra = 10;
  const bonusTentativa = 5;
  const penalDica = 30;

  let pontos = palavra.length * baseLetra;
  pontos += tentativasRestantes * bonusTentativa;
  if (usouDica) pontos = Math.max(0, pontos - penalDica);
  return pontos;
}

// ─── Ranking ───────────────────────────────────────────────────────────────────
function carregarRanking() {
  try {
    if (fs.existsSync(ARQUIVO_RANKING)) {
      return JSON.parse(fs.readFileSync(ARQUIVO_RANKING, "utf-8"));
    }
  } catch (_) {}
  return [];
}

function salvarRanking(ranking) {
  fs.writeFileSync(ARQUIVO_RANKING, JSON.stringify(ranking, null, 2), "utf-8");
}

function registrarPontuacao(nome, pontuacao) {
  const ranking = carregarRanking();
  ranking.push({ nome, pontuacao, data: new Date().toLocaleDateString("pt-BR") });
  ranking.sort((a, b) => b.pontuacao - a.pontuacao);
  salvarRanking(ranking.slice(0, 20)); // mantém top 20
}

function exibirRanking() {
  const ranking = carregarRanking();
  if (ranking.length === 0) {
    console.log("\n  Ainda não há pontuações registradas.\n");
    return;
  }
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║         🏆 RANKING DOS MELHORES      ║");
  console.log("╠══════════════════════════════════════╣");
  ranking.slice(0, 10).forEach((entrada, i) => {
    const pos = String(i + 1).padStart(2, " ");
    const nome = entrada.nome.substring(0, 15).padEnd(15, " ");
    const pts = String(entrada.pontuacao).padStart(5, " ");
    console.log(`║  ${pos}. ${nome}  ${pts} pts  ║`);
  });
  console.log("╚══════════════════════════════════════╝\n");
}

// ─── Interface readline ────────────────────────────────────────────────────────
function criarInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function perguntar(rl, pergunta) {
  return new Promise((resolve) => rl.question(pergunta, resolve));
}

// ─── Limpar tela ───────────────────────────────────────────────────────────────
function limparTela() {
  console.clear();
}

// ─── Cabeçalho ─────────────────────────────────────────────────────────────────
function exibirCabecalho(nomeJogador = "", modo2j = false, jogadorAtual = 1) {
  limparTela();
  console.log("╔══════════════════════════════════════╗");
  console.log("║         💀 JOGO DA FORCA  💀         ║");
  console.log("╚══════════════════════════════════════╝");
  if (nomeJogador) {
    if (modo2j) {
      console.log(`  Vez do Jogador ${jogadorAtual}: ${nomeJogador}`);
    } else {
      console.log(`  Jogador: ${nomeJogador}`);
    }
  }
  console.log();
}

// ─── Rodada principal ──────────────────────────────────────────────────────────
async function jogarRodada(rl, nomeJogador, categoriaEscolhida, modo2j = false, jogadorAtual = 1) {
  // seleciona palavra
  const categoria =
    categoriaEscolhida === "ALEATORIA"
      ? sortearItem(categorias)
      : categoriaEscolhida;

  const item = sortearItem(bancoPalavras[categoria]);
  const palavraNormalizada = item.palavra
    .split("")
    .map(normalizarLetra)
    .join("");

  let letrasAcertadas = [];
  let letrasErradas = [];
  let erros = 0;
  let usouDica = false;

  while (erros < MAX_ERROS) {
    exibirCabecalho(nomeJogador, modo2j, jogadorAtual);

    console.log(desenharForca(erros));
    console.log();
    console.log(`  Categoria: ${categoria}`);
    console.log();
    console.log(`  Palavra: ${exibirPalavra(palavraNormalizada, letrasAcertadas)}`);
    console.log();

    if (letrasErradas.length > 0) {
      console.log(`  Letras erradas: ${letrasErradas.join(", ")}`);
    }
    if (letrasAcertadas.length > 0) {
      console.log(`  Letras acertadas: ${letrasAcertadas.join(", ")}`);
    }

    const tentativasRestantes = MAX_ERROS - erros;
    console.log(`  Erros restantes: ${tentativasRestantes}`);
    console.log();
    console.log(`  [ENTER] Chutar letra  |  [D] Pedir dica  |  [S] Sair`);
    console.log();

    const entrada = (await perguntar(rl, "  Sua jogada: ")).trim().toUpperCase();

    if (entrada === "S") {
      console.log("\n  Até logo!\n");
      rl.close();
      process.exit(0);
    }

    if (entrada === "D") {
      if (usouDica) {
        console.log("\n  Você já usou a dica nessa rodada!\n");
        await perguntar(rl, "  Pressione ENTER para continuar...");
        continue;
      }
      usouDica = true;
      erros++; // penalidade: -1 tentativa
      exibirCabecalho(nomeJogador, modo2j, jogadorAtual);
      console.log(desenharForca(erros));
      console.log();
      console.log(`  💡 DICA: ${item.dica}`);
      console.log(`  (Penalidade: -1 tentativa e -30 pts na pontuação final)`);
      console.log();
      await perguntar(rl, "  Pressione ENTER para continuar...");
      continue;
    }

    if (entrada.length !== 1 || !/[A-ZÀ-Ú]/.test(entrada)) {
      console.log("\n  Digite apenas uma letra válida!\n");
      await perguntar(rl, "  Pressione ENTER para continuar...");
      continue;
    }

    const letraNorm = normalizarLetra(entrada);

    if (letrasAcertadas.includes(letraNorm) || letrasErradas.includes(letraNorm)) {
      console.log("\n  Você já tentou essa letra!\n");
      await perguntar(rl, "  Pressione ENTER para continuar...");
      continue;
    }

    if (palavraNormalizada.includes(letraNorm)) {
      letrasAcertadas.push(letraNorm);
      if (verificarVitoria(palavraNormalizada, letrasAcertadas)) {
        break; // vitória
      }
    } else {
      letrasErradas.push(letraNorm);
      erros++;
    }
  }

  // ─── Fim da rodada ─────────────────────────────────────────────────────────
  const vitoria = erros < MAX_ERROS;
  const tentativasRestantes = MAX_ERROS - erros;
  const pontuacao = vitoria
    ? calcularPontuacao(palavraNormalizada, erros, usouDica, tentativasRestantes)
    : 0;

  exibirCabecalho(nomeJogador, modo2j, jogadorAtual);
  console.log(desenharForca(erros));
  console.log();

  if (vitoria) {
    console.log("  🎉 PARABÉNS! Você venceu!\n");
  } else {
    console.log("  💀 GAME OVER! Você perdeu!\n");
  }

  console.log(`  Jogador   : ${nomeJogador}`);
  console.log(`  Palavra   : ${item.palavra}`);
  console.log(`  Resultado : ${vitoria ? "VITÓRIA 🏆" : "DERROTA 💀"}`);
  console.log(`  Pontuação : ${pontuacao} pts`);
  if (usouDica) console.log("  (Dica utilizada: -30 pts)");
  console.log();

  if (vitoria) {
    registrarPontuacao(nomeJogador, pontuacao);
  }

  return { vitoria, pontuacao };
}

// ─── Escolher categoria ────────────────────────────────────────────────────────
async function escolherCategoria(rl) {
  console.log("  Categorias disponíveis:");
  categorias.forEach((cat, i) => console.log(`   ${i + 1}. ${cat}`));
  console.log(`   ${categorias.length + 1}. Aleatória`);
  console.log();

  while (true) {
    const resp = (await perguntar(rl, "  Escolha uma categoria: ")).trim();
    const num = parseInt(resp);
    if (num >= 1 && num <= categorias.length) return categorias[num - 1];
    if (num === categorias.length + 1) return "ALEATORIA";
    console.log("  Opção inválida. Tente novamente.");
  }
}

// ─── Menu principal ────────────────────────────────────────────────────────────
async function menuPrincipal() {
  const rl = criarInterface();

  while (true) {
    exibirCabecalho();
    console.log("  1. Jogar (1 jogador)");
    console.log("  2. Jogar (2 jogadores)");
    console.log("  3. Ver ranking");
    console.log("  4. Sair");
    console.log();

    const opcao = (await perguntar(rl, "  Escolha: ")).trim();

    if (opcao === "4") {
      console.log("\n  Até logo! 👋\n");
      rl.close();
      process.exit(0);
    }

    if (opcao === "3") {
      exibirCabecalho();
      exibirRanking();
      await perguntar(rl, "  Pressione ENTER para voltar...");
      continue;
    }

    if (opcao === "1") {
      // ── Modo 1 jogador ────────────────────────────────────────────────────
      exibirCabecalho();
      const nome = (await perguntar(rl, "  Seu nome: ")).trim() || "Jogador";
      let placarTotal = 0;
      let rodada = 1;

      while (true) {
        exibirCabecalho(nome);
        console.log(`  Rodada ${rodada}  |  Placar acumulado: ${placarTotal} pts\n`);
        const categoria = await escolherCategoria(rl);
        const { vitoria, pontuacao } = await jogarRodada(rl, nome, categoria);
        placarTotal += pontuacao;

        console.log(`  Placar acumulado: ${placarTotal} pts\n`);
        const novamente = (await perguntar(rl, "  Jogar novamente? (S/N): "))
          .trim()
          .toUpperCase();
        if (novamente !== "S") break;
        rodada++;
      }

      console.log(`\n  Fim de jogo! Placar final: ${placarTotal} pts\n`);
      await perguntar(rl, "  Pressione ENTER para voltar ao menu...");
      continue;
    }

    if (opcao === "2") {
      // ── Modo 2 jogadores ──────────────────────────────────────────────────
      exibirCabecalho();
      console.log("  ── Modo 2 Jogadores ──\n");
      const nome1 = (await perguntar(rl, "  Nome do Jogador 1: ")).trim() || "Jogador 1";
      const nome2 = (await perguntar(rl, "  Nome do Jogador 2: ")).trim() || "Jogador 2";

      let placar = { [nome1]: 0, [nome2]: 0 };
      let rodada = 1;

      while (true) {
        exibirCabecalho();
        console.log(`  🎮 Rodada ${rodada}\n`);
        console.log(`  ${nome1}: ${placar[nome1]} pts  |  ${nome2}: ${placar[nome2]} pts\n`);

        // vez do jogador 1
        exibirCabecalho(nome1, true, 1);
        console.log(`  Rodada ${rodada} — vez do ${nome1}\n`);
        const cat1 = await escolherCategoria(rl);
        const res1 = await jogarRodada(rl, nome1, cat1, true, 1);
        placar[nome1] += res1.pontuacao;
        await perguntar(rl, "\n  Passe o controle para o Jogador 2. ENTER para continuar...");

        // vez do jogador 2
        exibirCabecalho(nome2, true, 2);
        console.log(`  Rodada ${rodada} — vez do ${nome2}\n`);
        const cat2 = await escolherCategoria(rl);
        const res2 = await jogarRodada(rl, nome2, cat2, true, 2);
        placar[nome2] += res2.pontuacao;

        // placar da rodada
        exibirCabecalho();
        console.log(`  ── Placar após a Rodada ${rodada} ──\n`);
        console.log(`  ${nome1}: ${placar[nome1]} pts`);
        console.log(`  ${nome2}: ${placar[nome2]} pts\n`);

        const novamente = (await perguntar(rl, "  Jogar mais uma rodada? (S/N): "))
          .trim()
          .toUpperCase();
        if (novamente !== "S") break;
        rodada++;
      }

      // resultado final
      exibirCabecalho();
      console.log("  ── RESULTADO FINAL ──\n");
      console.log(`  ${nome1}: ${placar[nome1]} pts`);
      console.log(`  ${nome2}: ${placar[nome2]} pts\n`);

      if (placar[nome1] > placar[nome2]) {
        console.log(`  🏆 Vencedor: ${nome1}!\n`);
        registrarPontuacao(nome1, placar[nome1]);
      } else if (placar[nome2] > placar[nome1]) {
        console.log(`  🏆 Vencedor: ${nome2}!\n`);
        registrarPontuacao(nome2, placar[nome2]);
      } else {
        console.log("  🤝 Empate!\n");
        registrarPontuacao(nome1, placar[nome1]);
        registrarPontuacao(nome2, placar[nome2]);
      }

      await perguntar(rl, "  Pressione ENTER para voltar ao menu...");
      continue;
    }

    console.log("  Opção inválida.\n");
    await perguntar(rl, "  ENTER para continuar...");
  }
}

// ─── Iniciar ───────────────────────────────────────────────────────────────────
menuPrincipal().catch((err) => {
  console.error("Erro:", err);
  process.exit(1);
});
