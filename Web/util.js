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
    return circle;
}