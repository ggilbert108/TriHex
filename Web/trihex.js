addEventListener("load", start, false);

var grid = [];
var buttons = [];

var ctx;
var stage;

var score = 0;

var animation =
{
	animating: false,
	trihex: [],
	id: -1,
	centerX: 0,
	centerY: 0
};

var fading =
{
	isFading: false,
	fadingHexes: [],
	id: 0
};

function start()
{
	ctx = document.getElementById("canvas").getContext("2d");
	stage = new createjs.Stage("canvas");
	var half = Math.floor(SIZE / 2);
	for(var i = 0; i < SIZE; i++)
	{
		var colSize = SIZE - Math.abs(i - half);
		for(var j = 0; j < colSize; j++)
		{
			var offset = SIZE - colSize;
			var row = j + offset / 2;
			var hexagon = getHexagon(row, i, grid.length);
			grid[grid.length] = hexagon;
			stage.addChild(hexagon);

			if((i >= half && (j == 0 || j == colSize - 1)) || i == SIZE - 1)
				continue;

			var x = hexagon.x + HEX_WIDTH/2;
			var y = hexagon.y;

			buttons[buttons.length] = getCircle(x, y, BUTTON_SIZE);
		}
	}

	var rotateImg = document.getElementById("rotate");
	for(var i = 0; i < buttons.length; i++)
	{
		stage.addChild(buttons[i]);
		var bitmap = new createjs.Bitmap(rotateImg);
		bitmap.x = buttons[i].x + ROTATION_SYMBOL_OFFSET;
		bitmap.y = buttons[i].y + ROTATION_SYMBOL_OFFSET;
		stage.addChild(bitmap);
		var ind = i;
		buttons[i].addEventListener("click", handleClick);
	}
	updateScore();
	checkBoard();
	stage.update();
}

function animate(trihex)
{
	animation.animating = true;
	animation.trihex = trihex;
	animation.id = setInterval(function(){
		var ended = false;
		for(var i = 0; i < 3; i++)
		{
			animation.trihex[i].rotation += 5;
			if(animation.trihex[i].rotation >= 120)
			{
				animation.trihex[i].rotation = 0;
				trihex[i].x -= trihex[i].regX;
				trihex[i].y -= trihex[i].regY;
				trihex[i].regX = 0;
				trihex[i].regY = 0;
				ended = true;
				clearInterval(animation.id);
			}
		}
		if(ended)
		{
			sortTrihex(trihex, animation.centerY);

			var colors =
			[
				trihex[2].color,
				trihex[0].color,
				trihex[1].color
			];

			for(var i = 0; i < 3; i++)
			{
				redrawHex(trihex[i], colors[i]);
			}
			animation.animating = false;
			checkBoard();
		}
		stage.update();
	}, 10);
}

function fade(group)
{
	fading.isFading = true;
	fading.fadingHexes = group;

	fading.id = setInterval(function(){
		var ended = false;
		for(var i = 0; i < fading.fadingHexes.length; i++)
		{
			var hex = fading.fadingHexes[i];
			hex.alpha -= .01;
			if(hex.alpha <= 0)
			{
				ended = true;
				hex.alpha = 1;
				redrawHex(hex, pickColor());
				clearInterval(fading.id);
			}
		}
		if(ended)
		{
			fading.isFading = false;
			fadingHexes = [];
			score += group.length;
			updateScore();
			checkBoard();
		}
		stage.update();
	}, 10);
}

function handleClick(evt)
{
	if(animation.animating || fading.isFading)
	{
		return;
	}
	var button = evt.currentTarget;
	var bounds = button.getBounds();

	var trihex = findIntersectingHexagons(bounds);

	for(var i = 0; i < 3; i++)
	{
		var reg = trihex[i].globalToLocal(button.centerX, button.centerY);
		trihex[i].regX = reg.x;
		trihex[i].regY = reg.y;
		trihex[i].x += reg.x;
		trihex[i].y += reg.y;
	}
	animation.centerX = button.centerX;
	animation.centerY = button.centerY;
	animate(trihex);
	stage.update();
}

function findIntersectingHexagons(bounds)
{
	var trihex = [];

	for(var i = 0; i < grid.length; i++)
	{
		var hexBounds = grid[i].getBounds();
		if(bounds.intersects(hexBounds))
		{
			trihex[trihex.length] = grid[i];
		}
	}
	return trihex;
}

function checkBoard()
{
	for(var i = 0; i < grid.length; i++)
	{
		var group = getGroup(grid[i], 5);
		if(group.length >= 5)
		{
			fade(group);
			return;
		}
	}
}

function removeGroup(group)
{
	score += group.length;
	for(var i = 0; i < group.length; i++)
	{
		redrawHex(group[i], "black");
	}
}

function updateScore()
{
	var scoreElement = document.getElementById("score");
	scoreElement.innerHTML = score;
}

//------------------CONSTANTS-----------------------
var CANVAS_X_OFFSET = 51;
var CANVAS_Y_OFFSET = 44;
var HEX_HEIGHT = 86;
var HEX_WIDTH = 100;
var HEX_RADIUS = 50;
var BUTTON_SIZE = 20;
var ROTATION_SYMBOL_OFFSET = -15;

//size HAS to be an odd number
var SIZE = 5;
//--------------------------------------------------

var rotation = 0;
