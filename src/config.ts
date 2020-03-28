export default {
  client: {
    relative_build_directory: "../client/build",
    routes: ["/", "/about"]
  },
  server: {
    allowed_origins: process.env.SERVER_ALLOWED_ORIGINS,
    port: process.env.PORT || 5000
  }
};
