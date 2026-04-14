module.exports = {
  apps : [{
    name   : "CAMERA_UZ",
    cwd: __dirname,
    script : "./dist/server.js",
    watch: false,
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    },
    instances: 1,
    exec_mode: "cluster"
  }]
}
