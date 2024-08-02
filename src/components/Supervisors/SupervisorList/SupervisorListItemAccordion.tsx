import { trim } from '../../../lib/utils/shared/strings';
import { ManageSupervisorOptions } from './ManageSupervisorOptions';
import { SupervisorWithAssociations } from '../../../lib/db/models/types';

const styles = {
  infoContainer: 'ml-2',
  hideOnPrint: 'hide-on-print',
  span: 'text-xs text-tertiary print:text-black mt-10',
  edit: 'px-2 py-1 bg-slate-400 hover:bg-amber-500 text-primary rounded mr-2',
  delete: 'px-2 py-1 bg-slate-400 hover:bg-red-500 text-primary rounded mr-2',
  div: `flex justify-between items-center border-t-2 p-2 text-sm cursor-pointer bg-secondary rounded-b-md details-print`
};

export function SupervisorListItemAccordion({
  show,
  roles,
  supervisor,
  onModalEditCallBack,
  onModalDeleteCallBack
}: Readonly<{
  show: boolean;
  roles: ('Supervisor' | 'Admin')[];
  supervisor: SupervisorWithAssociations;
  onModalDeleteCallBack: (supervisorId: string) => void;
  onModalEditCallBack: (supervisor: SupervisorWithAssociations, isNew?: boolean) => void;
}>) {
  return (
    show && (
      <div className={trim(styles.div)}>
        <div className={styles.infoContainer}>
          <p>
            <strong>Name:</strong> {supervisor.supervisor_info.name}
          </p>

          <p className="mt-2">
            <strong>Role:</strong> {roles.join(', ')}
          </p>

          <p className="mt-2">
            <strong>Divisions: </strong>
            {supervisor.supervisor_info.divisions.map(division => division.name).join(', ')}
          </p>
        </div>

        <div className="w-auto flex flex-col justify-between items-end">
          <ManageSupervisorOptions
            supervisor={supervisor}
            onModalEditCallBack={onModalEditCallBack}
            onModalDeleteCallBack={onModalDeleteCallBack}
          />
          <span className={styles.span}>
            Created at: {new Date(supervisor.createdAt).toLocaleDateString()} @{' '}
            {new Date(supervisor.createdAt).toLocaleTimeString()}
            <br />
            Updated at: {new Date(supervisor.updatedAt).toLocaleDateString()} @{' '}
            {new Date(supervisor.updatedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>
    )
  );
}
