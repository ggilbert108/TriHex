
addEventListener("load", start, false);

var grid = [];
var buttons = [];

function start()
{
	var stage = new createjs.Stage("canvas");
	var half = Math.floor(SIZE / 2);
	for(var i = 0; i < SIZE; i++)
	{
		var colSize = SIZE - Math.abs(i - half);
		for(var j = 0; j < colSize; j++)
		{
			var offset = SIZE - colSize;
			var row = j + offset / 2;
			var hexagon = new Hexagon(row, i);
			stage.addChild(hexagon.shape);

			if((i >= half && (j == 0 || j == colSize - 1)) || i == SIZE - 1)
				continue;

			var x = hexagon.x + HEX_WIDTH/2;
			var y = hexagon.y;
			buttons[buttons.length] = new CircleButton(x, y, BUTTON_SIZE);
		}
	}

	for(var i = 0; i < buttons.length; i++)
	{
		stage.addChild(buttons[i].shape);
		var ind = i;
		buttons[i].shape.addEventListener("click", buttonPress);
		stage.update();
}

function buttonPress(evt)
{
	var pressedButton = getButton(evt.stageX, evt.stageY);	
}

// function getButton(x, y)
// {
// 	var buttonBounds = null;
// 	for(var i = 0; i < buttons.length; i++)
// 	{
// 		var bounds = buttons[i].getBounds();
// 		if(bounds.contains(x, y))
// 		{
// 			console.log("clicked " + i);
// 			buttonBounds = bounds;
// 		}
// 	}
// }




//------------------CONSTANTS-----------------------
var CANVAS_X_OFFSET = 51;
var CANVAS_Y_OFFSET = 44;
var HEX_HEIGHT = 86;
var HEX_WIDTH = 100;
var BUTTON_SIZE = 20;

//size HAS to be an odd number
var SIZE = 5;
