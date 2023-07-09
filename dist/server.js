import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import root from './routes/root.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/', root);
//should be at the end
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ message: 'Not Found' });
    }
    else {
        res.type('txt').send('404 Not Found');
    }
});
app.listen(PORT, () => console.log(`running on port ${PORT}`));
//# sourceMappingURL=server.js.map