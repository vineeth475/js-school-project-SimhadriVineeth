// src_filter/filter.ts

import { TimelineEvent } from './types';

/**
 * Injects the necessary CSS for the filter buttons into the document's head.
 */
function injectStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
        .filter-container {
            text-align: center;
            margin: 10px 0 20px 0;
        }
        .filter-btn {
            padding: 8px 16px;
            font-size: 0.9rem;
            font-family: 'Georgia', serif;
            cursor: pointer;
            border: 1px solid #6b4f36;
            background-color: #f4e4bc;
            color: #6b4f36;
            margin: 0 5px;
            border-radius: 5px;
            transition: background-color 0.3s, color 0.3s;
        }
        .filter-btn:hover, .filter-btn.active {
            background-color: #6b4f36;
            color: #f4e4bc;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Creates and injects the filter buttons onto the page.
 * @param categories - A list of unique event categories.
 * @param onFilter - The callback function to execute when a filter button is clicked.
 */
function createFilterUI(categories: string[], onFilter: (category: string) => void): void {
    const container = document.createElement('div');
    container.className = 'filter-container';

    // Create an "All" button
    const allButton = createButton('All', onFilter);
    allButton.classList.add('active'); // Active by default
    container.appendChild(allButton);

    // Create buttons for each unique category
    categories.forEach(category => {
        const button = createButton(category, onFilter);
        container.appendChild(button);
    });
    
    // Insert the filter container after the main title
    const mainTitle = document.querySelector('h2');
    mainTitle?.parentNode?.insertBefore(container, mainTitle.nextSibling);
}

/**
 * Helper function to create a single filter button.
 * @param category - The category name for the button.
 * @param onFilter - The click handler function.
 * @returns The created HTMLButtonElement.
 */
function createButton(category: string, onFilter: (category: string) => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'filter-btn';
    button.textContent = category;
    button.dataset.category = category;
    button.addEventListener('click', () => {
        // Handle the active state for buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        onFilter(category);
    });
    return button;
}

/**
 * The main function to initialize the filter feature.
 */
export async function initializeFilter(): Promise<void> {
    try {
        const response = await fetch('events.json');
        if (!response.ok) throw new Error('Failed to fetch events.json');
        
        const events: TimelineEvent[] = await response.json();
        const categories = [...new Set(events.map(event => event.category))];

        // Wait for the original script to create the timeline markers
        // We use a small delay and check for the markers to exist
        setTimeout(() => {
            const markers = document.querySelectorAll('.event-marker') as NodeListOf<HTMLElement>;
            if (markers.length === 0) {
                console.warn("Timeline markers not found. The filter may not work correctly.");
                return;
            }

            injectStyles();
            createFilterUI(categories, (selectedCategory) => {
                // This is the filtering logic
                markers.forEach((marker, index) => {
                    const eventCategory = events[index].category;
                    if (selectedCategory === 'All' || eventCategory === selectedCategory) {
                        marker.style.display = 'block';
                    } else {
                        marker.style.display = 'none';
                    }
                });
            });
        }, 500); // A 500ms delay should be enough for the original script to run

    } catch (error) {
        console.error("Error initializing filter feature:", error);
    }
}
