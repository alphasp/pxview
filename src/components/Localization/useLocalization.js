import { useContext } from 'react';
import { LocalizationContext } from './LocalizationProvider';

const useLocalization = () => useContext(LocalizationContext);

export default useLocalization;
