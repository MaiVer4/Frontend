export interface ApiErrorDto {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
