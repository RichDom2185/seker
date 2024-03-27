import interpreterEvaluatePrelude from "./interpreter_evaluate_prelude.py?raw";
import interpreterPrefix from "./interpreter_prefix.py?raw";
import interpreterPrefix2 from "./interpreter_prefix2.py?raw";
import interpreterSuffix from "./interpreter_suffix.py?raw";
import spikeMicrocode from "./spike_microcode.py?raw";

export default {
  evaluatePrelude: interpreterEvaluatePrelude,
  prefix: interpreterPrefix,
  prefix2: interpreterPrefix2,
  suffix: interpreterSuffix,
  spikeMicrocode,
};
