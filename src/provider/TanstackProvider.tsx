import {type ReactNode, useState} from "react";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";

function TanstackProvider({children}: {children : ReactNode}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime : 5 * 60 * 1000, //5min
                        gcTime : 24 * 60 * 60 * 1000,
                        retry : 3,
                        retryDelay : (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
                        networkMode : "offlineFirst",
                        refetchOnWindowFocus : false,
                        refetchOnReconnect : "always",
                    },
                    mutations : {
                        retry : 2,
                        networkMode : "offlineFirst",
                    }
                }
            })
    )

    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default TanstackProvider