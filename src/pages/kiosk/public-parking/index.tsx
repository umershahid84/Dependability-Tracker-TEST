import React from 'react';
import {KioskCallOutBoard} from '../../../components';

// Public, unauthenticated kiosk display scoped to the Public Parking division —
// see src/pages/kiosk/index.tsx for the shared rationale on why this is public.
export default function PublicParkingKioskPage() {
  return <KioskCallOutBoard division="public-parking" />;
}
