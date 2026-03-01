import app from './app';
import { env } from './config/env';

const port = env.PORT;

app.listen(Number(port), '0.0.0.0', () => {
    console.log(`🚀 Server ready at: http://localhost:${port}`);
    console.log(`Backend is listening on port: ${port}`);
});
