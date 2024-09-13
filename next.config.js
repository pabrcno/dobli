const nextConfig = {
  webpack: (config, { isServer }) => {
    // This will only affect the server-side build.
    if (isServer) {
      if (!Array.isArray(config.externals)) {
        config.externals = [];
      }

      // Here, we specify the modules that should not be bundled but rather be left as external.
      // This is useful for packages like `@ffmpeg-installer/ffmpeg` which are not meant to be bundled.
      config.externals.push("@ffmpeg-installer/ffmpeg");
      config.externals.push("@ffprobe-installer/ffprobe");
    }

    // Always return the modified config
    return config;
  },
};

module.exports = nextConfig;
