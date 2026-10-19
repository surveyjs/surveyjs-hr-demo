import { demoUsers, toPublicUser } from "./data/demoUsers.js";

const STORAGE_KEY = "acme-hr-auth-user";
const SIGNED_OUT_KEY = "acme-hr-auth-signed-out";

export function storeUser(user, remember) {
  const target = remember ? window.localStorage : window.sessionStorage;
  const other = remember ? window.sessionStorage : window.localStorage;
  target.setItem(STORAGE_KEY, JSON.stringify(toPublicUser(user)));
  other.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(SIGNED_OUT_KEY);
}

function readKnownUser(raw) {
  try {
    const user = JSON.parse(raw);
    const known = demoUsers.find((item) => item.username === user.username && item.role === user.role);
    return known ? toPublicUser(known) : null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return readKnownUser(raw);
}

export function clearStoredUser() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.setItem(SIGNED_OUT_KEY, "1");
}
