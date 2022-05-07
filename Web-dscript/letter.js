class letter{
    constructor(img,x,y,w,h){
        this.dragging = false;
        this.rollover = false;
        this.img = img;
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.isOnShow = false;
        this.isOnUpdate = false;
    }

    over() {
        // Is mouse over object
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
          this.rollover = true;
        } else {
          this.rollover = false;
        }
    }

    toggleOnOff(isOnShow,isOnUpdate){
        this.isOnShow = isOnShow; 
        this.isOnUpdate = isOnUpdate; 
    }

    update() {
        // Adjust location if being dragged
        if (this.dragging) {
          this.x = mouseX + this.offsetX;
          this.y = mouseY + this.offsetY;
        }
    }
    updateInsideGlyph(x,y){
        this.x+=x;
        this.y+=y;
    }
    show2(sketch){
        if(this.isOnShow){
            sketch.image(this.img, this.x, this.y,this.w,this.h);
        }
    }
    show() {
        if(this.isOnShow){
            image(this.img, this.x, this.y,this.w,this.h);
        }
        
    }
    pressed2(sketch) {
        if(this.isOnUpdate){
            // Did I click on the rectangle?
            if (sketch.mouseX > this.x && sketch.mouseX < this.x + this.w && sketch.mouseY > this.y && sketch.mouseY < this.y + this.h) {
                this.dragging = true;
                // If so, keep track of relative location of click to corner of rectangle
                this.offsetX = this.x - sketch.mouseX;
                this.offsetY = this.y - sketch.mouseY;
            }
        }
        
    }
    pressed() {
        if(this.isOnUpdate){
            // Did I click on the rectangle?
            if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
                this.dragging = true;
                // If so, keep track of relative location of click to corner of rectangle
                this.offsetX = this.x - mouseX;
                this.offsetY = this.y - mouseY;
            }
        }
        
    }
    released() {
        // Quit dragging
        this.dragging = false;
    }
}