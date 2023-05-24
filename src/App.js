import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Typography, Toolbar, IconButton } from '@mui/material';
import MainView from './views/mainView/MainView';
import TableDetail from './views/tableDetail/TableDetail';

const httpLink = createHttpLink({
  uri: 'https://peaceful-oryx-35.hasura.app/v1/graphql',
  headers: {
    'x-hasura-admin-secret': 'NVCQU6iRr0w1Okd6wduAS6UVtjknqYAnFrIlmVsb3QQf7a7XLUD67m9UkZTxb78R', // or 'x-hasura-access-key' for access key
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      
        <div>
          <AppBar position="static">
            <Toolbar variant="dense">
              <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              </IconButton>
              <Typography variant="h6" color="inherit" component="div">
                Waiter's App
              </Typography>
            </Toolbar>
          </AppBar>
          <Router>
            <Routes>
              <Route path='/' element={<MainView/>}/>
              <Route path="/tables/:tableId/orders" element={<TableDetail/>} />
            </Routes>
          </Router>
        </div>
    </ApolloProvider>
  );
}

export default App;
