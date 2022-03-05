import { QueryOption } from '../../types/easyGetData';
/**
 * get Doc or getDocs
 */
export declare function easyGetData<T>(path: string, option?: QueryOption): Promise<T[] | T | undefined | Error>;
