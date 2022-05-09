let c, c2;
let imgs = [];
let img_example;
let glyphs = [];
let index = 0;
let indexWord = 0;
let kaledoscope = false;
let words;
let textWord;
let name_image = "exemplo_usuario/exemplo1.png";

function saveInStorage(key, data) {
  //let dados = JSON.stringify(data, getCircularReplacer());
  sessionStorage.setItem(key, dados);
}

function retorna() {
  var queryString = document.getElementById("inputPhrase");
  var value = queryString.value;
  var words = value.split(" ");
  let string = '';
  for (let i = 0; i < words.length; i++) {
    string = string.concat(words[i], "|");
    saveInStorage("words", words);
  }
  //console.log("string ", string);

  window.location = "segunda_tela.html?" + string;
}

//Pega as palavras que foram inseridas pelo usuario (Ex: mikael|vidal|da|silva)
function preload() {
  //console.log("PRELOADDDDDDDDDDDDDDDDDDDDDD");
  let l;
  // var queryString = location.search.substring(1);
  var queryString = document.getElementById("inputPhrase");
  var value = queryString.value;
  words = value.split(" ");
 
  saveInStorage("words", words);

  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words[i].length; j++) {
      l = new letter(
        loadImage("alfabeto/" + words[i][j].toUpperCase() + ".png"),
        40 * j,
        50,
        50,
        50
      );
      imgs.push(l);
    }
  }
}

//Função responsavel por criar a tela preta (canvas, onde o DSCRIPT | PALAVRA | IMAGEM INSPIRAÇÃO) vão aparecer
function setup() {
  console.log("SETUPPPPPPPPPPPPPPPPPPPPPPPPP");
  img_example = loadImage(name_image);

  c = createCanvas(850, 400);

  let offset = 0;
  for (let i = 0; i < indexWord; i++) {
    offset += words[i].length;
  }
  for (let i = 0; i < offset; i++) {
    imgs[i].toggleOnOff(false, false);
  }
  for (let i = offset; i < offset + words[indexWord].length; i++) {
    imgs[i].toggleOnOff(true, true);
  }
  indexWord += 1;
  saveInStorage("words", words);
}

//Função para misturar as letras DSCRIPT na pagina
function misturar() {
  if (glyphs.length > 0) {
    for (let i = 0; i < glyphs.length; i++) {
      //alert("glyph?")
      glyphs[i].updateXY(
        Math.floor(Math.random() * (width - glyphs[i].w)),
        Math.floor(Math.random() * (height - glyphs[i].h))
      );
    }
  } else {
    let offset = 0;
    for (let i = 0; i < indexWord - 1; i++) {
      offset += words[i].length;
    }
    for (let i = 0; i < offset + words[indexWord - 1].length; i++) {
      imgs[i].x = Math.floor(Math.random() * (width - imgs[i].w));
      imgs[i].y = Math.floor(Math.random() * (height - imgs[i].h));
    }
  }
}

//Função auxiliar
function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

//Função para salvar estrutura feita pelo usuario com as letras em DSCRIPT
function saveInStorage(key, data) {
  let dados = JSON.stringify(data, getCircularReplacer());
  sessionStorage.setItem(key, dados);
}

//Desenha a tela contendo a palavra atual, a convesão em DSCRIPT para o usuario alterar e uma imagem de inspiração
function draw() {
  background(0);

  console.log("----------------------- ", words);
  let string = "";
  if (words.length > 1) {
    for (let i = 0; i < words.length; i++) {
      string = string.concat(words[i], " ");
      console.log("string ", string);
      saveInStorage("words", words);
    }
  } else {
    string = "loading";
  }

  textSize(30);
  fill(255, 255, 255);
  text(string, 320, 350);
  console.log("string ", string);

  image(img_example, 0, 250);
}

