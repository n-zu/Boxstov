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
  window.location.href = "/play?" + params;
});

document.getElementById("btnJoin")?.addEventListener("click", () => {
  const params = getQueryString({ id: getInputValue("inputID") });
  window.location.href = "/play?" + params;
});

document.getElementById("btnPlay")?.addEventListener("click", () => {
  window.location.href = "/play?" + getQueryString();
});
