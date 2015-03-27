function pickColor()
{
	var colors = ["red", "blue", "green", "yellow", "purple", "orange"];
	var index = randomInt(colors.length - 1);
	return colors[index];
}

function randomInt(max)
{
	var random = Math.random() * max;
	return Math.round(random);
}

function getCircle(x, y, radius)
{
    circle = new createjs.Shape();
    circle.graphics.beginFill("green").drawCircle(0, 0, radius);
    circle.graphics.setStrokeStyle(3, "butt");
	circle.graphics.beginStroke("black").drawCircle(0, 0, radius);
    circle.x = x;
    circle.y = y;
    circle.centerX = x;
    circle.centerY = y;
    circle.setBounds(x - radius, y - radius, radius * 2, radius * 2)
    return circle;
}

function getHexagon(row, col, index)
{
	var color = pickColor();

	var x = col * (HEX_WIDTH * 0.75) + CANVAS_X_OFFSET;
	var y = row * HEX_HEIGHT + CANVAS_Y_OFFSET;

	var shape = new createjs.Shape();
	shape.graphics.beginFill(color).drawPolyStar(0, 0, HEX_RADIUS, 6, 0, 0);
	shape.graphics.setStrokeStyle(3, "butt");
	shape.graphics.beginStroke("black").drawPolyStar(0,0, HEX_RADIUS, 6, 0, 0);

	shape.setBounds(x - HEX_RADIUS, y - HEX_RADIUS, HEX_RADIUS * 2, HEX_RADIUS * 2)

	shape.color = color;
	shape.x = x;
	shape.y = y;
	shape.index = index;

	return shape;
}

function redrawHex(shape, newColor)
{
	shape.color = newColor;

	shape.graphics.clear();
	shape.graphics.beginFill(newColor).drawPolyStar(0, 0, HEX_RADIUS, 6, 0, 0);
	shape.graphics.setStrokeStyle(3, "butt");
	shape.graphics.beginStroke("black").drawPolyStar(0,0, HEX_RADIUS, 6, 0, 0);
}

function rotate(shape, theta, x, y)
{
	shape.regX = x;
	shape.regY = y;
	shape.rotation += theta;
}

function compareEpsilon(a, b)
{
	var epsilon = 3;

	var difference = a - b;

	if(Math.abs(difference) < epsilon)
	{
		return 0;
	}
	else if(difference > 0)
	{
		return 1;
	}
	else
	{
		return -1;
	}
}

function sortTrihex(trihex, centerY)
{
	var one, two, three;

	for(var i = 0; i < 3; i++)
	{
		var hexagon = trihex[i];
		if(compareEpsilon(hexagon.y, centerY) == 0)
		{
			one = hexagon;
		}
		else if(compareEpsilon(hexagon.y, centerY) < 0)
		{
			two = hexagon;
		}
		else 
		{
			three = hexagon;
		}
	}

	trihex = [one, two, three];
}

function getAdjacents(hexagon)
{
	var distance = HEX_RADIUS * 1.5;
	var x = hexagon.x;
	var y = hexagon.y;

	var adjacents=
	[
		hexAtCoord(x + distance, y - distance),
		hexAtCoord(x + distance, y + distance),
		hexAtCoord(x - distance, y - distance),
		hexAtCoord(x - distance, y + distance),
		hexAtCoord(x, y - distance),
		hexAtCoord(x, y + distance)
	];

	return adjacents;
}

function hexAtCoord(x, y)
{
	for(var i = 0; i < grid.length; i++)
	{
		var bounds = grid[i].getBounds();
		if(bounds.contains(x, y))
		{
			return grid[i];
		}
	}
	return null;
}

function getGroup(hexagon, minSize)
{
	clearMarked();
	var group = [];
	var count = markSimilar(hexagon, group);
	
	return group;
}

function markSimilar(hexagon, group)
{
	hexagon.marked = true;
	group[group.length] = hexagon;
	var adjacents = getAdjacents(hexagon);

	var result = 1;
	for(var i = 0; i < adjacents.length; i++)
	{
		if(adjacents[i] == null 
			|| adjacents[i].marked
			|| adjacents[i].color != hexagon.color)
		{
			continue;
		}
		result += markSimilar(adjacents[i], group);
	}
	return result;
}

function clearMarked()
{
	for(var i = 0; i < grid.length; i++)
	{
		grid[i].marked = false;
	}
}