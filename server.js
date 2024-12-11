import app from './app.js';

const port = process.env.PORT || 5050;

app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port: ${port}`);
});
