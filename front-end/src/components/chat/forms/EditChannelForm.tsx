import BasicInput from '@/components/app/inputs/BasicInput';
import { useFormik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import chatStyles from '@/styles/chat.module.css';
import { IChannel, IChannelUser, IChatUser } from '@/api/channel/channel.types';
import Line from '@/components/chat/line/Line';
import { useGetAllChatUsers } from '@/api/channel/channel.api';

const schema = Yup.object().shape({
  password: Yup.string(),
  withPassword: Yup.boolean().required(),
});

export type EditChannelFormValues = {
  channel: IChannel;
  isOwner: boolean;
  isAdmin: boolean;
  users: IChannelUser[];
  withPassword: boolean;
  password: string;
};

interface EditChannelFormProps {
  initialValues: EditChannelFormValues;
  onSubmit: (values: EditChannelFormValues) => void;
  onLeave: () => void;
}

function EditChannelForm({
  initialValues,
  onSubmit,
  onLeave,
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
    } else {
      toast.error('Please correct the form errors');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') onClick();
  };

  const isBanned = (
    userId: number,
    bannedUserIds: number[] | undefined
  ): boolean => {
    if (bannedUserIds?.find((id) => id === userId)) return true;
    return false;
  };

  const {
    data: allUsers,
    isLoading: allUsersLoading,
    isError: allUsersError,
  } = useGetAllChatUsers(initialValues.channel.id, {
    enabled: true,
  });

  const createDummyChannelUser = (user: IChatUser): IChannelUser => {
    return {
      ...user,
      channelId: initialValues.channel.id,
      userId: user.id,
      user,
      isAdmin: false,
    };
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full px-4 py-8 overflow-y-auto hide-scrollbar">
      {initialValues.channel.isPrivate || !initialValues.isOwner ? null : (
        <div className="flex flex-col items-center space-y-8 w-full">
          <div className="flex flex-row space-x-4 items-center">
            <input
              type="checkbox"
              name="toggle password input"
              checked={values.withPassword}
              onChange={(event): void =>
                void setFieldValue('withPassword', event.target.checked)
              }
            />
            <p>Protect with password</p>
          </div>
          {values.withPassword && (
            <BasicInput
              type="input"
              name="new channel password"
              className="text-black rounded-full w-1/2 py-2 px-4 outline-0 placeholder:text-center placeholder:antialiased antialiased"
              placeholder={
                !initialValues.withPassword
                  ? 'Enter a password'
                  : 'New password'
              }
              value={values.password}
              onChange={handleChange('password')}
              onKeyPress={handleKeyDown}
            />
          )}
        </div>
      )}

      <div className="flex flex-col items-center space-y-8 w-full">
        <div className={chatStyles.ctn_user}>
          <h2 className={chatStyles.h2_user}>Users</h2>
          {initialValues.users?.map((user) => (
            <Line
              key={user.userId}
              isDM={initialValues.channel.isDM}
              user={user}
              isInChannel={true}
              asOwner={initialValues.isOwner}
              asAdmin={initialValues.isAdmin}
              isOwner={user.userId === initialValues.channel.ownerId}
              isBanned={isBanned(
                user.userId,
                initialValues.channel.bannedUserIds
              )}
              isPrivateChannel={initialValues.channel.isPrivate}
            />
          ))}
        </div>
      </div>

      {initialValues.channel.isDM ? null : (
        <div className="flex flex-col items-center space-y-8 w-full">
          <div className={chatStyles.ctn_user}>
            <h2 className={chatStyles.h2_user}>The Rest of the World</h2>
            {!allUsersLoading &&
              !allUsersError &&
              allUsers
                .filter(
                  (chatUser) =>
                    !initialValues.users.find(
                      (channelUser) => channelUser.userId == chatUser.id
                    )
                )
                .map((user) => (
                  <Line
                    key={user.id}
                    isDM={false}
                    user={createDummyChannelUser(user)}
                    isInChannel={false}
                    asOwner={false}
                    asAdmin={false}
                    isOwner={false}
                    isBanned={isBanned(
                      user.id,
                      initialValues.channel.bannedUserIds
                    )}
                    isPrivateChannel={initialValues.channel.isPrivate}
                  />
                ))}
          </div>
        </div>
      )}

      <div className="flex flex-row space-x-4 items-center">
        <button
          onClick={onLeave}
          className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
          hidden={initialValues.channel.isDM}
        >
          Leave channel
        </button>
        <button
          type="submit"
          onClick={onClick}
          className="bg-purple ring-1 ring-white hover:ring-2 hover:ring-offset-1 active:opacity-75 rounded-full text-white font-medium text-sm transition ease-in-out duration-200 px-4 py-2"
          hidden={initialValues.channel.isDM || !initialValues.isOwner}
        >
          Save settings
        </button>
      </div>
    </div>
  );
}

export default EditChannelForm;
