import { baseApi } from './api';

export interface RidePayload {
  id: number;
  userId: number;
  vendorId: number | null;
  pickup: { lat: number; lng: number; address?: string };
  dropoff: { lat: number; lng: number; address?: string };
  offeredFare: number;
  negotiatedFare: number | null;
  status: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: number; name: string; phoneNumber?: string };
  vendor?: { id: number; userId: number; vehicleType: string; user?: { id: number; name: string; phoneNumber?: string } };
  offers?: Array<{ id: number; vendorId: number; proposedFare: number; status: string; vendor?: { id: number; user?: { name: string } } }>;
}

function parseRideResponse(raw: any): RidePayload | null {
  const body = raw?.data ?? raw;
  const inner = body?.data ?? body;
  if (inner && typeof inner === 'object' && 'id' in inner) return inner as RidePayload;
  return null;
}

function parseRideListResponse(raw: any): RidePayload[] {
  const body = raw?.data ?? raw;
  const inner = body?.data ?? body;
  if (Array.isArray(inner)) return inner;
  if (Array.isArray(body)) return body;
  return [];
}

export const rideService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendorActiveRide: builder.query<RidePayload | null, void>({
      query: () => ({ url: '/ride/vendor/active', method: 'GET' }),
      transformResponse: (raw: any) => {
        const body = raw?.data ?? raw;
        const inner = body?.data ?? body;
        if (inner && typeof inner === 'object' && 'id' in inner) return inner as RidePayload;
        return null;
      },
    }),
    getAvailableRides: builder.query<RidePayload[], { latitude: number; longitude: number }>({
      query: ({ latitude, longitude }) => ({
        url: '/ride/vendor/available',
        method: 'GET',
        params: { latitude, longitude },
      }),
      transformResponse: parseRideListResponse,
    }),
    getRideById: builder.query<RidePayload, number>({
      query: (rideId) => ({ url: `/ride/${rideId}`, method: 'GET' }),
      transformResponse: parseRideResponse,
    }),
    acceptRide: builder.mutation<RidePayload, number>({
      query: (rideId) => ({
        url: `/ride/${rideId}/accept`,
        method: 'POST',
      }),
      transformResponse: parseRideResponse,
    }),
    counterOffer: builder.mutation<{ ride: RidePayload; offer: { id: number; proposedFare: number; status: string } }, { rideId: number; proposedFare: number }>({
      query: ({ rideId, proposedFare }) => ({
        url: `/ride/${rideId}/counter-offer`,
        method: 'POST',
        body: { proposedFare },
      }),
      transformResponse: (raw: any) => {
        const body = raw?.data ?? raw;
        const inner = body?.data ?? body;
        return inner ?? body;
      },
    }),
    cancelRide: builder.mutation<RidePayload, { rideId: number; asVendor?: boolean }>({
      query: ({ rideId, asVendor }) => ({
        url: `/ride/${rideId}/cancel`,
        method: 'POST',
        body: { asVendor: !!asVendor },
      }),
      transformResponse: parseRideResponse,
    }),
    updateRideStatus: builder.mutation<RidePayload, { rideId: number; status: 'ongoing' | 'completed' }>({
      query: ({ rideId, status }) => ({
        url: `/ride/${rideId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: parseRideResponse,
    }),
  }),
});

export const {
  useLazyGetVendorActiveRideQuery,
  useLazyGetAvailableRidesQuery,
  useLazyGetRideByIdQuery,
  useAcceptRideMutation,
  useCounterOfferMutation,
  useCancelRideMutation,
  useUpdateRideStatusMutation,
} = rideService;
