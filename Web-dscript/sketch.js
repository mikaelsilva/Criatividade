let c;
let imgs = [];
let glyphs = [];
let index = 0;
let indexWord = 0;
let kaledoscope = false
let words;

function preload(){
  let l;
  var queryString = location.search.substring(1);
  words = queryString.split("|");
  for(let i = 0; i < words.length;i++){
    for(let j = 0; j < words[i].length;j++){
      console.log('alfabeto/'+words[i][j].toUpperCase()+'.png')
      l = new letter(loadImage('alfabeto/'+words[i][j].toUpperCase()+'.png'),40*j,50,50,50);
      imgs.push(l)
    }
    
  }
}

function setup() {
  c = createCanvas(720, 640);
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
  indexWord+=1;
  
}

function misturar(){
  if(glyphs.length > 0 ){
    for(let i = 0; i < glyphs.length;i++){
      //alert("glyph?")
      glyphs[i].updateXY(Math.floor(Math.random()*(width-glyphs[i].w)), Math.floor(Math.random()*(height-glyphs[i].h)))
    }
  }else{
    let offset = 0;
    for(let i = 0; i < indexWord-1;i++){
      offset+=words[i].length
    }
    for(let i = 0; i < offset+words[indexWord-1].length; i++){
      imgs[i].x = Math.floor(Math.random()*(width-imgs[i].w))
      imgs[i].y = Math.floor(Math.random()*(height-imgs[i].h))
    }
  }
  
  
}

function draw() {
  background(220);

  if(kaledoscope == true){
    translate(width/2,height/2)
    let angle = 30
    for(let i = 0; i<angle;i++){
      rotate(angle)
      push()
      scale(1,-1);
      for(let i = 0; i < imgs.length; i++){
        imgs[i].update()
        imgs[i].show()
      }
      for(let i = 0; i < glyphs.length;i++){
        //alert("glyph?")
        glyphs[i].update();
        glyphs[i].over();
      }
      pop()
    }
  }else{
    //rect(30, 80, 255, 255);
    for(let i = 0; i < imgs.length; i++){
      imgs[i].update()
      imgs[i].show()
    }
    for(let i = 0; i < glyphs.length;i++){
      //alert("glyph?")
      glyphs[i].update();
      glyphs[i].over();
    }
  }

}

function mousePressed(){
  for(let i= 0;i < imgs.length; i++){
    imgs[i].pressed();
  }
  for(let i = 0; i < glyphs.length;i++){
    glyphs[i].pressed();
  }
}

function mouseReleased(){
  for(let i = 0;i < imgs.length; i++){
    imgs[i].released()
  }
  for(let i = 0; i < glyphs.length;i++){
    glyphs[i].released();
  }
}

function rectanglesIntersect(minAx,  minAy,  maxAx,  maxAy, minBx,  minBy,  maxBx,  maxBy ) {
   aLeftOfB = maxAx < minBx;
   aRightOfB = minAx > maxBx;
   aAboveB = minAy > maxBy;
   aBelowB = maxAy < minBy;

  return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
}

function verificaSuperposicao(){
  var valido = true;
  let offset = 0;
  for(let i = 0; i < indexWord-1;i++){
    offset+=words[i].length
  }
  for(let i = offset; i < offset+words[indexWord-1].length; i++){
    var validaLetra = false;
    for(let j = offset; j < offset+words[indexWord-1].length; j++){
      if(i == j){
        continue;
      }
      if(rectanglesIntersect(imgs[i].x,imgs[i].y,imgs[i].x+imgs[i].w,imgs[i].y+imgs[i].h,imgs[j].x,imgs[j].y,imgs[j].x+imgs[j].w,imgs[j].y+imgs[j].h)){
        validaLetra = true;
      }
    }
    if(!validaLetra){
      valido = false;
    }
  }
  return valido;
}

function toggleKaledoscope(){
  if(kaledoscope){
    kaledoscope=false;
  }else{
    kaledoscope=true;
  }
}

function updateOrSave(){
  if(indexWord > words.length){
    saveCanvas(c, 'myCanvas', 'jpg');
  }
  else if(indexWord == words.length){
    
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
    
  }else{
    if(verificaSuperposicao()){
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
      
      
    }else{
      alert('opa, as letras precisam se sobrepor!')
    }
    
  }
  
}
