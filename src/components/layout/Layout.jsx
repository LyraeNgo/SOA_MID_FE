// src/components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Header className="" />
      <main className="container mt-16 ">
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

export default Layout;
