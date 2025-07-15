import { jwtDecode } from "jwt-decode";

const authMiddleware = (store:any) => (next:any) => (action:any) => {
  if (action.type === "auth/validateToken") {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        store.dispatch({ type: "auth/setUser", payload: decoded });
      } catch (error) {
        console.error("Invalid or expired token");
        store.dispatch({ type: "auth/logout" });  
      }
    }
  }
  return next(action);  
};

export default authMiddleware;
