import React from 'react';
import {KioskCallOutBoard} from '../../components';

// Public, unauthenticated kiosk display — intentionally not behind the
// supervisor/admin auth middleware (see src/proxy.ts) so it can be shown
// on an unattended screen for on-duty employees.
export default function KioskPage() {
  return <KioskCallOutBoard />;
}
