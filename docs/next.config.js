const basePath = process.env.GITHUB_PAGES ? "/fabricjs-psbrush" : "";
module.exports = {
  basePath,
  env: { BASE_PATH: basePath }
}
