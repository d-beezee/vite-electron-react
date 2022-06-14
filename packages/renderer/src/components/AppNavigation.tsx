import React from "react";
import Link from "./Link";
import styled from "styled-components";
const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  width: 60px;
  height: 100%;
  background-color: #f5f5f5;
  padding: 0.5rem;
  box-sizing: border-box;
  border-right: 1px solid #e5e5e5;

  .item {
    margin-bottom: 0.5rem;
  }
`;
const Content = styled.div`
  position: fixed;
  top: 0;
  left: 60px;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem;
  box-sizing: border-box;
  background-color: #fff;
`;

const AppNavigation: React.FC = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <>
      <Sidebar>
        <Link className="item" to="/">
          Home
        </Link>
        <Link className="item" isExternal to="https://www.google.com/">
          Google
        </Link>
        <Link className="item" to="/about">
          About
        </Link>
      </Sidebar>
      <Content>{children}</Content>
    </>
  );
};

export default AppNavigation;
