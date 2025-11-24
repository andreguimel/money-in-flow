import React, { Suspense, Component as ReactComponent } from 'react';
import { RouteWrapper } from './RouteWrapper';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

interface LazyRouteProps {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  requiresAuth?: boolean;
  requiresSubscription?: boolean;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LazyLoadErrorBoundary extends ReactComponent<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Detectar erro de lazy loading
    if (error.message?.includes('Failed to fetch dynamically imported module')) {
      return { hasError: true, error };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro no lazy loading:', error, errorInfo);
  }

  handleReload = () => {
    // Limpar cache e recarregar
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes('Failed to fetch dynamically imported module');
      
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground">
              {isChunkError ? 'Atualização Disponível' : 'Algo deu errado'}
            </h2>
            <p className="text-muted-foreground">
              {isChunkError 
                ? 'Uma nova versão do aplicativo está disponível. Por favor, recarregue a página.'
                : 'Ocorreu um erro ao carregar esta página.'}
            </p>
            <Button 
              onClick={this.handleReload}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar Página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const LazyRoute: React.FC<LazyRouteProps> = ({
  component: Component,
  requiresAuth = true,
  requiresSubscription = true,
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
}) => {
  return (
    <RouteWrapper 
      requiresAuth={requiresAuth} 
      requiresSubscription={requiresSubscription}
    >
      <LazyLoadErrorBoundary>
        <Suspense fallback={fallback}>
          <Component />
        </Suspense>
      </LazyLoadErrorBoundary>
    </RouteWrapper>
  );
};

export default LazyRoute;