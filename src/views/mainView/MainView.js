import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useQuery, gql } from '@apollo/client';

import './MainView.css';

const FETCH_ORDERS_QUERY = gql`
  query getOrdersInDateRange($startDate: String!, $endDate: String!) {
    getOrdersInDateRange(arg1: { startDate: $startDate, endDate: $endDate }) {
      orders {
        customer_id
        date_created
        date_paid
        id
        number
        percentage_tip
        state
        table_id
        total_check
        total_tip
        waiter_id
      }
      total_check
      total_tip
    }
  }
`;

const MainView = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [orders, setOrders] = React.useState([]);
  const [value, setValue] = React.useState([dayjs('2023-05-01'), dayjs('2023-07-01')]);

  const tables = [
    {
      name: 'Table 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Table 2',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Table 3',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Table 4',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      name: 'Table 5',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ];

  const { data } = useQuery(FETCH_ORDERS_QUERY, {
    variables: {
      startDate: value[0].toDate().toISOString().split('T')[0],
      endDate: value[1].toDate().toISOString().split('T')[0],
    },
  });

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (data) {
      setOrders(data.getOrdersInDateRange.orders);
    }
  }, [data, value]);

  const handleClickOnCardTable = (number) => {
    const tableId = number + 1;
    navigate(`/tables/${tableId}/orders`);
  };

  const stateTranslated = (state) => {
    if (state === '1') return 'ORDERING';
    else if (state === '2') return 'CHECKING';
    else return 'PAID';
  };

  return (
    <Container maxWidth="md" className="main-container">
      <Grid container spacing={2} className="grid-container">
        <Grid item xs={12} className="table-grid">
          <Tabs value={selectedTab} onChange={handleTabChange} className="tabs">
            <Tab label="Tables"/>
            <Tab label="Orders History"/>
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {selectedTab === 0 && (
            <Grid container spacing={2} className="table-grid">
              {tables.map((table, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card className="table-card" onClick={() => handleClickOnCardTable(index)}>
                    <CardContent className="card-content">
                      <Typography variant="h6">
                        {table.name}
                      </Typography>
                      <Typography variant="body1">
                        No. customers: #
                      </Typography>
                      <Typography variant="body1">
                        State: ####
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {selectedTab === 1 && (
            <div className="orders-history">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangePicker']}>
                  <DateRangePicker value={value} onChange={(newValue) => {setValue(newValue)}} />
                </DemoContainer>
              </LocalizationProvider>
              <Grid container spacing={1} className="orders-grid">
                {orders.map((order, index) => (
                  <Grid item xs={12} key={index}>
                    <Typography variant="h6">
                      OrderID: {order.id}
                    </Typography>
                    <Typography variant="body1">
                      State: {stateTranslated(order.state)}
                    </Typography>
                    {order.state === '3' && (
                      <Typography variant="body1">
                        Paid on: {order.date_paid}
                      </Typography>
                    )}
                    <Divider orientation="horizontal" className="order-divider" />
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainView;
