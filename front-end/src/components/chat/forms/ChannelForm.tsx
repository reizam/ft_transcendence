import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  users: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Il faut au moins un utilisateur'),
  private: Yup.boolean().required(),
  password: Yup.string(),
});

export type ChannelFormValues = {
  users: string[];
  private: boolean;
  password: string;
};

interface ChannelFormProps {
  buttonLabel: string;
  initialValues: ChannelFormValues;
  onSubmit: (values: ChannelFormValues) => void;
}

function ChannelForm({
  buttonLabel,
  initialValues,
  onSubmit,
}: ChannelFormProps): React.ReactElement {
  const { handleSubmit } = useFormik({
    initialValues,
    onSubmit,
    validationSchema: schema,
  });

  const onClick = (): void => {
    handleSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-between w-full p-4">
      <button
        onClick={onClick}
        className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default ChannelForm;
