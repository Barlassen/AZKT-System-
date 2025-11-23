import { Injectable } from '@nestjs/common';

@Injectable()
export class ItinaryService {
  private readonly itinaries = [
    { id: 'lausanne-geneva', from: 'Lausanne', to: 'Geneva', duration: 55, price: 15.00 },
    { id: 'zurich-bern',     from: 'Zurich',   to: 'Bern',   duration: 60, price: 18.00 },
    { id: 'basel-zurich',    from: 'Basel',    to: 'Zurich', duration: 55, price: 16.00 },
    { id: 'geneva-lausanne', from: 'Geneva',   to: 'Lausanne', duration: 55, price: 15.00 },
    { id: 'basel-bern',      from: 'Basel',    to: 'Bern',   duration: 75, price: 22.00 },
    { id: 'zurich-lausanne', from: 'Zurich',   to: 'Lausanne', duration: 135, price: 32.00 },
    { id: 'bern-geneva',     from: 'Bern',     to: 'Geneva', duration: 95, price: 25.00 },
    { id: 'lausanne-zurich', from: 'Lausanne', to: 'Zurich', duration: 135, price: 32.00 },
    { id: 'bern-basel',      from: 'Bern',     to: 'Basel',  duration: 75, price: 22.00 },
    { id: 'zurich-basel',    from: 'Zurich',   to: 'Basel',  duration: 55, price: 16.00 },
    { id: 'geneva-zurich',   from: 'Geneva',   to: 'Zurich', duration: 175, price: 38.00 },
    { id: 'bern-lausanne',   from: 'Bern',     to: 'Lausanne', duration: 95, price: 25.00 }
  ];

  getItinaries() {
    return { itinaries: this.itinaries };
  }
}

