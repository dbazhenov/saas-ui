import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { SerializedError } from '@reduxjs/toolkit';

// NOTE: this condition checks whether the error is coming from the server (FetchBaseQueryError),
//       since those errors contain the 'status' property, and ignores other errors (SerializedError),
//       that can have a different interface.
export const errorHasStatus = (error: FetchBaseQueryError | SerializedError | undefined, status: number) =>
  error && 'status' in error && error?.status === status;
