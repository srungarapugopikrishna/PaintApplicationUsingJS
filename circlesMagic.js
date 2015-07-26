var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var offsetX = canvas.offsetLeft;
var offsetY = canvas.offsetTop;
var startX;
var startY;
var rad;
var isDown = false;
//Circle Variable
var centerX;
var centerY;
var circleRad;
//Rect Variables
var width;
var height;
var xCo;
var yCo;

var shapeColor;
var shapeType;    
var numShapes;
var shapes=[];
var dragIndex;
var dragging;
var mouseX;
var mouseY;
var dragHoldX;
var dragHoldY;
var drawShape;
var getShape;
var shapeFunc={"circle":{
						"createFunc":function(x, y) {
							centerX = startX + (x - startX) / 2;
							centerY = startY + (y - startY) / 2;
							circleRad     = Math.abs(y - centerY);
							shapeFunc.circle.drawCircle({"x":centerX,"y":centerY,"rad":circleRad,"color":shapeColor})
						},
						"drawCircle":function(obj){
							ctx.beginPath();
							ctx.arc(obj.x, obj.y, obj.rad, 0, 2*Math.PI, false)
							ctx.fillStyle = obj.color;
							ctx.fill();
							ctx.closePath();    
						},
						"editFunc":function(x,y){
							console.log("doing a dummy log");
						},
						"hitTest":function(shape,mx,my) {
							var dx;
							var dy;
							dx = mx - shape.x;
							dy = my - shape.y;
							//a "hit" will be registered if the distance away from the center is less than the radius of the circular object        
							return (dx*dx + dy*dy < shape.rad*shape.rad);
						},
						"getShape":function(){
							var shape={
								"x":centerX
								,"y":centerY
								,"rad":circleRad
								,"color":shapeColor
								,"drawShapeFn":shapeFunc.circle.drawCircle
								,"hitTest":shapeFunc.circle.hitTest
							};
							return shape;
						}
					},
				"rectangle":{
						"createFunc":function(x, y) {
							xCo=startX;
							yCo=startY;
							width=x-startX;
							height=y-startY;
							shapeFunc.rectangle.drawRect({"x":xCo,"y":yCo,"w":width,"h":height,"color":shapeColor})
						},
						"drawRect":function(obj){
							ctx.beginPath();
							ctx.rect(obj.x, obj.y, obj.w, obj.h);
							ctx.fillStyle = obj.color;
							ctx.fill();
							ctx.closePath();    
						},
						"editFunc":function(x,y){
							console.log("doing a dummy log");
						},
						"hitTest":function(shape,mx,my) {
							var isValidmx,isValidmy;
							if(shape.w>=0){
								if(mx >= shape.x && mx <= (shape.x+shape.w)){
									isValidmx=true;
								}else{
									isValidmx=false;
								}
							}else{
								if(mx <= shape.x && mx >= (shape.x+shape.w)){
									isValidmx=true;
								}else{
									isValidmx=false;
								}
							}
							if(shape.h>=0){
								 
									if(my >= shape.y && my <= (shape.y+shape.h)){
										isValidmy=true;
									}else{
										isValidmy=false;
									}
							}else{
								if(my <= shape.y && my >= (shape.y+shape.h)){
										isValidmy=true;
									}else{
										isValidmy=false;
									}
							}
							if(isValidmx && isValidmy){
								return true;
							}else{
								return false;
							}
						},
						"getShape":function(){
							var shape={
								"x":xCo
								,"y":yCo
								,"w":width
								,"h":height
								,"color":shapeColor
								,"drawShapeFn":shapeFunc.rectangle.drawRect
								,"hitTest":shapeFunc.rectangle.hitTest
							};
							return shape;
						}
					}
			  }
		 
		var  creationMode = false;
		function switchOnCreationMode(shapeName){
			creationMode = true;
			shapeType=shapeName;
			drawShape = shapeFunc[shapeType].createFunc;
			getShape = shapeFunc[shapeType].getShape;
            document.body.style.cursor="crosshair";
			document.getElementById('hint').style.display="none";
		}
		function switchOnMovementMode(){
			creationMode = false;
			document.body.style.cursor="move";
			document.getElementById('hint').style.display="block";
		}
		function getcreationMode(){
			return creationMode;
		}
		function clearCanvas(){
			shapes = [];
			numShapes=shapes.length;
			document.getElementById('hint').style.display="none";
			 ctx.clearRect(0, 0, canvas.width, canvas.height);

		}	
//random Color Generator
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
 
function drawSquare(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    centerX = startX + (x - startX) / 2;
    centerY = startY + (y - startY) / 2;
    circleRad     = Math.abs(y - centerY);
    ctx.arc(centerX, centerY, circleRad, 0, 2*Math.PI, false)
    ctx.closePath();    
    ctx.fill();
     
}

