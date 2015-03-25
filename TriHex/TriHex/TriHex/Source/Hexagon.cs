using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;


namespace TriHex.Source
{
    class Hexagon
    {
        private Color _color;
        private Rectangle _bounds;

        public int row, col;

        public Hexagon(int r, int c)
        {
            row = r;
            col = c;

            Color[] possible =
            {
                Color.Red, Color.Blue, Color.Green,
                Color.Purple, Color.Orange, Color.Yellow
            };
            int index = Window.random.Next(6);
            color = possible[index];

            int width = Window.hexImage.Width;
            int height = Window.hexImage.Height;
            int x = (int) (c*width*0.75);
            int y = r*height;

            if (c%2 == 1)
            {
                y += height/2;
            }

            bounds = new Rectangle(x, y, width, height);
        }

        public bool sharesVertex(Vector2 other)
        {
            foreach (Vector2 vertex in vertices)
            {
                float distance = Util.distance(other, vertex);
                if (distance < 10)
                {
                    return true;
                }
            }
            return false;
        }

        public Color color
        {
            get { return _color; }
            set { _color = value; }
        }

        public Rectangle bounds
        {
            get { return _bounds; }
            set { _bounds = value; }
        }

        public Vector2[] vertices
        {
            get
            {
                Vector2 origin = new Vector2(bounds.X, bounds.Y);
                Vector2 left = origin + new Vector2(0, bounds.Height/2);
                Vector2 right = origin + new Vector2(bounds.Width, bounds.Height/2);
                Vector2 topLeft = origin + new Vector2(bounds.Width*0.25f, 0);
                Vector2 topRight = origin + new Vector2(bounds.Width*0.75f, 0);
                Vector2 bottomLeft = origin + new Vector2(bounds.Width * 0.25f, bounds.Height);
                Vector2 bottomRight = origin + new Vector2(bounds.Width * 0.75f, bounds.Height);

                Vector2[] result = {left, right, topLeft, topRight, bottomRight, bottomLeft};
                return result;
            }
        }

        public Vector2 center
        {
            get
            {
                Point centerPoint = bounds.Center;
                return new Vector2(centerPoint.X, centerPoint.Y);
            }
        }
    }
}
