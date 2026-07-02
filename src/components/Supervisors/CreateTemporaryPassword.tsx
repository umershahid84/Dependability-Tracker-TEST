import React, { useState } from 'react';
import { ModalAction } from '../Modal';
import FormInputWithErrors from '../FormInputs/FormInputWithErrors';
import { makeToast, ToastTypes } from '../Toasts';

export default function CreateTemporaryPassword({ supervisor, onModalEditCallBack }: any) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(supervisor?.create_credentials_invite?.email ?? supervisor?.login_credentials?.email ?? '');

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await fetch('/api/admin/supervisors/create-temp-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forSupervisor: supervisor.id, email })
      });
      const payload = await response.json();
      if (!response.ok || payload?.error) throw new Error(payload?.error ?? 'Failed to create temporary password');

      makeToast({ type: ToastTypes.Success, title: 'Temporary Password', message: 'Temporary password created and email sent.' });

      // if the API returned the temp password (email disabled) show it to admin
      if (payload?.tempPassword) {
        makeToast({ type: ToastTypes.Warning, title: 'Temporary Password (visible)', message: `Password: ${payload.tempPassword}` });
      }

      setLoading(false);
      onModalEditCallBack && onModalEditCallBack(supervisor);
      window.dispatchEvent(new CustomEvent('modalEvent', { detail: { action: ModalAction.CLOSE } }));
    } catch (error) {
      setLoading(false);
      makeToast({ type: ToastTypes.Error, title: 'Error', message: String(error) });
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-2">Create Temporary Password</h2>
      <p className="mb-3">This will create a temporary password and send it to the supervisor's email. The supervisor must use the temp password and the invite to create new credentials.</p>

      <FormInputWithErrors
        label="Email"
        type="text"
        id="email"
        required
        placeholder="Email to send temp password to"
        value={email}
        // @ts-ignore
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />

      <div className="mt-4 flex gap-2">
        <button onClick={handleCreate} className="px-2 py-1 bg-quinary text-primary rounded">Create Temporary Password</button>
        <button onClick={() => window.dispatchEvent(new CustomEvent('modalEvent', { detail: { action: ModalAction.CLOSE } }))} className="px-2 py-1 bg-quaternary text-primary rounded">Cancel</button>
      </div>
    </div>
  );
}
