/* tslint:disable */

/**
 */
export class UserModel {
page: number
per_page: number
total: number
total_pages: number
data: Data[]

constructor(values = {}) {
  Object.keys(this).forEach(key => {
    if (values && values.hasOwnProperty(key))
      this[key] = values[key];
  });
}
}

export interface Data {
  avatar: string
  email: string
  first_name: string
  id: number
  last_name: string
}
