import mustache from "mustache";
import { User } from "../shared/types";

const sidebarTemplate = document.getElementById(
  "sidebar-template",
) as HTMLTemplateElement;
const sidebar = document.getElementById("sidebar") as HTMLDivElement;

const setUsers = (roomId: string, users: User[]) => {
  const html = mustache.render(sidebarTemplate.innerHTML, { roomId, users });
  sidebar.innerHTML = html;
};

export { setUsers };
