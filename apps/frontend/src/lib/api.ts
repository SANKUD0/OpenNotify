const BASE_URL = process.env.MONOLITH_API_URL || "http://localhost:3001";

export const api = {
    services: {
        getAll: () => fetch(`${BASE_URL}/services`).then(res => res.json()),
        getCount: () => fetch(`${BASE_URL}/services/count`).then(res => res.json()),
    }
}