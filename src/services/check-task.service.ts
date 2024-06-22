import { ISheetItem } from '../types/sheet';
import _ from 'lodash';
import {
  firestoreTimestampToDate,
  getWeekOfMonth,
} from '../utils/dateFunctions';

export interface ICheckTaskService {
  checkTask(sheetId: string): Promise<boolean>;
}

interface ICheckTaskSvcProps {
  itemsProvider(sheetId: string): Promise<ISheetItem[]>;
}

export default function getCheckTaskSvc(
  props: ICheckTaskSvcProps,
): ICheckTaskService {
  async function checkTask(sheetId: string): Promise<boolean> {
    const items = await props.itemsProvider(sheetId);

    if (items.length == 0) {
      return false;
    }

    const itemDates = items.map((item) => ({
      date: firestoreTimestampToDate(item.date!),
    }));

    const datesGroupedByWeekDict = _.groupBy(itemDates, (c) => {
      const month = c.date.getMonth() + 1;
      const week = getWeekOfMonth(c.date);
      return `w-${week}-m-${month}`;
    });

    const datesByWeek = Object.entries(datesGroupedByWeekDict).map((c) => {
      return {
        week: c[0][2],
        month: c[0][6],
        dates: c[1],
      };
    });

    if (datesByWeek.length < 3) {
      return false;
    }

    return true;
  }

  return {
    checkTask,
  };
}
