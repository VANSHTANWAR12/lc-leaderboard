const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

const FILE_PATH = path.join(__dirname, "../data/friends.json");
const USERS_PATH = path.join(__dirname, "../data/users.json");

// Load friends from file (legacy, for migration)
function loadFriends() {
  if (!fs.existsSync(FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(FILE_PATH));
}

// Save friends to file (legacy, for migration)
function saveFriends(friends) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(friends, null, 2));
}

// Load users
function loadUsers() {
  if (!fs.existsSync(USERS_PATH)) return {};
  return JSON.parse(fs.readFileSync(USERS_PATH));
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

// Hash password
function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

// Generate token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Verify token and get user
function verifyToken(token) {
  const users = loadUsers();
  for (const username in users) {
    if (users[username].token === token) {
      return username;
    }
  }
  return null;
}

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  next();
}

// 🔐 Sign Up
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  let users = loadUsers();
  if (users[username]) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  const token = generateToken();
  users[username] = {
    password: hashPassword(password),
    token,
    friends: []
  };
  saveUsers(users);

  res.json({ message: 'Signup successful', user: { username }, token });
});

// 🔑 Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  let users = loadUsers();
  if (!users[username] || users[username].password !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken();
  users[username].token = token;
  saveUsers(users);

  res.json({ message: 'Login successful', user: { username }, token });
});

// 🚪 Logout
app.post('/logout', authMiddleware, (req, res) => {
  let users = loadUsers();
  users[req.user].token = null;
  saveUsers(users);
  res.json({ message: 'Logged out' });
});

// ➕ Add friend
app.post("/add-friend", authMiddleware, (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  let users = loadUsers();

  if (!users[req.user].friends.includes(username)) {
    users[req.user].friends.push(username);
    saveUsers(users);
  }

  res.json({ message: "Friend added", friends: users[req.user].friends });
});

// ➖ Remove friend
app.post('/remove-friend', authMiddleware, (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  let users = loadUsers();
  users[req.user].friends = users[req.user].friends.filter(u => u !== username);
  saveUsers(users);

  res.json({ message: 'Friend removed', friends: users[req.user].friends });
});

// 🔥 Fetch LeetCode data
async function fetchLeetCodeData(username) {
  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `,
        variables: { username }
      }
    );

    const stats = response.data.data.matchedUser.submitStats.acSubmissionNum;
    const total = stats.find(x => x.difficulty === "All")?.count || 0;
    const easy = stats.find(x => x.difficulty === "Easy")?.count || 0;
    const medium = stats.find(x => x.difficulty === "Medium")?.count || 0;
    const hard = stats.find(x => x.difficulty === "Hard")?.count || 0;

    return { username, totalSolved: total, easy, medium, hard };
  } catch (err) {
    return { username, totalSolved: 0, easy: 0, medium: 0, hard: 0, error: true };
  }
}

// 📊 Leaderboard
app.get("/leaderboard", authMiddleware, async (req, res) => {
  try {
    const users = loadUsers();
    const friends = users[req.user].friends || [];

    const results = await Promise.all(
      friends.map(user => fetchLeetCodeData(user))
    );

    results.sort((a, b) => b.totalSolved - a.totalSolved);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
