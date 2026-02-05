# Deployment Configuration Files

This directory contains deployment configuration files for the Dependability Tracker application.

## Apache Configuration

### Location
`config/apache/dependability-tracker.conf`

### Description
This Apache VirtualHost configuration file sets up a reverse proxy to the Dependability Tracker Node.js application running on port 3000. It handles:

- **HTTPS/SSL**: Serves the application over HTTPS on port 443
- **Path Proxying**: Proxies requests from Apache to the Node.js server for:
  - `/dc/*` - Main application paths
  - `/_next/*` - Next.js static assets and build files
  - `/api/*` - API endpoints

### Installation Instructions

1. **Copy the configuration file to Apache's sites-available directory:**
   ```bash
   sudo cp config/apache/dependability-tracker.conf /etc/apache2/sites-available/
   ```

2. **Enable required Apache modules:**
   ```bash
   sudo a2enmod ssl
   sudo a2enmod proxy
   sudo a2enmod proxy_http
   sudo a2enmod rewrite
   ```

3. **Configure SSL certificates:**
   - Edit the configuration file to add your SSL certificate paths:
     ```apache
     SSLCertificateFile /path/to/your/certificate.crt
     SSLCertificateKeyFile /path/to/your/private.key
     SSLCertificateChainFile /path/to/your/chain.crt  # if applicable
     ```

4. **Update ServerName if needed:**
   - Modify the `ServerName` directive to match your server's hostname or IP address

5. **Enable the site:**
   ```bash
   sudo a2ensite dependability-tracker.conf
   ```

6. **Test the configuration:**
   ```bash
   sudo apache2ctl configtest
   ```

7. **Restart Apache:**
   ```bash
   sudo systemctl restart apache2
   ```

### Prerequisites

- Apache 2.4 or higher installed
- SSL certificate and key files configured
- The Dependability Tracker application running on port 3000
- Required Apache modules: `ssl`, `proxy`, `proxy_http`, `rewrite`

### Notes

- Make sure the Dependability Tracker application is running before accessing it through Apache
- The application can be started using `npm start` or as a systemd service (see main README.md)
- Adjust firewall rules to allow HTTPS traffic on port 443 if needed
