export default {
  api: {
    root: process.env.REACT_APP_API_ROOT ? process.env.REACT_APP_API_ROOT : window.location.origin
  },
  googleAnalyticsTrackingId: process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID
};
