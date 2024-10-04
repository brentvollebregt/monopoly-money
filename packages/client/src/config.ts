export default {
  api: {
    root: import.meta.env.VITE_API_ROOT,
    unreachableErrorMessage:
      import.meta.env.VITE_API_UNREACHABLE_ERROR_MESSAGE ?? "Unable to communicate with server"
  },
  googleAnalyticsTrackingId: import.meta.env.VITE_GOOGLE_ANALYTICS_TRACKING_ID,
  heartBeatTimeoutSeconds: 10
};
