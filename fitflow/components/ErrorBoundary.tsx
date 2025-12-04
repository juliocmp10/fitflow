import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('fitflow_state_v2');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-neutral-900 border border-red-900/30 p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Algo deu errado</h1>
            <p className="text-neutral-400 mb-6">
              Encontramos um erro inesperado. Tente recarregar a página ou resetar os dados do aplicativo.
            </p>
            
            <div className="bg-black/30 p-3 rounded-lg text-xs font-mono text-left text-neutral-500 mb-6 overflow-auto max-h-32">
                {this.state.error?.message || "Erro desconhecido"}
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-neutral-800 text-white py-3 rounded-xl font-bold hover:bg-neutral-700 transition"
                >
                    Tentar Novamente
                </button>
                <button
                    onClick={this.handleReset}
                    className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                    <RotateCcw size={18} /> Resetar Dados (Fábrica)
                </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}