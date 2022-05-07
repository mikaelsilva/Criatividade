let imgs = [];
let glyphs = [];
let cProxima;
let sketch2;
let indexWord = 0; //Reponsavel por indicar qual é a palavra analisada da vez
let limite = 0; //Indica a quantidade maxima de palavras que o usuario inseriu
let words; //Responsavel por armazenar uma lista das palavras ['mikael','vidal'] inseridas pelo usuario

//Função responsavel por ler os arquivos salvos da etapa de INDEX
function getOfStorage(key) {
  let dados = JSON.parse(sessionStorage.getItem(key));
  return dados;
}

//Funções responsaveis por salvar a composição das imagens que
//acabaram de ser feitas uma a uma
function getCircularReplacer() {
  const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
}

function saveInStorage(key, data) {
  let dados = JSON.stringify(data, getCircularReplacer());
  sessionStorage.setItem(key, dados);
}


const sProxima = ( sketch ) => {

    //let indexWord = 0;
    //let words;

    //Função sempre executa uma vez, faz a leitura das palavras inseridas pelo usuario e
    // guarda a ferencia de cada letra para cada imagem do DSCRIPT
    sketch.preload = () =>{
      sketch2 = sketch;
      let l;
      
      var queryString = getOfStorage("letters");//location.search.substring(1);
      words = queryString.split("|");
      limite = words.length - 1;
      xs = getOfStorage("xs");
      ys = getOfStorage("ys");
      count = 0;
      for(let i = 0; i < words.length;i++){
        for(let j = 0; j < words[i].length;j++){
          //console.log('alfabeto/'+words[i][j].toUpperCase()+'.png')
          l = new letter(sketch.loadImage('alfabeto/'+words[i][j].toUpperCase()+'.png'),xs[count],ys[count],50,50);
          count+=1;
          imgs.push(l)
        }
      }
      console.log("LIMITE: ",limite);
      console.log("PRELOOOOOOOOOOOOOOOOOOOOOAD");
    }
      

    //Cria a tela onde será feita a interação com as palavras
    sketch.setup = () => {
      cProxima = sketch.createCanvas(480, 360);
      //cProxima = sketch.createCanvas(1500,600);
      console.log("SETUPPPPPPPPPPPPPPPPPPPPPPPPPPPPP");
  
      let offset = 0;
      for(let i = 0; i < indexWord;i++){
        offset+=words[i].length
      }
      for(let i = 0; i < offset; i++){
        imgs[i].toggleOnOff(false,false);
      }
      for(let i = offset; i < offset+words[indexWord].length; i++){
        imgs[i].toggleOnOff(true,true);
      }
      //indexWord+=1;
    };

    //Desenha as palavras DSCRIPT no Canvas definido
    //Além disso, mostra qual é a palavra da vez
    sketch.draw = () => {
      sketch.background(0);
      //console.log("DRAWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
      sketch.textSize(40)
      sketch.fill(255, 255, 255);
      sketch.text(words[indexWord],180,350)
      

      console.log(imgs.length)
      for(let i = 0; i < imgs.length; i++){
        //imgs[i].update();
        imgs[i].show2(sketch);
      }
      for(let i = 0; i < glyphs.length;i++){
        glyphs[i].update2(sketch);
        glyphs[i].over2(sketch);
      }

    };

    //Função responsavel por identificar o mouse, no caso, o que foi clicado ou não
    sketch.mousePressed = () => {
      for(let i= 0;i < imgs.length; i++){
        imgs[i].pressed2(sketch);
      }
      for(let i = 0; i < glyphs.length;i++){
        glyphs[i].pressed2(sketch);
      }
    };
    
    //Função responsavel por identificar o mouse também, no caso o arraste dele
    sketch.mouseReleased = () => {
      for(let i = 0;i < imgs.length; i++){
        imgs[i].released()
      }
      for(let i = 0; i < glyphs.length;i++){
        glyphs[i].released();
      }
    };

    sketch.over = () => {
      for(let i = 0; i < glyphs.length;i++){
        glyphs[i].update2(sketch);
        glyphs[i].over2(sketch);
      }
    };

 
};

//Tentativa de salvar a imagem gerada do DSCRIPT que o usuario moveu
function salve_image(){
  for(let i = 0; i < imgs.length;i++){
    imgs[i].toggleOnOff(true,false);
  }

  let offset = 0;
  for(let i_words = 0; i_words < words.length;i_words++){
    let aux = []
    let minx = 999999;
    let miny = 999999;
    let maxw = 0;
    let maxh = 0;
    for(let i = offset;i < offset+words[i_words].length;i++){
      aux.push(imgs[i]);
      if(imgs[i].x < minx){
        minx = imgs[i].x;
      }
      if(imgs[i].y < miny){
        miny = imgs[i].y;
      }
      if(imgs[i].x + imgs[i].w > maxw){
        maxw = imgs[i].w + imgs[i].x;
      }
      if(imgs[i].y + imgs[i].h > maxh){
        maxh = imgs[i].h + imgs[i].y;
      }
    } 
    let g = new glyph(aux,minx,miny,maxw,maxh);
    glyphs.push(g);
    offset+=words[i_words].length;
  }

  saveInStorage("letters",location.search.substring(1));
  xs = []
  ys = []
  for(let i = 0; i < imgs.length;i++){
    xs.push(imgs[i].x)
    ys.push(imgs[i].y)
  }
  saveInStorage("ys",ys);
  saveInStorage("xs",xs);
}

//Função responsavel por PASSAR pelas palavras escolhidas pelo usuario
//Chega até o limite de interações, e depois chama a proxima pagina (final)
function proximaPalavra(){
  console.log('PROXIMA PALAVRA');
  console.log("LIMITE: ",limite-1);
  console.log("PALAVRA: ",indexWord);
  if(limite != indexWord){
    salve_image();
    indexWord++;
    cProxima.remove();
    imgs = [];
    glyphs = [];
    let proxima = new p5(sProxima,'proxima');
  }
  else{
    console.log("PROXIMA PAGINA");
    cProxima.remove();
  }
}

function exportOriginal(){
    sketch2.saveCanvas(cProxima, 'myCanvas', 'jpg');
}

function misturar(){
    if(glyphs.length > 0 ){
      for(let i = 0; i < glyphs.length;i++){
        
        glyphs[i].updateXY(Math.floor(Math.random()*(sketch2.width-glyphs[i].w)), Math.floor(Math.random()*(sketch2.height-glyphs[i].h)))
      }
    } 
}

let proxima = new p5(sProxima,'proxima');