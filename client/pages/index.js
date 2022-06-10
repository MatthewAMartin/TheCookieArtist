import { useState, useEffect } from "react";
import CookieForm from "../components/CookieForm";
import PackageForm from "../components/PackageForm";

export default function Home() {
  const [showCookieForm, setShowCookieForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);

  const closeCookieForm = () => {
    setShowCookieForm(false);
  };

  const closePackageForm = () => {
    setShowPackageForm(false);
  };

  useEffect(() => {}, []);

  return (
    <div className="row" style={{ height: "calc(100vh - 49px)" }}>
      <div className="d-flex flex-column flex-shrink-0 sidebar">
        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <a href="/">
              <button className="btn btn-toggle align-items-center">
                <img src="/icons/house.svg" className="sidebar-icon" /> Home
              </button>
            </a>
          </li>
          <li>
            <button
              className="btn btn-toggle align-items-center"
              data-bs-toggle="collapse"
              data-bs-target="#website-collapse"
              aria-expanded="false"
            >
              <img src="/icons/laptop.svg" className="sidebar-icon" /> Manage
              Website{" "}
              <img
                src="/icons/caret-right-fill.svg"
                className="sidebar-arrow"
              />
            </button>
            <div className="collapse dropdown-background" id="website-collapse">
              <ul className="btn-toggle-nav list-unstyled fw-normal">
                <li>
                  <a href="#">
                    <img
                      src="/icons/caret-right.svg"
                      className="sidebar-icon"
                    />{" "}
                    Posts
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img
                      src="/icons/caret-right.svg"
                      className="sidebar-icon"
                    />{" "}
                    Images
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img
                      src="/icons/caret-right.svg"
                      className="sidebar-icon"
                    />{" "}
                    etc
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <button
              className="btn btn-toggle align-items-center"
              data-bs-toggle="collapse"
              data-bs-target="#database-collapse"
              aria-expanded="false"
            >
              <img src="/icons/archive.svg" className="sidebar-icon" /> Manage
              Database{" "}
              <img
                src="/icons/caret-right-fill.svg"
                className="sidebar-arrow"
              />
            </button>
            <div
              className="collapse dropdown-background"
              id="database-collapse"
            >
              <ul className="btn-toggle-nav list-unstyled fw-normal">
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      setShowPackageForm(false);
                      setShowCookieForm(!showCookieForm);
                    }}
                  >
                    <img
                      src="/icons/caret-right.svg"
                      className="sidebar-icon"
                    />{" "}
                    Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      setShowCookieForm(false);
                      setShowPackageForm(!showPackageForm);
                    }}
                  >
                    <img
                      src="/icons/caret-right.svg"
                      className="sidebar-icon"
                    />{" "}
                    Packages
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img
                      src="/icons/caret-right.svg"
                      className="sidebar-icon"
                    />{" "}
                    Collections
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <button className="btn btn-toggle align-items-center">Other</button>
          </li>
        </ul>
      </div>
      <div style={{ width: "calc(100vw - 250px)" }}>
        {showCookieForm && (
          <CookieForm form={showCookieForm} closeForm={closeCookieForm} />
        )}
        {showPackageForm && (
          <PackageForm form={showPackageForm} closeForm={closePackageForm} />
        )}
      </div>
    </div>
  );
}
