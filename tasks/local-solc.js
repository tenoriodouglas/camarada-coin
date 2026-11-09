const { subtask } = require("hardhat/config");
const { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } = require("hardhat/builtin-tasks/task-names");

/**
 * Compile with the solc pinned in package.json instead of downloading a binary.
 * Keeps builds reproducible and lets CI or sandboxed environments compile offline.
 */
subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async (args, _hre, runSuper) => {
  try {
    const compilerPath = require.resolve("solc/soljson.js");
    const longVersion = require("solc").version();
    // Only take over when the pinned compiler matches the requested version.
    if (longVersion.startsWith(`${args.solcVersion}+`)) {
      return { compilerPath, isSolcJs: true, version: args.solcVersion, longVersion };
    }
  } catch {
    // Fall through to Hardhat's default download path.
  }
  return runSuper();
});
