import { useState, useEffect } from "react";

// Navbar Component
const SideNavbar = ({ pageType }) => {
  const [websiteOpen, setWebsiteOpen] = useState(false);
  const [databaseOpen, setDatabaseOpen] = useState(false);

  useEffect(() => {
    if (pageType == "Posts" || pageType == "Images" || pageType == "etc") {
      setWebsiteOpen(true);
      setDatabaseOpen(false);
    } else if (
      pageType == "Cookies" ||
      pageType == "Packages" ||
      pageType == "Collections"
    ) {
      setWebsiteOpen(false);
      setDatabaseOpen(true);
    } else {
      setWebsiteOpen(false);
      setDatabaseOpen(false);
    }
  }, []);

  return (
    <div className="d-flex flex-column flex-shrink-0 sidebar">
      <ul className="nav nav-pills flex-column mb-auto">
        <li
          style={{
            "background-color": pageType == undefined ? "#d4c6ec" : "",
          }}
        >
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
            aria-expanded={websiteOpen}
          >
            <img src="/icons/laptop.svg" className="sidebar-icon" /> Manage
            Website{" "}
            <img src="/icons/caret-right-fill.svg" className="sidebar-arrow" />
          </button>
          <div
            className={
              websiteOpen
                ? "collapse show dropdown-background"
                : "collapse dropdown-background"
            }
            id="website-collapse"
          >
            <ul className="btn-toggle-nav list-unstyled fw-normal">
              <li
                style={{
                  "background-color": pageType == "Posts" ? "#d4c6ec" : "",
                }}
              >
                <a href="#">
                  <img
                    src={
                      pageType == "Posts"
                        ? "/icons/caret-right-fill.svg"
                        : "/icons/caret-right.svg"
                    }
                    className="sidebar-icon"
                  />{" "}
                  Posts
                </a>
              </li>
              <li
                style={{
                  "background-color": pageType == "Images" ? "#d4c6ec" : "",
                }}
              >
                <a href="#">
                  <img
                    src={
                      pageType == "Images"
                        ? "/icons/caret-right-fill.svg"
                        : "/icons/caret-right.svg"
                    }
                    className="sidebar-icon"
                  />{" "}
                  Images
                </a>
              </li>
              <li
                style={{
                  "background-color": pageType == "etc" ? "#d4c6ec" : "",
                }}
              >
                <a href="#">
                  <img
                    src={
                      pageType == "etc"
                        ? "/icons/caret-right-fill.svg"
                        : "/icons/caret-right.svg"
                    }
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
            aria-expanded={databaseOpen}
          >
            <img src="/icons/archive.svg" className="sidebar-icon" /> Manage
            Database{" "}
            <img src="/icons/caret-right-fill.svg" className="sidebar-arrow" />
          </button>
          <div
            className={
              databaseOpen
                ? "collapse show dropdown-background"
                : "collapse dropdown-background"
            }
            id="database-collapse"
          >
            <ul className="btn-toggle-nav list-unstyled fw-normal">
              <li
                style={{
                  "background-color": pageType == "Cookies" ? "#d4c6ec" : "",
                }}
              >
                <a href="cookies">
                  <img
                    src={
                      pageType == "Cookies"
                        ? "/icons/caret-right-fill.svg"
                        : "/icons/caret-right.svg"
                    }
                    className="sidebar-icon"
                  />{" "}
                  Cookies
                </a>
              </li>
              <li
                style={{
                  "background-color": pageType == "Packages" ? "#d4c6ec" : "",
                }}
              >
                <a href="packages">
                  <img
                    src={
                      pageType == "Packages"
                        ? "/icons/caret-right-fill.svg"
                        : "/icons/caret-right.svg"
                    }
                    className="sidebar-icon"
                  />{" "}
                  Packages
                </a>
              </li>
              <li
                style={{
                  "background-color":
                    pageType == "Collections" ? "#d4c6ec" : "",
                }}
              >
                <a href="#">
                  <img
                    src={
                      pageType == "Collections"
                        ? "/icons/caret-right-fill.svg"
                        : "/icons/caret-right.svg"
                    }
                    className="sidebar-icon"
                  />{" "}
                  Collections
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li
          style={{ "background-color": pageType == "Other" ? "#d4c6ec" : "" }}
        >
          <button className="btn btn-toggle align-items-center">Other</button>
        </li>
      </ul>
    </div>
  );
};

export default SideNavbar;
