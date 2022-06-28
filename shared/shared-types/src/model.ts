export type ID = number;

export interface Identifiable {
  id: ID;
}

export interface EntityTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
