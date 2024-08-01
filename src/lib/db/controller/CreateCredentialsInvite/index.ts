import {
  SupervisorWithAssociations,
  CreateCredentialsInviteWithAssociations,
  CreateCredentialsInviteCreationAttributes,
  UpdateCredentialsInviteCreationAttributes
} from '../../models/types';
import { getSupervisorFromDB } from '../Supervisor';
import { CreateCredentialsInvite } from '../../models';
import { validateCreateCredentialsInviteProps } from './helpers';
import { logTemplate } from '../../../utils/server';

// (C)reate
export const createCreateCredentialsInviteInDB = async (
  props: CreateCredentialsInviteCreationAttributes
): Promise<CreateCredentialsInviteWithAssociations | null> => {
  try {
    const [admin, supervisor] = await validateCreateCredentialsInviteProps(props);

    const createCredentialsInvite: CreateCredentialsInvite = await CreateCredentialsInvite.create(
      props
    );

    // istanbul ignore next
    return createCredentialsInvite
      ? {
        supervisor_info: supervisor,
        id: createCredentialsInvite.id,
        email: createCredentialsInvite?.email,
        created_by: { ...admin, is_admin: true },
        createdAt: createCredentialsInvite.createdAt,
        updatedAt: createCredentialsInvite.updatedAt,
        expires_at: createCredentialsInvite.expires_at,
        invite_token: createCredentialsInvite.invite_token
      }
      : null;
    // istanbul ignore next
  } catch (error) {
    const errMessage = '❌ Error in createCreateCredentialsInviteInDB:' + ' ' + error;
    console.error(logTemplate(errMessage, 'error'));
    throw new Error(`\n❌ Error creating createCredentialsInvite: ${String(error)}`);
  }
};

// (R)ead
export const getCreateCredentialsInviteFromDB = async (props: {
  id?: string;
  supervisor_id?: string;
  admin_id?: string;
}): Promise<CreateCredentialsInviteWithAssociations | null> => {
  const where = {};
  if (props.id) Object.assign(where, { id: props.id });
  if (props.supervisor_id) Object.assign(where, { supervisor_id: props.supervisor_id });
  if (props.admin_id) Object.assign(where, { created_by: props.admin_id });

  try {
    const createCredentialsInvite: CreateCredentialsInvite | null =
      await CreateCredentialsInvite.findOne({
        where: { ...where }
      });

    if (!createCredentialsInvite) return null;

    const [admin, supervisor] = await Promise.all([
      getSupervisorFromDB.byId(createCredentialsInvite.created_by),
      getSupervisorFromDB.byId(createCredentialsInvite.supervisor_id)
    ]);

    return {
      id: createCredentialsInvite.id,
      email: createCredentialsInvite.email,
      createdAt: createCredentialsInvite.createdAt,
      updatedAt: createCredentialsInvite.updatedAt,
      expires_at: createCredentialsInvite.expires_at,
      invite_token: createCredentialsInvite.invite_token,
      supervisor_info: supervisor as SupervisorWithAssociations,
      created_by: { ...(admin as SupervisorWithAssociations), is_admin: true }
    };
    // istanbul ignore next
  } catch (error) {
    // istanbul ignore next
    throw new Error(`\n❌ Error getting createCredentialsInvite: ${String(error)}`);
  }
};

// (U)pdate
export const updateCreateCredentialsInviteInDB = async (props: {
  id?: string;
  supervisor_id?: string;
  updateData: UpdateCredentialsInviteCreationAttributes;
}): Promise<CreateCredentialsInviteWithAssociations | null> => {
  const where = {};
  if (props.id) Object.assign(where, { id: props.id });
  if (props.supervisor_id) Object.assign(where, { supervisor_id: props.supervisor_id });

  const { updateData } = props;

  try {
    const [rowsAffected] = await CreateCredentialsInvite.update(updateData, { where });

    if (rowsAffected === 0) return null;

    const createCredentialsInvite = await getCreateCredentialsInviteFromDB({
      supervisor_id: props.supervisor_id
    });
    if (!createCredentialsInvite) return null;

    return createCredentialsInvite;
    // istanbul ignore next
  } catch (error) {
    // istanbul ignore next
    throw new Error(`\n❌ Error updating createCredentialsInvite: ${String(error)}`);
  }
};

export const CreateCredentialsInviteModelController = {
  createCreateCredentialsInviteInDB,
  getCreateCredentialsInviteFromDB,
  updateCreateCredentialsInviteInDB
};

export default CreateCredentialsInviteModelController;
