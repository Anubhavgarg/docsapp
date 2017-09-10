module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name        : "docsapp-ola-simulator",
      script      : "bin/www",
      instances  : 0,
      exec_mode  : "cluster",
      // watch: ['app.js', 'routes.js', 'ecosystem.config.js', 'controllers', 'middlewares', 'config', 'db'],
      merge_logs: true,
      env: {
        PORT: "3001"
      },
      env_development: {
        NODE_ENV: "development"
      },
      env_production : {
        NODE_ENV: "production"
      },
      env_staging : {
        NODE_ENV: "staging"
      },
      env_staging2 : {
        NODE_ENV: "staging2"
      },
      env_local : {
        NODE_ENV: "development"
      }
    }
  ]
  // ,

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  // deploy : {
  //   production : {
  //     user : "node",
  //     host : "212.83.163.1",
  //     ref  : "origin/master",
  //     repo : "git@github.com:repo.git",
  //     path : "/var/www/production",
  //     "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production"
  //   },
  //   dev : {
  //     user : "node",
  //     host : "212.83.163.1",
  //     ref  : "origin/master",
  //     repo : "git@github.com:repo.git",
  //     path : "/var/www/development",
  //     "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env dev",
  //     env  : {
  //       NODE_ENV: "dev"
  //     }
  //   }
  // }
}
