 import axios from "axios";

const getgeolocation =  async ()=>{
    try{
    const position = await new Promise((resolve, reject)=>{navigator.geolocation.getCurrentPosition(
     (position) =>
       resolve(position.coords),
     (error) => reject(error)
    )}); return position
    }catch(error: any){
     console.error('Geolocation error:', error)
     if(error.code === 1) return 'notallowed'
       return null
    }
}


const updatecurrentlocation = async (latitude: number, longitude: number)=>{
 try {
   const response = await axios.get(
     `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
   );
    return response

 } catch (error) {
   console.error('Error fetching current location:', error);
   return null
 }
}

const fetchLocations = async (searchQuery: string) =>{
    try{
        const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`
        );
        return response.data;
    }catch(err){
        return null
    }
}

const fetchLocation = async (locationId: string)=>{
    try{
        const locationResponse = await axios.get(
            `https://nominatim.openstreetmap.org/lookup?osm_ids=${locationId}&format=json`);
       return locationResponse.data
    }catch(err){
        return null;
    }
}



export {getgeolocation, updatecurrentlocation, fetchLocations, fetchLocation}