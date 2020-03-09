const basePath = process.env.GITHUB_PAGES ? "/fabricjs-psbrush" : "/";
module.exports = {
  assetPrefix: basePath,
  env: { BASE_PATH: basePath }
}
