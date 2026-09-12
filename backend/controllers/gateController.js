// controllers/gateController.js
// CRUD logic and validations for Gates

const supabase = require('../config/supabase');

// Input validation helper
function validateGateData(body, isUpdate = false) {
  const errors = [];
  const { gate_number, terminal, status } = body;

  const validStatuses = ['Available', 'Boarding', 'Occupied', 'Maintenance'];

  if (!isUpdate) {
    if (!gate_number || gate_number.trim() === '') errors.push("Gate number is required.");
    if (!terminal || terminal.trim() === '') errors.push("Terminal number is required.");
    if (!status || status.trim() === '') errors.push("Status is required.");
  } else {
    if (gate_number !== undefined && gate_number.trim() === '') errors.push("Gate number cannot be blank.");
    if (terminal !== undefined && terminal.trim() === '') errors.push("Terminal number cannot be blank.");
    if (status !== undefined && status.trim() === '') errors.push("Status cannot be blank.");
  }

  if (status && !validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  return errors;
}

// 1. GET ALL GATES
exports.getAllGates = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('gates')
      .select('*, flights(id, flight_number, airline, status)')
      .order('id', { ascending: true });

    if (error) throw error;

    // Supabase returns nested flight rows as an array. Let's flatten to single object reference
    // because each gate has at most one active assigned flight in our operational model.
    const formattedData = data.map(gate => {
      const activeFlight = gate.flights && gate.flights.length > 0 ? gate.flights[0] : null;
      const formatted = { ...gate };
      delete formatted.flights;
      formatted.assignedFlight = activeFlight ? activeFlight.flight_number : null;
      formatted.flightDetail = activeFlight;
      return formatted;
    });

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (err) {
    next(err);
  }
};

// 2. GET SINGLE GATE BY ID
exports.getGateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('gates')
      .select('*, flights(id, flight_number, airline, status)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: `Gate with ID ${id} not found`
      });
    }

    const activeFlight = data.flights && data.flights.length > 0 ? data.flights[0] : null;
    const formatted = { ...data };
    delete formatted.flights;
    formatted.assignedFlight = activeFlight ? activeFlight.flight_number : null;
    formatted.flightDetail = activeFlight;

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
};

// 3. CREATE GATE
exports.createGate = async (req, res, next) => {
  try {
    const validationErrors = validateGateData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    const { gate_number, terminal, status } = req.body;

    // Check if gate number is already taken
    const { data: duplicate, error: checkErr } = await supabase
      .from('gates')
      .select('id')
      .eq('gate_number', gate_number)
      .maybeSingle();

    if (checkErr) throw checkErr;
    if (duplicate) {
      return res.status(400).json({
        success: false,
        error: `Gate number '${gate_number}' already exists.`
      });
    }

    const { data, error } = await supabase
      .from('gates')
      .insert([{ gate_number, terminal, status }])
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

// 4. UPDATE GATE
exports.updateGate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const validationErrors = validateGateData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    // Verify gate exists
    const { data: existingGate, error: fetchErr } = await supabase
      .from('gates')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!existingGate) {
      return res.status(404).json({
        success: false,
        error: `Gate with ID ${id} not found`
      });
    }

    const { gate_number, terminal, status } = req.body;

    // Check if new gate number conflicts with another gate
    if (gate_number) {
      const { data: duplicate, error: checkErr } = await supabase
        .from('gates')
        .select('id')
        .eq('gate_number', gate_number)
        .neq('id', id)
        .maybeSingle();

      if (checkErr) throw checkErr;
      if (duplicate) {
        return res.status(400).json({
          success: false,
          error: `Gate number '${gate_number}' already taken by another gate.`
        });
      }
    }

    const updateFields = {};
    if (gate_number !== undefined) updateFields.gate_number = gate_number;
    if (terminal !== undefined) updateFields.terminal = terminal;
    if (status !== undefined) updateFields.status = status;

    const { data, error } = await supabase
      .from('gates')
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

// 5. DELETE GATE
exports.deleteGate = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify gate exists
    const { data: existingGate, error: fetchErr } = await supabase
      .from('gates')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!existingGate) {
      return res.status(404).json({
        success: false,
        error: `Gate with ID ${id} not found`
      });
    }

    const { error } = await supabase
      .from('gates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `Gate with ID ${id} has been deleted successfully`
    });
  } catch (err) {
    next(err);
  }
};
