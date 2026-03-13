import { Dispatch, SetStateAction } from 'react';
import { ShowToast } from '../config/constants';
import { BASE_URL } from './api';

export const fetchNGN = async (fn: Dispatch<SetStateAction<number>>) => {
  try {
    const res = await fetch(
      BASE_URL + '/exchange/exchange-rate'
    );
    const data = await res.json();
    console.log("Data: ",data);
    fn(data?.data?.exchangeRate);
  } catch (error) {
    console.log(error);
    ShowToast('error', 'Failed to fetch NGN');
  }
};
