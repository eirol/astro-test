import { defineMiddleware } from "astro/middleware";

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

export const onRequest = defineMiddleware((context, next) => {
  // If a basic auth header is present, it wil take the string form: "Basic authValue"

  const path = context.url.pathname;
  let allowedUsers = [];

  if (path.match("^/foobar/?$")) {
    allowedUsers = [...admins, ...regularUsers];
  } else if (path.match("^/html/?$")) {
    allowedUsers = admins;
  } else {
    return next();
  }

  const basicAuth = context.request.headers.get("authorization");

  if (basicAuth) {
    // Get the auth value from string "Basic authValue"
    const authValue = basicAuth.split(" ")[1];

    // Decode the Base64 encoded string via atob (https://developer.mozilla.org/en-US/docs/Web/API/atob)
    // Get the username and password. NB: the decoded string is in the form "username:password"
    const [username, pwd] = atob(authValue).split(":");

    // check if the username and password are valid
    console.log(username, pwd);
    console.log(allowedUsers);
    console.log(allowedUsers.find(user => user.username === username && user.password === pwd));

    if (allowedUsers.find(user => user.username === username && user.password === pwd)) {
      console.log("allowed");
      // forward request
      return next();
    }
  }

  return new Response("Auth required", {
    status: 401,
    headers: {
      "WWW-authenticate": 'Basic realm="Secure Area"',
    },
  });
});
