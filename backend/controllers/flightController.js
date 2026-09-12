// controllers/flightController.js
// CRUD logic and validations for Flights

const supabase = require('../config/supabase');

// Input validation helper
function validateFlightData(body, isUpdate = false) {
  const errors = [];
  const { 
    flight_number, airline, origin, destination, 
    scheduled_departure, scheduled_arrival, status, delay_minutes 
  } = body;

  // For CREATE, check required fields
  if (!isUpdate) {
    if (!flight_number || flight_number.trim() === '') errors.push("Flight number is required.");
    if (!airline || airline.trim() === '') errors.push("Airline is required.");
    if (!origin || origin.trim() === '') errors.push("Origin is required.");
    if (!destination || destination.trim() === '') errors.push("Destination is required.");
    if (!scheduled_departure || scheduled_departure.trim() === '') errors.push("Scheduled departure is required.");
    if (!scheduled_arrival || scheduled_arrival.trim() === '') errors.push("Scheduled arrival is required.");
    if (!status || status.trim() === '') errors.push("Status is required.");
  } else {
    // For UPDATE, if fields are supplied, ensure they aren't empty strings
    if (flight_number !== undefined && flight_number.trim() === '') errors.push("Flight number cannot be blank.");
    if (airline !== undefined && airline.trim() === '') errors.push("Airline cannot be blank.");
    if (origin !== undefined && origin.trim() === '') errors.push("Origin cannot be blank.");
    if (destination !== undefined && destination.trim() === '') errors.push("Destination cannot be blank.");
    if (scheduled_departure !== undefined && scheduled_departure.trim() === '') errors.push("Scheduled departure cannot be blank.");
    if (scheduled_arrival !== undefined && scheduled_arrival.trim() === '') errors.push("Scheduled arrival cannot be blank.");
    if (status !== undefined && status.trim() === '') errors.push("Status cannot be blank.");
  }

  // Validate delay_minutes if present
  if (delay_minutes !== undefined && delay_minutes !== null) {
    const delayNum = Number(delay_minutes);
    if (isNaN(delayNum) || delayNum < 0) {
      errors.push("Delay minutes must be a non-negative number.");
    }
  }

  return errors;
}

// 1. GET ALL FLIGHTS
exports.getAllFlights = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('flights')
      .select('*, gates(id, gate_number, terminal, status)')
      .order('id', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

// 2. GET SINGLE FLIGHT BY ID
exports.getFlightById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('flights')
      .select('*, gates(id, gate_number, terminal, status)')
      .eq('id', id)
      .maybeSingle(); // Prevents throwing 406 on no record

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: `Flight with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

// 3. CREATE FLIGHT
exports.createFlight = async (req, res, next) => {
  try {
    const validationErrors = validateFlightData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    const {
      flight_number, airline, airline_code, origin, origin_code,
      destination, destination_code, scheduled_departure, estimated_departure,
      scheduled_arrival, estimated_arrival, terminal, gate_id, status, delay_minutes
    } = req.body;

    // Validate foreign key gate_id if provided
    if (gate_id) {
      const { data: gate, error: gateErr } = await supabase
        .from('gates')
        .select('id')
        .eq('id', gate_id)
        .maybeSingle();

      if (gateErr) throw gateErr;
      if (!gate) {
        return res.status(400).json({
          success: false,
          error: `Referenced Gate ID ${gate_id} does not exist.`
        });
      }
    }

    const { data, error } = await supabase
      .from('flights')
      .insert([{
        flight_number, airline, airline_code: airline_code || '', origin, origin_code: origin_code || '',
        destination, destination_code: destination_code || '', scheduled_departure,
        estimated_departure: estimated_departure || scheduled_departure,
        scheduled_arrival, estimated_arrival: estimated_arrival || scheduled_arrival,
        terminal, gate_id: gate_id || null, status, delay_minutes: Number(delay_minutes) || 0
      }])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data[0]
    });
  } catch (err) {
    next(err);
  }
};

// 4. UPDATE FLIGHT
exports.updateFlight = async (req, res, next) => {
  try {
    const { id } = req.params;

    const validationErrors = validateFlightData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    // Verify flight exists
    const { data: existingFlight, error: fetchErr } = await supabase
      .from('flights')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!existingFlight) {
      return res.status(404).json({
        success: false,
        error: `Flight with ID ${id} not found`
      });
    }

    const {
      flight_number, airline, airline_code, origin, origin_code,
      destination, destination_code, scheduled_departure, estimated_departure,
      scheduled_arrival, estimated_arrival, terminal, gate_id, status, delay_minutes
    } = req.body;

    // Validate foreign key gate_id if updated
    if (gate_id) {
      const { data: gate, error: gateErr } = await supabase
        .from('gates')
        .select('id')
        .eq('id', gate_id)
        .maybeSingle();

      if (gateErr) throw gateErr;
      if (!gate) {
        return res.status(400).json({
          success: false,
          error: `Referenced Gate ID ${gate_id} does not exist.`
        });
      }
    }

    const updateFields = {};
    if (flight_number !== undefined) updateFields.flight_number = flight_number;
    if (airline !== undefined) updateFields.airline = airline;
    if (airline_code !== undefined) updateFields.airline_code = airline_code;
    if (origin !== undefined) updateFields.origin = origin;
    if (origin_code !== undefined) updateFields.origin_code = origin_code;
    if (destination !== undefined) updateFields.destination = destination;
    if (destination_code !== undefined) updateFields.destination_code = destination_code;
    if (scheduled_departure !== undefined) updateFields.scheduled_departure = scheduled_departure;
    if (estimated_departure !== undefined) updateFields.estimated_departure = estimated_departure;
    if (scheduled_arrival !== undefined) updateFields.scheduled_arrival = scheduled_arrival;
    if (estimated_arrival !== undefined) updateFields.estimated_arrival = estimated_arrival;
    if (terminal !== undefined) updateFields.terminal = terminal;
    if (gate_id !== undefined) updateFields.gate_id = gate_id || null;
    if (status !== undefined) updateFields.status = status;
    if (delay_minutes !== undefined) updateFields.delay_minutes = Number(delay_minutes);

    const { data, error } = await supabase
      .from('flights')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data[0]
    });
  } catch (err) {
    next(err);
  }
};

// 5. DELETE FLIGHT
exports.deleteFlight = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify flight exists
    const { data: existingFlight, error: fetchErr } = await supabase
      .from('flights')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!existingFlight) {
      return res.status(404).json({
        success: false,
        error: `Flight with ID ${id} not found`
      });
    }

    const { error } = await supabase
      .from('flights')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `Flight with ID ${id} has been deleted successfully`
    });
  } catch (err) {
    next(err);
  }
};
