import { NextPage } from "next";
import NavBar from "./Navbar";

const Layout: NextPage = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default Layout;
