const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  resolve: {
    alias: {
      '@exam-planner/shared-types': join(
        __dirname,
        '../../libs/shared/types/src/index.ts'
      ),
      '@exam-planner/shared-utils': join(
        __dirname,
        '../../libs/shared/utils/src/index.ts'
      ),
      '@exam-planner/server-auth': join(
        __dirname,
        '../../libs/server/auth/src/index.ts'
      ),
      '@exam-planner/server-security': join(
        __dirname,
        '../../libs/server/security/src/index.ts'
      ),
      '@exam-planner/server-users': join(
        __dirname,
        '../../libs/server/users/src/index.ts'
      ),
      '@exam-planner/server-catalog': join(
        __dirname,
        '../../libs/server/catalog/src/index.ts'
      ),
      '@exam-planner/server-subject': join(
        __dirname,
        '../../libs/server/subject/src/index.ts'
      ),
      '@exam-planner/server-sessions': join(
        __dirname,
        '../../libs/server/sessions/src/index.ts'
      ),
      '@exam-planner/server-appointments': join(
        __dirname,
        '../../libs/server/appointments/src/index.ts'
      ),
      '@exam-planner/server-calendar': join(
        __dirname,
        '../../libs/server/calendar/src/index.ts'
      ),
    },
    extensions: ['.ts', '.js'],
  },
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
    }),
  ],
};
