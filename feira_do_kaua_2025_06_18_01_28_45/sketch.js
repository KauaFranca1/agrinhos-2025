let produtos = [];
let barracas = [];
let pontuacao = 0;
let tempoRestante = 60;
let produtoSelecionado = null;
let feedbacks = [];

const EMOJIS = {
  "Milho": "🌽",
  "Leite": "🥛",
  "Tomate": "🍅",
  "Mel": "🍯",
  "Ovos": "🥚"
};

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  frameRate(60);
  iniciarProdutos();
  iniciarBarracas();
  setInterval(() => {
    if (tempoRestante > 0) tempoRestante--;
  }, 1000);
}

function iniciarProdutos() {
  const nomes = Object.keys(EMOJIS);
  const cores = [color(255, 223, 0), color(255), color(255, 80, 80), color(255, 200, 100), color(255, 255, 180)];
  
  produtos = nomes.map((nome, i) => ({
    nome: nome,
    x: 100 + i * 120,
    y: 500,
    cor: cores[i],
    selecionado: false
  }));
}

function iniciarBarracas() {
  const pedidos = shuffle(Object.keys(EMOJIS));
  barracas = pedidos.map((pedido, i) => ({
    pedido: pedido,
    x: 120 + i * 130,
    y: 150,
    cor: color(random(180, 255), random(180, 255), random(180, 255)),
    preenchido: false,
    tempoPreenchido: 0
  }));
}

function draw() {
  background(240);

  // Header
  fill(0);
  textSize(24);
  text("Feira Do Kauã", width / 2, 30);
  textSize(16);
  text("Pontuação: " + pontuacao + " | Tempo: " + tempoRestante + "s", width / 2, 60);

  // Fim de jogo
  if (tempoRestante <= 0) {
    textSize(40);
    fill(0);
    text("⏱️ Tempo Esgotado!", width / 2, height / 2 - 20);
    textSize(24);
    text("Pontuação final: " + pontuacao, width / 2, height / 2 + 30);
    noLoop();
    return;
  }

  // Barracas
  for (let barraca of barracas) {
    fill(barraca.cor);
    rect(barraca.x - 50, barraca.y - 40, 100, 80, 10);
    textSize(32);
    text(EMOJIS[barraca.pedido], barraca.x, barraca.y);
  }

  // Produtos
  for (let produto of produtos) {
    fill(produto.cor);
    ellipse(produto.x, produto.y, 60);
    fill(0);
    textSize(32);
    text(EMOJIS[produto.nome], produto.x, produto.y);
  }

  // Produto arrastando
  if (produtoSelecionado) {
    produtoSelecionado.x = mouseX;
    produtoSelecionado.y = mouseY;
  }

  // Feedbacks
  for (let i = feedbacks.length - 1; i >= 0; i--) {
    let fb = feedbacks[i];
    fill(fb.cor);
    textSize(20);
    text(fb.texto, fb.x, fb.y);
    fb.contador--;
    fb.y -= 1;
    if (fb.contador <= 0) {
      feedbacks.splice(i, 1);
    }
  }
}

function mousePressed() {
  for (let produto of produtos) {
    if (dist(mouseX, mouseY, produto.x, produto.y) < 30) {
      produtoSelecionado = produto;
      break;
    }
  }
}

function mouseReleased() {
  if (!produtoSelecionado) return;

  for (let barraca of barracas) {
    if (dist(mouseX, mouseY, barraca.x, barraca.y) < 50) {
      if (produtoSelecionado.nome === barraca.pedido) {
        pontuacao += 10;
        mostrarFeedback("+10", color(0, 180, 0), barraca.x, barraca.y);
        barraca.pedido = gerarNovoPedido();
      } else {
        pontuacao -= 5;
        mostrarFeedback("-5", color(200, 0, 0), barraca.x, barraca.y);
      }
    }
  }

  const index = produtos.findIndex(p => p.nome === produtoSelecionado.nome);
  produtoSelecionado.x = 100 + index * 120;
  produtoSelecionado.y = 500;
  produtoSelecionado = null;
}

function gerarNovoPedido() {
  let opcoes = Object.keys(EMOJIS);
  return random(opcoes);
}

function mostrarFeedback(texto, cor, x, y) {
  feedbacks.push({ texto, cor, x, y, contador: 60 });
}
