// src_filter/types.ts

/**
 * Interface for a single timeline event.
 * This must match the structure of your events.json
 */
export interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    imageURL: string;
    category: string;
}
