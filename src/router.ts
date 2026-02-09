type Route = {
  path: string;
  component: () => string;
};

class Router {
  private routes: Route[] = [];
  private currentPath: string = '';
  private initialized: boolean = false;
  private clickHandler: ((e: Event) => void) | null = null;

  constructor() {
    this.currentPath = window.location.pathname || '/';
  }

  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    
    // Set up popstate listener for browser back/forward
    window.addEventListener('popstate', () => {
      this.currentPath = window.location.pathname;
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

  navigate(path: string): void {
    this.currentPath = path;
    window.history.pushState({}, '', path);
    this.render();
  }

  private render(): void {
    const route = this.routes.find(r => r.path === this.currentPath) || 
                  this.routes.find(r => r.path === '*');
    
    const app = document.querySelector('#app');
    if (app && route) {
      app.innerHTML = route.component();
    }
  }
}

export const router = new Router();

