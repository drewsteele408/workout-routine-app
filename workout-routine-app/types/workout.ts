export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight?: string;
    rest?: number;
    notes?: string;
}

export interface WorkoutRoutine {
    id: string;
    name: string;
    description?: string;
    exercises: Exercise[];
    created: Date;
    lastModified: Date;
}
