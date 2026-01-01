# Apache VPN Setup Guide for Dependability Tracker

## Overview

**YES, this is absolutely possible!** The Dependability Tracker can be configured to work with Apache as a reverse proxy on port 443 (HTTPS) when accessed through a VPN.

This guide explains what files need to be changed and what configurations are required.

## Current Architecture

The application currently runs as:
- **Node.js/Express server** with Next.js frontend
- **Default port**: 3000 (configurable via `PORT` environment variable)
- **TLS support**: Port 3005 (PORT + 5) if TLS certificates are available
- **Deployment**: Systemd service on Linux or manual `npm start`

## Required Changes for Apache + VPN on Port 443

### Architecture Change
Instead of accessing the Node.js server directly, Apache will:
1. Listen on port 443 (HTTPS) with SSL/TLS certificates
2. Act as a reverse proxy, forwarding requests to the Node.js application
3. Handle SSL/TLS termination
4. The Node.js app continues running on localhost (port 3000 or custom port)

---

## Files That Need to Be Changed

### 1. **Environment Configuration** (`.env` file)

**Location**: `/path/to/project/.env`

**Current Configuration**:
```env
PORT=3000  # or not set (defaults to 3000)
```

**Recommended Changes**:
```env
# Keep the application on localhost only since Apache will proxy
PORT=3000

# Optional: Set a custom port if 3000 conflicts with other services
# PORT=8080
```

**Why**: Keep Node.js on a non-privileged port (>1024) since Apache handles port 443.

---

### 2. **Server Configuration** (Optional Modification)

**Location**: `src/server/index.ts`

**Current Code** (lines 96-97):
```typescript
await new Promise<void>(resolve => httpServer.listen(PORT, 'localhost', resolve));
console.log(logTemplate(`\n🚀 LocalHost Server ready at http://localhost:${PORT}\n`));
```

**No changes required**, but you should be aware:
- The server binds to `'localhost'` which is correct for a reverse proxy setup
- Apache will handle external connections on the VPN

**Optional Enhancement** (if you want to add proxy awareness):
```typescript
// Add this after line 88 to trust proxy headers
app.set('trust proxy', 1);
```

This allows the application to correctly identify client IPs when behind Apache.

---

### 3. **Apache Virtual Host Configuration** (New File)

**Location**: `/etc/apache2/sites-available/dependability-tracker.conf` (Ubuntu/Debian)  
or `/etc/httpd/conf.d/dependability-tracker.conf` (RHEL/CentOS)

**Create this new file**:

```apache
<VirtualHost *:443>
    # Server identification
    ServerName dependability-tracker.yourdomain.com
    # Or use the VPN IP address
    # ServerName 10.x.x.x
    
    ServerAdmin admin@yourdomain.com

    # SSL/TLS Configuration
    SSLEngine on
    SSLCertificateFile /path/to/ssl/certificate.crt
    SSLCertificateKeyFile /path/to/ssl/private.key
    SSLCertificateChainFile /path/to/ssl/ca-bundle.crt  # Optional, if you have a CA chain
    
    # Modern SSL/TLS settings (recommended)
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLHonorCipherOrder on

    # Reverse Proxy Configuration
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # WebSocket support (if needed for real-time features)
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*)           ws://localhost:3000/$1 [P,L]
    RewriteCond %{HTTP:Upgrade} !=websocket [NC]
    RewriteRule /(.*)           http://localhost:3000/$1 [P,L]

    # Proxy headers to preserve client information
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
    ProxyAddHeaders On

    # Logging
    ErrorLog ${APACHE_LOG_DIR}/dependability-tracker-error.log
    CustomLog ${APACHE_LOG_DIR}/dependability-tracker-access.log combined

    # Optional: Restrict access to VPN network only
    <Proxy *>
        Order deny,allow
        Deny from all
        Allow from 10.0.0.0/8  # Adjust to your VPN subnet
        # Or specific IPs: Allow from 192.168.1.100
    </Proxy>
</VirtualHost>

# Optional: Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName dependability-tracker.yourdomain.com
    Redirect permanent / https://dependability-tracker.yourdomain.com/
