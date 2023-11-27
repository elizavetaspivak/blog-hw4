import {Request, Response} from "express";


export type RequestType = Request<{}, {}, {}, {}>
export type RequestTypeWithParams<T> = Request<T, {}, {}, {}>
export type RequestTypeWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestTypeWithQueryAndParams<P, Q> = Request<P, {}, {}, Q>
export type RequestTypeWithBody<T> = Request<{}, {}, T, {}>
export type RequestTypeWithBodyAndParams<P, B> = Request<P, {}, B, {}>

export type ResponseType<T> = Response<T, {}>