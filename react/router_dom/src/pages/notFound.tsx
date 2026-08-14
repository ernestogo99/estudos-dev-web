import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <p>404 Not found</p>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFound;
