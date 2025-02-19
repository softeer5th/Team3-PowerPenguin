import { ClientError, ServerError } from '@/core/errorType';
import { ResponseError } from '@/core/model';

export const throwError = async (response: Response) => {
  if (!response.ok) {
    if (response.status >= 500) {
      if (response.status === 502) {
        throw new ServerError({
          success: false,
          errorCode: 'BAD_GATEWAY',
          message: 'Server Error',
        });
      }

      const json = await response.json();
      throw new ServerError(json as ResponseError);
    } else if (response.status >= 400) {
      const json = await response.json();

      throw new ClientError(json as ResponseError);
    } else {
      throw new Error('Unknown Error');
    }
  }
};
