class RouteResponseDTO {
  constructor(route) {
    this.trip_id = route.trip_id;
    this.from = route.from;
    this.to = route.to;
    this.createdAt = route.createdAt;
  }

  static format(route) {
    return new RouteResponseDTO(route);
  }
}

module.exports = RouteResponseDTO;
