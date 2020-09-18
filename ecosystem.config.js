module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'login.dfe.interactions',
      script: 'src/index.js',
      interpreter: `${process.env.NVM_BIN}/node`,
      env: {
        COMMON_VARIABLE: 'true',
        NODE_TLS_REJECT_UNAUTHORIZED: '0',
        settings: '/Users/Steve/DfE-Projects/login.dfe.config/local-env/login.dfe.interactions.local.json',
        NODE_EXTRA_CA_CERTS: '/certs',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    },
    dev: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/development',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env dev',
      env: {
        NODE_ENV: 'dev',
      },
    },
  },
};
