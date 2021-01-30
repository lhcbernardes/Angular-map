export class PlaceModel {
  place: any
  comment?: Comment[]
  
  constructor(values = {}) {
    Object.keys(this).forEach(key => {
      if (values && values.hasOwnProperty(key))
        this[key] = values[key];
    });
  }
  }
  
  export interface Comment {
    rating: string
    commentary: string
  }
  