//Função auxiliar
function mousePressed() {
  for (let i = 0; i < imgs.length; i++) {
    imgs[i].pressed();
  }
  for (let i = 0; i < glyphs.length; i++) {
    glyphs[i].pressed();
  }
}
//Função auxiliar
function mouseReleased() {
  for (let i = 0; i < imgs.length; i++) {
    imgs[i].released();
  }
  for (let i = 0; i < glyphs.length; i++) {
    glyphs[i].released();
  }
}
//Função auxiliar
function rectanglesIntersect(
  minAx,
  minAy,
  maxAx,
  maxAy,
  minBx,
  minBy,
  maxBx,
  maxBy
) {
  aLeftOfB = maxAx < minBx;
  aRightOfB = minAx > maxBx;
  aAboveB = minAy > maxBy;
  aBelowB = maxAy < minBy;

  return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
}
//Função para verificar se a estrutura de DSCRIPT esta perto suficiente uma das outras
function verificaSuperposicao() {
  var valido = true;
  let offset = 0;
  for (let i = 0; i < indexWord - 1; i++) {
    offset += words[i].length;
  }
  for (let i = offset; i < offset + words[indexWord - 1].length; i++) {
    var validaLetra = false;
    for (let j = offset; j < offset + words[indexWord - 1].length; j++) {
      if (i == j) {
        continue;
      }
      if (
        rectanglesIntersect(
          imgs[i].x,
          imgs[i].y,
          imgs[i].x + imgs[i].w,
          imgs[i].y + imgs[i].h,
          imgs[j].x,
          imgs[j].y,
          imgs[j].x + imgs[j].w,
          imgs[j].y + imgs[j].h
        )
      ) {
        validaLetra = true;
      }
    }
    if (!validaLetra) {
      valido = false;
    }
  }
  return valido;
}
//Função auxiliar
function toggleKaledoscope() {
  if (kaledoscope) {
    kaledoscope = false;
  } else {
    kaledoscope = true;
  }
}

//Função para salvar a estrutura atual de DSCRIPT e ir para a proxima palavra
function updateOrSave() {
  console.log("UPDATEEEEEE ORRRR SAVEEEEEE");
  //if(indexWord > words.length){
  //  saveCanvas(c, 'myCanvas', 'jpg');
  //}
  console.log("words ", words);
  if (indexWord == words.length) {
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].toggleOnOff(true, false);
    }
    let offset = 0;
    for (let i_words = 0; i_words < words.length; i_words++) {
      let aux = [];
      let minx = 999999;
      let miny = 999999;
      let maxw = 0;
      let maxh = 0;
      for (let i = offset; i < offset + words[i_words].length; i++) {
        aux.push(imgs[i]);
        if (imgs[i].x < minx) {
          minx = imgs[i].x;
        }
        if (imgs[i].y < miny) {
          miny = imgs[i].y;
        }
        if (imgs[i].x + imgs[i].w > maxw) {
          maxw = imgs[i].w + imgs[i].x;
        }
        if (imgs[i].y + imgs[i].h > maxh) {
          maxh = imgs[i].h + imgs[i].y;
        }
      }
      let g = new glyph(aux, minx, miny, maxw, maxh);
      glyphs.push(g);
      offset += words[i_words].length;
      indexWord += 1;
    }

    //Salva a estrutura
    saveInStorage("letters", location.search.substring(1));
    xs = [];
    ys = [];
    for (let i = 0; i < imgs.length; i++) {
      xs.push(imgs[i].x);
      ys.push(imgs[i].y);
    }
    saveInStorage("ys", ys);
    saveInStorage("xs", xs);
  } else {
    //Se estiver tudo ok, ele remove a cena atual e inicia outra com aproxima palavra
    if (verificaSuperposicao()) {
      //var data = canvas.toDataURL('image/png').replace(/data:image\/png;base64,/, '');

      // make names  eg "img_1.png", "img_2.png"......etc"
      //var iname = 'img_' + index + '.png';

      c.remove();
      //post to php
      //$.post('save.php',{data: data, iname });
      // update counter
      index++;

      //restart sketch
      setup();
    } else {
      alert("opa, as letras precisam se sobrepor!");
    }
  }
}

//Função utilizada para gerar um numero aleatorio para auxiliar no LOAD de uma imagem de INSPIRAÇÃO (pasta exemplo_inspiração)
//Para podermos mostrar ao usuario, e ele se inspirar em criar alguma estrutura utilizando o DSCRIPT
function example() {
  let r = int(random(4));
  console.log("RAMDON:", r);
  img_example = loadImage("exemplo_usuario/exemplo" + str(r) + ".png");
  //name_image = 'exemplo_usuario/exemplo2.png'
  console.log("inspirar");
}
