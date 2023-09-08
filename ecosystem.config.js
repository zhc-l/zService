module.exports = {
  apps: [
    {
      name: 'z-service',
      script: './bin/www',
    },
  ],

  deploy: {
    production: {
      user: 'root',
      host: ['116.62.114.25'],
      port: '22',
      ref: 'origin/master',
      repo: 'git@github.com:zhc-l/zService.git',
      path: '/zService',
      'post-deploy': 'npm run install && pm2 reload ecosystem.config.js --env production',
    },
  },
}
