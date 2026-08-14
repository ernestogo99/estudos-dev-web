import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { id } = useParams();

  return (
    <div>
      <p>Profile page {id}</p>
    </div>
  );
};

export default ProfilePage;
