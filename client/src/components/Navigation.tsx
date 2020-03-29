import React from "react";
import { navigate, usePath } from "hookrouter";
import { Container, Nav, Navbar } from "react-bootstrap";
import BannerImage from "../img/banner.png";

interface INavigationProps {
  inGame: boolean;
  isBanker: boolean;
}

const Navigation: React.FC<INavigationProps> = ({ inGame, isBanker }) => {
  const currentPath = usePath();

  const navbarLinks: Record<string, { active: boolean; title: string }> = {
    "/funds": {
      active: inGame,
      title: "Funds"
    },
    "/bank": {
      active: inGame && isBanker,
      title: "Bank"
    },
    "/transactions": {
      active: inGame,
      title: "Transactions"
    },
    "/game": {
      active: inGame && isBanker,
      title: "Game"
    }
  };

  const goTo = (location: string) => () => navigate(location);

  return (
    <Navbar collapseOnSelect expand="md" bg="light" variant="light" sticky="top">
      <Container>
        <Navbar.Brand onClick={goTo("/")}>
          <img
            src={BannerImage}
            height="30"
            className="d-inline-block align-top"
            alt="Monopoly Money Banner Logo"
            style={{ cursor: "pointer" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {Object.keys(navbarLinks)
              .filter(path => navbarLinks[path].active)
              .map(path => (
                <Nav.Link key={path} href="#" onClick={goTo(path)} active={currentPath === path}>
                  {navbarLinks[path].title}
                </Nav.Link>
              ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
