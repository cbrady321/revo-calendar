import React, { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import helperFunctions from "./helpers/functions";
import translations from "./helpers/translations";
import type { Props } from "./typings";
import { ThemeProvider } from "styled-components";
import {
  Calendar,
  CloseDetail,
  CloseSidebar,
  Day,
  DayButton,
  Details,
  Event,
  Inner,
  MonthButton,
  Sidebar,
} from "./styles";
import { CHEVRON_ICON_SVG, CLOCK_ICON_SVG, DETAILS_ICON_SVG, SIDEBAR_ICON_SVG } from "./helpers/consts";

// -1 = ANIMATE CLOSING | 0 = NOTHING | 1 = ANIMATE OPENING
let animatingSidebar = 0;
let animatingDetail = 0;

const RevoCalendarInner: FC<Props> = ({
  style = {},
  className = "",
  events = [],
  highlightToday: enableHighlightToday = true,
  lang = "en",
  primaryColor = "#4F6995",
  secondaryColor = "#c4dce9",
  todayColor = "#3B3966",
  textColor = "#333333",
  indicatorColor = "orange",
  animationSpeed = 300,
  sidebarWidth = 180,
  detailWidth = 280,
  showDetailToggler = true,
  detailDefault = true,
  showSidebarToggler = true,
  sidebarDefault = true,
  onePanelAtATime = false,
  allowDeleteEvent = false,
  allowAddEvent = false,
  openDetailsOnDateSelection = true,
  timeFormat24 = true,
  showAllDayLabel = false,
  detailDateFormat = "DD/MM/YYYY",
  languages = translations,
  date = new Date(),
  dateSelected = () => {},
  eventSelected = () => {},
  addEvent = () => {},
  deleteEvent = () => {},
}) => {
  const primaryColorRGB = helperFunctions.getRGBColor(primaryColor);
  const secondaryColorRGB = helperFunctions.getRGBColor(secondaryColor);
  const todayColorRGB = helperFunctions.getRGBColor(todayColor);
  const indicatorColorRGB = helperFunctions.getRGBColor(indicatorColor);
  const textColorRGB = helperFunctions.getRGBColor(textColor);

  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendarWidth, setCalendarWidth] = useState<number>(0);

  useEffect(() => {
    const updateSize = () => {
      if (calendarRef.current) {
        setCalendarWidth(calendarRef.current.offsetWidth);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateSize);
      updateSize();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);

  let adjustedOnePanelAtATime = onePanelAtATime;
  if (calendarWidth <= 320 + sidebarWidth + detailWidth) {
    adjustedOnePanelAtATime = true;
    if (sidebarDefault && detailDefault) {
      detailDefault = false;
    }
  }

  const floatingPanels = calendarWidth <= 320 + sidebarWidth || calendarWidth <= 320 + detailWidth;
  const adjustedSidebarWidth = calendarWidth < sidebarWidth + 50 ? calendarWidth - 50 : sidebarWidth;
  const adjustedDetailWidth = calendarWidth < detailWidth + 50 ? calendarWidth - 50 : detailWidth;

  if (!helperFunctions.isValidDate(date)) {
    console.warn("The passed date prop is invalid, using current date");
    date = new Date();
  }

  const [currentDay, setDay] = useState(date.getDate());
  const [currentMonth, setMonth] = useState(date.getMonth());
  const [currentYear, setYear] = useState(date.getFullYear());
  const [sidebarOpen, setSidebarState] = useState(sidebarDefault);
  const [detailsOpen, setDetailsState] = useState(detailDefault);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  useEffect(() => {
    dateSelected({
      day: currentDay,
      month: currentMonth,
      year: currentYear,
    });
  }, [currentDay, currentMonth, currentYear, dateSelected]);

  useEffect(() => {
    if (sidebarOpen && detailsOpen && adjustedOnePanelAtATime) {
      animatingDetail = -1;
      setDetailsState(false);
    }
  }, [calendarWidth, sidebarOpen, detailsOpen, adjustedOnePanelAtATime]);

  const toggleSidebar = () => {
    if (animatingSidebar !== 0) return;
    if (!sidebarOpen && detailsOpen && adjustedOnePanelAtATime) {
      animatingDetail = -1;
      setDetailsState(false);
    }
    animatingSidebar = sidebarOpen ? -1 : 1;
    setSidebarState(!sidebarOpen);
    setTimeout(() => {
      animatingSidebar = 0;
    }, animationSpeed);
  };

  const toggleDetail = () => {
    if (animatingDetail !== 0) return;
    if (!detailsOpen && sidebarOpen && adjustedOnePanelAtATime) {
      animatingSidebar = -1;
      setSidebarState(false);
    }
    animatingDetail = detailsOpen ? -1 : 1;
    setDetailsState(!detailsOpen);
    setTimeout(() => {
      animatingDetail = 0;
    }, animationSpeed);
  };

  const handleDayClick = (day: number) => {
    setDay(day);
    if (openDetailsOnDateSelection && !detailsOpen) {
      toggleDetail();
    }
  };

  const handleMonthClick = (month: number) => {
    setMonth(month);
  };

  const handleYearClick = (delta: number) => {
    setYear(currentYear + delta);
  };

  const handleEventClick = (index: number) => {
    setSelectedEvent(index);
    eventSelected(index);
  };

  const handleAddEventClick = () => {
    addEvent(new Date(currentYear, currentMonth, currentDay));
  };

  const handleDeleteEventClick = () => {
    if (selectedEvent !== null) {
      deleteEvent(selectedEvent);
      setSelectedEvent(null);
    }
  };

  const renderSidebar = () => {
    return (
      <Sidebar
        sidebarOpen={sidebarOpen}
        animatingIn={animatingSidebar === 1}
        animatingOut={animatingSidebar === -1}
      >
        <div>
          <button onClick={() => handleYearClick(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 8 8">
              <path fill="currentColor" d={CHEVRON_ICON_SVG} transform="rotate(-90 4 4)" />
            </svg>
          </button>
          <span>{currentYear}</span>
          <button onClick={() => handleYearClick(1)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 8 8">
              <path fill="currentColor" d={CHEVRON_ICON_SVG} transform="rotate(90 4 4)" />
            </svg>
          </button>
        </div>
        <ul>
          {languages[lang].months.map((month: string, index: number) => (
            <li key={month}>
              <MonthButton current={currentMonth === index} onClick={() => handleMonthClick(index)}>
                {month}
              </MonthButton>
            </li>
          ))}
        </ul>
      </Sidebar>
    );
  };

  const renderInner = () => {
    const firstWeekDay = helperFunctions.getFirstWeekDayOfMonth(currentMonth, currentYear);
    const daysInMonth = helperFunctions.isLeapYear(currentYear)[currentMonth];

    return (
      <Inner>
        <div>
          <div>
            {languages[lang].daysMin.map((day: string) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const hasEvent = events.some((event) => {
                const eventDate = new Date(event.date);
                return (
                  eventDate.getDate() === day &&
                  eventDate.getMonth() === currentMonth &&
                  eventDate.getFullYear() === currentYear
                );
              });

              return (
                <Day key={day} firstDay={day === 1} firstOfMonth={firstWeekDay + 1}>
                  <DayButton
                    current={currentDay === day}
                    enableHighlight={enableHighlightToday}
                    today={helperFunctions.isToday(day, currentMonth, currentYear)}
                    hasEvent={hasEvent}
                    onClick={() => handleDayClick(day)}
                  >
                    <span>{day}</span>
                  </DayButton>
                </Day>
              );
            })}
          </div>
        </div>
      </Inner>
    );
  };

  const renderDetails = () => {
    const currentDate = new Date(currentYear, currentMonth, currentDay);
    const todayEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === currentDay &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });

    return (
      <Details
        detailsOpen={detailsOpen}
        animatingIn={animatingDetail === 1}
        animatingOut={animatingDetail === -1}
        floatingPanels={floatingPanels}
      >
        <div>
          <span>
            {helperFunctions.getFormattedDate(currentDate, detailDateFormat, lang, languages)}
          </span>
          {allowAddEvent && (
            <button onClick={handleAddEventClick}>{languages[lang].addEvent}</button>
          )}
        </div>
        <div>
          {todayEvents.length === 0 ? (
            <p>{languages[lang].noEventForThisDay}</p>
          ) : (
            todayEvents.map((event, index) => (
              <Event key={index} onClick={() => handleEventClick(index)}>
                <p>{event.name}</p>
                <div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" viewBox="0 0 24 24">
                      <path fill="currentColor" d={CLOCK_ICON_SVG} />
                    </svg>
                    <span>
                      {event.allDay && showAllDayLabel
                        ? languages[lang].allDay
                        : helperFunctions.getFormattedTime(new Date(event.date), timeFormat24)}
                    </span>
                  </div>
                  {event.extra && (
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" viewBox="0 0 24 24">
                        <path fill="currentColor" d={event.extra.icon} />
                      </svg>
                      <span>{event.extra.text}</span>
                    </div>
                  )}
                </div>
                {allowDeleteEvent && selectedEvent === index && (
                  <button onClick={handleDeleteEventClick}>{languages[lang].delete}</button>
                )}
              </Event>
            ))
          )}
        </div>
      </Details>
    );
  };

  return (
    <ThemeProvider
      theme={{
        primaryColor: primaryColorRGB,
        primaryColor50: helperFunctions.getRGBAColorWithAlpha(primaryColorRGB, 0.5),
        secondaryColor: secondaryColorRGB,
        todayColor: todayColorRGB,
        textColor: textColorRGB,
        indicatorColor: indicatorColorRGB,
        animationSpeed: `${animationSpeed}ms`,
        sidebarWidth: `${adjustedSidebarWidth}px`,
        detailWidth: `${adjustedDetailWidth}px`,
      }}
    >
      <Calendar className={className} ref={calendarRef} style={style}>
        {renderSidebar()}
        {showSidebarToggler && (
          <CloseSidebar
            onClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
            animatingIn={animatingSidebar === 1}
            animatingOut={animatingSidebar === -1}
            title={languages[lang].toggleSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" viewBox="0 0 24 24">
              <path fill="currentColor" d={SIDEBAR_ICON_SVG} />
            </svg>
          </CloseSidebar>
        )}
        {renderInner()}
        {renderDetails()}
        {showDetailToggler && (
          <CloseDetail
            onClick={toggleDetail}
            detailsOpen={detailsOpen}
            animatingIn={animatingDetail === 1}
            animatingOut={animatingDetail === -1}
            title={languages[lang].toggleDetails}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" viewBox="0 0 24 24">
              <path fill="currentColor" d={DETAILS_ICON_SVG} />
            </svg>
          </CloseDetail>
        )}
      </Calendar>
    </ThemeProvider>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
const RevoCalendar = React.memo(RevoCalendarInner);

// Re-export Events type
export type { Events } from "./typings";
export default RevoCalendar;
