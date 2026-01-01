# Apache VPN Configuration Examples

This directory contains example configuration files and guides for setting up Apache as a reverse proxy for the Dependability Tracker application on port 443 (HTTPS) with VPN access.

## Files in This Directory

### 1. `apache-vpn-reverse-proxy.conf`
**Complete Apache virtual host configuration template**

- Ready-to-use Apache configuration for reverse proxy setup
- Includes SSL/TLS configuration
- VPN access restrictions
- WebSocket support
- Security headers
- Performance optimizations
- Heavily commented with explanations

**How to use:**
1. Copy to Apache config directory
2. Customize placeholders (ServerName, SSL paths, VPN subnet, etc.)
3. Test and enable

### 2. `.env.apache-example`
**Environment variable template for Apache deployment**

- Shows recommended environment configuration
- Includes helpful comments
- No code changes required to work with Apache

**How to use:**
1. Review for reference
2. Compare with your `.env` file
3. Adjust PORT if needed (default 3000 works fine)

### 3. `QUICK_SETUP.md`
**Step-by-step implementation guide**

- Condensed setup instructions
- Command-line examples for Ubuntu/Debian and RHEL/CentOS
- Common issues and solutions
- Verification checklist
- Estimated time: 30-60 minutes

**Best for:** Quick reference during implementation

## Related Documentation

### In Project Root

- **`APACHE_VPN_SETUP_GUIDE.md`** - Comprehensive guide with detailed explanations, architecture overview, and security considerations
- **`APACHE_VPN_SUMMARY.md`** - Executive summary answering the feasibility question with file change overview
- **`README.md`** - Main project documentation with link to Apache setup section

## Quick Links

| Need | Document | Location |
|------|----------|----------|
| "Is this possible?" | Summary | `../APACHE_VPN_SUMMARY.md` |
| "How do I set it up?" | Quick Setup | `./QUICK_SETUP.md` |
| "I want all the details" | Full Guide | `../APACHE_VPN_SETUP_GUIDE.md` |
| "Show me the config" | Apache Config | `./apache-vpn-reverse-proxy.conf` |
| "What about .env?" | Env Example | `./.env.apache-example` |

## Usage Workflow

### For First-Time Setup

1. Read `../APACHE_VPN_SUMMARY.md` to understand feasibility
2. Review `../APACHE_VPN_SETUP_GUIDE.md` for architecture and options
3. Follow `./QUICK_SETUP.md` for implementation
4. Use `./apache-vpn-reverse-proxy.conf` as your config template
5. Reference `./.env.apache-example` for environment variables

### For Quick Reference

1. Open `./QUICK_SETUP.md`
2. Follow step-by-step instructions
3. Use `./apache-vpn-reverse-proxy.conf` template
4. Test and verify

## Key Customization Points

When using these examples, customize:

### In `apache-vpn-reverse-proxy.conf`:
- `ServerName` → Your domain or VPN IP address
- `SSLCertificateFile` → Path to your SSL certificate
- `SSLCertificateKeyFile` → Path to your SSL private key
- `Allow from 10.0.0.0/8` → Your VPN subnet range
- `ProxyPass` port → Match PORT in your .env (default: 3000)

### In `.env` (optional):
- `PORT` → Change if 3000 conflicts (update Apache config to match)

## Prerequisites

Before using these examples:

- [ ] Apache web server installed
- [ ] Node.js and npm installed
- [ ] Dependability Tracker application installed and working
- [ ] SSL/TLS certificates available (self-signed or trusted)
- [ ] VPN infrastructure configured
- [ ] Root/sudo access to the server

## Support

### Troubleshooting
See the "Common Issues and Solutions" section in `./QUICK_SETUP.md`

### Testing
```bash
# Test Apache configuration
sudo apache2ctl configtest  # or apachectl configtest

# Test connection
curl -k https://your-server-address

# Check logs
sudo tail -f /var/log/apache2/dependability-tracker-error.log
```

### Additional Help
- Check Apache documentation: https://httpd.apache.org/docs/
- Review Node.js server logs
- Consult your network administrator for VPN-specific issues

## License

These configuration examples are provided as part of the Dependability Tracker project.

---

**Questions?** Review the comprehensive guide at `../APACHE_VPN_SETUP_GUIDE.md`
