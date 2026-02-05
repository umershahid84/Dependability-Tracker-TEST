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

**Important:** This configuration file is a template. You must customize it for your environment before use.

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

3. **Edit the configuration file to customize for your environment:**
   ```bash
   sudo nano /etc/apache2/sites-available/dependability-tracker.conf
   ```
   
   Update the following:
   - **ServerName**: Replace `your-domain.com` with your actual domain name or IP address
   - **SSLCertificateFile**: Path to your SSL certificate file
   - **SSLCertificateKeyFile**: Path to your SSL private key file
   - **SSLCertificateChainFile**: Uncomment and set if you have a certificate chain file

4. **Test the configuration:**
   ```bash
   sudo apache2ctl configtest
   ```

5. **Enable the site:**
   ```bash
   sudo a2ensite dependability-tracker.conf
   ```

6. **Restart Apache:**
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