</VirtualHost>
```

**What to customize**:
- `ServerName`: Your domain or VPN IP address
- `SSLCertificateFile`, `SSLCertificateKeyFile`, `SSLCertificateChainFile`: Paths to your SSL certificates
- `Allow from 10.0.0.0/8`: Your VPN subnet range
- Port `3000`: Match the PORT in your `.env` file

---

### 4. **Apache Modules** (Required)

**Enable these Apache modules**:

```bash
# Ubuntu/Debian
sudo a2enmod ssl
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_wstunnel  # For WebSocket support
sudo a2enmod headers
sudo a2enmod rewrite

# RHEL/CentOS/Fedora (modules usually auto-loaded, verify in httpd.conf)
# Uncomment these lines in /etc/httpd/conf/httpd.conf or /etc/httpd/conf.modules.d/
LoadModule ssl_module modules/mod_ssl.so
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
LoadModule headers_module modules/mod_headers.so
LoadModule rewrite_module modules/mod_rewrite.so
```

---

### 5. **Firewall Configuration** (System Level)

**Allow port 443 through the firewall**:

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 443/tcp
sudo ufw allow 'Apache Full'  # Allows both 80 and 443

# firewalld (RHEL/CentOS/Fedora)
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload

# iptables (if not using UFW or firewalld)
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

---

## SSL/TLS Certificate Options

You need SSL certificates for HTTPS. Choose one:

### Option 1: Use Existing Self-Signed Certificates

The app already generates self-signed certificates in `cert/` directory:
- `cert/certificate.pem` → Use as `SSLCertificateFile`
- `cert/private_key.pem` → Use as `SSLCertificateKeyFile`

**In Apache config, use full paths:**
```apache
SSLCertificateFile /full/path/to/project/cert/certificate.pem
SSLCertificateKeyFile /full/path/to/project/cert/private_key.pem
```

**Generate them** (if not present):
```bash
npm run genTLS
```

**Note:** Self-signed certificates will show security warnings in browsers. They're fine for internal/VPN use but not for public-facing sites.

### Option 2: Use Let's Encrypt (Free, Trusted)

```bash
# Install certbot
sudo apt install certbot python3-certbot-apache  # Ubuntu/Debian
sudo yum install certbot python3-certbot-apache  # RHEL/CentOS

# Obtain certificate (requires public domain)
sudo certbot --apache -d dependability-tracker.yourdomain.com
```

### Option 3: Use Corporate/Internal CA Certificates

If your organization has an internal Certificate Authority, request certificates from them for your VPN domain/IP.

---

## Implementation Steps

### Step 1: Install and Configure Apache

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install apache2

# RHEL/CentOS/Fedora
sudo yum install httpd
# or
sudo dnf install httpd
```

### Step 2: Enable Required Apache Modules

```bash
sudo a2enmod ssl proxy proxy_http proxy_wstunnel headers rewrite
```

### Step 3: Create Apache Virtual Host Configuration

Create `/etc/apache2/sites-available/dependability-tracker.conf` with the configuration shown above.

### Step 4: Enable the Site

```bash
# Ubuntu/Debian
sudo a2ensite dependability-tracker.conf
sudo systemctl restart apache2

# RHEL/CentOS/Fedora
# Configuration is in /etc/httpd/conf.d/, already loaded
sudo systemctl restart httpd
```

### Step 5: Ensure Node.js Application is Running

```bash
# If using systemd service (Linux)
sudo systemctl status dependability
sudo systemctl start dependability

# If running manually
cd /path/to/dependability-tracker
npm start
```

### Step 6: Configure Firewall

Allow port 443 as shown in the Firewall Configuration section above.

### Step 7: Test the Setup

```bash
# Check if Apache is listening on 443
sudo netstat -tlnp | grep :443

# Check if Node.js is running on 3000
netstat -tlnp | grep :3000

# Test access from VPN
curl -k https://your-vpn-address-or-domain
```

---

## Environment Variables Summary

