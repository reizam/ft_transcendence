import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BasicInput from '@/components/app/inputs/BasicInput';

const schema = Yup.object().shape({
  users: Yup.array().of(Yup.string().required()),
  private: Yup.boolean().required(),
  password: Yup.string(),
});

export type ChannelFormValues = {
  users: number[];
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
  const { handleSubmit, values, handleChange, setFieldValue, isValid } =
    useFormik({
      initialValues,
      onSubmit,
      validationSchema: schema,
    });

  const onClick = (): void => {
    if (isValid) {
      handleSubmit();
    } else {
      // show toast error
    }
  };

  const onChannelTypeChange =
    (isPrivate: boolean): (() => void) =>
    (): void => {
      void setFieldValue('private', isPrivate);
    };

  return (
    <div className="flex flex-col space-y-8 items-center justify-between w-full p-4">
      <div className="flex flex-row items-center justify-center space-x-8 w-1/2">
        <button
          onClick={onChannelTypeChange(false)}
          className={
            !values.private
              ? 'bg-gray-500 text-black w-full antialiased py-2 rounded-full ease-in-out duration-200'
              : 'bg-white text-black w-full antialiased py-2 rounded-full ease-in-out duration-200'
          }
        >
          Public
        </button>
        <button
          onClick={onChannelTypeChange(true)}
          className={
            values.private
              ? 'bg-gray-500 text-black w-full antialiased py-2 rounded-full ease-in-out duration-200'
              : 'bg-white text-black w-full antialiased py-2 rounded-full ease-in-out duration-200'
          }
        >
          Private
        </button>
      </div>
      <BasicInput
        className="text-black rounded-full w-1/2 py-2 px-4 outline-0 placeholder:text-center placeholder:antialiased antialiased"
        placeholder="Mot de passe (optionnel)"
        value={values.password}
        onChange={handleChange('password')}
      />
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
