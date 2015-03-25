using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Audio;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.GamerServices;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using Microsoft.Xna.Framework.Media;

namespace TriHex.Source
{
    /// <summary>
    /// This is the main type for your game
    /// </summary>
    public class Window : Microsoft.Xna.Framework.Game
    {
        GraphicsDeviceManager graphics;
        SpriteBatch spriteBatch;
        InputHelper helper;

        public static Random random;
        private Board board;
        public static Texture2D hexImage;
        public static Texture2D outlineImage;

        public Window()
        {
            graphics = new GraphicsDeviceManager(this);
            Content.RootDirectory = "Content";
            this.IsMouseVisible = true;
        }

        protected override void Initialize()
        {
            random = new Random();
            helper = new InputHelper();
            base.Initialize();
        }

        protected override void LoadContent()
        {
            spriteBatch = new SpriteBatch(GraphicsDevice);
            hexImage = Content.Load<Texture2D>("hex");
            outlineImage = Content.Load<Texture2D>("outline");

            board = new Board(10, 5);
        }

        protected override void UnloadContent()
        {

        }

        protected override void Update(GameTime gameTime)
        {
            MouseState mouseState = Mouse.GetState();
            helper.Update();
            if (mouseState.LeftButton == ButtonState.Pressed && helper.IsNewPress(MouseButtons.LeftButton))
            {
                board.processClick(mouseState.X, mouseState.Y);
            }
            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.Beige);

            spriteBatch.Begin();
            board.draw(spriteBatch);
            spriteBatch.End();

            base.Draw(gameTime);
        }
    }
}
