import { Link, NavLink, Outlet } from "react-router-dom";

const Profiles = () => {
  const profiles = [1, 2, 3, 4, 5];

  return (
    <div>
      <p>profiles</p>
      {profiles.map((profile) => (
        <NavLink key={profile} to={`/profiles/${profile}`}>
          Profile {profile}
        </NavLink>
      ))}
      <Outlet />
    </div>
  );
};

export default Profiles;
