export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type CollectionId = "paystack" | "github" | "openweathermap" | "coingecko" | "custom";

export interface EndpointParam {
  name: string;
  defaultValue: string;
  description?: string;
}

export interface Endpoint {
  id: string;
  name: string;
  category: string;
  method: HttpMethod;
  path: string;
  description?: string;
  params?: EndpointParam[];
  defaultBody?: Record<string, unknown>;
  requiresAuth?: boolean;
}

export interface Collection {
  id: CollectionId;
  name: string;
  baseUrl: string;
  authType: "bearer" | "query" | "none";
  authLabel?: string;
  authParamName?: string;
  endpoints: Endpoint[];
}

export interface ResolvedRequest {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
}

export interface ApiResponse {
  data: unknown;
  status: number;
  responseTime: number;
  size: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface HeaderPair {
  key: string;
  value: string;
  enabled: boolean;
}
