import { useRef } from "react";
import { useCalendarState } from "react-stately";
import { useCalendar, useLocale } from "react-aria";
import { createCalendar } from "@internationalized/date";
import { CalendarButton } from "./Button";
import { CalendarGrid } from "./CalendarGrid";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Heading } from "@chakra-ui/react";

export function Calendar(props) {
  let { locale } = useLocale();
  let state = useCalendarState({
    ...props,
    locale,
    createCalendar
  });

  let ref = useRef();
  let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    props,
    state,
    ref
  );

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
      <CalendarGrid state={state} />
    </div>
  );
}
