import { Layout as RALayout, LayoutProps, AppBar } from 'react-admin';
import { Layout as CustomLayout } from '../../src/components/layout/Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const resetSearch = () => {
    queryClient.invalidateQueries({ queryKey: ['search'] });
};

const CustomAdminAppBar = (props: any) => null;

const CombinedAdminLayout = (props: LayoutProps) => (
  <QueryClientProvider client={queryClient}>
    {/* <CustomLayout resetSearch={resetSearch}> */}
      <RALayout {...props} appBar={CustomAdminAppBar} />
    {/* </CustomLayout> */}
  </QueryClientProvider>
);

export default CombinedAdminLayout;