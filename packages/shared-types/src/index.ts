/**
 * Shared Types for Trends Platform
 * Core types used across the application
 */

export interface TrendNiche {
  id: string;
  name: string;
  description?: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TrendData {
  id: string;
  nicho_id: string;
  title: string;
  description?: string;
  volume: number;
  growth_percentage: number;
  sentiment?: "positive" | "neutral" | "negative";
  detected_at: Date;
  sources: string[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
