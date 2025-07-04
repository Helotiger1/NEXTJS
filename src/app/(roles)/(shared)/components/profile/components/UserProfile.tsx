import React from "react";
import  UserHeader  from "./UserHeader";
import  UserInfo  from "./UserInfo";
import EditButton from "./ui/EditButton";

export default function UserProfile() {

  let nose = {
    icon : "XD",
    email : "nose@example.com",
    name : "Pipe",
    ci : "31638644",
    phone : "04120948781",
  }

  const onEditClick = () => {};

  return (
    <section className="p-6 border rounded-md max-w-md mx-auto">
      <UserHeader email={nose.email} icon={nose.icon} name={nose.name} />
      <UserInfo ci={nose.ci} phone={nose.phone} />
      <EditButton onClick={onEditClick} />
    </section>
  );
}
