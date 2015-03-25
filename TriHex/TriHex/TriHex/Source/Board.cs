using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace TriHex.Source
{
    class Board
    {
        private int _width, _height;
        private Hexagon[,] grid;

        private Animation animation;

        public Board(int w, int h)
        {
            width = w;
            height = h;

            grid = new Hexagon[height, width];

            for (int i = 0; i < height; i++)
            {
                for (int j = 0; j < width; j++)
                {
                    grid[i, j] = new Hexagon(i, j);
                }
            }

            animation = new Animation();
            animation.isAnimating = false;
        }

        public void draw(SpriteBatch spriteBatch)
        {
            Texture2D hexImage = Window.hexImage;
            Texture2D outline = Window.outlineImage;
            int x = 0;
            int xStep = (int) (hexImage.Width*0.75);
            for (int i = 0; i < grid.GetLength(0); i++)
            {
                int y = 0;
                int yStep = hexImage.Height;
                if (i % 2 == 1)
                {
                    y = yStep / 2;
                }
                for (int j = 0; j < grid.GetLength(1); j++)
                {
                    Hexagon hex = grid[i, j]; 
                    if (animation.isAnimating && animation.containsHex(hex))
                    {
                        continue;
                    }
                    spriteBatch.Draw(hexImage, hex.bounds, hex.color);
                    spriteBatch.Draw(outline, hex.bounds, Color.White);
                    y += yStep; 
                }
                x += xStep;
            }

            if (animation.isAnimating)
            {
                foreach (Hexagon hex in animation.trihex)
                {
                    spriteBatch.End();
                    Vector2 center = animation.center;
                    Matrix m = Matrix.CreateTranslation(-center.X, -center.Y, 0) *
                    Matrix.CreateRotationZ(animation.theta) *                   // rotation : parameter
                    Matrix.CreateTranslation(center.X, center.Y, 0); // pos : parameter!

                    spriteBatch.Begin(SpriteSortMode.Deferred, null, null, null, null, null, m);

                    spriteBatch.Draw(hexImage, hex.bounds, hex.color);
                    spriteBatch.Draw(outline, hex.bounds, Color.White);
                    spriteBatch.End();
                    spriteBatch.Begin();
                    animation.theta += 0.04f;
                    if (animation.theta >= 2 * Math.PI/3)
                    {
                        animation.reset();
                    }
                }
            }
        }

        public void processClick(int x, int y)
        {
            if (animation.isAnimating)
            {
                return;
            }
            Hexagon[] trihex = new Hexagon[3];
            SortedDictionary<float, Hexagon> map = new SortedDictionary<float, Hexagon>();

            for (int i = 0; i < height; i++)
            {
                for (int j = 0; j < width; j++)
                {
                    Vector2 center = grid[i, j].center;

                    float dx = x - center.X;
                    float dy = y - center.Y;
                    float distance = dx*dx + dy*dy;
                    if(!map.ContainsKey(distance))
                    map.Add(distance, grid[i, j]);
                }
            }

            int filled = 0;

            KeyValuePair<float, Hexagon>[] pairs = new KeyValuePair<float, Hexagon>[3];
            map.CopyTo(pairs, 0);

            trihex[0] = pairs[0].Value;
            trihex[1] = pairs[1].Value;
            trihex[2] = pairs[2].Value;

            Vector2 triCenter = Vector2.Zero;
            foreach (Vector2 vertex in trihex[0].vertices)
            {
                if (trihex[1].sharesVertex((vertex)) && trihex[2].sharesVertex(vertex))
                {
                    triCenter = vertex;
                }
            }

            animation.set(trihex, triCenter);

            sortTri(trihex, triCenter);

        }

        private void sortTri(Hexagon[] tri, Vector2 center)
        {
            for (int i = 0; i < tri.Length; i++)
            {
                for (int j = i + 1; j < tri.Length; j++)
                {
                    if (less(tri[j].center, tri[j-1].center, center))
                    {
                        swap(tri, j, j-1);
                    }
                }
            }
        }

        private void swap(Hexagon[] tri, int a, int b)
        {
            Hexagon temp = tri[a];
            tri[a] = tri[b];
            tri[b] = temp;
        }

        private bool less(Vector2 a, Vector2 b, Vector2 center)
        {
            if (a.X - center.X >= 0 && b.X - center.X < 0)
            {
                return true;
            }
            if (a.X - center.X < 0 && b.X - center.X >= 0)
            {
                return false;
            }
            if (a.Y - center.Y >= 0 || b.Y - center.Y >= 0)
                return a.Y > b.Y;
            return b.Y > a.Y;
        }

        public int width
        {
            get { return _width; }
            set { _width = value; }
        }

        public int height
        {
            get { return _height; }
            set { _height = value; }
        }
    }

    struct Animation
    {
        public bool isAnimating;
        public Hexagon[] trihex;
        public Vector2 center;
        public float theta;

        public void set(Hexagon[] tri, Vector2 mid)
        {
            isAnimating = true;
            trihex = tri;
            center = mid;
            theta = 0;
        }

        public bool containsHex(Hexagon other)
        {
            foreach (Hexagon hex in trihex)
            {
                if (hex.bounds.Equals(other.bounds))
                    return true;
            }
            return false;
        }

        public void reset()
        {
            isAnimating = false;

            Color[] newHex =
            {
                trihex[2].color,
                trihex[0].color,
                trihex[1].color
            };


            for (int i = 0; i < 3; i++)
            {
                trihex[i].color = newHex[i];
            }
        }
    }
}
