import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    // every route must declare
    needAuth: boolean; // need login
    // permissionID
    permission?: string;
    icon?: string;
    locale?: string;
    // menu select key
    menuSelectKey?: string;
  }
}
