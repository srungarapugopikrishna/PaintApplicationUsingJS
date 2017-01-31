var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvas1 = document.getElementById("canvas1");
var ctx1 = canvas1.getContext("2d");
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
var event;
//Traingle Variables
var x1Co,x2Co,x3Co,y1Co,y2Co,y3Co;

var drawImageId;
var brushingMode;
var brushDrag = false;
var brushSize;
var gotColor;
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
						//	shapeFunc.circle.drawCircle({"x":centerX,"y":centerY,"rad":circleRad,"color":shapeColor})
						shapeFunc.circle.drawCircleDrag({"x":centerX,"y":centerY,"rad":circleRad,"color":shapeColor})
						},
						"drawCircle":function(obj){
							ctx.beginPath();
							ctx.arc(obj.x, obj.y, obj.rad, 0, 2*Math.PI, false)
							ctx.fillStyle = obj.color;
							ctx.fill();
							ctx.lineWidth = 3;
							ctx.strokeStyle = 'black';
							ctx.stroke();
							ctx.closePath();    
						},
						"drawCircleDrag":function(obj){
							ctx.beginPath();
							ctx.arc(obj.x, obj.y, obj.rad, 0, 2*Math.PI, false)
							//ctx.fillStyle = obj.color;
							//ctx.fill();
							ctx.lineWidth = 3;
							ctx.strokeStyle = 'black';
							ctx.stroke();
							//ctx.closePath();    
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
								,"drawShapeDrag":shapeFunc.circle.drawCircleDrag
								,"hitTest":shapeFunc.circle.hitTest
								,"selectShape":shapeFunc.circle.selectCircle	
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
//							shapeFunc.rectangle.drawRect({"x":xCo,"y":yCo,"w":width,"h":height,"color":shapeColor})
							shapeFunc.rectangle.drawRectDrag({"x":xCo,"y":yCo,"w":width,"h":height})
						},
						"drawRect":function(obj){
							ctx.beginPath();
							ctx.rect(obj.x, obj.y, obj.w, obj.h);
							ctx.lineWidth = 3;
							ctx.strokeStyle = 'black';
							ctx.stroke();
							ctx.fillStyle = obj.color;
							ctx.fill();
							ctx.closePath();    
						},
						"drawRectDrag":function(obj){
							ctx.beginPath();
							ctx.rect(obj.x, obj.y, obj.w, obj.h);
							ctx.lineWidth = 3;
							ctx.strokeStyle = 'black';
							ctx.stroke();
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
								,"drawShapeDrag":shapeFunc.rectangle.drawRectDrag
								,"hitTest":shapeFunc.rectangle.hitTest
							};
							return shape;
						}
					},
					
			"triangle":{
						"createFunc":function(x, y) {
							x1Co=startX;
							y1Co=startY;
							width=x-startX;
							height=y-startY;
							shapeFunc.triangle.drawTriangleDrag({"x":x1Co,"y":y1Co,"w":width,"h":height})
						},
						"drawTriangle":function(obj){
							ctx.beginPath();
							ctx.moveTo(obj.x, obj.y);
							ctx.lineTo(obj.x+obj.w, obj.y+obj.h);
							ctx.lineTo(obj.x-obj.w, obj.y+obj.h);
							ctx.lineTo(obj.x, obj.y);
							ctx.lineWidth = 3;
							ctx.strokeStyle = 'black';
							ctx.stroke();
							ctx.fillStyle = obj.color;
							ctx.fill();
							ctx.closePath();    
						},
						"drawTriangleDrag":function(obj){
							ctx.beginPath();
							ctx.moveTo(obj.x, obj.y);
							ctx.lineTo(obj.x+obj.w, obj.y+obj.h);
							ctx.lineTo(obj.x-obj.w, obj.y+obj.h);
							ctx.lineTo(obj.x, obj.y);
							ctx.lineWidth = 3;
							ctx.strokeStyle = 'black';
							ctx.stroke();
							ctx.closePath();   
						},
						"editFunc":function(x,y){
							console.log("doing a dummy log");
						},
						"hitTest":function(shape,mx,my) {
/*				  			 return ((Math.abs (shape.x1 * (shape.y2 - shape.y3) + shape.x2 * (shape.y3 - shape.y1) + shape.x3 * (shape.y1 - shape.y2)))
												==( Math.abs (shape.x1 * (shape.y2 - my) + shape.x2 * (my - shape.y1) + mx * (shape.y1 - shape.y2))
													+Math.abs (shape.x1 * (my - shape.y3) + mx * (shape.y3 - shape.y1) + shape.x3 * (shape.y1 - my))
													+Math.abs (mx * (shape.y2 - shape.y3) + shape.x2 * (shape.y3 - my) + shape.x3 * (my - shape.y2))))		
	*/
				  			 return ((Math.abs (shape.x * ((shape.y+shape.h) - (shape.y+shape.h)) + (shape.x+shape.w) * ((shape.y+shape.h) - shape.y) + (shape.x-shape.w) * (shape.y - (shape.y+shape.h))))
										==( Math.abs (shape.x * ((shape.y+shape.h) - my) + (shape.x+shape.w) * (my - shape.y) + mx * (shape.y - (shape.y+shape.h)))
											+Math.abs (shape.x * (my - (shape.y+shape.h)) + mx * ((shape.y+shape.h) - shape.y) + (shape.x-shape.w) * (shape.y - my))
											+Math.abs (mx * ((shape.y+shape.h) - (shape.y+shape.h)) + (shape.x+shape.w) * ((shape.y+shape.h) - my) + (shape.x-shape.w) * (my - (shape.y+shape.h)))))	
 						},
						"getShape":function(){
							var shape={ 
								"x":x1Co
								,"y":y1Co
								,"w":width
								,"h":height
								,"color":shapeColor
								,"drawShapeFn":shapeFunc.triangle.drawTriangle
								,"drawShapeDrag":shapeFunc.triangle.drawTriangleDrag
								,"hitTest":shapeFunc.triangle.hitTest
							};
							return shape;
						}
					},
			"line":{
						"createFunc":function(x, y) {
							x1Co=startX;
							y1Co=startY;
							width=x-startX;
							height=y-startY;
							shapeFunc.line.drawLineDrag({"x":x1Co,"y":y1Co,"w":width,"h":height})
						},
						"drawLine":function(obj){
							ctx.beginPath();
							ctx.moveTo(obj.x, obj.y);
							ctx.lineTo(obj.x+obj.w, obj.y+obj.h);
							ctx.lineWidth = 3;
							ctx.stroke();
							ctx.strokeStyle = obj.color;
							ctx.fill();
							ctx.closePath();    
						},
						"drawLineDrag":function(obj){
							ctx.beginPath();
							ctx.moveTo(obj.x, obj.y);
							ctx.lineTo(obj.x+obj.w, obj.y+obj.h);
							ctx.lineWidth = 3;
							ctx.stroke();
						//	obj.color=gotColor;
							ctx.strokeStyle = 'black';
							ctx.fill();
							ctx.closePath();   
						},
						"editFunc":function(x,y){
							console.log("doing a dummy log");
						},
						"hitTest":function(shape,mx,my) {
					/*			var x1=shape.x;var y1=shape.y;
								var x2=shape.x+shape.w;var y2=shape.y+shape.h;
								var subX=(x2-x1);var subY=(y2-y1);
								var c1=((subX)*y1)-((subY)*x1);
								var c2=((subX)*y2)-((subY)*x2);
								var a=mx;var b=my;
								console.log('x1:'+x1+' y1:'+y1+' a:'+a+' b:'+b+' x2:'+x2+' y2:'+y2);
								if(((x1<=a && a<=x2)||(x1>=a && a>=x2)) && ((y1<=b && b<=y2)||(y1>=b && b>=y2))){
									if(((((subX)*b)-((subY)*a)-c1)==0)){
											return true;
									}else if((((subX)*b)-((subY)*a)-c2)==0){
											return true;
									}else{
											return false;
									} 
								}else{
										return false;
								}
						*/
						
						////////////////////
						
	/*					 var slope, intercept;
						var x1, y1, x2, y2;
						var px, py;
						var left, top, right, bottom; // Bounding Box For Line Segment
						var dx, dy;
						x1=shape.x;
						y1=shape.y;
						x2=shape.x+shape.w;
						y2=shape.y+shape.h;
						if (mx < 0){
							px=Math.ceil(mx);
						}else{
							px=Math.floor(mx);
						}
						if (my < 0){
							py=Math.ceil(my);
						}else{
							py=Math.floor(my);
						}
//						px=mx;
//						py=my;
					 
						dx = x2 - x1;
						dy = y2 - y1;
					 
						slope = dy / dx;
						// y = mx + c
						// intercept c = y - mx
						intercept = y1 - slope * x1; // which is same as y2 - slope * x2
						if(x1 < x2)
						{
							left = x1;
							right = x2;
						}
						else
						{
							left = x2;
							right = x1;
						}
						if(y1 < y2)
						{
							top = y1;
							bottom = y2;
						}
						else
						{
							top = y1;
							bottom = y2;
						}
					   
						if( slope * px + intercept > (py - 0.01) &&
							slope * px + intercept < (py + 0.01))
						{
							if( px >= left && px <= right && 
								py >= top && py <= bottom )
							{
								console.log('Given point lies in the line segment');
								return true;
							}
							else
								console.log('Given point is outside the line segment');
								return false;					
						}
						else{
								console.log('The point is outside the line segment');
								return false;
						}		   
						
		*/				
						///////////////////////////
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
								"x":x1Co
								,"y":y1Co
								,"w":width
								,"h":height
								,"color":shapeColor
								,"drawShapeFn":shapeFunc.line.drawLine
								,"drawShapeDrag":shapeFunc.line.drawLineDrag
								,"hitTest":shapeFunc.line.hitTest
							};
							return shape;
						}
					}			
			  }
		 
		var  creationMode = false;
		var  movementMode = false;
		var  coloringMode = false;
		var  brushingMode = false;
		function switchOnCreationMode(shapeName){
			creationMode = true;
			brushingMode = false;
			shapeType=shapeName;
			drawShape = shapeFunc[shapeType].createFunc;
			getShape = shapeFunc[shapeType].getShape;
            document.body.style.cursor="crosshair";
			document.getElementById('hint').style.display="none";
		}
		function switchOnMovementMode(){
			creationMode = false;
			brushingMode = false;
			movementMode = true;
			document.body.style.cursor="move";
			document.getElementById('hint').style.display="block";
		}
		function switchOnBrushMode(brushSizeParameter){
			brushSize = brushSizeParameter;
			brushingMode = true;
			creationMode = false;
			movementMode = false;
			coloringMode = false;
			document.body.style.cursor="pointer";
			document.getElementById('hint').style.display="none";
		}
		function getcreationMode(){
			return creationMode;
		}
		function clearCanvas(){
			shapes = [];
			drawImageId=null;
			numShapes=shapes.length;
			document.getElementById('hint').style.display="none";
			 ctx.clearRect(0, 0, canvas.width, canvas.height);
			 ctx1.clearRect(0, 0, canvas.width, canvas.height);
		}	
		function getColor(colorName){
				gotColor=colorName;
				creationMode = false;
				movementMode = false;
				coloringMode = true;
				document.body.style.cursor="pointer";
				document.getElementById('hint').style.display="none";
		}
