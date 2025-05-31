
export interface CreateBookingModel {
  roomId?: number,
  namedGroupId?: number | undefined,
  date?: string,
  startTime?: string | undefined,
  endTime?: string | undefined
}
