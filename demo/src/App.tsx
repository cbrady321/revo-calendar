import React from 'react';
import RevoCalendar from 'revo-calendar';
import './App.css';

function App() {
  const events = [
    {
      name: "Holiday Party 🎉",
      date: +new Date(2024, 11, 20, 18, 30),
      extra: {
        icon: "M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z",
        text: "Office Event"
      }
    },
    {
      name: "Christmas Day 🎄",
      date: +new Date(2024, 11, 25),
      allDay: true
    },
    {
      name: "End of Year Review",
      date: +new Date(2024, 11, 23, 10, 0)
    }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Revo Calendar Demo</h1>
      </header>
      <main>
        <div className="calendar-container">
          <RevoCalendar
            events={events}
            date={new Date(2024, 11, 1)}
            style={{ height: '500px' }}
            primaryColor="#1a73e8"
            secondaryColor="#ffffff"
            todayColor="#1a73e8"
            textColor="#333333"
            indicatorColor="#ff5722"
            animationSpeed={300}
            sidebarWidth={200}
            detailWidth={280}
            showDetailToggler={true}
            detailDefault={true}
            showSidebarToggler={true}
            sidebarDefault={true}
            timeFormat24={false}
            showAllDayLabel={true}
            detailDateFormat="dddd, MMMM nth, YYYY"
          />
        </div>
      </main>
    </div>
  );
}

export default App;
