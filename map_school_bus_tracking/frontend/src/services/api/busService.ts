// frontend/src/services/api/busService.ts
export const busService = {
    getBusesByParent: async (userId: string) => {
        const response = await fetch(`http://localhost:5000/api/buses/parent/${userId}`);
        const data = await response.json();
        console.log("Parent buses:", data); // Debug
        return data;
    },

    getBusesByDriver: async (userId: string) => {
        const response = await fetch(`http://localhost:5000/api/buses/driver/${userId}`);
        const data = await response.json();
        console.log("Driver buses:", data); // Debug
        return data;
    },

    getAllBuses: async () => {
        const response = await fetch(`http://localhost:5000/api/buses`);
        const data = await response.json();
        console.log("All buses:", data); // Debug
        return data;
    }
};