import { FunctionField } from "react-admin";

interface KoreanDateFieldProps {
  source: string;
  label?: string;
  showTime?: boolean;
}

export const KoreanDateField = ({
  source,
  label,
  showTime = false,
}: KoreanDateFieldProps) => {
  const formatKoreanTime = (dateString: string) => {
    try {
      const match = dateString.match(
        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
      );
      if (!match) return dateString;

      const [, year, month, day, hour, minute, second] = match;

      // 시간에 9시간 더하기
      let newHour = parseInt(hour) + 9;
      let newDay = parseInt(day);
      let newMonth = parseInt(month);
      let newYear = parseInt(year);

      // 24시간 넘으면 다음날로
      if (newHour >= 24) {
        newHour -= 24;
        newDay += 1;

        // 월말 처리 (간단히 31일로 가정)
        if (newDay > 31) {
          newDay = 1;
          newMonth += 1;

          // 연말 처리
          if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
          }
        }
      }

      const koreanTime = {
        year: newYear,
        month: String(newMonth).padStart(2, "0"),
        day: String(newDay).padStart(2, "0"),
        hour: String(newHour).padStart(2, "0"),
        minute: minute,
        second: second,
      };

      return showTime
        ? `${koreanTime.year}.${koreanTime.month}.${koreanTime.day} ${koreanTime.hour}:${koreanTime.minute}:${koreanTime.second}`
        : `${koreanTime.year}.${koreanTime.month}.${koreanTime.day}`;
    } catch {
      return dateString;
    }
  };

  return (
    <FunctionField
      label={label}
      render={(record: any) => {
        const dateValue = record[source];

        if (!dateValue) return "-";

        return formatKoreanTime(dateValue);
      }}
    />
  );
};
