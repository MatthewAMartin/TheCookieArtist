import SideNavbar from "../components/SideNavbar";
import CookieTable from "../components/CookieTable";

export default function Cookies () {
  return (
    <div className="row" style={{ height: "calc(100vh - 49px)" }}>
      <SideNavbar pageType={"Cookies"} />
      <div style={{ width: "calc(100vw - 250px)" }}>
        <div className="container-xxl">
          <CookieTable />
        </div>
      </div>
    </div>
  );
};
