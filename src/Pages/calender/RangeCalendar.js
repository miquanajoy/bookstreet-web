import { useRef } from "react";
import { useRangeCalendarState } from "react-stately";
import { useRangeCalendar, useLocale } from "react-aria";
import { createCalendar } from "@internationalized/date";
import { CalendarButton } from "./Button";
import { CalendarGrid } from "./CalendarGrid";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Heading } from "@chakra-ui/react";

export function RangeCalendar(props) {
  let { locale } = useLocale();
  let state = useRangeCalendarState({
    ...props,
    visibleDuration: { months: 2 },
    locale,
    createCalendar
  });

  let ref = useRef();
  let {
    calendarProps,
    prevButtonProps,
    nextButtonProps,
    title
  } = useRangeCalendar(props, state, ref);

  return (
    <div {...calendarProps} ref={ref}>
      <Box display="flex" alignItems="center" paddingBottom="4">
        <CalendarButton {...prevButtonProps}>
          <ChevronLeftIcon w={6} h={6} />
        </CalendarButton>
        <Heading as="h2" size="md" flex="1" textAlign="center">
          {title}
        </Heading>
        <CalendarButton {...nextButtonProps}>
          <ChevronRightIcon w={6} h={6} />
        </CalendarButton>
      </Box>
      <Box display="flex" gap="8">
        <CalendarGrid state={state} />
        <CalendarGrid state={state} offset={{ months: 1 }} />
      </Box>
    </div>
  );
}
