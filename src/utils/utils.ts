

type QueryStatus = 'loading' | 'error' | 'success' | 'idle';

export const isQueryLoading = (status: QueryStatus) => {
    return status === 'loading';
}

export const hasQueryErrored = (status: QueryStatus) => {
    return status === 'error';
}

export const hasQuerySucceeded = (status: QueryStatus) => {
    return status === 'success';
}