{-# LANGUAGE OverloadedStrings #-}

import Data.Either (lefts)
import Data.List (sort)
import Data.Text (Text, splitOn)
import Data.Text.IO (readFile)
import Data.Text.Read (decimal)
import Prelude hiding (last)

main = do
  content <- Data.Text.IO.readFile "input.txt"
  let groups = splitOn "\n\n" content
  let summedIntegerGroups = sort (map (sum . map toint . splitOn "\n") groups)
  putStrLn "Part 1: " >> print (tostr (last summedIntegerGroups))
  putStrLn "Part 2: " >> print (tostr (sum (lastR 3 summedIntegerGroups)))

toint :: Text -> Int
toint x = case decimal x of
  Left _ -> 0
  Right (a, _) -> a

tostr :: Int -> String
tostr = show

removeItem :: [Int] -> Int -> [Int]
removeItem [] _ = []
removeItem (y : ys) x
  | x == y = removeItem ys x
  | otherwise = y : removeItem ys x

last :: [Int] -> Int
last [] = 0
last [x] = x
last (_ : xs) = last xs

lastR :: Int -> [a] -> [a]
lastR n xs = drop (length xs - n) xs