### Current `.env` file structure:
```env
DB_PORT=3306
DB_USER=<username>
DB_PASS=<password>
DB_HOST=localhost
DB_NAME=dependability_tracker
DB_DIALECT=mysql
SEND_EMAILS=true
EMAIL_PORT=465
EMAIL_USER=<email_user>
EMAIL_HOST=<email_host>
EMAIL_SECURE=true
EMAIL_SENDER=<email_sender>
TEST_EMAIL_USER=<test_email_user>
JWT_SECRET=<generated>
JWT_EXPIRES_IN=10h
JWT_ALGORITHM=HS256
AES_SALT=<generated>
AES_PEPPER=<generated>
```

### Add/Modify for Apache setup:
```env
# Optional: Change port if needed
PORT=3000

# Optional: Disable TLS in Node.js since Apache handles it
# (Currently TLS is only enabled if certificates exist, so no change needed)
```

**No significant changes needed** to the `.env` file for basic Apache reverse proxy setup.

---

## Security Considerations

### 1. **VPN Access Restriction**

In the Apache config, restrict access to your VPN subnet:
```apache
<Proxy *>
    Order deny,allow
    Deny from all
    Allow from 10.0.0.0/8  # Your VPN subnet
</Proxy>
```

### 2. **Node.js Binding**

Keep Node.js bound to `localhost` only (already configured):
```typescript
httpServer.listen(PORT, 'localhost', resolve)
```

This prevents direct access bypassing Apache.

### 3. **SSL/TLS Configuration**

Use strong SSL/TLS settings in Apache:
```apache
SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
SSLCipherSuite HIGH:!aNULL:!MD5
```

### 4. **Database Access**

Ensure MariaDB/MySQL is not exposed outside localhost unless necessary.

---

## Troubleshooting

### Apache won't start
```bash
# Check configuration syntax
sudo apache2ctl configtest  # Ubuntu/Debian
sudo apachectl configtest   # RHEL/CentOS

# Check logs
sudo tail -f /var/log/apache2/error.log  # Ubuntu/Debian
sudo tail -f /var/log/httpd/error.log    # RHEL/CentOS
```

### Can't connect from VPN
1. Check firewall rules (port 443 open)
2. Verify VPN subnet in Apache `Allow from` directive
3. Check Apache is listening: `sudo netstat -tlnp | grep :443`

### 502 Bad Gateway
1. Verify Node.js is running: `netstat -tlnp | grep :3000`
2. Check the PORT in `.env` matches Apache's `ProxyPass` port
3. Review Node.js logs: `sudo journalctl -u dependability -f` (if systemd)

### SSL Certificate errors
1. Verify certificate paths in Apache config
2. Check certificate validity: `openssl x509 -in /path/to/cert.crt -text -noout`
3. Ensure private key matches certificate

---

## Optional: Update Documentation

### Update `README.md`

Add a new section after the installation instructions:

```markdown
## Apache Reverse Proxy Setup for VPN Access

For deploying with Apache as a reverse proxy on port 443 (HTTPS), see [APACHE_VPN_SETUP_GUIDE.md](./APACHE_VPN_SETUP_GUIDE.md).

This setup is useful when:
- Accessing the application through a VPN
- Requiring HTTPS on standard port 443
- Using Apache as the web server front-end
```

---

## Summary of Files to Modify/Create

| File | Action | Required |
|------|--------|----------|
| `.env` | Modify (optional port change) | Optional |
| `src/server/index.ts` | Modify (add trust proxy) | Optional |
| `/etc/apache2/sites-available/dependability-tracker.conf` | Create | **Required** |
| Firewall rules | Modify | **Required** |
| SSL Certificates | Create/Obtain | **Required** |
| `README.md` | Update (add reference) | Optional |

---

## Conclusion

**This setup is completely feasible** and is a standard production deployment pattern. The changes required are minimal:

1. **Create Apache virtual host configuration** (main change)
2. **Obtain/configure SSL certificates**
3. **Configure firewall** for port 443
4. **Optional**: Modify `.env` and `src/server/index.ts` for better proxy integration

The Node.js application requires **minimal to no changes** to work behind Apache. The application is already well-structured for this deployment model.

## Next Steps

1. Review this guide
2. Prepare SSL certificates
3. Test in a non-production environment first
4. Create the Apache configuration file
5. Enable and test the setup
6. Monitor logs during initial VPN access

**Estimated implementation time**: 1-2 hours (depending on SSL certificate setup)

---

*Document created for Dependability Tracker Apache VPN setup guidance*
