class RouteRequestDTO {
  constructor(data) {
    this.from = data.from;
    this.to = data.to;
  }

  validate() {
    const errors = [];

    if (!this.from || typeof this.from !== 'string' || this.from.trim() === '') {
      errors.push('From location is required and must be a non-empty string');
    }

    if (!this.to || typeof this.to !== 'string' || this.to.trim() === '') {
      errors.push('To location is required and must be a non-empty string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = RouteRequestDTO;
