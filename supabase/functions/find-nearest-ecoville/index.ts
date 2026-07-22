import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type RequestBody = {
  latitude?: number | null;
  longitude?: number | null;
  city?: string | null;
  state?: string | null;
  neighborhood?: string | null;
  address?: string | null;
};

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  nationalPhoneNumber?: string;
  rating?: number;
  googleMapsUri?: string;
};

type StoreResult = {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  rating: number | null;
  mapsUrl: string | null;
  distanceKm: number;
};

function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function buildAddressQuery(body: RequestBody): string {
  return [body.address, body.neighborhood, body.city, body.state, "Brasil"]
    .filter((part) => part?.trim())
    .join(", ");
}

async function geocodeAddress(
  address: string,
  apiKey: string,
): Promise<{ latitude: number; longitude: number } | null> {
  const url =
    `https://maps.googleapis.com/maps/api/geocode/json?address=${
      encodeURIComponent(address)
    }&key=${apiKey}&region=br&language=pt-BR`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  const location = data.results?.[0]?.geometry?.location;

  if (!location) return null;

  return {
    latitude: Number(location.lat),
    longitude: Number(location.lng),
  };
}

async function searchEcovillePlaces(
  latitude: number,
  longitude: number,
  apiKey: string,
): Promise<GooglePlace[]> {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.nationalPhoneNumber,places.rating,places.googleMapsUri",
    },
    body: JSON.stringify({
      textQuery: "Ecoville",
      locationBias: {
        circle: {
          center: { latitude, longitude },
          radius: 50000,
        },
      },
      languageCode: "pt-BR",
      regionCode: "BR",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Places API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return (data.places ?? []) as GooglePlace[];
}

function getPlaceName(place: GooglePlace): string {
  return place.displayName?.text?.trim() ?? "";
}

function mapPlaceToStore(
  place: GooglePlace,
  userLat: number,
  userLng: number,
): StoreResult | null {
  const name = getPlaceName(place);
  const placeLat = place.location?.latitude;
  const placeLng = place.location?.longitude;

  if (!name || placeLat == null || placeLng == null) return null;

  return {
    placeId: place.id ?? "",
    name,
    address: place.formattedAddress ?? name,
    latitude: placeLat,
    longitude: placeLng,
    phone: place.nationalPhoneNumber ?? null,
    rating: place.rating ?? null,
    mapsUrl: place.googleMapsUri ?? null,
    distanceKm: calculateDistanceKm(userLat, userLng, placeLat, placeLng),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          store: null,
          message: "Serviço de localização indisponível no momento.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    const body = (await req.json()) as RequestBody;

    let latitude = body.latitude != null ? Number(body.latitude) : null;
    let longitude = body.longitude != null ? Number(body.longitude) : null;

    const hasValidCoordinates =
      latitude != null &&
      longitude != null &&
      !Number.isNaN(latitude) &&
      !Number.isNaN(longitude);

    if (!hasValidCoordinates) {
      const addressQuery = buildAddressQuery(body);

      if (!addressQuery.trim()) {
        return new Response(
          JSON.stringify({
            store: null,
            message: "Não encontramos uma unidade Ecoville próxima.",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      }

      const geocoded = await geocodeAddress(addressQuery, apiKey);

      if (!geocoded) {
        return new Response(
          JSON.stringify({
            store: null,
            message: "Não encontramos uma unidade Ecoville próxima.",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      }

      latitude = geocoded.latitude;
      longitude = geocoded.longitude;
    }

    const places = await searchEcovillePlaces(latitude!, longitude!, apiKey);

    const ecovilleStores = places
      .filter((place) => getPlaceName(place).toLowerCase().includes("ecoville"))
      .map((place) => mapPlaceToStore(place, latitude!, longitude!))
      .filter((store): store is StoreResult => store != null)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const nearestStore = ecovilleStores[0] ?? null;

    if (!nearestStore) {
      return new Response(
        JSON.stringify({
          store: null,
          message: "Não encontramos uma unidade Ecoville próxima.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    return new Response(JSON.stringify({ store: nearestStore }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch {
    return new Response(
      JSON.stringify({
        store: null,
        message: "Não encontramos uma unidade Ecoville próxima.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  }
});
