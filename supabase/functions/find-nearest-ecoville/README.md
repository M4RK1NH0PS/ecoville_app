# find-nearest-ecoville

Edge Function que busca a unidade Ecoville mais próxima usando Google Places API.

## Configuração

1. Ative no Google Cloud:
   - Places API (New)
   - Geocoding API

2. Configure o secret no Supabase:

```bash
supabase secrets set GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

3. Faça deploy:

```bash
supabase functions deploy find-nearest-ecoville
```

## Request

```json
{
  "latitude": -23.5105,
  "longitude": -46.8761,
  "city": "Barueri",
  "state": "SP",
  "neighborhood": "Centro",
  "address": "Rua Exemplo, 100"
}
```

Se `latitude`/`longitude` não forem enviados, a function geocodifica o endereço montado a partir dos demais campos.

## Response

```json
{
  "store": {
    "placeId": "places/ChIJ...",
    "name": "Ecoville Barueri",
    "address": "Endereço completo",
    "latitude": -23.51,
    "longitude": -46.87,
    "phone": "+55 11 96586-2948",
    "rating": 4.5,
    "mapsUrl": "https://maps.google.com/...",
    "distanceKm": 3.2
  }
}
```
