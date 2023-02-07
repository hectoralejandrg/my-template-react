import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

export const globalApi = createApi({
  reducerPath: 'globalApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: [],
  endpoints: () => ({})
})