function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
	startX = e.offsetX;
	startY = e.offsetY;
    isDown = true;
}

function handleMouseUp(e) {
    if (!isDown) {
        return;
    }
	shapeColor=getRandomColor();
	drawShape(e.offsetX,e.offsetY);
    tempShape = getShape();
    shapes.push(tempShape);
    numShapes = shapes.length;
	drawShapes();
    e.preventDefault();
    e.stopPropagation();
    isDown = false;
}

function handleMouseOut(e) {
    if (!isDown) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    isDown = false;
}

function handleMouseMove(e) {
    if (!isDown) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();
	mouseX = e.offsetX;
	mouseY = e.offsetY;
    shapeColor = "#000000";
 	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawShapes();
	drawShape(mouseX, mouseY);
}

///////********************MOVEMENT **********************///////////////////

    function mouseDownListener(evt) {
        var i;
        //We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
        //only the topmost one will be dragged.
        var highestIndex = -1;
        //getting mouse position correctly, being mindful of resizing that may have occurred in the browser:
        var bRect = canvas.getBoundingClientRect();
        mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
        mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
        //find which shape was clicked
        for (i=0; i < numShapes; i++) {
            if  (shapes[i].hitTest(shapes[i], mouseX, mouseY)) {
                dragging = true;
                if (i > highestIndex) {
                    //We will pay attention to the point on the object where the mouse is "holding" the object:
                    dragHoldX = mouseX - shapes[i].x;
                    dragHoldY = mouseY - shapes[i].y;
                    highestIndex = i;
                    dragIndex = i;
                }
            }
        }
        if (dragging) {
            window.addEventListener("mousemove", mouseMoveListener, false);
        }
        canvas.removeEventListener("mousedown", mouseDownListener, false);
        window.addEventListener("mouseup", mouseUpListener, false);
        //code below prevents the mouse down from having an effect on the main browser window:
        if (evt.preventDefault) {
            evt.preventDefault();
        } //standard
        else if (evt.returnValue) {
            evt.returnValue = false;
        } //older IE
        return false;
    }
    
    function mouseUpListener(evt) {
        canvas.addEventListener("mousedown", mouseDownListener, false);
        window.removeEventListener("mouseup", mouseUpListener, false);
        if (dragging) {
            dragging = false;
            window.removeEventListener("mousemove", mouseMoveListener, false);
        }
    }

    function mouseMoveListener(evt) {
        var posX;
        var posY;
        var minX = 0;
        var maxX = canvas.width;
        var minY = 0;
        var maxY = canvas.height;
        //getting mouse position correctly 
        var bRect = canvas.getBoundingClientRect();
        mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
        mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
        
        //clamp x and y positions to prevent object from dragging outside of canvas
        posX = mouseX - dragHoldX;
        posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
        posY = mouseY - dragHoldY;
        posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
        
        shapes[dragIndex].x = posX;
        shapes[dragIndex].y = posY;
        
        drawScreen();
    }
        function drawShapes() {
        var i;
        for (i=0; i < numShapes; i++) {
			shapes[i].drawShapeFn(shapes[i]);
        }
    }
    
    function drawScreen() {
        //bg
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        
        drawShapes();       
    } 
///////////////////********************* MOVEMENT ENDS *******************////////////////////////////

function removeMoveEventListeners(){
    canvas.removeEventListener("mousedown", mouseDownListener, false);
    window.removeEventListener("mousemove", mouseMoveListener, false);
    window.removeEventListener("mouseup", mouseUpListener, false);
}

canvas.addEventListener("mousedown",function (e) {
    if(getcreationMode()){
        removeMoveEventListeners();
        handleMouseDown(e);    
    }else{
        mouseDownListener(e);
    }
    
},false);

canvas.addEventListener("mousemove",function (e) {
    if(getcreationMode()){
        removeMoveEventListeners();
        handleMouseMove(e);
    }
},false);
canvas.addEventListener("mouseup",function (e) {
    if(getcreationMode()){
        removeMoveEventListeners();
        handleMouseUp(e);
    }
},false);
canvas.addEventListener("mouseout",function (e) {
    if(getcreationMode()){
        removeMoveEventListeners();
        handleMouseOut(e);
    }
},false);

canvas.addEventListener("dblclick",function (evt) {
    if(!getcreationMode()){
		var bRect = canvas.getBoundingClientRect();
    mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
    mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
            
    var highestIndex = -1;
    var dragIndexDel = -1;
    //find which shape was clicked
    for (i=0; i < numShapes; i++) {
        if  (shapes[i].hitTest(shapes[i], mouseX, mouseY)) {
            if (i > highestIndex) {
                highestIndex = i;
                dragIndexDel = i;
            }
        }
    }
    if(dragIndexDel != -1){
        shapes.splice(dragIndexDel, 1);    
    }
    numShapes = shapes.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShapes();
	}
},false);