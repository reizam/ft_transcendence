import dashStyles from '@/styles/dash.module.css';
import { ReactElement } from 'react';

interface ProfileAvatarProps {
  src: string;
  isEditing?: boolean;
}

function ProfileAvatar({
  src,
  isEditing = false,
}: ProfileAvatarProps): ReactElement {
  // const [selectedFile, setSelectedFile] = useState<File>();
  // const [errorMsg, setErrorMsg] = useState('');
  // const notificationCtx = useContext(NotificationContext);

  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();

  //   const MAX_FILE_SIZE = 1024;
  //   const ALLOWED_TYPE = ['image/jpg', 'image/jpeg'];

  //   if (!e.target.files) {
  //     notificationCtx.error('Please choose a file1');
  //     return;
  //   }

  //   if (e.target.files.length > 1) {
  //     notificationCtx.error('Too much files selected');
  //     return;
  //   }

  //   setSelectedFile(e.target.files[0]);

  //   if (!selectedFile) {
  //     notificationCtx.error('Please choose a file2');
  //     return;
  //   }

  //   if (!ALLOWED_TYPE.includes(selectedFile.type)) {
  //     notificationCtx.error(`File type not allowed (${selectedFile.type})`);
  //     return;
  //   }

  //   const fileSizeKiloBytes = selectedFile.size / 1024;

  //   if (fileSizeKiloBytes > MAX_FILE_SIZE) {
  //     notificationCtx.error('File size is greater than maximum limit (1MB)');
  //     return;
  //   }

  //   fetch(`${BACKEND_URL}/profile`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: {
  //       Authorization: `Bearer ${getCookie('jwt')}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ profilePicture: await selectedFile.text() }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => console.log(data))
  //     .catch((err) => console.error(err));
  // };

  return (
    <div className={dashStyles.pict__prof}>
      {isEditing && (
        <input
          accept="image/*"
          type="file"
          id="select-image"
          style={{ display: 'none' }}
          // onChange={handleFileUpload}
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
