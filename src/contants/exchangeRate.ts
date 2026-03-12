import { Dispatch, SetStateAction } from 'react';
import { ShowToast } from '../config/constants';

export const fetchNGN = async (fn: Dispatch<SetStateAction<number>>) => {
  try {
    const res = await fetch(
      'https://hexarate.paikama.co/api/rates/USD/NGN/latest',
    );
    const data = await res.json();
    console.log(data?.data?.mid);
    fn(data?.data?.mid);
  } catch (error) {
    console.log(error);
    ShowToast('error', 'Failed to fetch NGN');
  }
};
