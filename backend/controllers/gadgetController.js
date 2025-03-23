const Gadget = require("../models/gadgetModel");

exports.getAllGadgets = (req, res) => {
    Gadget.getAll((err, rows) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                status_code: 500,
                message: "An error occurred while fetching gadgets.",
                error: err.message
            });
        }
        res.status(200).json({
            status: "success",
            status_code: 200,
            message: "Gadgets retrieved successfully.",
            data: rows
        });
    });
};

exports.getGadgetById = (req, res) => {
    Gadget.getById(req.params.id, (err, row) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                status_code: 500,
                message: "An error occurred while retrieving the gadget.",
                error: err.message
            });
        }
        if (!row) {
            return res.status(404).json({
                status: "failed",
                status_code: 404,
                message: "Gadget not found."
            });
        }
        res.status(200).json({
            status: "success",
            status_code: 200,
            message: "Gadget retrieved successfully.",
            data: row
        });
    });
};

exports.createGadget = (req, res) => {
    console.log('create gadgets body',req.body)
    Gadget.create(req.body, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                status_code: 500,
                message: "An error occurred while creating the gadget.",
                error: err.message
            });
        }
        res.status(201).json({
            status: "success",
            status_code: 201,
            message: "Gadget created successfully.",
            data: { id: result.id }
        });
    });
};

exports.updateGadget = (req, res) => {
    Gadget.update(req.params.id, req.body, (err) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                status_code: 500,
                message: "An error occurred while updating the gadget.",
                error: err.message
            });
        }
        res.status(200).json({
            status: "success",
            status_code: 200,
            message: "Gadget updated successfully."
        });
    });
};

exports.deleteGadget = (req, res) => {
    Gadget.delete(req.params.id, (err) => {
        if (err) {
            return res.status(500).json({
                status: "failed",
                status_code: 500,
                message: "An error occurred while deleting the gadget.",
                error: err.message
            });
        }
        res.status(200).json({
            status: "success",
            status_code: 200,
            message: "Gadget deleted successfully."
        });
    });
};
