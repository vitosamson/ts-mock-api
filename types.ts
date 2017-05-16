// // resource: /users
// export interface User {
//   id: number;
//   name: string; // type: name.findName
//   username: string; // type: internet.userName
//   email: string; // type: internet.email
//   description: string; // maxLength: 50
//   foo: 'bar';
//   group: Group;
//   groups: Group[];
// }

// export interface Group {
//   id: number;
//   name: string; // type: business.companyName
// }

// @resource: /users
export interface User {
  foo: {
    bar: string;
  };
}
