
interface ProfileCardProps {
    username: string,
    picture: string,
    twoFAIsEnabled: boolean
}

export default function ProfileCard({username, picture, twoFAIsEnabled}: ProfileCardProps) {

  return (
    <div className="flex">
        <h1>Profile</h1>
        <h2>{username}</h2>
        <h2>{picture}</h2>
        <h1>{twoFAIsEnabled ? "2FA enable" : "2FA disable"}</h1>
    </div>
  );
}
