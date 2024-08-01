import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { logTemplate } from '../lib/utils/server';

// Generate a private key and certificate for use with TLS
function generateTLSCredentials() {
  const certPath = path.join(process.cwd(), 'cert');

  // Create the cert folder if it doesn't exist
  if (!fs.existsSync(certPath)) {
    fs.mkdirSync(certPath);
  }

  const csrFileName = 'csr.pem';
  const certFileName = 'certificate.pem';
  const privateKeyFileName = 'private_key.pem';

  const csrPath = path.join(certPath, csrFileName);
  const certPathFile = path.join(certPath, certFileName);
  const privateKeyPath = path.join(certPath, privateKeyFileName);

  // if the privateKey doesn't already exist
  if (!fs.existsSync(privateKeyPath)) {
    // Generate a private RSA 4096 Key, save it as a .pem file
    exec(`openssl genrsa -out "${privateKeyPath}" 4096`, err => {
      if (err) {
        console.error(logTemplate(`Error generating private key: ${err.message}`, 'error'));
        return;
      }

      // Generate a CSR with default values for all the required fields
      exec(
        `openssl req -new -key "${privateKeyPath}" -out "${csrPath}" -subj "/C=US/ST=WA/L=Seattle/O=SEA-TAC/OU=Parking/CN=DependabilityTracker"`,
        err => {
          if (err) {
            console.error(logTemplate(`Error generating CSR: ${err.message}`, 'error'));
            return;
          }

          // Generate the self-signed certificate
          exec(
            `openssl x509 -req -days 365 -in "${csrPath}" -signkey "${privateKeyPath}" -out "${certPathFile}"`,
            err => {
              if (err) {
                console.error(logTemplate(`Error generating certificate: ${err.message}`), 'error');
                return;
              }
              console.log(logTemplate('TLS credentials generated successfully.'));
            }
          );
        }
      );
    });
  }
}

if (require.main === module) {
  generateTLSCredentials();
}
