/*
solution to property 'user' does not exist on type request which happens
on line 19 of the verifyToken function in the verifyToken file
*/
declare namespace Express {
  export interface Request {
    user: any;
  }
}
