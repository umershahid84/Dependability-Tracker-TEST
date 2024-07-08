import {
  CreateCredentialsInviteAttributes,
  CreateCredentialsInviteWithAssociations,
  CreateCredentialsInviteCreationAttributes,
  SupervisorWithAssociations
} from '../../models/types';
import {CreateCredentialsInvite} from '../../models';
import {validateCreateCredentialsInviteProps} from './helpers';
import {getSupervisorFromDB} from '../Supervisor';

// (C)reate
export const createCreateCredentialsInviteInDB = async (
  props: CreateCredentialsInviteCreationAttributes
): Promise<CreateCredentialsInviteWithAssociations | null> => {
  try {
    const [admin, supervisor] = await validateCreateCredentialsInviteProps(props);

    const createCredentialsInvite: CreateCredentialsInviteAttributes = (
      await CreateCredentialsInvite.create(props)
    ).get({plain: true});

    // istanbul ignore next
    return createCredentialsInvite
      ? {
          supervisor_info: supervisor,
          id: createCredentialsInvite.id,
          created_by: {...admin, is_admin: true},
          createdAt: createCredentialsInvite.createdAt,
          updatedAt: createCredentialsInvite.updatedAt,
          expires_at: createCredentialsInvite.expires_at,
          default_email: createCredentialsInvite.default_email,
          default_password: createCredentialsInvite.default_password
        }
      : null;
  } catch (error) {
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
  if (props.id) Object.assign(where, {id: props.id});
  if (props.supervisor_id) Object.assign(where, {supervisor_id: props.supervisor_id});
  if (props.admin_id) Object.assign(where, {created_by: props.admin_id});

  try {
    const createCredentialsInvite: CreateCredentialsInviteAttributes | undefined = (
      await CreateCredentialsInvite.findOne({
        where: {...where}
      })
    )?.get({plain: true});

    if (!createCredentialsInvite) return null;

    const [admin, supervisor] = await Promise.all([
      getSupervisorFromDB.byId(createCredentialsInvite.created_by),
      getSupervisorFromDB.byId(createCredentialsInvite.supervisor_id)
    ]);

    return {
      id: createCredentialsInvite.id,
      createdAt: createCredentialsInvite.createdAt,
      updatedAt: createCredentialsInvite.updatedAt,
      expires_at: createCredentialsInvite.expires_at,
      default_email: createCredentialsInvite.default_email,
      supervisor_info: supervisor as SupervisorWithAssociations,
      default_password: createCredentialsInvite.default_password,
      created_by: {...(admin as SupervisorWithAssociations), is_admin: true}
    };
  } catch (error) {
    throw new Error(`\n❌ Error getting createCredentialsInvite: ${String(error)}`);
  }
};

export const CreateCredentialsInviteModelController = {
  createCreateCredentialsInviteInDB,
  getCreateCredentialsInviteFromDB
};

export default CreateCredentialsInviteModelController;
