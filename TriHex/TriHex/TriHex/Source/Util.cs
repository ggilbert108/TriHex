using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;

namespace TriHex.Source
{
    static class Util
    {
        public static float distance(Vector2 a, Vector2 b)
        {
            float dx = a.X - b.X;
            float dy = a.Y - b.Y;
            float result = dx*dx + dy*dy;
            result = (float)Math.Sqrt(result);

            return result;
        }

        public static float distanceSquared(Vector2 a, Vector2 b)
        {
            float dx = a.X - b.X;
            float dy = a.Y - b.Y;
            float result = dx * dx + dy * dy;

            return result;
        }
    }
}
