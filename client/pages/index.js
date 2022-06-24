import SideNavbar from "../components/SideNavbar";

export default function Home() {
  return (
    <div className="row" style={{ height: "calc(100vh - 49px)" }}>
      <SideNavbar />
      <div style={{ width: "calc(100vw - 250px)" }}>
        <h1>Content</h1>
      </div>
    </div>
  );
}
