export interface Checkout {
    id?: number;
    firstName: string;
    secondName: string;
    address: string;
    city: string;
    country: string;
    postcode: number;
    mobile: number;
    email: string;
    notes?: string;
    payment: string;
    status? : string;
  }
  