const express = require('express');
const router = express.Router();
const Crud = require('../models/crud');
 
router.post('/create', async (req, res, next) => {
    try {
        const newcrud = new Crud({
            order: req.body.order,
            date: req.body.date,
            payment: req.body.payment,
            product: req.body.product,
            customer: req.body.customer,
            phone: req.body.phone,
            weight: req.body.weight,
        });
 
        const savedCrud = await newcrud.save();
        res.status(200).json({ msg: savedCrud });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmsg: err.message });
    }
});
 
router.get('/read', async (req, res, next) => {
    try {
        const cruds = await Crud.find({});
        res.status(200).json({ data: cruds, message: 'Cruds retrieved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
 
router.put('/update/:id', async (req, res, next) => {
    const crudId = req.params.id;
 
    try {
        const crud = await Crud.findById(crudId);
 
        if (!crud) {
            return res.status(404).json({ errmsg: 'Crud not found' });
        }
 
        
        crud.order = req.body.order;
        crud.date = req.body.date;
        crud.payment = req.body.payment;
        crud.product = req.body.product;
        crud.customer = req.body.customer;
        crud.phone = req.body.phone;
        crud.weight = req.body.weight;
 
        const updatedCrud = await crud.save();
        res.status(200).json({ msg: 'Crud updated successfully', crud: updatedCrud });
    } catch (error) {
        console.error('Error updating crud:', error);
        res.status(500).json({ errmsg: 'Internal Server Error' });
    }
});
 
router.delete('/delete/:_id', async (req, res, next) => {
    try {
        const deletedCrud = await Crud.findByIdAndDelete(req.params._id);
 
        if (!deletedCrud) {
            return res.status(404).json({ errmsg: 'Crud not found' });
        }
 
        res.status(200).json({ msg: 'Crud deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmsg: err.message });
    }
});
 
module.exports = router;