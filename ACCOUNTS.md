# InterviewPro - Account Credentials

## 🚀 Setup Instructions

1. **Setup Database:**
   ```bash
   npm run db:setup
   ```

2. **Seed Sample Data:**
   ```bash
   npm run db:seed
   ```

3. **Start Application:**
   ```bash
   npm run dev
   ```

## 👥 Sample Accounts

### Admin Account
- **Email:** `admin@interview.com`
- **Password:** `admin123`
- **Role:** Administrator
- **Access:** Full system access, user management, analytics

### Regular User
- **Email:** `nathanielinocando@aol.com`
- **Password:** `user123`
- **Role:** Regular User
- **Features:** Basic interview practice, limited sessions

## 🔐 Security Notes

- All passwords are hashed using bcryptjs with 12 salt rounds
- JWT tokens expire after 7 days
- Admin routes are protected with role-based access control
- Change default passwords in production

## 📊 Sample Data Included

- **Interview Sessions:** Sample completed interviews for John and Jane
- **Question Categories:** Behavioral, Technical, Situational, Leadership, Communication
- **Subscription Plans:** Free Trial, Professional, Premium
- **Sample Questions:** Ready-to-use interview questions

## 🛠️ Admin Features

Access admin panel at `/admin` (after logging in as admin):
- View all users
- Manage interview sessions
- Monitor system analytics
- User role management

## 🔄 Reset Database

To reset and reseed the database:
```bash
npm run db:setup
npm run db:seed
```

---

**Note:** These are development credentials. Use secure passwords in production.