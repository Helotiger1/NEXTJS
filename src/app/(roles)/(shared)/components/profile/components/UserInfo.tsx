
type UserInfoProps = {
  phone: string;
  ci: string;
};

export default function UserInfo({ phone, ci }: UserInfoProps) {
  return (
    <section className="p-4">
      <h2 className="text-lg font-semibold mb-2">Información</h2>
      <ul className="space-y-1 text-sm text-gray-700">
        <li>
          <span className="font-medium">Teléfono:</span> {phone}
        </li>
        <li>
          <span className="font-medium">Cédula:</span> {ci}
        </li>
      </ul>
    </section>
  );
}