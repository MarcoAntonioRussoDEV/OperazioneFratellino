import { getUserPreoders, resetStatus } from '@/redux/preorderSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion } from '@/components/ui/accordion';
import PreorderAccordion from './PreorderAccordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { use } from 'react';
import { useResetStatus } from '@/hooks/useAppHooks';

const MyPreorders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { myPreorders } = useSelector((state) => state.preorders);
  const tc = useTranslateAndCapitalize();

  useEffect(() => {
    if (user.email) {
      dispatch(getUserPreoders(user.email));
    }
  }, [user]);

  useResetStatus(resetStatus);
  return (
    <Accordion className="h-screen lg:px-10" type="single" collapsible>
      <ul className="border-b-2 sticky top-0 start-0 bg-muted-darker z-10 flex justify-between text-left p-2 rounded-t-lg">
        <li className="border-0 w-full">{tc('orderNumber')}</li>
        <li className="border-0 w-full">{tc('totalPrice')}</li>
        <li className="border-0 w-full">{tc('createdAt')}</li>
        <li className="border-0 w-full">{tc('status')}</li>
        <li>
          <ChevronDown className="opacity-0 h-4 w-4" />
        </li>
      </ul>
      {myPreorders.map((preorder) => {
        return (
          <PreorderAccordion key={preorder.id} {...preorder} className="px-2" />
        );
      })}
    </Accordion>
  );
};

export default MyPreorders;
