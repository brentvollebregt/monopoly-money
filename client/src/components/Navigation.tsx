import React from "react";
import { navigate, usePath } from "hookrouter";
import { Container, Nav, Navbar } from "react-bootstrap";
import BannerImage from "../img/banner.png";

const navbarLinks: Record<string, string> = {
  "/": "Home",
  "/about": "About"
};

const Navigation: React.FC = () => {
  const currentPath = usePath();

  const goTo = (location: string) => () => navigate(location);

  return (
    <Navbar collapseOnSelect expand="md" bg="light" variant="light" sticky="top">
      <Container>
        <Navbar.Brand onClick={goTo("/")}>
          <img
            src={BannerImage}
            height="30"
            className="d-inline-block align-top"
            alt="Emotionify Banner Logo"
            style={{ cursor: "pointer" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {Object.keys(navbarLinks).map(path => (
              <Nav.Link key={path} href="#" onClick={goTo(path)} active={currentPath === path}>
                {navbarLinks[path]}
              </Nav.Link>
            ))}
          </Nav>
          <Nav>
            <div>right Icon</div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
