import React, { ReactNode } from "react";
import { Col, Container, Row } from "react-bootstrap";

interface IPageSizeWrapperProps {
  children: ReactNode;
}

const PageSizeWrapper: React.FC<IPageSizeWrapperProps> = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="col-md-10">{children}</Col>
      </Row>
    </Container>
  );
};

export default PageSizeWrapper;
