// App.tsx
import React from 'react';

// --- TYPE DEFINITION ---
// Defines the structure for a single timeline event object.
interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  imageURL: string;
  category: string;
}

// --- MOCK DATA ---
// In a real app, this would be fetched from an API. For this example,
// we'll use the data directly. This is the content from your events.json.
const eventsData: TimelineEvent[] = [
  {
    "year": "1939",
    "title": "German Invasion of Poland",
    "description": "Germany invades Poland on September 1, 1939, marking the start of World War II. Britain and France declare war on Germany shortly after.",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Battle_of_Poland.jpg",
    "category": "Military"
  },
  {
    "year": "1940",
    "title": "Fall of France & Battle of Britain",
    "description": "France falls to German forces in June 1940. The Battle of Britain follows, with the Royal Air Force successfully defending the UK.",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Battle_of_Britain.jpg",
    "category": "Military"
  },
  {
    "year": "1941",
    "title": "Pearl Harbor & USA Enters the War",
    "description": "Japan attacks Pearl Harbor on December 7, 1941, leading the USA to declare war on Japan and later Germany.",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Pearl_Harbor_wreckage.jpg",
    "category": "Military"
  },
  {
    "year": "1942",
    "title": "Battle of Midway & Stalingrad",
    "description": "The Allies win at Midway in the Pacific and begin a long battle at Stalingrad, marking turning points in the war.",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Stalingrad_aftermath.jpg",
    "category": "Military"
  },
  {
    "year": "1943",
    "title": "Italy Surrenders",
    "description": "In September 1943, Italy surrenders to the Allies; German forces take control of northern Italy.",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/8/80/Italian_surrender.jpg",
    "category": "Political"
  },
  {
    "year": "1944",
    "title": "D-Day Landings",
    "description": "On June 6, 1944, Allied forces land in Normandy, France, beginning the liberation of Western Europe.",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/b/b5/D-day_landing.jpg",
    "category": "Military"
  },
  {
    "year": "1945",
    "title": "War Ends",
    "description": "Germany surrenders in May 1945; Japan surrenders in August after atomic bombings of Hiroshima and Nagasaki.",
    "imageURL": "https://upload.wikimedia.org/wikipedia/commons/f/f6/V-J_Day_Times_Square.jpg",
    "category": "Global Event"
  }
];


// --- HEADER COMPONENT ---
const Header: React.FC = () => {
  // A simple theme switcher state. In a real app, this would likely
  // use Context API to provide the theme throughout the app.
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // This is a simple way to toggle a class on the body.
    // A more robust solution might use CSS variables.
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
  };

  return (
    <header className="app-header">
      <h2 className="main-title">World War II Timeline (1939-1945)</h2>
      <button onClick={toggleTheme} className="theme-switch">
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </header>
  );
};

// --- EVENT MARKER COMPONENT ---
interface EventMarkerProps {
  event: TimelineEvent;
  onMarkerClick: (event: TimelineEvent) => void;
}

const EventMarker: React.FC<EventMarkerProps> = ({ event, onMarkerClick }) => {
  return (
    <>
      <div className="event-marker-wrapper" onClick={() => onMarkerClick(event)}>
        <div className="event-marker">
          <div className="event-year">{event.year}</div>
          <div className="event-title-small">{event.title}</div>
        </div>
      </div>
      <div className="timeline-arrow">→</div>
    </>
  );
};

// --- TIMELINE COMPONENT ---
interface TimelineProps {
  events: TimelineEvent[];
  onEventSelect: (event: TimelineEvent) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, onEventSelect }) => {
  return (
    <div className="timeline-container">
      <div className="timeline">
        {events.map((event) => (
          <EventMarker key={event.year} event={event} onMarkerClick={onEventSelect} />
        ))}
      </div>
    </div>
  );
};

// --- EVENT MODAL COMPONENT ---
interface EventModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  if (!event) {
    return null; // Don't render anything if no event is selected
  }

  return (
    // The modal backdrop, clicking this will close the modal
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={onClose}>&times;</span>
        <h3 id="modal-title">{event.title}</h3>
        <img id="modal-img" src={event.imageURL} alt={event.title} onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // prevent infinite loop
            target.src = `https://placehold.co/500x300/e0cfa7/3b2f2f?text=Image+Not+Found`;
        }} />
        <p id="modal-desc">{event.description}</p>
      </div>
    </div>
  );
};

// --- FILTER PANEL COMPONENT ---
interface FilterPanelProps {
    categories: string[];
    activeFilter: string;
    onFilterChange: (category: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ categories, activeFilter, onFilterChange }) => {
    return (
        <div className="filter-container">
            <button
                className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
                onClick={() => onFilterChange('All')}
            >
                All
            </button>
            {categories.map(category => (
                <button
                    key={category}
                    className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                    onClick={() => onFilterChange(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  // State to hold all events fetched from the data source
  const [events, setEvents] = React.useState<TimelineEvent[]>([]);
  // State for the currently selected event to show in the modal
  const [selectedEvent, setSelectedEvent] = React.useState<TimelineEvent | null>(null);
  // State for the active category filter
  const [activeFilter, setActiveFilter] = React.useState<string>('All');


  // useEffect to load data when the component mounts
  React.useEffect(() => {
    // In a real app, you might fetch this from an API
    // For now, we use the mock data directly
    setEvents(eventsData);
  }, []); // Empty dependency array means this runs once on mount

  // Derive the list of unique categories from the events data
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(events.map(event => event.category));
    return Array.from(uniqueCategories);
  }, [events]);

  // Filter events based on the active filter
  const filteredEvents = React.useMemo(() => {
    if (activeFilter === 'All') {
      return events;
    }
    return events.filter(event => event.category === activeFilter);
  }, [events, activeFilter]);


  // Handler to set the selected event, which triggers the modal to open
  const handleEventSelect = (event: TimelineEvent) => {
    setSelectedEvent(event);
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container">
      <Header />
      <FilterPanel categories={categories} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <Timeline events={filteredEvents} onEventSelect={handleEventSelect} />
      <EventModal event={selectedEvent} onClose={handleCloseModal} />
    </div>
  );
};

export default App;
