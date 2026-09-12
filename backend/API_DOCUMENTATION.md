# AirTrack REST API Documentation

This document describes the API endpoints exposed by the AirTrack backend server.

Base URL during local development: `http://localhost:5000/api`

---

## 1. System Health

### `GET /health`
- **Purpose**: Get API service status and connectivity health.
- **Request Body**: None
- **Status Codes**: 
  - `200` — Successful response
- **Example Response**:
```json
{
  "success": true,
  "message": "AirTrack API is running"
}
```

---

## 2. Flights Endpoints

### `GET /flights`
- **Purpose**: Retrieve the list of all flights, including nested gate allocation records.
- **Request Body**: None
- **Status Codes**: 
  - `200` — Success
  - `500` — Server/Database error
- **Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "flight_number": "AI 539",
      "airline": "Air India",
      "airline_code": "AI",
      "origin": "Indira Gandhi International Airport, Delhi",
      "origin_code": "DEL",
      "destination": "Chennai International Airport, Chennai",
      "destination_code": "MAA",
      "scheduled_departure": "14:30",
      "estimated_departure": "15:05",
      "scheduled_arrival": "17:15",
      "estimated_arrival": "17:50",
      "terminal": "2",
      "gate_id": 8,+
      "status": "Delayed",
      "delay_minutes": 35,
      "created_at": "2026-08-18T00:55:00.000Z",
      "updated_at": "2026-08-18T00:55:00.000Z",
      "gates": {
        "id": 8,
        "gate_number": "B04",
        "terminal": "2",
        "status": "Boarding"
      }
    }
  ]
}
```

---

### `GET /flights/:id`
- **Purpose**: Retrieve a single flight configuration.
- **Request Body**: None
- **Status Codes**:
  - `200` — Success
  - `404` — Flight not found
  - `500` — Database error
- **Example Response**:
```json+
{
  "success": true,
  "data": {
    "id": 1,
    "flight_number": "AI 539",
    "airline": "Air India",
    "gates": {
      "id": 8,
      "gate_number": "B04"
    }
  }
}
```

---

### `POST /flights`
- **Purpose**: Insert a new flight dispatch.
- **Request Body**:
```json
{
  "flight_number": "UK 812",
  "airline": "Vistara",
  "airline_code": "UK",
  "origin": "Chennai International Airport, Chennai",
  "origi+_code": "MAA",
  "destination": "Chhatrapati Shivaji Maharaj Airport, Mumbai",
  "destination_code": "BOM",
  "scheduled_departure": "16:15",
  "estimated_departure": "16:15",
  "scheduled_arrival": "18:20",
  "estimated_arrival": "18:20",
  "terminal": "1",
  "gate_id": 3,
  "status": "On Time",
  "delay_minutes": 0
}
```
- **Status Codes**:
  - `201` — Created
  - `400` — Validation error (e.g. negative delay, invalid gate reference)
  - `500` — Database error
- **Example Response**:
```json
{
  "success": true,
  "data": {
    "id": 11,
    "flight_number": "UK 812",
    "airline": "Vistara"
  }
}+
```

---

### `PUT /flights/:id`
- **Purpose**: Update an existing flight's details.
- **Request Body**: (Allows partial updates)
```json
{
  "gate_id": 9,
  "status": "Gate Changed"
}
```
- **Status Codes**:
  - `200` — Updated successfully
  - `400` — Validation error
  - `404` — Record not found
  - `500` — Database error
- **Example Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "flight_number": "AI 539",
  + "gate_id": 9,
    "status": "Gate Changed"
  }
}
```

---

### `DELETE /flights/:id`
- **Purpose**: Delete a flight from the operational schedule.
- **Request Body**: None
- **Status Codes**:
  - `200` — Deleted successfully
  - `404` — Record not found
  - `500` — Database error
- **Example Response**:
```json
{
  "success": true,
  "message": "Flight with ID 1 has been deleted successfully"
}
```

---

## 3. Gates Endpoints

### `GET /gates`
- **Purpose**: Retrieve all gates, including flat representation of assigned active flights.
- **Request Body**: None
- **Status Codes**:
  - `200` — Success
- **Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "gate_number": "A01",
      "terminal": "1",
      "status": "Boarding",
      "assignedFlight": "6E 621",
      "flightDetail": {
        "id": 2,
        "flight_number": "6E 621",
        "airline": "IndiGo",
        "status": "Boarding"
      }
    }
  ]
}
```

---

### `GET /gates/:id`
- **Purpose**: Retrieve details of one gate.
- **Request Body**: None
- **Status Codes**:
  - `200` — Success
  - `404` — Gate not found
- **Example Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "gate_number": "A01",
    "terminal": "1",
    "status": "Boarding",
    "assignedFlight": "6E 621"
  }
}
```

---

### `POST /gates`
- **Purpose**: Add a new gate bay.
- **Request Body**:
```json
{
  "gate_number": "B06",
  "terminal": "2",
  "status": "Available"
}
```
- **Status Codes**:
  - `201` — Created
  - `400` — Validation error (e.g. duplicate gate number)
  - `500` — Database error
- **Example Response**:
```json
{
  "success": true,
  "data": {
    "id": 10,
    "gate_number": "B06",
    "terminal": "2",
    "status": "Available"
  }
}
```

---

### `PUT /gates/:id`
- **Purpose**: Update terminal status or gate number labels.
- **Request Body**: (Allows partial updates)
```json
{
  "status": "Maintenance"
}
```
- **Status Codes**:
  - `200` — Success
  - `400` — Validation error
  - `404` — Gate not found
  - `500` — Database error
- **Example Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "gate_number": "A01",
    "terminal": "1",
    "status": "Maintenance"
  }
}
```

---

### `DELETE /gates/:id`
- **Purpose**: Remove a gate terminal record.
- **Request Body**: None
- **Status Codes**:
  - `200` — Success
  - `404` — Record not found
  - `500` — Database error
- **Example Response**:
```json
{
  "success": true,
  "message": "Gate with ID 1 has been deleted successfully"
}
```
