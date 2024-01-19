import { EventBus } from 'quasar';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  const eventBus = new EventBus();

  // for Options API
  app.config.globalProperties.$eventBus = eventBus;

  // for Composition API
  app.provide('event-bus', eventBus);
});
