import BasicInput from '@/components/app/inputs/BasicInput';
import { useFormik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  users: Yup.array().of(Yup.string().required()),
  isPrivate: Yup.boolean().required(),
  password: Yup.string(),
});

export type ChannelFormValues = {
  users: number[];
  isPrivate: boolean;
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
  const { handleSubmit, values, handleChange, setFieldValue, isValid, errors } =
    useFormik({
      initialValues,
      onSubmit,
      validationSchema: schema,
    });

  const onClick = (): void => {
    if (isValid) {
      handleSubmit();
    } else {
      toast.error(errors?.password ?? errors?.isPrivate ?? 'Form error');
    }
  };

  const onChannelTypeChange =
    (isPrivate: boolean): (() => void) =>
    (): void => {
      void setFieldValue('isPrivate', isPrivate);
    };

  return (
    <div className="flex flex-col space-y-8 items-center justify-between w-full p-4">
      <div className="flex flex-row items-center justify-center space-x-8 w-1/2">
        <button
          onClick={onChannelTypeChange(false)}
          className={
            !values.isPrivate
              ? 'text-white w-full antialiased py-2 rounded-full border-[var(--main-theme-color)] border-2'
              : 'text-white w-full antialiased py-2 rounded-full border-white border-[0.5px]'
          }
        >
          Public
        </button>
        <button
          onClick={onChannelTypeChange(true)}
          className={
            values.isPrivate
              ? 'text-white w-full antialiased py-2 rounded-full border-[var(--main-theme-color)] border-2'
              : 'text-white w-full antialiased py-2 rounded-full border-white border-[0.5px]'
          }
        >
          Private
        </button>
      </div>
      <BasicInput
        type="input"
        name="channel password"
        className="text-black rounded-full w-1/2 py-2 px-4 outline-0 placeholder:text-center placeholder:antialiased antialiased"
        placeholder="Password (optional)"
        value={values.password}
        onChange={handleChange('password')}
      />
      <button
        type="submit"
        onClick={onClick}
        className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default ChannelForm;
