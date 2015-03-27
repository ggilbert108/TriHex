var Hexagon = function(row, col)
{
	this.color = pickColor();
	this.row = row;
	this.col = col;

	this.x = col * (HEX_WIDTH * 0.75) + CANVAS_X_OFFSET;
	this.y = row * HEX_HEIGHT + CANVAS_Y_OFFSET;

	this.shape = new createjs.Shape();
	this.shape.graphics.beginFill(this.color).drawPolyStar(this.x, this.y, 50, 6, 0, 0);
	this.shape.graphics.setStrokeStyle(3, "butt");
	this.shape.graphics.beginStroke("black").drawPolyStar(this.x, this.y, 50, 6, 0, 0);}