
export interface CreateBookingModel {
  roomId?: number,
  namedGroupId?: number | undefined,
  date?: string,
  time: {
    startTime?: string | undefined,
    endTime?: string | undefined
  }
}
