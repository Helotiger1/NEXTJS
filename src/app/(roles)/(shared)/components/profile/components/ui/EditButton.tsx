
type EditProfileButtonProps = {
  onClick?: () => void;
};

export default function EditButton({ onClick }: EditProfileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
    >
      Editar perfil
    </button>
  );
}
