import Gains from './Gains';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getAllSalesDateRange,
  resetStatus,
  initializeSalesData,
} from '@/redux/salesSlice';
import MostSoldProducts from './MostSoldProduct';
import DatePicker from './DatePicker';
import { setCurrentMonth } from '@/utils/formatUtils';

const totalGainColor = 'hsl(var(--chart-1))';
const profitColor = 'hsl(var(--chart-3))';

const chartConfig = {
  totalGain: {
    label: 'Incassi',
    color: totalGainColor,
  },
  profit: {
    label: 'Utile',
    color: profitColor,
  },
};

const Home = () => {
  const {
    sales,
    status: salesStatus,
    mostSoldProducts,
    gainsChartData,
    monthsGainsChartData,
  } = useSelector((state) => state.sales);
  const [totalGain, setTotalGain] = useState(0);
  const [profit, setProfit] = useState(0);
  const dispatch = useDispatch();
  const [date, setDate] = useState(setCurrentMonth());

  useEffect(() => {
    dispatch(initializeSalesData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllSalesDateRange(date));
  }, [date]);

  const handleSetDate = (payload) => {
    if (payload) {
      setDate(payload);
    } else {
      setDate({ from: null, to: null });
    }
  };

  useEffect(() => {
    return () => dispatch(resetStatus());
  }, []);

  return (
    <>
      <DatePicker
        date={date}
        setDate={handleSetDate}
        className="mx-auto mt-10"
      />
      <div className="flex flex-col xl:flex-row justify-center xl:justify-between items-center w-full gap-10 p-10 mx-auto">
        <Gains chartData={monthsGainsChartData} date={date} />
        <MostSoldProducts chartData={mostSoldProducts} date={date} />
      </div>
      {/* <div className="px-10">
        <Gains chartData={monthsGainsChartData} />
      </div> */}
    </>
  );
};

export default Home;
