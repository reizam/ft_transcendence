import { UpdateProfile } from '@/api/user/user.type';
import dashStyles from '@/styles/dash.module.css';
import { UseMutateFunction } from '@tanstack/react-query';
import { ReactElement } from 'react';
import { toast } from 'react-toastify';

interface ProfileAvatarProps {
  src: string;
  mutate: UseMutateFunction<unknown, unknown, UpdateProfile, unknown>;
  isEditing?: boolean;
}

function ProfileAvatar({
  src,
  mutate,
  isEditing = false,
}: ProfileAvatarProps): ReactElement {
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    e.preventDefault();

    const MAX_FILE_SIZE = 1024;
    const ALLOWED_TYPE = ['image/jpg', 'image/jpeg'];

    if (!e.target.files || e.target.files.length == 0) {
      toast.error('Please choose a file');
      return;
    }

    if (e.target.files.length > 1) {
      toast.error('Too much files selected');
      return;
    }

    const selectedFile: File = e.target.files[0];

    if (!ALLOWED_TYPE.includes(selectedFile.type)) {
      toast.error(`File type not allowed (${selectedFile.type})`);
      return;
    }

    const fileSizeKiloBytes = selectedFile.size / 1024;

    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      toast.error('File size is greater than maximum limit (1MB)');
      return;
    }

    const fileReader = new FileReader();

    fileReader.onloadend = (): void => {
      const fileAsDataURL = fileReader.result as string;
      mutate({ profilePicture: fileAsDataURL });
    };

    fileReader.onerror = (): void => {
      toast.error('Error reading the file!');
    };

    fileReader.readAsDataURL(selectedFile);
  };

  return (
    <div className={dashStyles.pict__prof}>
      {isEditing && (
        <input
          accept=".jpg, .jpeg"
          type="file"
          id="select-image"
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e)}
        />
      )}
      <label htmlFor="select-image">
        <img
          className={`${dashStyles.img__prof} ${
            isEditing ? dashStyles.editing__pointer : ''
          }`}
          src={src}
          alt="ProfileAvatar"
          style={{
            boxShadow: isEditing ? '0 0 40px 7px var(--main-theme-color)' : '',
          }}
        />
      </label>
      {/* {canEdit && (
        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 hover:cursor-pointer rounded-full">
          <BasicInput
          type="file"
          className="invisible"
          accept="image/*"
          onChange={handleFileUpload}
          />
          </div>
        )} */}
    </div>
  );
}

export default ProfileAvatar;
