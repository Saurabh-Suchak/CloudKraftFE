type Route = {
  path: string;
  component: () => string;
};

type GuardFn = (to: string) => string | null; // return redirect path, or null to allow

class Router {
  private routes: Route[] = [];
  private currentPath: string = '';
  private initialized: boolean = false;
  private clickHandler: ((e: Event) => void) | null = null;
  private guard: GuardFn | null = null;

  constructor() {
    this.currentPath = window.location.pathname || '/';
  }

  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    
    // Set up popstate listener for browser back/forward
    window.addEventListener('popstate', () => {
      this.currentPath = window.location.pathname + window.location.search;
      this.render();
    });
    
    // Set up click handler once using event delegation
    this.clickHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Find the closest element with data-navigate attribute
      const link = target.closest('a[data-navigate]') as HTMLAnchorElement;
      const button = target.closest('button[data-navigate]') as HTMLButtonElement;
      
      if (link) {
        e.preventDefault();
        const path = link.getAttribute('data-navigate') || '/';
        this.navigate(path);
      } else if (button) {
        e.preventDefault();
        const path = button.getAttribute('data-navigate') || '/';
        this.navigate(path);
      }
    };
    
    document.addEventListener('click', this.clickHandler);
    this.render();
  }

  addRoute(path: string, component: () => string): void {
    this.routes.push({ path, component });
  }

  setGuard(fn: GuardFn): void {
    this.guard = fn;
  }

  navigate(path: string): void {
    this.currentPath = path;
    window.history.pushState({}, '', path);
    this.render();
  }

  private render(): void {
    const pathname = this.currentPath.split('?')[0];

    if (this.guard) {
      const redirect = this.guard(pathname);
      if (redirect) {
        this.currentPath = redirect;
        window.history.replaceState({}, '', redirect);
        return this.render();
      }
    }

    const route = this.routes.find(r => r.path === pathname) ||
                  this.routes.find(r => r.path === '*');

    const app = document.querySelector('#app');
    if (app && route) {
      app.innerHTML = route.component();
    }
  }
}

export const router = new Router();

