import NodeCache from "node-cache";

// StdTTL = 600 seconds (10 minutes) by default
// checkperiod = 120 seconds (cleans up expired keys every 2 minutes)
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export default cache;