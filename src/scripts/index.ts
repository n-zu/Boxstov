import "../styles/menu.css";
console.log("Hello, world!");

function getInputValue(id: string): string {
  const element = document.getElementById(id);
  if (element instanceof HTMLInputElement) {
    return element.value;
  }
  return "";
}

function getQueryString(params?: Record<string, string>): string {
  const query = params ?? {};
  return new URLSearchParams(query).toString();
}

document.getElementById("btnHost")?.addEventListener("click", () => {
  const params = getQueryString({ host_with: getInputValue("inputID") });
  const path = window.location.pathname.split("/").slice(0, -1).join("/");
  window.location.href = path + "/play?" + params;
});

document.getElementById("btnJoin")?.addEventListener("click", () => {
  const params = getQueryString({ id: getInputValue("inputID") });
  const path = window.location.pathname.split("/").slice(0, -1).join("/");
  window.location.href = path + "/play?" + params;
});

document.getElementById("btnPlay")?.addEventListener("click", () => {
  const path = window.location.pathname.split("/").slice(0, -1).join("/");
  window.location.href = path + "/play?" + getQueryString();
});
