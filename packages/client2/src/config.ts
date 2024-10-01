export default {
  api: {
    root: process.env.REACT_APP_API_ROOT ? process.env.REACT_APP_API_ROOT : window.location.origin,
    unreachableErrorMessage:
      process.env.REACT_APP_API_UNREACHABLE_ERROR_MESSAGE ?? "Unable to communicate with server"
  },
  googleAnalyticsTrackingId: process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID,
  heartBeatTimeoutSeconds: 10
};
