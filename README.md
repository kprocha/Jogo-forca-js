# 💀 Jogo da Forca

**Seu Nome Completo**

Jogo da Forca desenvolvido em JavaScript (Node.js) para o terminal, como atividade da disciplina WEB.

---

## 📋 Regras do Jogo

1. O jogo seleciona uma palavra secreta de uma categoria.
2. O jogador tenta adivinhar a palavra letra por letra.
3. Cada letra errada adiciona uma parte ao boneco da forca.
4. O jogador tem **6 tentativas erradas** antes de ser enforcado.
5. O jogador vence se descobrir todas as letras antes de esgotar as tentativas.
6. Letras com acento são normalizadas (ex.: `Ã` e `A` são tratadas como a mesma letra).
7. Letras repetidas ou inválidas são avisadas, sem desconto de tentativas.

---

## 🕹️ Como Jogar

1. No menu principal, escolha o modo de jogo:
   - **1 Jogador** — jogue quantas rodadas quiser, acumulando pontos.
   - **2 Jogadores** — cada jogador joga sua rodada em turnos; o maior placar vence.
   - **Ver Ranking** — consulte o hall dos melhores jogadores.
2. Informe seu nome.
3. Escolha uma categoria (Tecnologia, Animais, Frutas ou Aleatória).
4. Digite uma letra por vez para tentar adivinhar a palavra.
5. Comandos disponíveis durante a rodada:
   - **Qualquer letra** — chuta a letra.
   - **D** — solicita a dica da palavra (penalidade: −1 tentativa e −30 pontos).
   - **S** — encerra o jogo imediatamente.

---

## ⚙️ Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) v14 ou superior instalado.

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/jogo-da-forca.git
cd jogo-da-forca

# Instale dependências (nenhuma externa, apenas garante o package.json)
npm install

# Inicie o jogo
npm start
```

---

## 🎯 Variações e Personalizações

| Aspecto | Escolha |
|---|---|
| **Pontuação** | `letras × 10 pts` + `5 pts × tentativas restantes` − `30 pts` se usou dica |
| **Forca ASCII** | Desenhada progressivamente a cada erro (7 estágios) |
| **Erros máximos** | 6 erros (cabeça, corpo, braço esq., braço dir., perna esq., perna dir.) |
| **Acentos** | Normalizados — digitar `A` acerta `Ã`, `Á`, `Â` etc. |
| **Letra repetida** | Avisada sem penalidade |
| **Dificuldade** | Única — mas palavras longas valem mais pontos naturalmente |
| **Múltiplas rodadas** | Sim — placar acumulado no modo 1 jogador |
| **Escolha de categoria** | Jogador escolhe ou sorteia aleatoriamente |

---

## 🏆 Bônus Implementados

### 💡 Sistema de Dicas
- Cada palavra possui uma dica descritiva associada.
- O jogador solicita a dica digitando **D** durante a rodada.
- **Penalidade**: −1 tentativa imediatamente + −30 pontos na pontuação final.
- A dica só pode ser usada uma vez por rodada.

### 🏆 Ranking dos Melhores Jogadores
- Ao vencer uma rodada, a pontuação é salva automaticamente em `ranking.json`.
- O ranking exibe os **top 10** jogadores, ordenados por pontuação decrescente.
- Dados persistem entre sessões (arquivo JSON local).
- Apenas vitórias são registradas no ranking.

### 👥 Modo 2 Jogadores
- Dois jogadores se revezam na mesma máquina (hot-seat).
- Cada jogador escolhe sua própria categoria por rodada.
- O placar é exibido após cada rodada dupla.
- Ao final, o jogador com mais pontos é declarado vencedor.
- Em caso de empate, ambos têm o resultado registrado no ranking.

---

## 📂 Estrutura do Projeto

```
jogo-da-forca/
├── index.js        # Todo o código do jogo
├── package.json    # Configuração do projeto
├── ranking.json    # Gerado automaticamente ao jogar
├── .gitignore      # Ignorar node_modules
└── README.md       # Este arquivo
```

---

## 📖 Créditos — Fontes de Referência

- [Documentação oficial do Node.js — módulo `readline`](https://nodejs.org/api/readline.html)
- [MDN Web Docs — `String.prototype.normalize()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
- [MDN Web Docs — `Array.prototype.every()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- [Wikipedia — Jogo da Forca](https://pt.wikipedia.org/wiki/Jogo_da_forca)
- [Arte ASCII da Forca](https://gist.github.com/chrishorton/8510732aa9a80a03c829b09f12e20d9c)

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**.  
Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
