import { useRef } from "react";
import { useCalendarCell } from "react-aria";
import { isSameMonth } from "@internationalized/date";
import { Button, Box } from "@chakra-ui/react";

export function CalendarCell({ state, date, currentMonth }) {
  let ref = useRef();
  let {
    cellProps,
    buttonProps,
    isSelected,
    isInvalid,
    formattedDate
  } = useCalendarCell({ date }, state, ref);

  let isOutsideMonth = !isSameMonth(currentMonth, date);

  return (
    <Box as="td" {...cellProps} textAlign="center">
      <Button
        {...buttonProps}
        ref={ref}
        hidden={isOutsideMonth}
        size="sm"
        colorScheme={isInvalid ? "red" : "blue"}
        variant={isSelected ? "solid" : "ghost"}
        width="100%"
      >
        {formattedDate}
      </Button>
    </Box>
  );
}
