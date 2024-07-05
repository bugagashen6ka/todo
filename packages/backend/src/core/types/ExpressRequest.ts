import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export interface ExpressBodyRequest<T> extends Request {
  body: T;
}

export interface ExpressParamsRequest<T extends ParamsDictionary> extends Request {
  params: T;
}
