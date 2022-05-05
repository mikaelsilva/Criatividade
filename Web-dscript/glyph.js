class glyph{
    constructor(imgs,x,y,w,h){
        this.dragging = false;
        this.rollover = false;
        this.imgs = imgs;
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
    }

    over2(sketch) {
        if (sketch.mouseX > this.x && sketch.mouseX < this.x + this.w && sketch.mouseY > this.y && sketch.mouseY < this.y + this.h) {
          this.rollover = true;
        } else {
          this.rollover = false;
        }
    }
    over() {
        
        // Is mouse over object
        
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
          this.rollover = true;
        } else {
          this.rollover = false;
        }
    }
    updateXY(newX,newY){

        let x = newX 
        let y = newY
        for(let i = 0; i < this.imgs.length; i++){
            this.imgs[i].updateInsideGlyph(x - this.x,y - this.y);
        }
        this.x = x;
        this.y = y;
    }
    
    update2(sketch) {
        // Adjust location if being dragged
        if (this.dragging) {
          let x = sketch.mouseX + this.offsetX;
          let y = sketch.mouseY + this.offsetY;
          for(let i = 0; i < this.imgs.length; i++){
              this.imgs[i].updateInsideGlyph(x - this.x,y - this.y);
          }
          this.x = x;
          this.y = y;
        }
    }

    update() {
        // Adjust location if being dragged
        if (this.dragging) {
          let x = mouseX + this.offsetX;
          let y = mouseY + this.offsetY;
          for(let i = 0; i < this.imgs.length; i++){
              this.imgs[i].updateInsideGlyph(x - this.x,y - this.y);
          }
          this.x = x;
          this.y = y;
        }
    }
    
    pressed2(sketch) {
        
        // Did I click on the rectangle?
        if (sketch.mouseX > this.x && sketch.mouseX < this.x + this.w && sketch.mouseY > this.y && sketch.mouseY < this.y + this.h) {
            this.dragging = true;
            // If so, keep track of relative location of click to corner of rectangle
            this.offsetX = this.x - sketch.mouseX;
            this.offsetY = this.y - sketch.mouseY;
        }
        
        
    }

    pressed() {
        
        // Did I click on the rectangle?
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            this.dragging = true;
            // If so, keep track of relative location of click to corner of rectangle
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
        }
        
        
    }
    released() {
        // Quit dragging
        this.dragging = false;
    }
}