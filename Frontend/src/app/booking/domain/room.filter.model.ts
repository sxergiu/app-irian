

export interface RoomFilterModel {

  date?: string | undefined;
  minCapacity?: number | undefined;
  requiredAmenities?: string[];

}

export interface RoomFilterRangeModel {
  startDate: string;
  endDate: string;
  requiredAmenities?: string[];
  minCapacity?: number;
}
