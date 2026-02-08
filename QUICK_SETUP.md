# What to Copy/Paste Where

## For Vercel

### Step 1: Go to https://vercel.com/new

### Step 2: Import Repository
```
https://github.com/YOUR_USERNAME/lc-leaderboard.git
```

### Step 3: Configuration (auto-detected, just click Deploy)
- Framework Preset: `Other`
- Root Directory: `.`
- Build Command: `npm install`
- Output Directory: (leave empty)
- Environment Variables: (skip)

### Result:
Your app is live at:
```
https://[YOUR_PROJECT_NAME].vercel.app
```

---

## For Render

### Step 1: Go to https://dashboard.render.com/new/web-service

### Step 2: Connect GitHub & Select Repo
- Connect your GitHub account
- Select `lc-leaderboard` repo

### Step 3: Configuration

| Field | Value |
|-------|-------|
| **Name** | `lc-leaderboard` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | `Free` |

Environment Variables: (leave empty)

### Result:
Your app is live at:
```
https://[YOUR_SERVICE_NAME].onrender.com
```

---

## Test the App

### 1. Create Account
Go to: `https://your-app-url/login.html`

Username: `demo`  
Password: `demo123`

Click: **Sign Up**

### 2. Add a Friend
Input field: `Aayush_coder07`

Click: **Add**

Click: **Refresh** (or wait 60 sec)

### 3. See Leaderboard
Your friends appear with Easy/Medium/Hard breakdown.

Click username → Links to LeetCode profile

Click **Remove** → Removes from your leaderboard

---

## Environment Variables (for later)

Once you add a database, add to your platform:

**Vercel:**
- Project Settings → Environment Variables

**Render:**
- Service Settings → Environment

```
KEY: DATABASE_URL
VALUE: postgresql://user:pass@host:5432/dbname
```

---

## Files You're Deploying

```
server.js           ← Node backend
index.html          ← Home page
login.html          ← Login/signup
about.html          ← About page
styles.css          ← Styling
package.json        ← Dependencies
vercel.json         ← For Vercel
render.yaml         ← For Render
```

Data stored in:
- `users.json` (created on first signup)

---

## If Something Breaks

### Error: "Cannot POST /add-friend"
→ Server crashed/didn't restart
→ On Render: Re-deploy (click "Manual Deploy")
→ On Vercel: Push a new commit to GitHub

### Error: "Unauthorized"
→ Token expired
→ Log out, log back in

### Network Error on Fresh Deploy
→ App is waking up
→ Wait 30 sec, refresh

### Data Lost After Redeploy
→ JSON files are temporary
→ Add a database (PostgreSQL recommended)

---

## Quick Links

- **Vercel:** https://vercel.com/dashboard
- **Render:** https://dashboard.render.com
- **GitHub:** https://github.com/settings/personal-access-tokens
- **LeetCode:** https://leetcode.com

---

## Next Steps (Optional)

1. **Add Custom Domain** (Vercel/Render settings)
2. **Setup PostgreSQL** (save data permanently)
3. **Add Email Verification** (prevent spam accounts)
4. **Add Notifications** → Discord/Slack (when friend solves)
5. **Add Badges** → Show achievement tier
