var canvas = document.getElementById("mycanvas"); //adquire o elemento canvas do html
var ctx = canvas.getContext("2d"); //define o contexto bidimensional do canvas

var teclas = {}; //teclas do teclado

var esquerda = { //barra da esquerda
  x: 10, //distância de 10 pixels da tela da esquerda
  y: canvas.height / 2 - 60, //ficar centralizado
  altura: 120,
  largura: 30,
  diry: 0,
  score: 0,
  velocidade: 5 //quantidade de pixels que ela anda
};

var direita = { //barra da direita
  x: canvas.width - 40, //-40 pq é a largura do canvas e a largura da barra
  y: canvas.height / 2 - 60, //ficar centralizado
  altura: 120,
  largura: 30,
  diry: 0,
  score: 0,
  velocidade: 5 //quantidade de pixels que ela anda
};

var bola = { //bola
  x: canvas.width / 2 - 15,
  y: canvas.height / 2 - 15,
  altura: 30,
  largura: 30,
  dirx: -1, //pra começar indo pra esquerda
  diry: 1, //pra começar indo também pra baixo
  mod: 0, //a medida que a bola bater nas barras, vai aumentar esse número
  //o que vai aumentar a velocidade da bola com o tempo
  velocidade: 1 //quantidade de pixels que ela anda
  //um valor mais abaixo vai multiplicar esse valor da velocidade
};

document.addEventListener("keydown", function(e) { //captura a tecla pressionada
  teclas[e.keyCode] = true;
}, false);

document.addEventListener("keyup", function(e) { //captura a tecla liberada
  delete teclas[e.keyCode];
}, false);

/*
*   Função para mover os blocos dos jogadores
*   Será chamada dentro da função dispatcher que
*   criará o canvas
*/

/*
* O ponto (0,0) fica no canto superior esquerdo
* Aumenta x pra direita
* Aumenta y pra baixo
*
* Plano cartesiano no canvas
*
*     (0,0) <- Ponto inicial
*       O------------------> (eixo x)
*       |
*       |
*       |
*       |
*       |
*       |
*       v (eixo y)
*
*/

function moverBloco() {
    if(87 in teclas && esquerda.y > 0) //tecla W e quando não está tocando no teto
        esquerda.y -= esquerda.velocidade; // decrementa 10 em y e faz subir

    else if(83 in teclas && esquerda.y + esquerda.altura < canvas.height) //tecla S e quando não está tocando no chão
        esquerda.y += esquerda.velocidade; //incrementa 10 em y e faz descer

    if(38 in teclas && direita.y > 0) //tecla cima e quando não está tocando no teto
        direita.y -= direita.velocidade; // decrementa 10 em y e faz subir

    else if(40 in teclas && direita.y + direita.altura < canvas.height) //tecla baixo e quando não está tocando no chão
        direita.y += direita.velocidade; //incrementa 10 em y e faz descer
};


/*
*   Função que move a bola dentro do jogo
*   dirx = 1   --> direita
*   dirx = -1  --> esquerda
*   diry = 1   --> baixo
*   diry - -1  --> cima
*/
function moveBola() {
    //bola posicionada na barra esquerda.. parte de cima da barra.. parte debaixo da barra... quando tocar na barra
    if(bola.y + bola.altura >= esquerda.y && bola.y <= esquerda.y + esquerda.altura && bola.x <= esquerda.x + esquerda.largura) {
        bola.dirx = 1; //bola pra direita --> quando bate na barra esquerda
        bola.mod += 0.15; //incrementa na velociade da bola
    }

    //bola posicionada na barra direita.. parte de cima da barrra... parte debaixo da barra.. quando tocar na barras
    else if(bola.y + bola.altura >= direita.y && bola.y <= direita.y + direita.altura && bola.x + bola.largura >= direita.x) {
        bola.dirx = -1; //bola pra esquerda --> quando bate na barra da direita
        bola.mod += 0.15; //incrementa na velociade da bola
    }

    if(bola.y <= 0) //quando bate no teto
        bola.diry = 1; //pra baixo

    else if(bola.y + bola.altura >= canvas.height) //quando bate no chão... quando a bola ultrapassa os 600 pixels
        bola.diry = -1; //pra cima

    //incrementa as modificações no posicionamento da bola de acordo com as alterações acima
    bola.x += (bola.velocidade + bola.mod) * bola.dirx; //o mod altera a velocidade
    bola.y += (bola.velocidade + bola.mod) * bola.diry; //o mod altera a velocidade

    //quando a bola passa pela barra
    if(bola.x < 25) // 10 (recuo) mais 15 (metade da  barra) --> evitar que um movimento brusco pra baixo faça prosseguir no jogo
        novoJogo("jogador 2");

    else if(bola.x + bola.largura > 575) //600 - 25 = 575... dessa vez tbm tem que considerar a largura da bola
        novoJogo("jogador 1");
};

/*
*   Função que inicia novo jogo e modifica o placar
*/
function novoJogo(winner) {
    if(winner == "jogador 1")
        ++esquerda.score; //adiciona a pontuação no jogador 1
    else
        ++direita.score; //adiciona a pontuação no jogador 2

    //após modificar o plcar, coloca os elementos nas posições originais
    esquerda.y = canvas.height / 2 - esquerda.altura / 2;
    direita.y = esquerda.y; //mesmo valor da variável anterior
    bola.y = canvas.height / 2 - bola.altura / 2;
    bola.x = canvas.width / 2 - bola.largura / 2;
    bola.mod = 0; //zera o multiplicador da velocidade
};

/*
*   Função que insere os elementos no canvas
*   Dispatcher para
*/
function desenha() {

  ctx.clearRect(0, 0, canvas.width, canvas.height); //limpa o canvas

  moverBloco(); //aciona a função de mover as barras
  moveBola();  //aciona a função de mover a bola

  ctx.fillStyle = "#E4B7A0"; //cor dos elementos inseridos no canvas 

  //vai inserindo os objetos de acordo com as variáveis definidas
  ctx.fillRect(bola.x, bola.y, bola.largura, bola.altura); //insere a bola
  ctx.fillRect(esquerda.x, esquerda.y, esquerda.largura, esquerda.altura); //insere a barra esquerda
  ctx.fillRect(direita.x, direita.y, direita.largura, direita.altura); //insere a barra direita

  ctx.font = "20px Courier New"; //define a fonte usada no canvas

  //insere os textos do placar
  ctx.fillText("Jogador 1: " + esquerda.score, 40, 25);
  ctx.fillText("Jogador 2: " + direita.score, canvas.width - 200, 25);

};

/*
*   Chama a função recursivamente a cada 5 milissegundos
*   Essa função sempre vai ser chamada se adequando às novas alterações no posicionamento dos objetos
*/
setInterval(desenha, 5);
