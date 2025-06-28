
type UserProfileHeaderProps = {
  icon: string;
  name: string;
  email: string;
};

export default function UserHeader({ icon, name, email }: UserProfileHeaderProps) {
  return (
    <header className="flex items-center gap-4 p-4 border-b border-gray-200">
      <div className="text-3xl text-blue-600">{icon}</div>
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </header>
  );
}