// // in src/MyAppBar.js
// import { AppBar } from 'react-admin';
// import { Box } from '@mui/material';
// // import { Search } from "@react-admin/ra-search";
// // import { Layout as RALayout, LayoutProps, AppBar } from 'react-admin';
// // import { Layout as CustomLayout } from '../../src/components/layout/Layout';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// import { Layout } from '../../src/components/layout/Layout';

// const queryClient = new QueryClient();

// const resetSearch = () => {
//     queryClient.invalidateQueries({ queryKey: ['search'] });
// };

// const MyAppBar = () => (
//     <AppBar>
//         <Box component="span" flex={1} />
//         <Layout resetSearch={resetSearch} children={undefined}/>
//         <Box component="span" flex={1} />
//         {/* <Search /> */}
//     </AppBar>
// );
