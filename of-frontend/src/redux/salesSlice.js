import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios, retryAttempt } from '@/config/axios/axiosConfig';
import { SALES_DATA, USER_DATA } from '@/config/links/urls';
import { capitalize, setCurrentMonth } from '@/utils/FormatUtils';

export const getAllSales = createAsyncThunk('sales/getAllSales', async () => {
  const response = await axios.get(SALES_DATA.all);

  return response.data;
});

export const createSale = createAsyncThunk(
  'sales/createSale',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(SALES_DATA.create, data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteSale = createAsyncThunk(
  'sales/deleteSale',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(SALES_DATA.delete + data);
      return { id: data, response: response.data };
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

export const getMostSoldProduct = (sales) => {
  const productMap = sales
    .flatMap((sale) => sale.products)
    .reduce((acc, product) => {
      if (acc[product.product]) {
        acc[product.product].quantity += product.quantity;
      } else {
        acc[product.product] = product;
      }
      return acc;
    }, {});

  return Object.values(productMap)
    .sort((a, b) => b.quantity - a.quantity)
    .map((product, idx) => {
      return { ...product, fill: `hsl(var(--chart-${idx + 1}))` };
    })
    .splice(0, 5);
};

export const filterSale = createAsyncThunk(
  'sales/filterSale',
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const allSales = state.sales.allSales;
    const userPromise = allSales.map(async (sale) => {
      const response = await axios.get(USER_DATA.byEmail + sale.user);
      return { ...sale, username: response.data.name.toLowerCase() };
    });
    const allSalesWithUsername = await Promise.all(userPromise);
    return allSalesWithUsername.filter((sale) => {
      return Object.entries(sale).some(([key, value]) => {
        const stringValue = String(value).toLowerCase();
        return stringValue.includes(String(data).toLowerCase());
      });
    });
  },
);

export const handleDateRangeSales = (state, payload) => {
  if (!payload.from && !payload.to) {
    state.sales = state.allSales;
  } else {
    state.sales = state.allSales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      const fromDate = new Date(payload.from);
      const toDate = new Date(payload.to);
      toDate.setHours(23, 59, 59);
      return saleDate > fromDate && saleDate < toDate;
    });
  }

  state.mostSoldProducts = getMostSoldProduct(state.sales);
  gainsResolver(state, payload);
};

export const totalGainsResolver = (state) => {
  state.totalGain = state.sales.reduce(
    (acc, sale) => (acc += sale.sellingPrice),
    0,
  );
};

export const profitResolver = (state) => {
  state.profit = state.sales.reduce((acc, sale) => (acc += sale.profit), 0);
};

export const gainsResolver = (state, { from, to }) => {
  totalGainsResolver(state);
  profitResolver(state);
  state.gainsChartData = [
    { head: 'totalGains', totalGain: state.totalGain, profit: state.profit },
  ];
};

export const monthsGainsChartDataResolver = (state, { from, to }) => {
  const months = new Set(
    state.sales
      .map((sale) => new Date(sale.createdAt).getMonth())
      .sort((a, b) => a - b),
  );

  months.forEach((month) => {
    let monthSales = {
      head: '',
      totalGain: 0,
      profit: 0,
    };
    state.sales.forEach((sale) => {
      const saleMonth = new Date(sale.createdAt).getMonth();
      if (saleMonth === month) {
        const date = new Date(sale.createdAt);
        const options = { month: 'short' };
        monthSales = {
          head: capitalize(
            date.toLocaleString(localStorage.getItem('language'), options),
          ),
          totalGain: (monthSales.totalGain += sale.sellingPrice),
          profit: (monthSales.profit += sale.profit),
        };
      }
    });
    state.monthsGainsChartData.push(monthSales);
  });
};

export const initializeSalesData = createAsyncThunk(
  'sales/initializeSalesData',
  async (_, { dispatch }) => {
    dispatch(resetStatus());
    await dispatch(getAllSales()).unwrap();

    const currentMonthRange = setCurrentMonth();
    dispatch(getAllSalesDateRange(currentMonthRange));
  },
);

const initialState = {
  sales: [],
  allSales: [],
  status: 'idle',
  error: null,
  retryAttempt: 0,
  response: null,
  mostSoldProducts: [],
  totalGain: 0,
  profit: 0,
  gainsChartData: [{}],
  monthsGainsChartData: [],
};

export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
      state.response = null;
      state.retryAttempt = 0;
      state.sales = [];
      state.allSales = [];
    },
    orderSales(state, { payload }) {
      const { column, direction } = payload;
      state.sales = state.sales.sort((a, b) => {
        if (typeof a[column] === 'number' && typeof b[column] === 'number') {
          return direction === 'DESC'
            ? b[column] - a[column]
            : a[column] - b[column];
        }
        if (column === 'createdAt') {
          const dateA = new Date(a[column]);
          const dateB = new Date(b[column]);
          return direction === 'DESC' ? dateB - dateA : dateA - dateB;
        }
        const stringA = String(a[column]).toLowerCase();
        const stringB = String(b[column]).toLowerCase();
        if (direction === 'DESC') {
          return stringB.localeCompare(stringA);
        } else {
          return stringA.localeCompare(stringB);
        }
      });
    },
    dateRangeSales(state, { payload }) {
      handleDateRangeSales(state, payload);
    },
    getMonthsGainsChartData(state, { payload }) {
      state.monthsGainsChartData = [];
      monthsGainsChartDataResolver(state, payload);
    },
    getAllSalesDateRange(state, { payload }) {
      state.monthsGainsChartData = [];
      state.mostSoldProducts = getMostSoldProduct(state.sales);
      if (payload) {
        handleDateRangeSales(state, payload);
        monthsGainsChartDataResolver(state, payload);
      } else {
        handleDateRangeSales(state, setCurrentMonth());
        monthsGainsChartDataResolver(state, setCurrentMonth());
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSales.pending, (state) => {
        state.status = 'loading';
        state.retryAttempt = retryAttempt;
      })
      .addCase(getAllSales.fulfilled, (state, action) => {
        state.status = 'success';
        state.sales = action.payload;
        state.allSales = action.payload;
        // state.mostSoldProducts = getMostSoldProduct(state.sales);
        // handleDateRangeSales(state, setCurrentMonth());
        // monthsGainsChartDataResolver(state, setCurrentMonth());
      })
      .addCase(getAllSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createSale.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.status = 'created';
        state.response = action.payload;
      })
      .addCase(createSale.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.status = 'deleted';
        state.response = action.payload.response;
        state.sales = state.sales.filter(
          (sale) => sale.id != action.payload.id,
        );
        state.mostSoldProducts = getMostSoldProduct(state.sales);
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
      })
      .addCase(filterSale.fulfilled, (state, { payload }) => {
        state.status = 'success';
        state.sales = payload;
      });
  },
});

export const {
  resetStatus,
  orderSales,
  dateRangeSales,
  getMonthsGainsChartData,
  getAllSalesDateRange,
} = salesSlice.actions;
export default salesSlice.reducer;
