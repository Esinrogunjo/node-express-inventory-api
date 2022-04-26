import app from "./app";
import { PORT } from "./utils/config";
import { consloeLog } from "./utils/helpers";

app.listen(PORT, () => consloeLog(`server is running at ${PORT}`, true));
