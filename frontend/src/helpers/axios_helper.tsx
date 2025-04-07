import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const _callApi = (
    servicePath: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any,
    params?: Record<string, any>
): Promise<AxiosResponse<any>> => {
    const url = `http://localhost:8080${servicePath}`;
    console.log("Request URL:", url);

    const token = localStorage.getItem('token');

    const config: AxiosRequestConfig = {
        method,
        url,
        data: body,
        params,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    };

    return axios(config);
}

export const callApi = (
    servicePath: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any,
    params?: Record<string, any>
): Promise<AxiosResponse<any>> => {
    return _callApi(servicePath, method, body,params).catch(error => {
        throw error;
    });
}