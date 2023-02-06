import avatar from "../../resources/images/avatar.jpg";

const Avatar = () => {
  const avatarClickHandler = () => {};
  return (
    <div
      onClick={avatarClickHandler}
      role="presentation"
      className="rounded-full w-11 h-11  cursor-pointer"
    >
      <img src={avatar} alt="avatar" className="w-11 h-11" />
    </div>
  );
};

export default Avatar;
