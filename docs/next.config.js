const basePath = process.env.GITHUB_PAGES ? "/fabricjs-psbrush" : "";
module.exports = {
  experimental: {
    basePath
  },
  env: { BASE_PATH: basePath }
}
