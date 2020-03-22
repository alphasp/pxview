import moment from 'moment';
import { SEARCH_PERIOD_TYPES } from '../constants';

const mapSearchPeriodToStartAndEndDates = (period) => {
  const startDate = moment().subtract(1, 'day');
  const endDate = startDate.clone();
  switch (period) {
    case SEARCH_PERIOD_TYPES.LAST_WEEK:
      startDate.subtract(1, 'week');
      break;
    case SEARCH_PERIOD_TYPES.LAST_MONTH:
      startDate.subtract(1, 'month');
      break;
    case SEARCH_PERIOD_TYPES.LAST_HALF_YEAR:
      startDate.subtract(6, 'month');
      break;
    case SEARCH_PERIOD_TYPES.LAST_YEAR:
      startDate.subtract(1, 'year');
      break;
    case SEARCH_PERIOD_TYPES.LAST_DAY:
    default:
      break;
  }
  return {
    start_date: startDate.format('YYYY-MM-DD'),
    end_date: endDate.format('YYYY-MM-DD'),
  };
};

export default mapSearchPeriodToStartAndEndDates;
