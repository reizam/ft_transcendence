import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BasicInput from '@/components/app/inputs/BasicInput';
import { IChannelUser } from '@/api/channel/channel.types';
import AdminList from '@/components/chat/lists/AdminList';

const schema = Yup.object().shape({
  password: Yup.string(),
  withPassword: Yup.boolean().required(),
  admins: Yup.array().of(Yup.number()).required(),
});

export type EditChannelFormValues = {
  withPassword: boolean;
  password: string;
  admins: number[];
};

interface EditChannelFormProps {
  initialValues: EditChannelFormValues;
  onSubmit: (values: EditChannelFormValues) => void;
  onLeave: () => void;
  users: IChannelUser[];
}

function EditChannelForm({
  initialValues,
  onSubmit,
  onLeave,
  users,
}: EditChannelFormProps): React.ReactElement {
  const { handleSubmit, values, handleChange, isValid, setFieldValue } =
    useFormik({
      initialValues,
      onSubmit,
      validationSchema: schema,
    });

  const onClick = (): void => {
    if (isValid) {
      handleSubmit();
    }
  };

  const _onLeave = (): void => {
    if (confirm('Êtes-vous sûr de vouloir quitter ce salon ?')) {
      onLeave();
    }
  };

  return (
    <div className="flex flex-col space-y-8 items-center justify-between w-full h-full px-4 py-8">
      <div className="flex flex-col items-center space-y-8 w-full">
        <div className="flex flex-row space-x-4 items-center">
          <input
            type="checkbox"
            checked={values.withPassword}
            onChange={(event): void =>
              void setFieldValue('withPassword', event.target.checked)
            }
          />
          <p>Protéger le salon par un mot de passe</p>
        </div>
        {values.withPassword && (
          <BasicInput
            className="text-black rounded-full w-1/2 py-2 px-4 outline-0 placeholder:text-center placeholder:antialiased antialiased"
            placeholder={
              !initialValues.withPassword
                ? 'Veuillez entrer un mot de passe '
                : 'Le nouveau mot de passe du salon'
            }
            value={values.password}
            onChange={handleChange('password')}
          />
        )}
        <AdminList
          admins={values.admins}
          users={users}
          onChange={(admins): void => void setFieldValue('admins', admins)}
        />
      </div>
      <div className="flex flex-row space-x-4">
        <button
          onClick={_onLeave}
          className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
        >
          Quitter le salon
        </button>
        <button
          onClick={onClick}
          className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
        >
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );
}

export default EditChannelForm;
