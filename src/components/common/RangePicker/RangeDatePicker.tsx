import { useEffect, useState } from "react";
import { ConfigProvider, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "react-router-dom";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";
import { RangeDatePickerStyled } from "./RangeDatePicker.style";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";

type RangePickerValue = [Dayjs, Dayjs] | null;

const RangeDatePicker = ({ filterable = true }: { filterable?: boolean }) => {
  const [date, setDate] = useState<RangePickerValue>(null);
  const [_, setSearchParams] = useSearchParams();
  const allParams = useAllQueryParams();

  // allParams dan dateFrom va dateTo ni olish
  useEffect(() => {
    if (allParams.dateFrom && allParams.dateTo) {
      setDate([dayjs(allParams.dateFrom), dayjs(allParams.dateTo)]);
    } else {
      setDate(null);
    }
  }, [allParams.dateFrom, allParams.dateTo]);

  const onDateChange = (value: RangePickerValue) => {
    setDate(value);
    if (filterable) {
      if (!value) {
        delete allParams?.dateFrom;
        delete allParams?.dateTo;
        setSearchParams({ ...allParams });
      } else if (dayjs(value?.[0]).isValid() && dayjs(value?.[1]).isValid()) {
        setSearchParams({
          ...allParams,
          dateFrom: dayjs(value?.[0]).startOf("day").toISOString(),
          dateTo: dayjs(value?.[1]).endOf("day").toISOString(),
        });
      }
    }
  };

  return (
    <RangeDatePickerStyled>
      <ConfigProvider locale={locale}>
        <DatePicker.RangePicker
          value={date}
          onChange={(val) => onDateChange(val as RangePickerValue)}
          disabledDate={(current) => current && current > dayjs().endOf("day")}
          getPopupContainer={(trigger) =>
            trigger.parentNode instanceof HTMLElement ? trigger.parentNode : document.body
          }
        />
      </ConfigProvider>
    </RangeDatePickerStyled>
  );
};

export default RangeDatePicker;
