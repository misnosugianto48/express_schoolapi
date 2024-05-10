import {web} from "./library/web.js";
import {logger} from "./library/logging.js";
const PORT=5000
web.listen(PORT, () => {
    logger.info(`App start on port ${PORT}`);
});