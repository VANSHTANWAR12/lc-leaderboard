# Deployment Guide: Vercel & Render

## Quick Summary

Your app has:
- **Backend:** Node.js/Express server (`server.js`)
- **Frontend:** Static HTML/CSS pages
- **Auth:** Login/signup with user-specific data
- **Data storage:** JSON files (`users.json` for accounts, per-user friends)

---

## VERCEL DEPLOYMENT

### Step 1: Prepare GitHub Repository

```bash
# From your project directory
git init
git add .
git commit -m "Add LC Leaderboard with authentication"
git remote add origin https://github.com/YOUR_USERNAME/lc-leaderboard.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Paste: `https://github.com/YOUR_USERNAME/lc-leaderboard.git`
4. Click **Import**
5. Vercel will auto-detect Node.js + static files
6. Leave env vars empty (or skip)
7. Click **Deploy**

### Step 3: Access Your App

After ~2 minutes, you'll get a URL like:
```
https://lc-leaderboard-abc123.vercel.app
```

**Access the app:**
- Login: https://lc-leaderboard-abc123.vercel.app/login.html
- Home: https://lc-leaderboard-abc123.vercel.app
- About: https://lc-leaderboard-abc123.vercel.app/about.html

### Vercel Important Notes

⚠️ **Data Persistence Issue:**
- JSON files reset every time the app redeploys
- Free tier also spins down after inactivity
- Users and friends data will be lost on redeploy

💡 **Solution for Production:**
- Connect a PostgreSQL database (Vercel offers free tier)
- OR use a service like Firebase Realtime Database
- Store connection string in env var, update `server.js` to use database

### Vercel Environment Variables (Optional)

If you add a database later:

1. Go to your Vercel project settings
2. Click **Environment Variables**
3. Add: `DATABASE_URL` = your database connection string
4. Redeploy

---

## RENDER DEPLOYMENT

### Step 1: Prepare GitHub Repository

(Same as Vercel)

```bash
git init
git add .
git commit -m "Add LC Leaderboard with authentication"
git remote add origin https://github.com/YOUR_USERNAME/lc-leaderboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render

1. Go to https://dashboard.render.com
2. Sign up / log in
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect account"** (GitHub)
5. Select **`lc-leaderboard`** repo
6. Name: `lc-leaderboard` (auto-filled)
7. Environment: `Node`
8. Build Command: `npm install`
9. Start Command: `node server.js`
10. Leave env vars empty
11. Plan: **Free** (blue button)
12. Click **Create Web Service**

### Step 3: Access Your App

After deployment (takes ~3-5 min), you'll get a URL like:
```
https://lc-leaderboard-abc123.onrender.com
```

**Access the app:**
- Login: https://lc-leaderboard-abc123.onrender.com/login.html
- Home: https://lc-leaderboard-abc123.onrender.com
- About: https://lc-leaderboard-abc123.onrender.com/about.html

### Render Important Notes

⚠️ **Free Tier Limitations:**
- Service spins down after 15 min of inactivity (wakes on request, takes ~30 sec)
- JSON files reset on each redeploy
- Limited to 750 hours per month

💡 **Manual Redeploy:**
- Just push to GitHub main branch
- Render auto-detects and redeploys

💡 **Solution for Production:**
- Add Render PostgreSQL database (free tier available)
- Create database, get connection string
- Add to Environment Variables
- Update `server.js` to use database

### Render Environment Variables

To add database later:

1. Go to your service in Render dashboard
2. Click **Environment** tab
3. Add new variable: `DATABASE_URL` = your database URL
4. Click Save
5. Service auto-redeploys

---

## TESTING BEFORE DEPLOYMENT

Do this before pushing to GitHub:

```bash
# 1. Start local server
npm start

# 2. In another terminal, test signup
curl -X POST http://localhost:5000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
# Should return token

# 3. Test add-friend (replace TOKEN with actual token from signup)
curl -X POST http://localhost:5000/add-friend \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"Aayush_coder07"}'

# 4. Test leaderboard
curl http://localhost:5000/leaderboard \
  -H "Authorization: Bearer TOKEN"
```

If all return success, you're ready to deploy!

---

## MAKING UPDATES

### After Deployment:

**If on Vercel:**
1. Make changes locally
2. `git add . && git commit -m "update"` 
3. `git push`
4. Vercel auto-redeploys (watch dashboard)

**If on Render:**
1. Make changes locally
2. `git add . && git commit -m "update"`
3. `git push`
4. Render auto-redeploys (watch dashboard)

---

## PRODUCTION SETUP (Migration to Database)

When you're ready to use a real database instead of JSON files:

### For Postgres (Render or Vercel):

1. **Create database:**
   - Render: Dashboard → New → PostgreSQL (free tier)
   - Vercel: Integrations → Postgres
   
2. **Get connection string** (looks like: `postgresql://user:pass@host:5432/db`)

3. **Create tables** (run in database):
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE friends (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  friend_username VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. **Update `server.js`** to query database instead of JSON files

5. **Deploy with DATABASE_URL env var**

---

## FAQ

**Q: App says "Cannot POST /add-friend"**
A: Server didn't restart. Manually restart on Render (redeploy) or Vercel (push a commit).

**Q: Data disappears after redeploy**
A: JSON files are ephemeral. Use database instead.

**Q: App is slow to wake up**
A: Free tier spins down. Upgrade to paid, or just wait 30 sec.

**Q: How do I see server logs?**
- Vercel: Dashboard → Function Logs
- Render: Dashboard → Logs tab

**Q: Can I use a custom domain?**
- Vercel: Settings → Domains → Add
- Render: Settings → Custom Domain

---

## Support

- Vercel docs: https://vercel.com/docs
- Render docs: https://render.com/docs
- Node.js Express: https://expressjs.com
- LeetCode GraphQL: https://leetcode.com/graphql (no official docs, reverse-engineered)
