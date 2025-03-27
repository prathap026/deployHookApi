// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');
const List = require('./models/DeployHook');
require('./deploy-cron');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

connectDB();

app.post('/post', async (req, res) => {
    try {
        const { DeployHook } = req.body;

        if (!DeployHook) {
            return res.send({ error: 'DeployHook is required' });
        }

        const existingHook = await List.findOne({ DeployHook });

        if (existingHook) {
            return res.send({ error: 'DeployHook already exists' });
        }

        const newHook = await List.create(req.body);
        return res.send(newHook);

    } catch (error) {
        console.error('Error:', error);
        return res.send({ error: 'Server error', details: error.message });
    }
});


app.get('/getAll', async (req, res) => {
    try {
        const items = await List.find();
        res.send(items);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});



app.get('/getById/:id', async (req, res) => {
    try {
        const item = await List.findById(req.params.id);
        if (!item) {
            return res.status(404).send({ error: 'Item not found' });
        }
        res.send(item);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const result = await List.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'Item not found' });
        }
        res.send({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

app.put('/update/:id', async (req, res) => {
    try {
        const updatedItem = await List.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).send({ error: 'Item not found' });
        }
        res.send(updatedItem);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});