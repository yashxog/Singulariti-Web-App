const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="lg:pl-20 bg-paper min-h-screen fixed inset-0 overflow-y-auto">
      <div className="max-w-screen-xl lg:mx-auto mx-4 py-4">{children}</div>
    </main>
  );
};

export default Layout;