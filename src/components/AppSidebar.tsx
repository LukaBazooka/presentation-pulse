import { Presentation, BarChart3, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const items = [
  {
    title: "Present",
    url: "/",
    icon: Presentation,
  },
  {
    title: "Metrics",
    url: "/metrics",
    icon: BarChart3,
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
  },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-dark border-r border-primary/20">
      <div className="flex flex-col p-4">
        <nav>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    location.pathname === item.url
                      ? "text-primary"
                      : "text-light hover:text-primary"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AppSidebar;