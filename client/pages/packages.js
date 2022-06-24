import SideNavbar from "../components/SideNavbar";
import PackageTable from "../components/PackageTable";

export default function Packages () {
  return (
    <div className="row" style={{ height: "calc(100vh - 49px)" }}>
      <SideNavbar pageType={"Packages"} />
      <div style={{ width: "calc(100vw - 250px)" }}>
        <div className="container-xxl">
          <PackageTable />
        </div>
      </div>
    </div>
  );
};
