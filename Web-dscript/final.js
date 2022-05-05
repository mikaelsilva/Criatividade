let imgs = [];
let glyphs = [];
let cOriginal;
let cCaleidoscopio;
let sketch2;

const sOriginal = ( sketch ) => {

  let indexWord = 0;

  let words;

  sketch.preload = () =>{
    sketch2 = sketch;
    let l;
    var queryString = location.search.substring(1);
    words = queryString.split("|");
    for(let i = 0; i < words.length;i++){
      for(let j = 0; j < words[i].length;j++){
        console.log('alfabeto/'+words[i][j].toUpperCase()+'.png')
        l = new letter(sketch.loadImage('alfabeto/'+words[i][j].toUpperCase()+'.png'),40*j,50,50,50);
        imgs.push(l)
      }
    }
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
      indexWord+=1;
    }

    misturar()
    
  }
  sketch.setup = () => {
    cOriginal = sketch.createCanvas(480, 360);
  };

  sketch.draw = () => {
    sketch.background(0);
    //sketch.fill(255);
    
    for(let i = 0; i < imgs.length; i++){
      imgs[i].show2(sketch)
    }
    for(let i = 0; i < glyphs.length;i++){
      glyphs[i].update2(sketch);
      glyphs[i].over2(sketch);
    }
    
  };
  sketch.mousePressed = () => {
    for(let i = 0; i < glyphs.length;i++){
      glyphs[i].pressed2(sketch);
    }
  }
  
  sketch.mouseReleased = () => {
    for(let i = 0; i < glyphs.length;i++){
      glyphs[i].released();
    }
  }

  sketch.over = () => {
    for(let i = 0; i < glyphs.length;i++){
      glyphs[i].update2(sketch);
      glyphs[i].over2(sketch);
    }
  }

};

const sCaleidoscopio = ( sketch ) => {

  let indexWord = 0;
  let words;

  sketch.setup = () => {
    cCaleidoscopio = sketch.createCanvas(480, 360);
    //colorMode(HSB,150,100,10,1)
  };

  sketch.draw = () => {
    sketch.background(0);
    sketch.translate(sketch.width/2,sketch.height/2)
    let angle = 14
    
    for(let i = 0; i < angle;i++){
      sketch.rotate(angle)
      sketch.push()
      sketch.scale(1,-1);
      for(let i = 0; i < imgs.length; i++){
        //sketch.tint(imgs[i].x,imgs[i].y,100,1)
        //imgs[i].update()
        imgs[i].show2(sketch)
      }
      for(let i = 0; i < glyphs.length;i++){
        //sketch.tint(glyphs[i].x,imgs[i].y,100,1)
        glyphs[i].update2(sketch);
        glyphs[i].over2(sketch);
      }
      sketch.pop()
    }
    
  };
  

};

function exportCaleidoscope(){
  sketch2.saveCanvas(cCaleidoscopio, 'myCanvas', 'jpg');
}

function exportOriginal(){
  sketch2.saveCanvas(cOriginal, 'myCanvas', 'jpg');
}

function misturar(){
  if(glyphs.length > 0 ){
    for(let i = 0; i < glyphs.length;i++){
      //alert("glyph?")
      glyphs[i].updateXY(Math.floor(Math.random()*(sketch2.width-glyphs[i].w)), Math.floor(Math.random()*(sketch2.height-glyphs[i].h)))
    }
  } 
}

let original = new p5(sOriginal,'original');
let caleidoscopio = new p5(sCaleidoscopio,'caleidoscopio');
