using System;

namespace day9
{
    class Program
    {
        static void Main(string[] args)
        {
            {
                var game = new Marbles(424, 71_144);
                game.Play();
                System.Console.WriteLine(game.Highscore());
            }
            {
                var game = new Marbles(424, 7_114_400);
                game.Play();
                System.Console.WriteLine(game.Highscore());
            }
        }
    }
}
