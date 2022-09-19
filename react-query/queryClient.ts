import { QueryClient } from "react-query";
import { toast } from 'react-toastify';

function queryErrorHandler(error: unknown): void {
  toast.error('🦄 Some error has happened!', {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler
    }
  }
})