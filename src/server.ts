import 'dotenv/config';
import App from './app';
import IndexRoute from './routes/index.route';
import validateEnv from './utils/validateEnv';
import TeamsRoute from './routes/teams.route';
import HerosRoute from './routes/heros.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new TeamsRoute(),
  new HerosRoute(),
]);

app.listen();
