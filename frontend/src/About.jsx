import { Link, Outlet } from "react-router-dom";

function About() {
  return (
    <div>
      <h1>About this app</h1>
      <Link to="profile">Profile</Link>
      <Outlet />
    </div>
  );
}

export default About;
