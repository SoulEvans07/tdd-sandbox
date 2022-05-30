export interface Identifiable {
  id: number;
}

export interface EntityTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
