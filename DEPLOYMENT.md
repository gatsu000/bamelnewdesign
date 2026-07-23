# Bamel Enerji Web - Hostinger Deployment Guide

## 📦 Production Deployment

### Build & Upload Process

#### 1. Build Production Files
```bash
npm install
npm run build
```

Build output: `dist/` folder contains:
- `index.html` - Main HTML file
- `assets/` - CSS and JavaScript files

#### 2. Upload to Hostinger

**Method A: File Manager (Recommended)**
1. Login to Hostinger hPanel
2. Navigate to **File Manager** → `public_html/`
3. Upload entire contents of `dist/` folder to `public_html/`
4. Make sure `.htaccess` file is included

**Method B: FTP/SFTP**
1. Connect via FileZilla or WinSCP:
   ```
   Host: your FTP hostname (from Hostinger panel)
   Username: your FTP username
   Password: your FTP password
   Port: 21 (FTP) or 22 (SFTP)
   ```
2. Navigate to `public_html/`
3. Upload all files from `dist/` folder

#### 3. Verify Deployment
- Visit your domain
- Test navigation links
- Test quote form submission
- Verify email links work (mailto:info@bamelenerji.com)
- Check mobile responsiveness

## 🔧 Technical Configuration

### File Structure After Upload
```
public_html/
├── .htaccess (Apache configuration)
├── index.html
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

### Apache Requirements
- mod_rewrite (for SPA routing)
- mod_headers (for security headers)
- mod_expires (for caching)
- mod_deflate (for compression)

### Environment Support
- Modern browsers (ES2020+)
- JavaScript enabled
- HTTPS recommended

## 🚨 Troubleshooting

### 404 Errors on Refresh
- Ensure `.htaccess` is uploaded
- Verify mod_rewrite is enabled
- Check RewriteBase matches your directory

### Blank Page
- Check browser console for errors
- Verify all files uploaded correctly
- Test in incognito mode

### Form Not Submitting
- Backend API required: `/api/quote` endpoint
- Configure CORS if using external API
- Test form submission in browser DevTools

## 📧 Contact Configuration
Email: info@bamelenerji.com (already configured)

## 🔒 Security Checklist
- ✅ HTTPS enabled
- ✅ Security headers configured
- ✅ HTTPS enforced via .htaccess
- ✅ Directory browsing disabled
- ✅ Proper cache headers set

## 📊 Performance
- Initial load: ~125KB (gzipped)
- Optimized assets with caching headers
- Gzip compression enabled
- Cache-control for 1 year on static assets

---

**Built with Vite + React + Tailwind CSS**
**Last Updated: July 2026**
