{-# LANGUAGE OverloadedStrings #-}
{-# OPTIONS_GHC -Wno-incomplete-patterns #-}

import Data.Text (Text, splitOn)
import Data.Text.IO (readFile)
import Debug.Trace (trace)

main = do
  content <- Data.Text.IO.readFile "input.txt"
  let games = splitOn "\n" content
  let scores = map (score "move") games
  putStrLn "Part 1: " >> print (sum scores)
  let scores = map (score "outcome") games
  putStrLn "Part 2: " >> print (sum scores)

score target game = do
  let a = splitOn " " game
  let theirMove = head a
  let ourMove = case target of
        "move" -> last a
        "outcome" -> case last a of
          "X" -> case theirMove of
            "A" -> "Z"
            "B" -> "X"
            "C" -> "Y"
          "Y" -> case theirMove of
            "A" -> "X"
            "B" -> "Y"
            "C" -> "Z"
          "Z" -> case theirMove of
            "A" -> "Y"
            "B" -> "Z"
            "C" -> "X"
  let t = (scoreInternal theirMove, scoreInternal ourMove) --`debug` (show (scoreInternal (head a)) ++ show (scoreInternal (last a)))
  rps t + scoreInternal ourMove

rps :: (Int, Int) -> Int
rps (a, b)
  | a == 1 && b == 2 = 6 --`debug` "paper beats rock"
  | a == 2 && b == 3 = 6 --`debug` "scissors beats paper"
  | a == 3 && b == 1 = 6 --`debug` "rock beats scissors"
  | a == b = 3 --`debug` "tie"
  | otherwise = 0 --`debug` "lose"

scoreInternal :: Text -> Int
scoreInternal x
  | x == "A" = 1
  | x == "B" = 2
  | x == "C" = 3
  | x == "X" = 1
  | x == "Y" = 2
  | x == "Z" = 3
  | otherwise = 0

debug = flip trace
