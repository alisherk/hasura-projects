import React from "react";

const OnlineUser = ({ user }: any) => {
  return (
    <div className="userInfo">
      <div className="userImg">
        <i className="far fa-user" />
      </div>
      <div className="userName">{user.name}</div>
    </div>
  );
};

export default OnlineUser;