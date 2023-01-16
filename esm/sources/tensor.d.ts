import { breakpoint, Sign, Tensor, U } from '../runtime/defs.js';
export declare function Eval_tensor(a: Tensor): U;
export declare function tensor_plus_tensor(p1: Tensor, p2: Tensor): U;
export declare function tensor_times_scalar(a: Tensor, p2: U): U;
export declare function scalar_times_tensor(p1: U, a: Tensor): U;
export declare function check_tensor_dimensions(p: Tensor): typeof breakpoint;
export declare function is_square_matrix(p: U): p is Tensor & {
    ndim: 2;
    square: true;
};
export declare function d_tensor_tensor(p1: Tensor, p2: Tensor): U;
export declare function d_scalar_tensor(p1: U, p2: Tensor): U;
export declare function d_tensor_scalar(p1: Tensor, p2: U): U;
export declare function compare_tensors(p1: Tensor, p2: Tensor): Sign;
export declare function power_tensor(p1: Tensor, p2: U): Tensor;
export declare function copy_tensor(p1: Tensor): Tensor;
