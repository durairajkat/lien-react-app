export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  overall_total?: number;
}
