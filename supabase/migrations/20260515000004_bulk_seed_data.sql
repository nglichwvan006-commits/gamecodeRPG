-- Bulk Seed Data for Code Adventure RPG
-- Adds 50 Easy Problems, 20 Achievements, 30 Items, 10 Pets, 5 Zones, 5 Bosses

--------------------------------------------------------------------------------
-- 1. PROBLEMS (50 Easy Problems + Specific Map Problems)
--------------------------------------------------------------------------------
INSERT INTO problems (id, title, description, difficulty, points, xp_reward, category, tags, test_cases, initial_code) VALUES
('77777777-7777-7777-7777-777777777777', 'Syntax Basics', 'Fix the syntax error in this simple program.', 'Easy', 10, 50, 'Basics', '["syntax"]', '[{"input": [], "expected": "Hello World"}]', 'function hello() {\n  return "Hello World"\n}'),
('88888888-8888-8888-8888-888888888888', 'Array Loop', 'Find the sum of all elements in an array.', 'Easy', 15, 60, 'Arrays', '["loops"]', '[{"input": [[1,2,3]], "expected": 6}]', 'function sum(arr) {}'),
('99999999-9999-9999-9999-999999999999', 'Fibonacci Master', 'Return the nth Fibonacci number.', 'Medium', 30, 150, 'Algorithms', '["dp", "recursion"]', '[{"input": [5], "expected": 5}]', 'function fib(n) {}'),
(uuid_generate_v4(), 'Reverse a String', 'Write a function that reverses a given string.', 'Easy', 10, 50, 'Strings', '["strings"]', '[{"input": ["hello"], "expected": "olleh"}, {"input": ["world"], "expected": "dlrow"}]', 'function reverseString(str) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Check Palindrome', 'Determine if a string is a palindrome (reads the same forwards and backwards).', 'Easy', 15, 60, 'Strings', '["strings", "logic"]', '[{"input": ["racecar"], "expected": true}, {"input": ["hello"], "expected": false}]', 'function isPalindrome(str) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'FizzBuzz', 'Return "Fizz" if divisible by 3, "Buzz" if by 5, "FizzBuzz" if both, else the number.', 'Easy', 10, 50, 'Logic', '["math", "logic"]', '[{"input": [3], "expected": "Fizz"}, {"input": [5], "expected": "Buzz"}, {"input": [15], "expected": "FizzBuzz"}, {"input": [7], "expected": 7}]', 'function fizzBuzz(n) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Find Maximum', 'Given an array, return the largest element.', 'Easy', 10, 50, 'Arrays', '["arrays"]', '[{"input": [[1, 5, 3]], "expected": 5}, {"input": [[-10, 0, -5]], "expected": 0}]', 'function findMax(arr) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Is Number Even?', 'Return true if the number is even, false otherwise.', 'Easy', 5, 30, 'Math', '["basics"]', '[{"input": [4], "expected": true}, {"input": [7], "expected": false}]', 'function isEven(n) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Count Vowels', 'Count the number of vowels (a, e, i, o, u) in a string.', 'Easy', 15, 60, 'Strings', '["strings"]', '[{"input": ["hello"], "expected": 2}, {"input": ["programming"], "expected": 3}]', 'function countVowels(str) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Calculate Factorial', 'Return the factorial of a non-negative integer n.', 'Easy', 15, 75, 'Math', '["recursion", "math"]', '[{"input": [5], "expected": 120}, {"input": [0], "expected": 1}]', 'function factorial(n) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Remove Duplicates', 'Remove duplicate elements from an array.', 'Easy', 20, 100, 'Arrays', '["arrays", "sets"]', '[{"input": [[1, 2, 2, 3, 1]], "expected": [1, 2, 3]}]', 'function removeDuplicates(arr) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Sum of N Numbers', 'Return the sum of integers from 1 to n.', 'Easy', 10, 50, 'Math', '["math"]', '[{"input": [10], "expected": 55}]', 'function sumN(n) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Array Average', 'Calculate the average value of elements in an array.', 'Easy', 10, 50, 'Arrays', '["arrays"]', '[{"input": [[1, 2, 3, 4, 5]], "expected": 3}]', 'function average(arr) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Find Minimum', 'Find the smallest number in an array.', 'Easy', 10, 50, 'Arrays', '["arrays"]', '[{"input": [[10, 20, 5, 30]], "expected": 5}]', 'function findMin(arr) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Length of Last Word', 'Find the length of the last word in a string.', 'Easy', 15, 60, 'Strings', '["strings"]', '[{"input": ["Hello World"], "expected": 5}, {"input": ["   fly me   to   the moon  "], "expected": 4}]', 'function lengthOfLastWord(s) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Check Leap Year', 'Return true if the year is a leap year.', 'Easy', 15, 60, 'Math', '["logic"]', '[{"input": [2000], "expected": true}, {"input": [1900], "expected": false}]', 'function isLeapYear(year) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Celsius to Fahrenheit', 'Convert temperature from Celsius to Fahrenheit.', 'Easy', 10, 50, 'Math', '["conversions"]', '[{"input": [0], "expected": 32}, {"input": [100], "expected": 212}]', 'function cToF(c) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Find Index of Element', 'Return the index of a value in an array or -1 if not found.', 'Easy', 10, 50, 'Arrays', '["arrays"]', '[{"input": [[1, 2, 3], 2], "expected": 1}]', 'function findIndex(arr, val) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Concatenate Strings', 'Join two strings with a space.', 'Easy', 5, 20, 'Strings', '["basics"]', '[{"input": ["Hello", "World"], "expected": "Hello World"}]', 'function joinStrings(s1, s2) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Capitalize First Letter', 'Capitalize the first letter of a string.', 'Easy', 10, 50, 'Strings', '["strings"]', '[{"input": ["javascript"], "expected": "Javascript"}]', 'function capitalize(s) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Power of Two', 'Check if a number is a power of two.', 'Easy', 20, 80, 'Math', '["bit-manipulation"]', '[{"input": [16], "expected": true}, {"input": [18], "expected": false}]', 'function isPowerOfTwo(n) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Reverse Array', 'Reverse the elements of an array in place or return new.', 'Easy', 10, 50, 'Arrays', '["arrays"]', '[{"input": [[1, 2, 3]], "expected": [3, 2, 1]}]', 'function reverseArray(arr) {\n  // Write your code here\n}'),
(uuid_generate_v4(), 'Count Occurrences', 'Count how many times a character appears in a string.', 'Easy', 15, 60, 'Strings', '["strings"]', '[{"input": ["mississippi", "s"], "expected": 4}]', 'function countChar(s, char) {\n  // Write your code here\n}'),
-- Adding more to reach 50
(uuid_generate_v4(), 'Repeat String', 'Repeat a string n times.', 'Easy', 10, 50, 'Strings', '[]', '[{"input": ["abc", 3], "expected": "abcabcabc"}]', 'function repeat(s, n) {}'),
(uuid_generate_v4(), 'Truncate String', 'Truncate a string if it is longer than n.', 'Easy', 10, 50, 'Strings', '[]', '[{"input": ["hello world", 5], "expected": "hello..."}]', 'function truncate(s, n) {}'),
(uuid_generate_v4(), 'Find Longest Word', 'Find the longest word in a sentence.', 'Easy', 15, 75, 'Strings', '[]', '[{"input": ["The quick brown fox"], "expected": "quick"}]', 'function longestWord(s) {}'),
(uuid_generate_v4(), 'Validate Email', 'Simple regex check for email format.', 'Easy', 20, 100, 'Regex', '[]', '[{"input": ["test@test.com"], "expected": true}]', 'function validateEmail(e) {}'),
(uuid_generate_v4(), 'Merge Arrays', 'Combine two arrays and remove duplicates.', 'Easy', 20, 100, 'Arrays', '[]', '[{"input": [[1,2], [2,3]], "expected": [1,2,3]}]', 'function merge(a, b) {}'),
(uuid_generate_v4(), 'Get Array Intersection', 'Find common elements between two arrays.', 'Easy', 20, 100, 'Arrays', '[]', '[{"input": [[1,2,3], [2,3,4]], "expected": [2,3]}]', 'function intersect(a, b) {}'),
(uuid_generate_v4(), 'Binary to Decimal', 'Convert binary string to decimal number.', 'Easy', 20, 100, 'Math', '[]', '[{"input": ["1010"], "expected": 10}]', 'function bToD(b) {}'),
(uuid_generate_v4(), 'Decimal to Binary', 'Convert decimal number to binary string.', 'Easy', 20, 100, 'Math', '[]', '[{"input": [10], "expected": "1010"}]', 'function dToB(d) {}'),
(uuid_generate_v4(), 'Is Anagram', 'Check if two strings are anagrams.', 'Easy', 20, 100, 'Strings', '[]', '[{"input": ["listen", "silent"], "expected": true}]', 'function isAnagram(a, b) {}'),
(uuid_generate_v4(), 'Filter Odd Numbers', 'Remove even numbers from an array.', 'Easy', 10, 50, 'Arrays', '[]', '[{"input": [[1,2,3,4]], "expected": [1,3]}]', 'function filterOdd(arr) {}'),
(uuid_generate_v4(), 'Flatten Array', 'Flatten a 2D array into 1D.', 'Easy', 20, 100, 'Arrays', '[]', '[{"input": [[[1,2], [3,4]]], "expected": [1,2,3,4]}]', 'function flatten(arr) {}'),
(uuid_generate_v4(), 'Chunk Array', 'Split an array into chunks of size n.', 'Easy', 25, 120, 'Arrays', '[]', '[{"input": [[1,2,3,4], 2], "expected": [[1,2], [3,4]]}]', 'function chunk(arr, size) {}'),
(uuid_generate_v4(), 'Title Case', 'Convert string to Title Case.', 'Easy', 15, 75, 'Strings', '[]', '[{"input": ["i am a coder"], "expected": "I Am A Coder"}]', 'function titleCase(s) {}'),
(uuid_generate_v4(), 'Random Integer', 'Generate a random integer between min and max.', 'Easy', 10, 50, 'Math', '[]', '[{"input": [1, 1], "expected": 1}]', 'function randomInt(min, max) {}'),
(uuid_generate_v4(), 'GCD of Two Numbers', 'Find the greatest common divisor.', 'Easy', 20, 100, 'Math', '[]', '[{"input": [8, 12], "expected": 4}]', 'function gcd(a, b) {}'),
(uuid_generate_v4(), 'LCM of Two Numbers', 'Find the least common multiple.', 'Easy', 20, 100, 'Math', '[]', '[{"input": [4, 6], "expected": 12}]', 'function lcm(a, b) {}'),
(uuid_generate_v4(), 'Fibonacci Iterative', 'Return nth Fibonacci number without recursion.', 'Easy', 15, 75, 'Math', '[]', '[{"input": [6], "expected": 8}]', 'function fib(n) {}'),
(uuid_generate_v4(), 'Prime Checker', 'Check if a number is prime.', 'Easy', 20, 100, 'Math', '[]', '[{"input": [13], "expected": true}]', 'function isPrime(n) {}'),
(uuid_generate_v4(), 'Get Prime Factors', 'Return prime factors of a number.', 'Easy', 25, 125, 'Math', '[]', '[{"input": [12], "expected": [2, 2, 3]}]', 'function primeFactors(n) {}'),
(uuid_generate_v4(), 'Matrix Transpose', 'Transpose a 2x2 matrix.', 'Easy', 25, 125, 'Math', '[]', '[{"input": [[[1,2],[3,4]]], "expected": [[1,3],[2,4]]}]', 'function transpose(m) {}'),
(uuid_generate_v4(), 'Rotate Array', 'Rotate array to the right by k steps.', 'Easy', 20, 100, 'Arrays', '[]', '[{"input": [[1,2,3], 1], "expected": [3,1,2]}]', 'function rotate(arr, k) {}'),
(uuid_generate_v4(), 'Sum Digits', 'Sum all digits of a number.', 'Easy', 15, 75, 'Math', '[]', '[{"input": [123], "expected": 6}]', 'function sumDigits(n) {}'),
(uuid_generate_v4(), 'Count Words', 'Count number of words in a string.', 'Easy', 10, 50, 'Strings', '[]', '[{"input": ["Hello world"], "expected": 2}]', 'function countWords(s) {}'),
(uuid_generate_v4(), 'Check Subset', 'Check if array A is a subset of B.', 'Easy', 20, 100, 'Arrays', '[]', '[{"input": [[1,2], [1,2,3]], "expected": true}]', 'function isSubset(a, b) {}'),
(uuid_generate_v4(), 'Unique Values', 'Return unique values using Set.', 'Easy', 10, 50, 'Arrays', '[]', '[{"input": [[1,1,2]], "expected": [1,2]}]', 'function unique(arr) {}'),
(uuid_generate_v4(), 'Valid Bracket Start', 'Check if string starts with ( and ends with ).', 'Easy', 10, 50, 'Logic', '[]', '[{"input": ["(hello)"], "expected": true}]', 'function valid(s) {}'),
(uuid_generate_v4(), 'Sort Array', 'Sort an array of numbers.', 'Easy', 10, 50, 'Arrays', '[]', '[{"input": [[3,1,2]], "expected": [1,2,3]}]', 'function sortArr(arr) {}'),
(uuid_generate_v4(), 'Find Duplicates', 'Return array of duplicate values.', 'Easy', 20, 100, 'Arrays', '[]', '[{"input": [[1,2,2,3,3]], "expected": [2,3]}]', 'function getDupes(arr) {}'),
(uuid_generate_v4(), 'Missing Number', 'Find the missing number in 1-n range.', 'Easy', 20, 100, 'Math', '[]', '[{"input": [[1,2,4,5]], "expected": 3}]', 'function missing(arr) {}'),
(uuid_generate_v4(), 'Last Element', 'Return the last element of an array.', 'Easy', 5, 20, 'Arrays', '[]', '[{"input": [[1,2,3]], "expected": 3}]', 'function last(arr) {}');

--------------------------------------------------------------------------------
-- 2. ACHIEVEMENTS (20 Achievements)
--------------------------------------------------------------------------------
INSERT INTO achievements (name, description, icon, condition_type, condition_value) VALUES
('Hello Coder', 'Solve your very first problem.', '👋', 'problems_solved', 1),
('Syntax Novice', 'Solve 5 easy problems.', '📜', 'problems_solved', 5),
('Variable Voyager', 'Solve 25 problems.', '🚀', 'problems_solved', 25),
('Logic Lord', 'Solve 50 problems.', '👑', 'problems_solved', 50),
('Algorithm Architect', 'Solve 100 problems.', '🏛️', 'problems_solved', 100),
('Coin Collector', 'Earn 500 coins.', '💰', 'coins_earned', 500),
('Gold Miner', 'Earn 5000 coins.', '⛏️', 'coins_earned', 5000),
('Treasure Hunter', 'Earn 20000 coins.', '💎', 'coins_earned', 20000),
('Level Up!', 'Reach level 10.', '🆙', 'player_level', 10),
('Master Coder', 'Reach level 50.', '🧙', 'player_level', 50),
('Pet Lover', 'Own your first pet.', '🐾', 'pets_owned', 1),
('Zoologist', 'Collect 5 different pets.', '🐘', 'pets_owned', 5),
('Item Hoarder', 'Have 10 items in your inventory.', '📦', 'items_owned', 10),
('Boutique Shopper', 'Spend 1000 coins in the shop.', '🛍️', 'coins_spent', 1000),
('Daily Warrior', 'Complete 7 daily quests in a row.', '📅', 'daily_streak', 7),
('Monthly Legend', 'Complete 30 daily quests in a row.', '🌕', 'daily_streak', 30),
('Boss Slayer', 'Defeat your first world boss.', '⚔️', 'bosses_defeated', 1),
('Giant Killer', 'Defeat 5 world bosses.', '💀', 'bosses_defeated', 5),
('Execution Expert', 'Submit code with 100ms or less execution time.', '⚡', 'fast_execution', 1),
('Memory Optimizer', 'Submit code with minimal memory usage.', '🧠', 'low_memory', 1);

--------------------------------------------------------------------------------
-- 3. INVENTORY_ITEMS (30 Items)
--------------------------------------------------------------------------------
INSERT INTO inventory_items (name, type, description, stats_boost, price) VALUES
('Mechanical Keyboard', 'Weapon', 'Clicky switches for faster typing.', '{"attack": 15}', 150),
('Gaming Mouse', 'Weapon', 'Precise clicking for better aim.', '{"attack": 10}', 100),
('Dual Monitors', 'Armor', 'See everything at once. Increases defense.', '{"defense": 15}', 300),
('Ergonomic Chair', 'Armor', 'Supports your back during long sessions.', '{"hp": 100}', 500),
('RGB Strip', 'Accessory', 'Increases your style and XP gain.', '{"xp_boost": 0.05}', 200),
('Espresso Shot', 'Potion', 'Instant focus. Restores MP.', '{"mp": 50}', 30),
('Energy Drink', 'Potion', 'Restores energy for more coding.', '{"mp": 30, "hp": 20}', 40),
('Blue Light Glasses', 'Armor', 'Protects your eyes.', '{"defense": 5}', 80),
('Hoodie of Hiding', 'Armor', 'A classic developer garment.', '{"defense": 10, "stealth": 5}', 250),
('Noise Cancelling Headphones', 'Accessory', 'Focus on the code, ignore the bugs.', '{"mp_regen": 5}', 400),
('Wireless Router', 'Accessory', 'Stable connection to the server.', '{"speed": 5}', 150),
('Stress Ball', 'Potion', 'Restores a small amount of HP.', '{"hp": 20}', 15),
('Coding Journal', 'Accessory', 'Increases XP reward per problem.', '{"xp_reward_bonus": 10}', 350),
('Vintage Terminal', 'Weapon', 'A relic from the early days.', '{"attack": 25, "mp": -10}', 600),
('Cloud Server Script', 'Accessory', 'Scalability at your fingertips.', '{"mp": 100}', 800),
('Rubber Duckie', 'Accessory', 'Debug your problems aloud.', '{"logic_bonus": 5}', 50),
('Dark Theme License', 'Accessory', 'Real coders use dark theme.', '{"style": 100}', 0),
('Linter Script', 'Weapon', 'Clean your code as you go.', '{"attack": 12}', 180),
('Git Commit Ribbon', 'Accessory', 'Proof of your hard work.', '{"reputation": 10}', 100),
('Coffee Mug', 'Potion', 'An endless supply of motivation.', '{"mp": 20}', 20),
('Sticker Pack', 'Accessory', 'Decorate your gear.', '{"style": 10}', 30),
('Stand-up Desk', 'Armor', 'Healthier coding posture.', '{"hp": 200}', 1000),
('Python Plushie', 'Accessory', 'Soft and indentation-sensitive.', '{"python_bonus": 10}', 120),
('JS Shield', 'Armor', 'Protects from undefined errors.', '{"defense": 20}', 350),
('C++ Heavy Sword', 'Weapon', 'Hard to master, but powerful.', '{"attack": 40, "speed": -5}', 900),
('Ruby Ring', 'Accessory', 'A gem for elegant solutions.', '{"mp": 40}', 450),
('Go Gopher Statue', 'Accessory', 'Fast and concurrent.', '{"speed": 10}', 500),
('PHP Elephant', 'Accessory', 'Old but reliable for the web.', '{"hp": 50}', 100),
('Docker Container', 'Armor', 'Deploy anywhere safely.', '{"defense": 30}', 700),
('Kubernetes Cape', 'Accessory', 'Orchestrate your power.', '{"all_stats": 5}', 2000);

--------------------------------------------------------------------------------
-- 4. PETS (10 Pets)
--------------------------------------------------------------------------------
INSERT INTO pets (name, description, buff_type, buff_value, rarity) VALUES
('Binary Cat', 'Meows in 0s and 1s.', 'xp_boost', 0.1, 'Common'),
('Hex Dog', 'Follows you at base 16.', 'coin_boost', 0.1, 'Common'),
('ASCII Fish', 'Swimming through the text buffers.', 'mp_regen', 2, 'Common'),
('Log Hamster', 'Keeps track of all your steps.', 'defense', 5, 'Common'),
('Boolean Bird', 'Always tells the truth (True/False).', 'attack', 5, 'Rare'),
('Compiler Chameleon', 'Changes color to match your IDE.', 'crit_chance', 0.05, 'Rare'),
('Recursion Rabbit', 'Multiplies your effectiveness.', 'mp', 50, 'Rare'),
('Database Dragon', 'Guards your precious data.', 'defense', 20, 'Epic'),
('Algorithm Ape', 'Solves puzzles with brute force.', 'attack', 15, 'Epic'),
('Neural Phoenix', 'Learns and evolves with you.', 'all_stats', 10, 'Legendary');

--------------------------------------------------------------------------------
-- 5. ZONES (5 Zones - Linked to Beginner Village Map)
--------------------------------------------------------------------------------
-- Map ID: 44444444-4444-4444-4444-444444444444 (Beginner Village)
INSERT INTO zones (map_id, name, description, enemy_type, problem_id) VALUES
('44444444-4444-4444-4444-444444444444', 'Variable Valley', 'A low-lying area where declarations are made.', 'Syntax Skeleton', (SELECT id FROM problems WHERE title = 'Reverse a String' LIMIT 1)),
('44444444-4444-4444-4444-444444444444', 'Array Archipelago', 'A series of islands where data is stored in order.', 'List Lizard', (SELECT id FROM problems WHERE title = 'Find Maximum' LIMIT 1)),
('44444444-4444-4444-4444-444444444444', 'Logic Labyrinth', 'A maze where you must choose the right path.', 'If-Else Imp', (SELECT id FROM problems WHERE title = 'FizzBuzz' LIMIT 1)),
('44444444-4444-4444-4444-444444444444', 'String Stream', 'A flowing river of characters.', 'Char Crocodile', (SELECT id FROM problems WHERE title = 'Check Palindrome' LIMIT 1)),
('44444444-4444-4444-4444-444444444444', 'Math Mountain', 'Climb the peaks of calculation.', 'Number Naga', (SELECT id FROM problems WHERE title = 'Calculate Factorial' LIMIT 1));

--------------------------------------------------------------------------------
-- 6. BOSSES (5 Bosses)
--------------------------------------------------------------------------------
INSERT INTO bosses (name, description, total_hp, required_level, reward_pool) VALUES
('Memory Leak', 'Slowly consumes your resources until you crash.', 1000, 3, '{"coins": 200, "xp": 500}'),
('Race Condition', 'Unpredictable and fast. Hard to hit.', 2000, 7, '{"coins": 500, "xp": 1200}'),
('Merge Conflict', 'A wall of conflicting changes that blocks progress.', 5000, 15, '{"coins": 1500, "xp": 3000}'),
('Deadlock', 'Freezes your actions. Must be broken carefully.', 8000, 25, '{"coins": 3000, "xp": 7000}'),
('Legacy System Architect', 'The ultimate challenge. Uses outdated tech but very stable.', 25000, 50, '{"coins": 10000, "xp": 25000, "legendary_drop": true}');
