# 🚀 Deployment Guide - Desert Villa

## Prerequisites
- Domain name (you have this ✅)
- GitHub account
- Credit/debit card (for hosting - some have free tiers)

---

## 🎯 RECOMMENDED: Option 1 - Vercel + Railway (Easiest)

### **Step 1: Prepare Your Code**

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/desert-villa.git
   git push -u origin main
   ```

2. **Update Frontend Environment Variables**
   - Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.railway.app/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

---

### **Step 2: Deploy Backend (Railway)**

1. **Sign up at Railway.app**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

3. **Add MySQL Database**
   - Click "New" → "Database" → "Add MySQL"
   - Railway will automatically create a database

4. **Set Environment Variables**
   - Go to your backend service
   - Click "Variables" tab
   - Add these variables:
   ```
   NODE_ENV=production
   PORT=3000
   
   # Database (Railway provides these automatically)
   DB_HOST=${{MYSQL.MYSQLHOST}}
   DB_USER=${{MYSQL.MYSQLUSER}}
   DB_PASSWORD=${{MYSQL.MYSQLPASSWORD}}
   DB_NAME=${{MYSQL.MYSQLDATABASE}}
   DB_PORT=${{MYSQL.MYSQLPORT}}
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Admin
   ADMIN_EMAIL=admin@desertvilla.com
   ADMIN_PASSWORD=your-secure-admin-password
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

6. **Initialize Database**
   - Go to Railway MySQL service
   - Click "Connect" → "MySQL CLI"
   - Run your database schema SQL file

---

### **Step 3: Deploy Frontend (Vercel)**

1. **Sign up at Vercel.com**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory

3. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - You'll get a URL like `https://your-app.vercel.app`

---

### **Step 4: Connect Your Domain**

**For Frontend (Vercel):**
1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `desertvilla.com`)
4. Follow DNS instructions:
   - Add A record: `76.76.21.21`
   - Add CNAME record: `cname.vercel-dns.com`

**For Backend (Railway):**
1. Go to your Railway backend service
2. Click "Settings" → "Domains"
3. Add custom domain (e.g., `api.desertvilla.com`)
4. Add CNAME record in your domain DNS:
   - Name: `api`
   - Value: `your-app.railway.app`

---

## 🔧 Option 2 - VPS Deployment (DigitalOcean/Linode)

### **Step 1: Create VPS**
1. Sign up at DigitalOcean/Linode
2. Create a Droplet/Linode:
   - OS: Ubuntu 22.04 LTS
   - Plan: $6/month (1GB RAM)
   - Add SSH key

### **Step 2: Initial Server Setup**
```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MySQL
apt install -y mysql-server

# Install Nginx
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2

# Install Certbot (for SSL)
apt install -y certbot python3-certbot-nginx
```

### **Step 3: Setup MySQL**
```bash
# Secure MySQL
mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE desert_villa;
CREATE USER 'dbuser'@'localhost' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON desert_villa.* TO 'dbuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import your database schema
mysql -u root -p desert_villa < /path/to/schema.sql
```

### **Step 4: Deploy Backend**
```bash
# Create app directory
mkdir -p /var/www/desert-villa
cd /var/www/desert-villa

# Clone your repository
git clone https://github.com/yourusername/desert-villa.git .

# Install backend dependencies
cd backend
npm install --production

# Create .env file
nano .env
# (Add your production environment variables)

# Start with PM2
pm2 start server.js --name desert-villa-backend
pm2 save
pm2 startup
```

### **Step 5: Deploy Frontend**
```bash
# Build frontend
cd /var/www/desert-villa/frontend
npm install
npm run build

# Move build to nginx directory
cp -r dist /var/www/html/desert-villa
```

### **Step 6: Configure Nginx**
```bash
nano /etc/nginx/sites-available/desert-villa
```

Add this configuration:
```nginx
# Backend API
server {
    listen 80;
    server_name api.desertvilla.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name desertvilla.com www.desertvilla.com;
    root /var/www/html/desert-villa;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site and restart Nginx:
```bash
ln -s /etc/nginx/sites-available/desert-villa /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### **Step 7: Setup SSL (HTTPS)**
```bash
# Get SSL certificates
certbot --nginx -d desertvilla.com -d www.desertvilla.com
certbot --nginx -d api.desertvilla.com

# Auto-renewal
certbot renew --dry-run
```

### **Step 8: Configure Domain DNS**
Add these DNS records at your domain registrar:
```
Type    Name    Value               TTL
A       @       your-server-ip      3600
A       www     your-server-ip      3600
A       api     your-server-ip      3600
```

---

## 📋 Post-Deployment Checklist

- [ ] Test all features on production
- [ ] Verify payment gateway works
- [ ] Check admin panel access
- [ ] Test order placement
- [ ] Test hall booking
- [ ] Verify email/SMS notifications
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Setup monitoring (optional)
- [ ] Setup backups (important!)
- [ ] Update Razorpay webhook URL
- [ ] Switch Razorpay to live mode

---

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall (UFW)
- [ ] Regular backups
- [ ] Keep dependencies updated
- [ ] Monitor server logs
- [ ] Setup fail2ban (optional)

---

## 💾 Database Backup (Important!)

### Automated Daily Backup Script:
```bash
#!/bin/bash
# Save as /root/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

mysqldump -u root -p'your-password' desert_villa > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

Add to crontab:
```bash
crontab -e
# Add this line:
0 2 * * * /root/backup-db.sh
```

---

## 🆘 Troubleshooting

### Backend not starting:
```bash
pm2 logs desert-villa-backend
pm2 restart desert-villa-backend
```

### Database connection issues:
```bash
mysql -u root -p
SHOW DATABASES;
SHOW GRANTS FOR 'dbuser'@'localhost';
```

### Nginx errors:
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### Check server resources:
```bash
htop
df -h
free -m
```

---

## 📞 Need Help?

If you face any issues during deployment, let me know:
- Which hosting option you chose
- What error you're getting
- Screenshots if possible

Good luck with your deployment! 🚀
