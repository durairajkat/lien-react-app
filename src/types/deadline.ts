export interface DeadLineRequestType {
    role_id: number;
    state_id: number;
    project_type_id: number;
    customer_id: number;
    furnishing_dates: Record<number, string>;
}

export interface CalculatedDeadline {
    title: string;
    date: string;
    daysRemaining: number;
    requirement?: string;
    is_late?: boolean;
    remedies: {
        title: string;
        description: string;
    }[];
}

export interface CalculatedDeadlineResponse {
    deadlines: CalculatedDeadline[]
}