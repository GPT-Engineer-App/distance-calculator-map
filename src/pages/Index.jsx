import React, { useState, useEffect } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";

const Index = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
      },
    );
  }, []);

  const handleMapClick = (event) => {
    const { lat, lng } = event.latLng;
    setDestinationLocation({ lat, lng });
  };

  const calculateDistance = () => {
    if (userLocation && destinationLocation) {
      const R = 6371; // Earth's radius in kilometers
      const dLat = toRad(destinationLocation.lat - userLocation.lat);
      const dLon = toRad(destinationLocation.lng - userLocation.lng);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(userLocation.lat)) * Math.cos(toRad(destinationLocation.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      setDistance(distance.toFixed(2));
    }
  };

  const toRad = (value) => {
    return (value * Math.PI) / 180;
  };

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>
        Interactive Map
      </Text>
      <Box width="100%" height="400px" bg="gray.200" position="relative" onClick={handleMapClick}>
        {userLocation && (
          <Box position="absolute" top={`${userLocation.lat}%`} left={`${userLocation.lng}%`} transform="translate(-50%, -50%)">
            <FaMapMarkerAlt color="blue" size={24} />
          </Box>
        )}
        {destinationLocation && (
          <Box position="absolute" top={`${destinationLocation.lat}%`} left={`${destinationLocation.lng}%`} transform="translate(-50%, -50%)">
            <FaMapMarkerAlt color="red" size={24} />
          </Box>
        )}
      </Box>
      <Button mt={4} onClick={calculateDistance}>
        Calculate Distance
      </Button>
      {distance && <Text mt={4}>Distance: {distance} km</Text>}
    </Box>
  );
};

export default Index;
