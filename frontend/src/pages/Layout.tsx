import Navbar from "@/components/Navbar";

type LayoutType = {
  children: React.ReactNode;
};

function Layout(props: LayoutType) {
  const { children } = props;

  return (
    <>
      <div className="min-h-screen flex flex-col overflow-y-hidden bg-background font-sans antialiased theme-slate">
        <Navbar />
        <div
          className="px-2.5 md:px-20 py-4 mb-4 content-max-height"
          style={{ "--navbar-height": "80px" } as React.CSSProperties}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;
