export function handleUnauthorized() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
