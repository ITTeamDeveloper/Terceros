module.exports = {
  apps: [
    {
      name: 'terceros-web',
      script: 'npm',
      args: 'run preview -- --host 0.0.0.0 --port 8081',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 8081,
      },
      env_development: {
        NODE_ENV: 'development',
      },
      out_file: './logs/pm2-out.log',
      error_file: './logs/pm2-error.log',
      merge_logs: true,
      time: true,
    },
  ],
};
