// Cloudflare Worker for basic auth on all routes
const admins = [
  {
    username: "admin",
    password: "admin"
  },
];

const regularUsers = [
  {
    username: "user",
    password: "user"
  }
];

// Define which paths require which level of auth
const getAuthLevel = (path) => {
  if (path === "/" || path === "/index") {
    return "both"; // admins and regular users
  } else if (path === "/html" || path === "/blog" || path === "/foobar") {
    return "admin"; // admin only
  } else if (path.startsWith("/posts/")) {
    return "both"; // admins and regular users
  }
  return "none"; // no auth required
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Skip auth for static assets
    if (path.startsWith('/favicon') || 
        path.includes('.') || 
        path.startsWith('/_astro/') ||
        path.startsWith('/assets/')) {
      return env.ASSETS.fetch(request);
    }
    
    const authLevel = getAuthLevel(path);
    
    // If no auth required, serve normally
    if (authLevel === "none") {
      return env.ASSETS.fetch(request);
    }
    
    // Check for basic auth header
    const authHeader = request.headers.get("authorization");
    
    if (authHeader && authHeader.startsWith("Basic ")) {
      const encoded = authHeader.substring(6);
      const decoded = atob(encoded);
      const [username, password] = decoded.split(":");
      
      let allowedUsers = [];
      if (authLevel === "admin") {
        allowedUsers = admins;
      } else if (authLevel === "both") {
        allowedUsers = [...admins, ...regularUsers];
      }
      
      const isValid = allowedUsers.find(user => 
        user.username === username && user.password === password
      );
      
      if (isValid) {
        console.log("Auth successful for:", path); // TEMP
        return env.ASSETS.fetch(request);
      }
    }
    
    // Auth failed or missing - return 401
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
        "Content-Type": "text/plain"
      }
    });
  }
}; 