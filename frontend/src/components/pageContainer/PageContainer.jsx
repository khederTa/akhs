import { Navbar } from "../navbar/Navbar";
import { SidebarComponent } from "../sidebarComponent/SidebarComponent";

export function PageContainer({ children }) {
  return (
    <div id="app" className="h-screen flex flex-row">
      <SidebarComponent />
      <main className="w-full text-[var(--text-color)] dark:text-[var(--text-dark-color)] bg-[var(--main-background-color)] dark:bg-[var(--main-background-dark-color)]">
        {/* Navbar */}
        <Navbar />
        {/* Main Content */}
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