/////  Brush Coloring///////////
	var putPoint = function(e){
		if(brushDrag){
				ctx1.lineTo(e.offsetX,e.offsetY);
				ctx1.strokeStyle =gotColor;
				ctx1.stroke();
				ctx1.beginPath();
				ctx1.arc(e.offsetX,e.offsetY, brushSize, 0, Math.PI*2);
				ctx1.lineWidth=brushSize*2;
				ctx1.fillStyle=gotColor;
				ctx1.fill();
				ctx1.beginPath();
				ctx1.moveTo(e.offsetX,e.offsetY);
			//	if(drawImageId!=null){
			//		drawImageOnCanvasKeepOn(drawImageId);
			//	}
			}	
	}
	var engage = function(e){
		brushDrag = true;
		putPoint(e);
	}
	var disengage = function(){
		brushDrag = false;
		ctx1.beginPath();
		
	}
	////End Brush Coloring End/////////

	function drawImageOnCanvas(imageid){
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawImageId=imageid;
				var img = document.getElementById(drawImageId);
				ctx.drawImage(img, 10, 10);
	}
	function drawImageOnCanvasKeepOn(drawImageId){
				var img = document.getElementById(drawImageId);
				ctx.drawImage(img, 10, 10);
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
	function fillShapeColor(evt){
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
			shapes[dragIndexDel].color=gotColor;
			drawShapes();
		}
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
	//	creationMode=true;
	//	document.body.style.cursor="crosshair";
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
    //console.log(e.offsetX,e.offsetY);
    if(getcreationMode()){
        removeMoveEventListeners();
        handleMouseDown(e);    
    }else if(movementMode){
	   
			mouseDownListener(e);
		 
    }else if(brushingMode){ 
			engage(e);
	}else if(coloringMode){ 
			fillShapeColor(e);
	}
    
},false);

canvas.addEventListener("mousemove",function (e) {
     
    if(getcreationMode()){
        removeMoveEventListeners();
        handleMouseMove(e);
    }else if(brushingMode){ 
			putPoint(e); 
	}
},false);
canvas.addEventListener("mouseup",function (e) {
	//console.log(e.offsetX,e.offsetY);
    if(getcreationMode()){
        removeMoveEventListeners();
        handleMouseUp(e);
    }else if(brushingMode){ 
			disengage();
	}
},false);
canvas.addEventListener("mouseout",function (e) {
    if(getcreationMode()){
        removeMoveEventListeners();
        handleMouseOut(e);
    }else if(brushingMode){ 
			disengage();
	}
//	document.body.style.cursor="auto";
},false);

canvas.addEventListener("dblclick",function (evt) {
   // if(!getcreationMode()){
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
    if(dragIndexDel != -1 && movementMode){
        shapes.splice(dragIndexDel, 1);    
    }
    numShapes = shapes.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShapes(); 
},false);