const HTTPStatusCode = {
  // Informational - 1xx
  continueStatus: 100,
  switchingProtocols: 101,
  processing: 102,

  // Success - 2xx
  ok: 200,
  created: 201,
  accepted: 202,
  nonAuthoritativeInformation: 203,
  noContent: 204,
  resetContent: 205,
  partialContent: 206,
  multiStatus: 207,
  alreadyReported: 208,
  IMUsed: 226,

  // Redirection - 3xx
  multipleChoices: 300,
  movedPermanently: 301,
  found: 302,
  seeOther: 303,
  notModified: 304,
  useProxy: 305,
  switchProxy: 306,
  temporaryRedirect: 307,
  permenantRedirect: 308,

  // Client Error - 4xx
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  notAcceptable: 406,
  proxyAuthenticationRequired: 407,
  requestTimeout: 408,
  conflict: 409,
  gone: 410,
  lengthRequired: 411,
  preconditionFailed: 412,
  payloadTooLarge: 413,
  URITooLong: 414,
  unsupportedMediaType: 415,
  rangeNotSatisfiable: 416,
  expectationFailed: 417,
  teapot: 418,
  misdirectedRequest: 421,
  unprocessableEntity: 422,
  locked: 423,
  failedDependency: 424,
  upgradeRequired: 426,
  preconditionRequired: 428,
  tooManyRequests: 429,
  requestHeaderFieldsTooLarge: 431,
  noResponse: 444,
  unavailableForLegalReasons: 451,
  SSLCertificateError: 495,
  SSLCertificateRequired: 496,
  HTTPRequestSentToHTTPSPort: 497,
  clientClosedRequest: 499,

  // Server Error - 5xx
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
  HTTPVersionNotSupported: 505,
  variantAlsoNegotiates: 506,
  insufficientStorage: 507,
  loopDetected: 508,
  notExtended: 510,
  networkAuthenticationRequired: 511,

  responseType: function (statusValue: number) {
    if (statusValue >= 100 && statusValue < 200) {
      return "informational";
    } else if (statusValue >= 200 && statusValue < 300) {
      return "success";
    } else if (statusValue >= 300 && statusValue < 400) {
      return "redirection";
    } else if (statusValue >= 400 && statusValue < 500) {
      return "clientError";
    } else if (statusValue >= 500 && statusValue < 600) {
      return "serverError";
    } else {
      return "undefined";
    }
  },
};

export default HTTPStatusCode;
