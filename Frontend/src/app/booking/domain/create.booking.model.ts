
export interface CreateBookingModel {
  id: number,
  roomId?: number,
  namedGroupId?: number | undefined,
  date?: string,
  time: {
    startTime?: string | undefined,
    endTime?: string | undefined
  }
}
