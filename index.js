var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/core/DefaultRun.ts
import { nanoid as createId } from "nanoid";

// src/core/FunctionEventSource.ts
var FunctionEventSource = class {
  observers;
  errorHandler;
  constructor({
    observers,
    errorHandler
  }) {
    this.observers = observers;
    this.errorHandler = errorHandler ?? ((error) => console.error(error));
  }
  notify(event) {
    for (const observer of this.observers) {
      try {
        observer.onFunctionEvent(event);
      } catch (error) {
        this.errorHandler(error);
      }
    }
  }
};

// src/core/DefaultRun.ts
var DefaultRun = class {
  runId;
  sessionId;
  userId;
  abortSignal;
  errorHandler;
  events = [];
  functionEventSource;
  constructor({
    runId = `run-${createId()}`,
    sessionId,
    userId,
    abortSignal,
    observers,
    errorHandler
  } = {}) {
    this.runId = runId;
    this.sessionId = sessionId;
    this.userId = userId;
    this.abortSignal = abortSignal;
    this.errorHandler = errorHandler ?? ((error) => console.error(error));
    this.functionEventSource = new FunctionEventSource({
      observers: observers ?? [],
      errorHandler: this.errorHandler.bind(this)
    });
  }
  functionObserver = {
    onFunctionEvent: (event) => {
      this.events.push(event);
      this.functionEventSource.notify(event);
    }
  };
  getSuccessfulModelCalls() {
    return this.events.filter(
      (event) => "model" in event && "result" in event && "status" in event.result && event.result.status === "success"
    );
  }
};

// src/core/ModelFusionConfiguration.ts
var ModelFusionConfiguration_exports = {};
__export(ModelFusionConfiguration_exports, {
  getFunctionObservers: () => getFunctionObservers,
  getLogFormat: () => getLogFormat,
  setFunctionObservers: () => setFunctionObservers,
  setLogFormat: () => setLogFormat
});
var globalLogFormat = void 0;
var globalFunctionObservers = [];
function setFunctionObservers(functionObservers) {
  globalFunctionObservers = functionObservers;
}
function getFunctionObservers() {
  return globalFunctionObservers;
}
function setLogFormat(format) {
  globalLogFormat = format;
}
function getLogFormat() {
  return globalLogFormat;
}

// src/core/PromptFunction.ts
var promptFunctionMarker = Symbol("promptFunction");
async function expandPrompt(prompt) {
  return isPromptFunction(prompt) ? await prompt() : { input: prompt, prompt };
}
function markAsPromptFunction(fn) {
  fn[promptFunctionMarker] = true;
  return fn;
}
function isPromptFunction(fn) {
  const hasMarker = fn[promptFunctionMarker] === true;
  const isFunction = typeof fn === "function";
  return hasMarker && isFunction;
}

// src/core/api/AbortError.ts
var AbortError = class extends Error {
  constructor(message = "Aborted") {
    super(message);
  }
};

// src/core/api/ApiCallError.ts
var ApiCallError = class extends Error {
  url;
  requestBodyValues;
  statusCode;
  responseBody;
  cause;
  isRetryable;
  data;
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 429 || statusCode >= 500),
    data
  }) {
    super(message);
    this.name = "ApiCallError";
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseBody = responseBody;
    this.cause = cause;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      url: this.url,
      requestBodyValues: this.requestBodyValues,
      statusCode: this.statusCode,
      responseBody: this.responseBody,
      cause: this.cause,
      isRetryable: this.isRetryable,
      data: this.data
    };
  }
};

// src/core/api/ApiFacade.ts
var ApiFacade_exports = {};
__export(ApiFacade_exports, {
  retryNever: () => retryNever,
  retryWithExponentialBackoff: () => retryWithExponentialBackoff,
  throttleMaxConcurrency: () => throttleMaxConcurrency,
  throttleOff: () => throttleOff
});

// src/core/api/retryNever.ts
var retryNever = () => async (f) => f();

// src/util/delay.ts
async function delay(delayInMs) {
  return new Promise((resolve) => setTimeout(resolve, delayInMs));
}

// src/util/getErrorMessage.ts
function getErrorMessage(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// src/core/api/RetryError.ts
var RetryError = class extends Error {
  // note: property order determines debugging output
  reason;
  lastError;
  errors;
  constructor({
    message,
    reason,
    errors
  }) {
    super(message);
    this.name = "RetryError";
    this.reason = reason;
    this.errors = errors;
    this.lastError = errors[errors.length - 1];
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      reason: this.reason,
      lastError: this.lastError,
      errors: this.errors
    };
  }
};

// src/core/api/retryWithExponentialBackoff.ts
var retryWithExponentialBackoff = ({
  maxTries = 3,
  initialDelayInMs = 2e3,
  backoffFactor = 2
} = {}) => async (f) => _retryWithExponentialBackoff(f, {
  maxTries,
  delayInMs: initialDelayInMs,
  backoffFactor
});
async function _retryWithExponentialBackoff(f, {
  maxTries,
  delayInMs,
  backoffFactor
}, errors = []) {
  try {
    return await f();
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const newErrors = [...errors, error];
    const tryNumber = newErrors.length;
    if (tryNumber >= maxTries) {
      throw new RetryError({
        message: `Failed after ${tryNumber} tries. Last error: ${errorMessage}`,
        reason: "maxTriesExceeded",
        errors: newErrors
      });
    }
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw error;
      }
      if (error instanceof ApiCallError && error.isRetryable && tryNumber < maxTries) {
        await delay(delayInMs);
        return _retryWithExponentialBackoff(
          f,
          { maxTries, delayInMs: backoffFactor * delayInMs, backoffFactor },
          newErrors
        );
      }
    }
    throw new RetryError({
      message: `Failed after ${tryNumber} attempt(s) with non-retryable error: '${errorMessage}'`,
      reason: "errorNotRetryable",
      errors: newErrors
    });
  }
}

// src/core/api/throttleMaxConcurrency.ts
var MaxConcurrencyThrottler = class {
  maxConcurrentCalls;
  activeCallCount;
  callQueue;
  constructor({ maxConcurrentCalls }) {
    this.maxConcurrentCalls = maxConcurrentCalls;
    this.activeCallCount = 0;
    this.callQueue = [];
  }
  async run(fn) {
    return new Promise((resolve, reject) => {
      const tryExecute = async () => {
        if (this.activeCallCount >= this.maxConcurrentCalls)
          return;
        this.activeCallCount++;
        const idx = this.callQueue.indexOf(tryExecute);
        if (idx !== -1)
          this.callQueue.splice(idx, 1);
        try {
          resolve(await fn());
        } catch (error) {
          reject(error);
        } finally {
          this.activeCallCount--;
          if (this.callQueue.length > 0) {
            this.callQueue[0]();
          }
        }
      };
      this.callQueue.push(tryExecute);
      if (this.activeCallCount < this.maxConcurrentCalls) {
        tryExecute();
      }
    });
  }
};
function throttleMaxConcurrency({
  maxConcurrentCalls
}) {
  const throttler = new MaxConcurrencyThrottler({ maxConcurrentCalls });
  return (fn) => throttler.run(fn);
}

// src/core/api/throttleOff.ts
var throttleOff = () => (fn) => fn();

// src/core/api/AbstractApiConfiguration.ts
var AbstractApiConfiguration = class {
  retry;
  throttle;
  customCallHeaders;
  constructor({
    retry,
    throttle,
    customCallHeaders = () => ({})
  }) {
    this.retry = retry;
    this.throttle = throttle;
    this.customCallHeaders = customCallHeaders;
  }
  headers(params) {
    return Object.fromEntries(
      [
        ...Object.entries(this.fixedHeaders(params)),
        ...Object.entries(this.customCallHeaders(params))
      ].filter(
        // remove undefined values:
        (entry) => typeof entry[1] === "string"
      )
    );
  }
};

// src/core/api/BaseUrlApiConfiguration.ts
var BaseUrlApiConfiguration = class extends AbstractApiConfiguration {
  baseUrl;
  fixedHeadersValue;
  constructor({
    baseUrl,
    headers,
    retry,
    throttle,
    customCallHeaders
  }) {
    super({ retry, throttle, customCallHeaders });
    this.baseUrl = typeof baseUrl == "string" ? parseBaseUrl(baseUrl) : baseUrl;
    this.fixedHeadersValue = headers ?? {};
  }
  fixedHeaders() {
    return this.fixedHeadersValue;
  }
  assembleUrl(path) {
    let basePath = this.baseUrl.path;
    if (basePath.endsWith("/")) {
      basePath = basePath.slice(0, -1);
    }
    if (!path.startsWith("/")) {
      path = `/${path}`;
    }
    return `${this.baseUrl.protocol}://${this.baseUrl.host}:${this.baseUrl.port}${basePath}${path}`;
  }
};
var BaseUrlApiConfigurationWithDefaults = class extends BaseUrlApiConfiguration {
  constructor({
    baseUrlDefaults,
    baseUrl,
    headers,
    retry,
    throttle,
    customCallHeaders
  }) {
    super({
      baseUrl: resolveBaseUrl(baseUrl, baseUrlDefaults),
      headers,
      retry,
      throttle,
      customCallHeaders
    });
  }
};
function parseBaseUrl(baseUrl) {
  const url = new URL(baseUrl);
  return {
    protocol: url.protocol.slice(0, -1),
    // remove trailing colon
    host: url.hostname,
    port: url.port,
    path: url.pathname
  };
}
function resolveBaseUrl(baseUrl = {}, baseUrlDefaults) {
  if (typeof baseUrl == "string") {
    return baseUrl;
  } else {
    return {
      protocol: baseUrl.protocol ?? baseUrlDefaults.protocol,
      host: baseUrl.host ?? baseUrlDefaults.host,
      port: baseUrl.port ?? baseUrlDefaults.port,
      path: baseUrl.path ?? baseUrlDefaults.path
    };
  }
}

// src/core/cache/MemoryCache.ts
var MemoryCache = class {
  cache = /* @__PURE__ */ new Map();
  hashKey(key) {
    return JSON.stringify(key);
  }
  async lookupValue(key) {
    return this.cache.get(this.hashKey(key)) ?? null;
  }
  async storeValue(key, value) {
    this.cache.set(this.hashKey(key), value);
  }
};

// src/core/executeFunctionCall.ts
import { nanoid as createId2 } from "nanoid";

// src/core/getFunctionCallLogger.ts
function getFunctionCallLogger(logging) {
  switch (logging) {
    case "basic-text":
      return [basicTextObserver];
    case "detailed-object":
      return [detailedObjectObserver];
    case "detailed-json":
      return [detailedJsonObserver];
    case "off":
    default:
      return [];
  }
}
var basicTextObserver = {
  onFunctionEvent(event) {
    const text13 = `[${event.timestamp.toISOString()}] ${event.callId}${event.functionId != null ? ` (${event.functionId})` : ""} - ${event.functionType} ${event.eventType}`;
    switch (event.eventType) {
      case "started": {
        console.log(text13);
        break;
      }
      case "finished": {
        console.log(`${text13} in ${event.durationInMs}ms`);
        break;
      }
    }
  }
};
var detailedObjectObserver = {
  onFunctionEvent(event) {
    if (event.eventType === "finished" && event.result != null && "rawResponse" in event.result && event.result?.rawResponse != null) {
      event = {
        ...event,
        result: Object.fromEntries(
          Object.entries(event.result).filter(([k]) => k !== "rawResponse")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )
      };
    }
    function cleanObject(obj) {
      if (obj instanceof Date || typeof obj === "string") {
        return obj;
      }
      if (Array.isArray(obj)) {
        return obj.map((item) => cleanObject(item));
      }
      if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => {
            if (v === void 0) {
              return [k, void 0];
            } else if (v instanceof Uint8Array) {
              return [k, "omitted<Uint8Array>"];
            } else if (Array.isArray(v) && v.length > 20 && v.every((v2) => typeof v2 === "number")) {
              return [k, "omitted<Array<number>>"];
            } else {
              return [k, cleanObject(v)];
            }
          }).filter(([_, v]) => v !== void 0)
        );
      }
      return obj;
    }
    const cleanedEvent = cleanObject(event);
    console.log(cleanedEvent);
  }
};
var detailedJsonObserver = {
  onFunctionEvent(event) {
    if (event.eventType === "finished" && event.result != null && "rawResponse" in event.result && event.result?.rawResponse != null) {
      event = {
        ...event,
        result: Object.fromEntries(
          Object.entries(event.result).filter(([k]) => k !== "rawResponse")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )
      };
    }
    event = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(event).filter(([_, v]) => v !== void 0)
    );
    console.log(JSON.stringify(event));
  }
};

// src/util/detectRuntime.ts
function detectRuntime() {
  const globalThisAny = globalThis;
  if (globalThisAny.EdgeRuntime) {
    return "vercel-edge";
  }
  if (globalThis.navigator?.userAgent === "Cloudflare-Workers") {
    return "cloudflare-workers";
  }
  if (globalThis.process?.release?.name === "node") {
    return "node";
  }
  if (globalThis.window) {
    return "browser";
  }
  return null;
}

// src/core/getRun.ts
var runStorage;
async function ensureLoaded() {
  if (detectRuntime() === "node" && !runStorage) {
    let AsyncLocalStorage;
    try {
      AsyncLocalStorage = (await import("async_hooks")).AsyncLocalStorage;
    } catch (error) {
      try {
        AsyncLocalStorage = __require("async_hooks").AsyncLocalStorage;
      } catch (error2) {
        throw new Error(`Failed to load 'async_hooks' module dynamically.`);
      }
    }
    runStorage = new AsyncLocalStorage();
  }
  return Promise.resolve();
}
async function getRun(run) {
  await ensureLoaded();
  return run ?? runStorage?.getStore();
}
async function withRun(run, callback) {
  await ensureLoaded();
  if (runStorage != null) {
    await runStorage.run(run, () => callback(run));
  } else {
    await callback(run);
  }
}

// src/util/DurationMeasurement.ts
function startDurationMeasurement() {
  return globalThis.performance != null ? new PerformanceNowDurationMeasurement() : new DateDurationMeasurement();
}
var PerformanceNowDurationMeasurement = class {
  startTime = globalThis.performance.now();
  get startEpochSeconds() {
    return Math.floor(
      (globalThis.performance.timeOrigin + this.startTime) / 1e3
    );
  }
  get startDate() {
    return new Date(this.startEpochSeconds * 1e3);
  }
  get durationInMs() {
    return Math.ceil(globalThis.performance.now() - this.startTime);
  }
};
var DateDurationMeasurement = class {
  startTime = Date.now();
  get startEpochSeconds() {
    return Math.floor(this.startTime / 1e3);
  }
  get startDate() {
    return new Date(this.startTime);
  }
  get durationInMs() {
    return Date.now() - this.startTime;
  }
};

// src/util/runSafe.ts
var runSafe = async (f) => {
  try {
    return { ok: true, value: await f() };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, isAborted: true };
    }
    return { ok: false, error };
  }
};

// src/core/executeFunctionCall.ts
async function executeFunctionCall({
  options,
  input,
  functionType,
  execute,
  inputPropertyName = "input",
  outputPropertyName = "value"
}) {
  const run = await getRun(options?.run);
  const eventSource = new FunctionEventSource({
    observers: [
      ...getFunctionCallLogger(options?.logging ?? getLogFormat()),
      ...getFunctionObservers(),
      ...run?.functionObserver != null ? [run.functionObserver] : [],
      ...options?.observers ?? []
    ],
    errorHandler: run?.errorHandler
  });
  const durationMeasurement = startDurationMeasurement();
  const startMetadata = {
    functionType,
    callId: `call-${createId2()}`,
    parentCallId: options?.callId,
    runId: run?.runId,
    sessionId: run?.sessionId,
    userId: run?.userId,
    functionId: options?.functionId,
    [inputPropertyName]: input,
    timestamp: durationMeasurement.startDate,
    startTimestamp: durationMeasurement.startDate
  };
  eventSource.notify({
    eventType: "started",
    ...startMetadata
  });
  const result = await runSafe(
    () => execute({
      functionType,
      functionId: options?.functionId,
      callId: startMetadata.callId,
      logging: options?.logging,
      observers: options?.observers,
      run
    })
  );
  const finishMetadata = {
    eventType: "finished",
    ...startMetadata,
    finishTimestamp: /* @__PURE__ */ new Date(),
    durationInMs: durationMeasurement.durationInMs
  };
  if (!result.ok) {
    if (result.isAborted) {
      eventSource.notify({
        ...finishMetadata,
        eventType: "finished",
        result: {
          status: "abort"
        }
      });
      throw new AbortError();
    }
    eventSource.notify({
      ...finishMetadata,
      eventType: "finished",
      result: {
        status: "error",
        error: result.error
      }
    });
    throw result.error;
  }
  eventSource.notify({
    ...finishMetadata,
    eventType: "finished",
    result: {
      status: "success",
      [outputPropertyName]: result.value
    }
  });
  return result.value;
}

// src/core/executeFunction.ts
async function executeFunction(fn, input, options) {
  return executeFunctionCall({
    options,
    input,
    functionType: "execute-function",
    execute: async (options2) => fn(input, options2)
  });
}

// src/core/schema/JSONParseError.ts
var JSONParseError = class extends Error {
  // note: property order determines debugging output
  text;
  cause;
  constructor({ text: text13, cause }) {
    super(
      `JSON parsing failed: Text: ${text13}.
Error message: ${getErrorMessage(cause)}`
    );
    this.name = "JSONParseError";
    this.cause = cause;
    this.text = text13;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      stack: this.stack,
      valueText: this.text
    };
  }
};

// src/core/schema/TypeValidationError.ts
var TypeValidationError = class extends Error {
  value;
  cause;
  constructor({ value, cause }) {
    super(
      `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage(cause)}`
    );
    this.name = "TypeValidationError";
    this.cause = cause;
    this.value = value;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      stack: this.stack,
      value: this.value
    };
  }
};

// src/core/schema/UncheckedSchema.ts
function uncheckedSchema(jsonSchema) {
  return new UncheckedSchema(jsonSchema);
}
var UncheckedSchema = class {
  constructor(jsonSchema) {
    this.jsonSchema = jsonSchema;
  }
  validate(value) {
    return { success: true, value };
  }
  getJsonSchema() {
    return this.jsonSchema;
  }
  _type;
};

// src/core/schema/ZodSchema.ts
import { zodToJsonSchema } from "zod-to-json-schema";
function zodSchema(zodSchema2) {
  return new ZodSchema(zodSchema2);
}
var ZodSchema = class {
  zodSchema;
  constructor(zodSchema2) {
    this.zodSchema = zodSchema2;
  }
  validate(value) {
    const result = this.zodSchema.safeParse(value);
    return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
  }
  getJsonSchema() {
    return zodToJsonSchema(this.zodSchema);
  }
  /**
   * Use only for typing purposes. The value is always `undefined`.
   */
  _type;
  /**
   * Use only for typing purposes. The value is always `undefined`.
   */
  _partialType;
};

// src/core/schema/parseJSON.ts
import SecureJSON from "secure-json-parse";

// src/core/schema/validateTypes.ts
function validateTypes({
  value,
  schema
}) {
  try {
    const validationResult = schema.validate(value);
    if (!validationResult.success) {
      throw new TypeValidationError({
        value,
        cause: validationResult.error
      });
    }
    return validationResult.value;
  } catch (error) {
    if (error instanceof TypeValidationError) {
      throw error;
    }
    throw new TypeValidationError({ value, cause: error });
  }
}
function safeValidateTypes({
  value,
  schema
}) {
  try {
    const validationResult = schema.validate(value);
    if (validationResult.success) {
      return validationResult;
    }
    return {
      success: false,
      error: new TypeValidationError({
        value,
        cause: validationResult.error
      })
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof TypeValidationError ? error : new TypeValidationError({ value, cause: error })
    };
  }
}

// src/core/schema/parseJSON.ts
function parseJSON({
  text: text13,
  schema
}) {
  try {
    const value = SecureJSON.parse(text13);
    if (schema == null) {
      return value;
    }
    return validateTypes({ value, schema });
  } catch (error) {
    if (error instanceof JSONParseError || error instanceof TypeValidationError) {
      throw error;
    }
    throw new JSONParseError({ text: text13, cause: error });
  }
}
function safeParseJSON({
  text: text13,
  schema
}) {
  try {
    const value = SecureJSON.parse(text13);
    if (schema == null) {
      return {
        success: true,
        value
      };
    }
    return safeValidateTypes({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: error instanceof JSONParseError ? error : new JSONParseError({ text: text13, cause: error })
    };
  }
}

// src/util/cosineSimilarity.ts
function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error(
      `Vectors must have the same length (a: ${a.length}, b: ${b.length})`
    );
  }
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
}
function dotProduct(a, b) {
  return a.reduce(
    (acc, val, i) => acc + val * b[i],
    0
  );
}
function magnitude(a) {
  return Math.sqrt(dotProduct(a, a));
}

// src/model-function/executeStandardCall.ts
import { nanoid as createId3 } from "nanoid";
async function executeStandardCall({
  model,
  options,
  input,
  functionType,
  generateResponse
}) {
  const run = await getRun(options?.run);
  const settings = model.settings;
  const eventSource = new FunctionEventSource({
    observers: [
      ...getFunctionCallLogger(options?.logging ?? getLogFormat()),
      ...getFunctionObservers(),
      ...settings.observers ?? [],
      ...run?.functionObserver != null ? [run.functionObserver] : [],
      ...options?.observers ?? []
    ],
    errorHandler: run?.errorHandler
  });
  const durationMeasurement = startDurationMeasurement();
  const startMetadata = {
    functionType,
    callId: `call-${createId3()}`,
    parentCallId: options?.callId,
    runId: run?.runId,
    sessionId: run?.sessionId,
    userId: run?.userId,
    functionId: options?.functionId,
    model: model.modelInformation,
    settings: model.settingsForEvent,
    input,
    timestamp: durationMeasurement.startDate,
    startTimestamp: durationMeasurement.startDate
  };
  eventSource.notify({
    eventType: "started",
    ...startMetadata
  });
  const result = await runSafe(
    () => generateResponse({
      functionType,
      functionId: options?.functionId,
      callId: startMetadata.callId,
      logging: options?.logging,
      observers: options?.observers,
      cache: options?.cache,
      run
    })
  );
  const finishMetadata = {
    eventType: "finished",
    ...startMetadata,
    finishTimestamp: /* @__PURE__ */ new Date(),
    durationInMs: durationMeasurement.durationInMs
  };
  if (!result.ok) {
    if (result.isAborted) {
      eventSource.notify({
        ...finishMetadata,
        eventType: "finished",
        result: {
          status: "abort"
        }
      });
      throw new AbortError();
    }
    eventSource.notify({
      ...finishMetadata,
      eventType: "finished",
      result: {
        status: "error",
        error: result.error
      }
    });
    throw result.error;
  }
  const rawResponse = result.value.rawResponse;
  const value = result.value.extractedValue;
  const usage = result.value.usage;
  eventSource.notify({
    ...finishMetadata,
    eventType: "finished",
    result: {
      status: "success",
      usage,
      rawResponse,
      value
    }
  });
  return {
    value,
    rawResponse,
    metadata: {
      model: model.modelInformation,
      callId: finishMetadata.callId,
      runId: finishMetadata.runId,
      sessionId: finishMetadata.sessionId,
      userId: finishMetadata.userId,
      functionId: finishMetadata.functionId,
      startTimestamp: startMetadata.startTimestamp,
      finishTimestamp: finishMetadata.finishTimestamp,
      durationInMs: finishMetadata.durationInMs,
      usage
    }
  };
}

// src/model-function/embed/embed.ts
async function embedMany({
  model,
  values,
  fullResponse,
  ...options
}) {
  const callResponse = await executeStandardCall({
    functionType: "embed",
    input: values,
    model,
    options,
    generateResponse: async (options2) => {
      const maxValuesPerCall = model.maxValuesPerCall;
      const valueGroups = [];
      if (maxValuesPerCall == null) {
        valueGroups.push(values);
      } else {
        for (let i = 0; i < values.length; i += maxValuesPerCall) {
          valueGroups.push(values.slice(i, i + maxValuesPerCall));
        }
      }
      let responses;
      if (model.isParallelizable) {
        responses = await Promise.all(
          valueGroups.map(
            (valueGroup) => model.doEmbedValues(valueGroup, options2)
          )
        );
      } else {
        responses = [];
        for (const valueGroup of valueGroups) {
          const response = await model.doEmbedValues(valueGroup, options2);
          responses.push(response);
        }
      }
      const rawResponses = responses.map((response) => response.rawResponse);
      const embeddings = [];
      for (const response of responses) {
        embeddings.push(...response.embeddings);
      }
      return {
        rawResponse: rawResponses,
        extractedValue: embeddings
      };
    }
  });
  return fullResponse ? {
    embeddings: callResponse.value,
    rawResponse: callResponse.rawResponse,
    metadata: callResponse.metadata
  } : callResponse.value;
}
async function embed({
  model,
  value,
  fullResponse,
  ...options
}) {
  const callResponse = await executeStandardCall({
    functionType: "embed",
    input: value,
    model,
    options,
    generateResponse: async (options2) => {
      const result = await model.doEmbedValues([value], options2);
      return {
        rawResponse: result.rawResponse,
        extractedValue: result.embeddings[0]
      };
    }
  });
  return fullResponse ? {
    embedding: callResponse.value,
    rawResponse: callResponse.rawResponse,
    metadata: callResponse.metadata
  } : callResponse.value;
}

// src/model-function/classify/EmbeddingSimilarityClassifier.ts
var EmbeddingSimilarityClassifier = class _EmbeddingSimilarityClassifier {
  settings;
  modelInformation = {
    provider: "modelfusion",
    modelName: "EmbeddingSimilarityClassifier"
  };
  embeddings;
  constructor(settings) {
    this.settings = settings;
  }
  async getEmbeddings(options) {
    if (this.embeddings != null) {
      return this.embeddings;
    }
    const embeddings = [];
    for (const cluster of this.settings.clusters) {
      const clusterEmbeddings = await embedMany({
        model: this.settings.embeddingModel,
        values: cluster.values,
        ...options
      });
      for (let i = 0; i < clusterEmbeddings.length; i++) {
        embeddings.push({
          embedding: clusterEmbeddings[i],
          clusterValue: cluster.values[i],
          clusterName: cluster.name
        });
      }
    }
    this.embeddings = embeddings;
    return embeddings;
  }
  async doClassify(value, options) {
    const valueEmbedding = await embed({
      model: this.settings.embeddingModel,
      value,
      ...options
    });
    const clusterEmbeddings = await this.getEmbeddings(options);
    const allMatches = [];
    for (const embedding of clusterEmbeddings) {
      const similarity = cosineSimilarity(valueEmbedding, embedding.embedding);
      if (similarity >= this.settings.similarityThreshold) {
        allMatches.push({
          similarity,
          clusterValue: embedding.clusterValue,
          clusterName: embedding.clusterName
        });
      }
    }
    allMatches.sort((a, b) => b.similarity - a.similarity);
    return {
      class: allMatches.length > 0 ? allMatches[0].clusterName : null,
      rawResponse: void 0
    };
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      "clusters",
      "embeddingModel",
      "similarityThreshold"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  withSettings(additionalSettings) {
    return new _EmbeddingSimilarityClassifier(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};

// src/model-function/classify/classify.ts
async function classify({
  model,
  value,
  fullResponse,
  ...options
}) {
  const callResponse = await executeStandardCall({
    functionType: "classify",
    input: value,
    model,
    options,
    generateResponse: async (options2) => {
      const result = await model.doClassify(value, options2);
      return {
        rawResponse: result.rawResponse,
        extractedValue: result.class
      };
    }
  });
  return fullResponse ? {
    class: callResponse.value,
    rawResponse: callResponse.rawResponse,
    metadata: callResponse.metadata
  } : callResponse.value;
}

// src/model-function/generate-image/PromptTemplateImageGenerationModel.ts
var PromptTemplateImageGenerationModel = class _PromptTemplateImageGenerationModel {
  model;
  promptTemplate;
  constructor({
    model,
    promptTemplate
  }) {
    this.model = model;
    this.promptTemplate = promptTemplate;
  }
  get modelInformation() {
    return this.model.modelInformation;
  }
  get settings() {
    return this.model.settings;
  }
  doGenerateImages(prompt, options) {
    const mappedPrompt = this.promptTemplate.format(prompt);
    return this.model.doGenerateImages(mappedPrompt, options);
  }
  get settingsForEvent() {
    return this.model.settingsForEvent;
  }
  withPromptTemplate(promptTemplate) {
    return new _PromptTemplateImageGenerationModel({ model: this, promptTemplate });
  }
  withSettings(additionalSettings) {
    return new _PromptTemplateImageGenerationModel({
      model: this.model.withSettings(additionalSettings),
      promptTemplate: this.promptTemplate
    });
  }
};

// src/util/format/UInt8Utils.ts
function base64ToUint8Array(base64String) {
  return Uint8Array.from(
    globalThis.atob(base64UrlToBase64(base64String)),
    (x) => x.codePointAt(0)
  );
}
var MAX_BLOCK_SIZE = 65535;
function uint8ArrayToBase64(array) {
  let base64;
  if (array.length < MAX_BLOCK_SIZE) {
    base64 = globalThis.btoa(String.fromCodePoint(...array));
  } else {
    base64 = "";
    for (const value of array) {
      base64 += String.fromCodePoint(value);
    }
    base64 = globalThis.btoa(base64);
  }
  return base64;
}
function base64UrlToBase64(base64url) {
  return base64url.replaceAll("-", "+").replaceAll("_", "/");
}

// src/model-function/generate-image/generateImage.ts
async function generateImage({
  model,
  prompt,
  fullResponse,
  ...options
}) {
  const callResponse = await executeStandardCall({
    functionType: "generate-image",
    input: prompt,
    model,
    options,
    generateResponse: async (options2) => {
      const result = await model.doGenerateImages(prompt, options2);
      return {
        rawResponse: result.rawResponse,
        extractedValue: result.base64Images
      };
    }
  });
  const imagesBase64 = callResponse.value;
  const images = imagesBase64.map(base64ToUint8Array);
  return fullResponse ? {
    image: images[0],
    imageBase64: imagesBase64[0],
    images,
    imagesBase64,
    rawResponse: callResponse.rawResponse,
    metadata: callResponse.metadata
  } : images[0];
}

// src/model-function/generate-speech/generateSpeech.ts
async function generateSpeech({
  model,
  text: text13,
  fullResponse,
  ...options
}) {
  const callResponse = await executeStandardCall({
    functionType: "generate-speech",
    input: text13,
    model,
    options,
    generateResponse: async (options2) => {
      const response = await model.doGenerateSpeechStandard(text13, options2);
      return {
        rawResponse: response,
        extractedValue: response
      };
    }
  });
  return fullResponse ? {
    speech: callResponse.value,
    rawResponse: callResponse.rawResponse,
    metadata: callResponse.metadata
  } : callResponse.value;
}

// src/util/AsyncQueue.ts
var AsyncQueue = class {
  values = Array();
  pendingResolvers = [];
  closed = false;
  processPendingResolvers() {
    while (this.pendingResolvers.length > 0) {
      this.pendingResolvers.shift()?.();
    }
  }
  /**
   * Pushes an element onto the queue. If the queue is closed, an error is thrown.
   *
   * @param {T} value - The element to add to the queue.
   * @throws {Error} Throws an error if the queue is closed.
   * @example
   * queue.push(2);
   */
  push(value) {
    if (this.closed) {
      throw new Error("Cannot push value to closed queue.");
    }
    this.values.push({ type: "value", value });
    this.processPendingResolvers();
  }
  error(error) {
    if (this.closed) {
      throw new Error("Cannot push error to closed queue.");
    }
    this.values.push({ type: "error", error });
    this.processPendingResolvers();
  }
  /**
   * Closes the queue, preventing more elements from being pushed onto it.
   *
   * @example
   * queue.close();
   */
  close() {
    this.closed = true;
    this.processPendingResolvers();
  }
  /**
   * Creates and returns an async iterator that allows the queue to be consumed.
   * You can create multiple iterators for the same queue.
   *
   * @returns {AsyncIterator<T>} An async iterator for the queue.
   * @example
   * (async () => {
   *   for await (const value of queue) {
   *     console.log(value);
   *   }
   * })();
   */
  [Symbol.asyncIterator]() {
    let position = 0;
    return {
      next: () => new Promise((resolve, reject) => {
        const attemptResolve = () => {
          if (position < this.values.length) {
            const entry = this.values[position++];
            switch (entry.type) {
              case "value":
                resolve({ value: entry.value, done: false });
                break;
              case "error":
                reject(entry.error);
                break;
            }
          } else if (this.closed) {
            resolve({ value: void 0, done: true });
          } else {
            this.pendingResolvers.push(attemptResolve);
          }
        };
        attemptResolve();
      })
    };
  }
};

// src/model-function/executeStreamCall.ts
import { nanoid as createId4 } from "nanoid";
async function executeStreamCall({
  model,
  options,
  input,
  functionType,
  startStream,
  processDelta,
  processFinished,
  onDone
}) {
  const run = await getRun(options?.run);
  const settings = model.settings;
  const eventSource = new FunctionEventSource({
    observers: [
      ...getFunctionCallLogger(options?.logging ?? getLogFormat()),
      ...getFunctionObservers(),
      ...settings.observers ?? [],
      ...run?.functionObserver != null ? [run.functionObserver] : [],
      ...options?.observers ?? []
    ],
    errorHandler: run?.errorHandler
  });
  const durationMeasurement = startDurationMeasurement();
  const startMetadata = {
    functionType,
    callId: `call-${createId4()}`,
    parentCallId: options?.callId,
    runId: run?.runId,
    sessionId: run?.sessionId,
    userId: run?.userId,
    functionId: options?.functionId,
    model: model.modelInformation,
    settings: model.settingsForEvent,
    input,
    timestamp: durationMeasurement.startDate,
    startTimestamp: durationMeasurement.startDate
  };
  eventSource.notify({
    eventType: "started",
    ...startMetadata
  });
  const result = await runSafe(async () => {
    const deltaIterable = await startStream({
      functionType,
      functionId: options?.functionId,
      callId: startMetadata.callId,
      logging: options?.logging,
      observers: options?.observers,
      run
    });
    const responseQueue = new AsyncQueue();
    (async function() {
      try {
        const loopResult = await runSafe(async () => {
          for await (const event of deltaIterable) {
            if (event?.type === "error") {
              const error = event.error;
              const finishMetadata2 = {
                eventType: "finished",
                ...startMetadata,
                finishTimestamp: /* @__PURE__ */ new Date(),
                durationInMs: durationMeasurement.durationInMs
              };
              eventSource.notify(
                error instanceof AbortError ? {
                  ...finishMetadata2,
                  result: { status: "abort" }
                } : {
                  ...finishMetadata2,
                  result: { status: "error", error }
                }
              );
              throw error;
            }
            if (event?.type === "delta") {
              const value = processDelta(event);
              if (value !== void 0) {
                responseQueue.push(value);
              }
            }
          }
          if (processFinished != null) {
            const value = processFinished();
            if (value !== void 0) {
              responseQueue.push(value);
            }
          }
        });
        if (!loopResult.ok) {
          const finishMetadata2 = {
            eventType: "finished",
            ...startMetadata,
            finishTimestamp: /* @__PURE__ */ new Date(),
            durationInMs: durationMeasurement.durationInMs
          };
          if (loopResult.isAborted) {
            eventSource.notify({
              ...finishMetadata2,
              eventType: "finished",
              result: {
                status: "abort"
              }
            });
            responseQueue.error(new AbortError());
            return;
          }
          eventSource.notify({
            ...finishMetadata2,
            eventType: "finished",
            result: {
              status: "error",
              error: loopResult.error
            }
          });
          responseQueue.error(loopResult.error);
          return;
        }
        onDone?.();
        const finishMetadata = {
          eventType: "finished",
          ...startMetadata,
          finishTimestamp: /* @__PURE__ */ new Date(),
          durationInMs: durationMeasurement.durationInMs
        };
        eventSource.notify({
          ...finishMetadata,
          result: {
            status: "success"
          }
        });
      } finally {
        responseQueue.close();
      }
    })();
    return {
      stream: responseQueue
    };
  });
  if (!result.ok) {
    const finishMetadata = {
      eventType: "finished",
      ...startMetadata,
      finishTimestamp: /* @__PURE__ */ new Date(),
      durationInMs: durationMeasurement.durationInMs
    };
    if (result.isAborted) {
      eventSource.notify({
        ...finishMetadata,
        eventType: "finished",
        result: {
          status: "abort"
        }
      });
      throw new AbortError();
    }
    eventSource.notify({
      ...finishMetadata,
      eventType: "finished",
      result: {
        status: "error",
        error: result.error
      }
    });
    throw result.error;
  }
  return {
    value: result.value.stream,
    metadata: startMetadata
  };
}

// src/model-function/generate-speech/streamSpeech.ts
async function streamSpeech({
  model,
  text: text13,
  fullResponse,
  ...options
}) {
  let textStream;
  if (typeof text13 === "string") {
    const queue = new AsyncQueue();
    queue.push(text13);
    queue.close();
    textStream = queue;
  } else {
    textStream = text13;
  }
  const callResponse = await executeStreamCall({
    functionType: "stream-speech",
    input: text13,
    model,
    options,
    startStream: async (options2) => model.doGenerateSpeechStreamDuplex(textStream, options2),
    processDelta: (delta) => delta.deltaValue
  });
  return fullResponse ? {
    speechStream: callResponse.value,
    metadata: callResponse.metadata
  } : callResponse.value;
}

// src/model-function/generate-text/generateText.ts
async function generateText({
  model,
  prompt,
  fullResponse,
  ...options
}) {
  const expandedPrompt = await expandPrompt(prompt);
  const callResponse = await executeStandardCall({
    functionType: "generate-text",
    input: expandedPrompt,
    model,
    options,
    generateResponse: async (options2) => {
      async function getGeneratedTexts() {
        if (options2?.cache == null) {
          return {
            ...await model.doGenerateTexts(expandedPrompt.prompt, options2),
            cache: void 0
          };
        }
        let cacheErrors = void 0;
        const cacheKey = {
          functionType: "generate-text",
          functionId: options2?.functionId,
          input: {
            model,
            settings: model.settingsForEvent,
            // TODO should include full model information
            prompt: expandedPrompt.prompt
          }
        };
        try {
          const cachedRawResponse = await options2.cache.lookupValue(cacheKey);
          if (cachedRawResponse != null) {
            return {
              ...model.restoreGeneratedTexts(cachedRawResponse),
              cache: { status: "hit" }
            };
          }
        } catch (err) {
          cacheErrors = [err];
        }
        const result2 = await model.doGenerateTexts(
          expandedPrompt.prompt,
          options2
        );
        try {
          await options2.cache.storeValue(cacheKey, result2.rawResponse);
        } catch (err) {
          cacheErrors = [...cacheErrors ?? [], err];
        }
        return {
          ...result2,
          cache: { status: "miss", errors: cacheErrors }
        };
      }
      const result = await getGeneratedTexts();
      const shouldTrimWhitespace = model.settings.trimWhitespace ?? true;
      const textGenerationResults2 = shouldTrimWhitespace ? result.textGenerationResults.map((textGeneration) => ({
        text: textGeneration.text.trim(),
        finishReason: textGeneration.finishReason
      })) : result.textGenerationResults;
      return {
        rawResponse: result.rawResponse,
        extractedValue: textGenerationResults2,
        usage: result.usage
      };
    }
  });
  const textGenerationResults = callResponse.value;
  const firstResult = textGenerationResults[0];
  return fullResponse ? {
    text: firstResult.text,
    finishReason: firstResult.finishReason,
    texts: textGenerationResults.map(
      (textGeneration) => textGeneration.text
    ),
    textGenerationResults,
    rawResponse: callResponse.rawResponse,
    metadata: callResponse.metadata
  } : firstResult.text;
}

// src/model-function/generate-object/ObjectParseError.ts
var ObjectParseError = class extends Error {
  cause;
  valueText;
  constructor({ valueText, cause }) {
    super(
      `Object parsing failed. Value: ${valueText}.
Error message: ${getErrorMessage(cause)}`
    );
    this.name = "ObjectParseError";
    this.cause = cause;
    this.valueText = valueText;
  }
  toJSON() {
    return {
      name: this.name,
      cause: this.cause,
      message: this.message,
      stack: this.stack,
      valueText: this.valueText
    };
  }
};

// src/model-function/generate-object/ObjectFromTextGenerationModel.ts
var ObjectFromTextGenerationModel = class _ObjectFromTextGenerationModel {
  model;
  template;
  constructor({
    model,
    template
  }) {
    this.model = model;
    this.template = template;
  }
  get modelInformation() {
    return this.model.modelInformation;
  }
  get settings() {
    return this.model.settings;
  }
  get settingsForEvent() {
    return this.model.settingsForEvent;
  }
  getModelWithJsonOutput(schema) {
    if (this.template.withJsonOutput != null) {
      return this.template.withJsonOutput({
        model: this.model,
        schema
      });
    }
    return this.model;
  }
  async doGenerateObject(schema, prompt, options) {
    const { rawResponse, text: text13 } = await generateText({
      model: this.getModelWithJsonOutput(schema),
      prompt: this.template.createPrompt(prompt, schema),
      fullResponse: true,
      ...options
    });
    try {
      return {
        rawResponse,
        value: this.template.extractObject(text13),
        valueText: text13
      };
    } catch (error) {
      throw new ObjectParseError({
        valueText: text13,
        cause: error
      });
    }
  }
  withSettings(additionalSettings) {
    return new _ObjectFromTextGenerationModel({
      model: this.model.withSettings(additionalSettings),
      template: this.template
    });
  }
};

// src/model-function/generate-text/streamText.ts
async function streamText({
  model,
  prompt,
  fullResponse,
  ...options
}) {
  const shouldTrimWhitespace = model.settings.trimWhitespace ?? true;
  let accumulatedText = "";
  let isFirstDelta = true;
  let trailingWhitespace = "";
  let resolveText;
  const textPromise = new Promise((resolve) => {
    resolveText = resolve;
  });
  const expandedPrompt = await expandPrompt(prompt);
  const callResponse = await executeStreamCall({
    functionType: "stream-text",
    input: expandedPrompt,
    model,
    options,
    startStream: async (options2) => model.doStreamText(expandedPrompt.prompt, options2),
    processDelta: (delta) => {
      let textDelta = model.extractTextDelta(delta.deltaValue);
      if (textDelta == null || textDelta.length === 0) {
        return void 0;
      }
      if (shouldTrimWhitespace) {
        textDelta = isFirstDelta ? (
          // remove leading whitespace:
          textDelta.trimStart()
        ) : (
          // restore trailing whitespace from previous chunk:
          trailingWhitespace + textDelta
        );
        const trailingWhitespaceMatch = textDelta.match(/\s+$/);
        trailingWhitespace = trailingWhitespaceMatch ? trailingWhitespaceMatch[0] : "";
        textDelta = textDelta.trimEnd();
      }
      isFirstDelta = false;
      accumulatedText += textDelta;
      return textDelta;
    },
    onDone: () => {
      resolveText(accumulatedText);
    }
  });
  return fullResponse ? {
    textStream: callResponse.value,
    textPromise,
    metadata: callResponse.metadata
  } : callResponse.value;
}

// src/util/parsePartialJson.ts
import SecureJSON2 from "secure-json-parse";

// src/util/fixJson.ts
function fixJson(input) {
  const stack = ["ROOT"];
  let lastValidIndex = -1;
  let literalStart = null;
  function processValueStart(char, i, swapState) {
    {
      switch (char) {
        case '"': {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_STRING");
          break;
        }
        case "f":
        case "t":
        case "n": {
          lastValidIndex = i;
          literalStart = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_LITERAL");
          break;
        }
        case "-": {
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "{": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_OBJECT_START");
          break;
        }
        case "[": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_ARRAY_START");
          break;
        }
      }
    }
  }
  function processAfterObjectValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  function processAfterArrayValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_ARRAY_AFTER_COMMA");
        break;
      }
      case "]": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const currentState = stack[stack.length - 1];
    switch (currentState) {
      case "ROOT":
        processValueStart(char, i, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
          case "}": {
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (char) {
          case ":": {
            stack.pop();
            stack.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        processAfterObjectValue(char, i);
        break;
      }
      case "INSIDE_STRING": {
        switch (char) {
          case '"': {
            stack.pop();
            lastValidIndex = i;
            break;
          }
          case "\\": {
            stack.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default: {
            lastValidIndex = i;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (char) {
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (char) {
          case ",": {
            stack.pop();
            stack.push("INSIDE_ARRAY_AFTER_COMMA");
            break;
          }
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        stack.pop();
        lastValidIndex = i;
        break;
      }
      case "INSIDE_NUMBER": {
        switch (char) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            lastValidIndex = i;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".": {
            break;
          }
          case ",": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "}": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "]": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            break;
          }
          default: {
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, i + 1);
        if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
          stack.pop();
          if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
            processAfterObjectValue(char, i);
          } else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
            processAfterArrayValue(char, i);
          }
        } else {
          lastValidIndex = i;
        }
        break;
      }
    }
  }
  let result = input.slice(0, lastValidIndex + 1);
  for (let i = stack.length - 1; i >= 0; i--) {
    const state = stack[i];
    switch (state) {
      case "INSIDE_STRING": {
        result += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        result += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        result += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, input.length);
        if ("true".startsWith(partialLiteral)) {
          result += "true".slice(partialLiteral.length);
        } else if ("false".startsWith(partialLiteral)) {
          result += "false".slice(partialLiteral.length);
        } else if ("null".startsWith(partialLiteral)) {
          result += "null".slice(partialLiteral.length);
        }
      }
    }
  }
  return result;
}

// src/util/parsePartialJson.ts
function parsePartialJson(jsonText) {
  if (jsonText == null) {
    return void 0;
  }
  try {
    return SecureJSON2.parse(jsonText);
  } catch (ignored) {
    try {
      const fixedJsonText = fixJson(jsonText);
      return SecureJSON2.parse(fixedJsonText);
    } catch (ignored2) {
    }
  }
  return void 0;
}

// src/model-function/generate-object/ObjectFromTextStreamingModel.ts
var ObjectFromTextStreamingModel = class _ObjectFromTextStreamingModel extends ObjectFromTextGenerationModel {
  constructor(options) {
    super(options);
  }
  async doStreamObject(schema, prompt, options) {
    const textStream = await streamText({
      model: this.getModelWithJsonOutput(schema),
      prompt: this.template.createPrompt(prompt, schema),
      ...options
    });
    const queue = new AsyncQueue();
    (async () => {
      try {
        for await (const deltaText of textStream) {
          queue.push({ type: "delta", deltaValue: deltaText });
        }
      } catch (error) {
        queue.push({ type: "error", error });
      } finally {
        queue.close();
      }
    })();
    return queue;
  }
  extractObjectTextDelta(delta) {
    return delta;
  }
  parseAccumulatedObjectText(accumulatedText) {
    return parsePartialJson(accumulatedText);
  }
  withSettings(additionalSettings) {
    return new _ObjectFromTextStreamingModel({
      model: this.model.withSettings(additionalSettings),
      template: this.template
    });
  }
};

// src/model-function/generate-object/ObjectStream.ts
var ObjectStreamResponse = class extends Response {
  constructor(stream, init) {
    super(ObjectStreamToTextStream(stream), {
      ...init,
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
};
async function* ObjectStreamFromResponse({
  response
}) {
  let text13 = "";
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done)
      break;
    text13 += new TextDecoder().decode(value);
    const partialObject = parsePartialJson(text13);
    yield { partialObject };
  }
}
function ObjectStreamToTextStream(stream) {
  const textEncoder2 = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const { textDelta } of stream) {
          controller.enqueue(textEncoder2.encode(textDelta));
        }
      } finally {
        controller.close();
      }
    }
  });
}

// src/model-function/generate-object/ObjectValidationError.ts
var ObjectValidationError = class extends Error {
  cause;
  valueText;
  value;
  constructor({
    value,
    valueText,
    cause
  }) {
    super(
      `Object validation failed. Value: ${valueText}.
Error message: ${getErrorMessage(cause)}`
    );
    this.name = "ObjectValidationError";
    this.cause = cause;
    this.value = value;
    this.valueText = valueText;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      stack: this.stack,
      value: this.value,
      valueText: this.valueText
    };
  }
};

// src/model-function/generate-object/generateObject.ts
async function generateObject({
  model,
  schema,
  prompt,
  fullResponse,
  ...options
}) {
  const resolvedPrompt = typeof prompt === "function" && !isPromptFunction(prompt) ? prompt(schema) : prompt;
  const expandedPrompt = await expandPrompt(resolvedPrompt);
  const callResponse = await executeStandardCall({
    functionType: "generate-object",
    input: {
      schema,
      ...expandedPrompt
    },
    model,
    options,
    generateResponse: async (options2) => {
      const result = await model.doGenerateObject(
        schema,
        expandedPrompt.prompt,
        options2
      );
      const parseResult = schema.validate(result.value);
      if (!parseResult.success) {
        throw new ObjectValidationError({
          valueText: result.valueText,
          value: result.value,
          cause: parseResult.error
        });
      }
      const value = parseResult.value;
      return {
        rawResponse: result.rawResponse,
        extractedValue: value,
        usage: result.usage
      };
    }
  });
  return fullResponse ? {
    value: callResponse.value,
    rawResponse: callResponse.rawResponse,
    metadata: callResponse.metadata
  } : callResponse.value;
}

// src/model-function/generate-object/jsonObjectPrompt.ts
var DEFAULT_SCHEMA_PREFIX = "JSON schema:";
var DEFAULT_SCHEMA_SUFFIX = "\nYou MUST answer with a JSON object that matches the JSON schema above.";
var jsonObjectPrompt = {
  custom(createPrompt) {
    return { createPrompt, extractObject };
  },
  text({
    schemaPrefix,
    schemaSuffix
  } = {}) {
    return {
      createPrompt: (prompt, schema) => ({
        system: createSystemPrompt({ schema, schemaPrefix, schemaSuffix }),
        instruction: prompt
      }),
      extractObject,
      adaptModel: (model) => model.withInstructionPrompt(),
      withJsonOutput: ({ model, schema }) => model.withJsonOutput(schema)
    };
  },
  instruction({
    schemaPrefix,
    schemaSuffix
  } = {}) {
    return {
      createPrompt: (prompt, schema) => ({
        system: createSystemPrompt({
          originalSystemPrompt: prompt.system,
          schema,
          schemaPrefix,
          schemaSuffix
        }),
        instruction: prompt.instruction
      }),
      extractObject,
      adaptModel: (model) => model.withInstructionPrompt(),
      withJsonOutput: ({ model, schema }) => model.withJsonOutput(schema)
    };
  }
};
function createSystemPrompt({
  originalSystemPrompt,
  schema,
  schemaPrefix = DEFAULT_SCHEMA_PREFIX,
  schemaSuffix = DEFAULT_SCHEMA_SUFFIX
}) {
  return [
    originalSystemPrompt,
    originalSystemPrompt != null ? "" : null,
    schemaPrefix,
    JSON.stringify(schema.getJsonSchema()),
    schemaSuffix
  ].filter(Boolean).join("\n");
}
function extractObject(response) {
  return parseJSON({ text: response });
}

// src/util/isDeepEqualData.ts
function isDeepEqualData(obj1, obj2) {
  if (obj1 === obj2)
    return true;
  if (obj1 == null || obj2 == null)
    return false;
  if (typeof obj1 !== "object" && typeof obj2 !== "object")
    return obj1 === obj2;
  if (obj1.constructor !== obj2.constructor)
    return false;
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length)
      return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!isDeepEqualData(obj1[i], obj2[i]))
        return false;
    }
    return true;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length)
    return false;
  for (const key of keys1) {
    if (!keys2.includes(key))
      return false;
    if (!isDeepEqualData(obj1[key], obj2[key]))
      return false;
  }
  return true;
}

// src/model-function/generate-object/streamObject.ts
async function streamObject({
  model,
  schema,
  prompt,
  fullResponse,
  ...options
}) {
  const resolvedPrompt = typeof prompt === "function" && !isPromptFunction(prompt) ? prompt(schema) : prompt;
  const expandedPrompt = await expandPrompt(resolvedPrompt);
  let accumulatedText = "";
  let accumulatedTextDelta = "";
  let latestObject;
  let resolveObject;
  let rejectObject;
  const objectPromise = new Promise((resolve, reject) => {
    resolveObject = resolve;
    rejectObject = reject;
  });
  const callResponse = await executeStreamCall({
    functionType: "stream-object",
    input: {
      schema,
      ...expandedPrompt
    },
    model,
    options,
    startStream: async (options2) => model.doStreamObject(schema, expandedPrompt.prompt, options2),
    processDelta(delta) {
      const textDelta = model.extractObjectTextDelta(delta.deltaValue);
      if (textDelta == null) {
        return void 0;
      }
      accumulatedText += textDelta;
      accumulatedTextDelta += textDelta;
      const currentObject = model.parseAccumulatedObjectText(accumulatedText);
      if (!isDeepEqualData(latestObject, currentObject)) {
        latestObject = currentObject;
        const currentAccumulatedTextDelta = accumulatedTextDelta;
        accumulatedTextDelta = "";
        return {
          partialObject: latestObject,
          partialText: accumulatedText,
          textDelta: currentAccumulatedTextDelta
        };
      }
      return void 0;
    },
    // The last object is processed and returned, even if it was already returned previously.
    // The reason is that the full text delta should be returned (and no characters should be omitted).
    processFinished() {
      return {
        partialObject: latestObject,
        partialText: accumulatedText,
        textDelta: accumulatedTextDelta
      };
    },
    onDone() {
      const parseResult = schema.validate(latestObject);
      if (parseResult.success) {
        resolveObject(parseResult.value);
      } else {
        rejectObject(parseResult.error);
      }
    }
  });
  return fullResponse ? {
    objectStream: callResponse.value,
    objectPromise,
    metadata: callResponse.metadata
  } : callResponse.value;
}

// src/tool/generate-tool-call/ToolCallParseError.ts
var ToolCallParseError = class extends Error {
  toolName;
  valueText;
  cause;
  constructor({
    toolName,
    valueText,
    cause
  }) {
    super(
      `Tool call parsing failed for '${toolName}'. Value: ${valueText}.
Error message: ${getErrorMessage(cause)}`
    );
    this.name = "ToolCallParseError";
    this.toolName = toolName;
    this.cause = cause;
    this.valueText = valueText;
  }
  toJSON() {
    return {
      name: this.name,
      cause: this.cause,
      message: this.message,
      stack: this.stack,
      toolName: this.toolName,
      valueText: this.valueText
    };
  }
};

// src/tool/generate-tool-call/TextGenerationToolCallModel.ts
var TextGenerationToolCallModel = class _TextGenerationToolCallModel {
  model;
  template;
  constructor({
    model,
    template
  }) {
    this.model = model;
    this.template = template;
  }
  get modelInformation() {
    return this.model.modelInformation;
  }
  get settings() {
    return this.model.settings;
  }
  get settingsForEvent() {
    return this.model.settingsForEvent;
  }
  getModelWithJsonOutput(schema) {
    if (this.template.withJsonOutput != null) {
      return this.template.withJsonOutput({
        model: this.model,
        schema
      });
    }
    return this.model;
  }
  async doGenerateToolCall(tool, prompt, options) {
    const { rawResponse, text: text13, metadata } = await generateText({
      model: this.getModelWithJsonOutput(tool.parameters),
      prompt: this.template.createPrompt(prompt, tool),
      fullResponse: true,
      ...options
    });
    try {
      return {
        rawResponse,
        toolCall: this.template.extractToolCall(text13, tool),
        usage: metadata?.usage
      };
    } catch (error) {
      throw new ToolCallParseError({
        toolName: tool.name,
        valueText: text13,
        cause: error
      });
    }
  }
  withSettings(additionalSettings) {
    return new _TextGenerationToolCallModel({
      model: this.model.withSettings(additionalSettings),
      template: this.template
    });
  }
};

// src/tool/generate-tool-calls/ToolCallsParseError.ts
var ToolCallsParseError = class extends Error {
  valueText;
  cause;
  constructor({ valueText, cause }) {
    super(
      `Tool calls parsing failed. Value: ${valueText}.
Error message: ${getErrorMessage(cause)}`
    );
    this.name = "ToolCallsParseError";
    this.cause = cause;
    this.valueText = valueText;
  }
  toJSON() {
    return {
      name: this.name,
      cause: this.cause,
      message: this.message,
      stack: this.stack,
      valueText: this.valueText
    };
  }
};

// src/tool/generate-tool-calls/TextGenerationToolCallsModel.ts
var TextGenerationToolCallsModel = class _TextGenerationToolCallsModel {
  model;
  template;
  constructor({
    model,
    template
  }) {
    this.model = model;
    this.template = template;
  }
  get modelInformation() {
    return this.model.modelInformation;
  }
  get settings() {
    return this.model.settings;
  }
  get settingsForEvent() {
    return this.model.settingsForEvent;
  }
  async doGenerateToolCalls(tools, prompt, options) {
    const {
      rawResponse,
      text: generatedText,
      metadata
    } = await generateText({
      model: this.model,
      prompt: this.template.createPrompt(prompt, tools),
      fullResponse: true,
      ...options
    });
    try {
      const { text: text13, toolCalls } = this.template.extractToolCallsAndText(generatedText);
      return {
        rawResponse,
        text: text13,
        toolCalls,
        usage: metadata?.usage
      };
    } catch (error) {
      throw new ToolCallsParseError({
        valueText: generatedText,
        cause: error
      });
    }
  }
  withSettings(additionalSettings) {
    return new _TextGenerationToolCallsModel({
      model: this.model.withSettings(additionalSettings),
      template: this.template
    });
  }
};

// src/model-function/generate-text/PromptTemplateTextGenerationModel.ts
var PromptTemplateTextGenerationModel = class _PromptTemplateTextGenerationModel {
  model;
  promptTemplate;
  constructor({
    model,
    promptTemplate
  }) {
    this.model = model;
    this.promptTemplate = promptTemplate;
  }
  get modelInformation() {
    return this.model.modelInformation;
  }
  get settings() {
    return this.model.settings;
  }
  get tokenizer() {
    return this.model.tokenizer;
  }
  get contextWindowSize() {
    return this.model.contextWindowSize;
  }
  get countPromptTokens() {
    const originalCountPromptTokens = this.model.countPromptTokens?.bind(
      this.model
    );
    if (originalCountPromptTokens === void 0) {
      return void 0;
    }
    return (prompt) => originalCountPromptTokens(
      this.promptTemplate.format(prompt)
    );
  }
  doGenerateTexts(prompt, options) {
    const mappedPrompt = this.promptTemplate.format(prompt);
    return this.model.doGenerateTexts(mappedPrompt, options);
  }
  restoreGeneratedTexts(rawResponse) {
    return this.model.restoreGeneratedTexts(rawResponse);
  }
  get settingsForEvent() {
    return this.model.settingsForEvent;
  }
  asToolCallGenerationModel(promptTemplate) {
    return new TextGenerationToolCallModel({
      model: this,
      template: promptTemplate
    });
  }
  asToolCallsOrTextGenerationModel(promptTemplate) {
    return new TextGenerationToolCallsModel({
      model: this,
      template: promptTemplate
    });
  }
  asObjectGenerationModel(promptTemplate) {
    return new ObjectFromTextGenerationModel({
      model: this,
      template: promptTemplate
    });
  }
  withJsonOutput(schema) {
    return new _PromptTemplateTextGenerationModel({
      model: this.model.withJsonOutput(schema),
      promptTemplate: this.promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _PromptTemplateTextGenerationModel({
      model: this.model.withSettings(additionalSettings),
      promptTemplate: this.promptTemplate
    });
  }
};

// src/model-function/generate-text/PromptTemplateTextStreamingModel.ts
var PromptTemplateTextStreamingModel = class _PromptTemplateTextStreamingModel extends PromptTemplateTextGenerationModel {
  constructor(options) {
    super(options);
  }
  doStreamText(prompt, options) {
    const mappedPrompt = this.promptTemplate.format(prompt);
    return this.model.doStreamText(mappedPrompt, options);
  }
  extractTextDelta(delta) {
    return this.model.extractTextDelta(delta);
  }
  asObjectGenerationModel(promptTemplate) {
    return new ObjectFromTextStreamingModel({
      model: this,
      template: promptTemplate
    });
  }
  withJsonOutput(schema) {
    return new _PromptTemplateTextStreamingModel({
      model: this.model.withJsonOutput(schema),
      promptTemplate: this.promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _PromptTemplateTextStreamingModel({
      model: this.model.withSettings(additionalSettings),
      promptTemplate: this.promptTemplate
    });
  }
};

// src/model-function/generate-text/PromptTemplateFullTextModel.ts
var PromptTemplateFullTextModel = class _PromptTemplateFullTextModel extends PromptTemplateTextStreamingModel {
  constructor(options) {
    super(options);
  }
  doGenerateToolCall(tool, prompt, options) {
    const mappedPrompt = this.promptTemplate.format(prompt);
    return this.model.doGenerateToolCall(tool, mappedPrompt, options);
  }
  doGenerateToolCalls(tools, prompt, options) {
    const mappedPrompt = this.promptTemplate.format(prompt);
    return this.model.doGenerateToolCalls(tools, mappedPrompt, options);
  }
  withSettings(additionalSettings) {
    return new _PromptTemplateFullTextModel({
      model: this.model.withSettings(additionalSettings),
      promptTemplate: this.promptTemplate
    });
  }
};

// src/model-function/generate-text/TextGenerationModel.ts
var textGenerationModelProperties = [
  "maxGenerationTokens",
  "stopSequences",
  "numberOfGenerations",
  "trimWhitespace"
];

// src/model-function/generate-text/prompt-template/AlpacaPromptTemplate.ts
var AlpacaPromptTemplate_exports = {};
__export(AlpacaPromptTemplate_exports, {
  chat: () => chat,
  instruction: () => instruction,
  text: () => text
});

// src/model-function/generate-text/prompt-template/InvalidPromptError.ts
var InvalidPromptError = class extends Error {
  prompt;
  constructor(message, prompt) {
    super(message);
    this.name = "InvalidPromptError";
    this.prompt = prompt;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      prompt: this.prompt
    };
  }
};

// src/model-function/generate-text/prompt-template/ContentPart.ts
function validateContentIsString(content, prompt) {
  if (typeof content !== "string") {
    throw new InvalidPromptError(
      "Only text prompts are are supported by this prompt template.",
      prompt
    );
  }
  return content;
}

// src/model-function/generate-text/prompt-template/AlpacaPromptTemplate.ts
var DEFAULT_SYSTEM_PROMPT_INPUT = "Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.";
var DEFAULT_SYSTEM_PROMPT_NO_INPUT = "Below is an instruction that describes a task. Write a response that appropriately completes the request.";
function text() {
  return {
    stopSequences: [],
    format(prompt) {
      let text13 = DEFAULT_SYSTEM_PROMPT_NO_INPUT;
      text13 += "\n\n### Instruction:\n";
      text13 += prompt;
      text13 += "\n\n### Response:\n";
      return text13;
    }
  };
}
function instruction() {
  return {
    stopSequences: [],
    format(prompt) {
      let text13 = prompt.system ?? (prompt.input != null ? DEFAULT_SYSTEM_PROMPT_INPUT : DEFAULT_SYSTEM_PROMPT_NO_INPUT);
      text13 += "\n\n### Instruction:\n";
      if (prompt.system != null) {
        text13 += `${prompt.system}
`;
      }
      text13 += validateContentIsString(prompt.instruction, prompt);
      if (prompt.input != null) {
        text13 += `

### Input:
${prompt.input}`;
      }
      text13 += "\n\n### Response:\n";
      if (prompt.responsePrefix != null) {
        text13 += `${prompt.responsePrefix}
`;
      }
      return text13;
    }
  };
}
function chat() {
  throw new Error("Chat prompts are not supported by the Alpaca format.");
}

// src/model-function/generate-text/prompt-template/ChatMLPromptTemplate.ts
var ChatMLPromptTemplate_exports = {};
__export(ChatMLPromptTemplate_exports, {
  chat: () => chat2,
  instruction: () => instruction2,
  text: () => text2
});
var START_SEGMENT = "<|im_start|>";
var END_SEGMENT = "<|im_end|>";
function segmentStart(role) {
  return `${START_SEGMENT}${role}
`;
}
function segment(role, text13) {
  return text13 == null ? "" : `${segmentStart(role)}${text13}${END_SEGMENT}
`;
}
function text2() {
  return {
    stopSequences: [END_SEGMENT],
    format(prompt) {
      return segment("user", prompt) + segmentStart("assistant");
    }
  };
}
function instruction2() {
  return {
    stopSequences: [END_SEGMENT],
    format(prompt) {
      const instruction13 = validateContentIsString(prompt.instruction, prompt);
      return segment("system", prompt.system) + segment("user", instruction13) + segmentStart("assistant") + (prompt.responsePrefix ?? "");
    }
  };
}
function chat2() {
  return {
    format(prompt) {
      let text13 = prompt.system != null ? segment("system", prompt.system) : "";
      for (const { role, content } of prompt.messages) {
        switch (role) {
          case "user": {
            text13 += segment("user", validateContentIsString(content, prompt));
            break;
          }
          case "assistant": {
            text13 += segment(
              "assistant",
              validateContentIsString(content, prompt)
            );
            break;
          }
          case "tool": {
            throw new InvalidPromptError(
              "Tool messages are not supported.",
              prompt
            );
          }
          default: {
            const _exhaustiveCheck = role;
            throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
          }
        }
      }
      text13 += segmentStart("assistant");
      return text13;
    },
    stopSequences: [END_SEGMENT]
  };
}

// src/model-function/generate-text/prompt-template/ChatPrompt.ts
var ChatMessage = {
  user({ text: text13 }) {
    return {
      role: "user",
      content: text13
    };
  },
  tool({
    toolResults
  }) {
    return {
      role: "tool",
      content: createToolContent({ toolResults })
    };
  },
  assistant({
    text: text13,
    toolResults
  }) {
    return {
      role: "assistant",
      content: createAssistantContent({ text: text13, toolResults })
    };
  }
};
function createToolContent({
  toolResults
}) {
  const toolContent = [];
  for (const { result, toolCall } of toolResults ?? []) {
    toolContent.push({
      type: "tool-response",
      id: toolCall.id,
      response: result
    });
  }
  return toolContent;
}
function createAssistantContent({
  text: text13,
  toolResults
}) {
  const content = [];
  if (text13 != null) {
    content.push({ type: "text", text: text13 });
  }
  for (const { toolCall } of toolResults ?? []) {
    content.push({ type: "tool-call", ...toolCall });
  }
  return content;
}
function createChatPrompt(promptFunction) {
  return (input) => markAsPromptFunction(async () => ({
    input,
    prompt: await promptFunction(input)
  }));
}

// src/model-function/generate-text/prompt-template/InstructionPrompt.ts
function createInstructionPrompt(promptFunction) {
  return (input) => markAsPromptFunction(async () => ({
    input,
    prompt: await promptFunction(input)
  }));
}

// src/model-function/generate-text/prompt-template/Llama2PromptTemplate.ts
var Llama2PromptTemplate_exports = {};
__export(Llama2PromptTemplate_exports, {
  chat: () => chat3,
  instruction: () => instruction3,
  text: () => text3,
  validateLlama2Prompt: () => validateLlama2Prompt
});
var BEGIN_SEGMENT = "<s>";
var END_SEGMENT2 = " </s>";
var BEGIN_INSTRUCTION = "[INST] ";
var END_INSTRUCTION = " [/INST] ";
var BEGIN_SYSTEM = "<<SYS>>\n";
var END_SYSTEM = "\n<</SYS>>\n\n";
function text3() {
  return {
    stopSequences: [END_SEGMENT2],
    format(prompt) {
      return `${BEGIN_SEGMENT}${BEGIN_INSTRUCTION}${prompt}${END_INSTRUCTION}`;
    }
  };
}
function instruction3() {
  return {
    stopSequences: [END_SEGMENT2],
    format(prompt) {
      const instruction13 = validateContentIsString(prompt.instruction, prompt);
      return `${BEGIN_SEGMENT}${BEGIN_INSTRUCTION}${prompt.system != null ? `${BEGIN_SYSTEM}${prompt.system}${END_SYSTEM}` : ""}${instruction13}${END_INSTRUCTION}${prompt.responsePrefix ?? ""}`;
    }
  };
}
function chat3() {
  return {
    format(prompt) {
      validateLlama2Prompt(prompt);
      const content = prompt.messages[0].content;
      let text13 = `${BEGIN_SEGMENT}${BEGIN_INSTRUCTION}${prompt.system != null ? `${BEGIN_SYSTEM}${prompt.system}${END_SYSTEM}` : ""}${content}${END_INSTRUCTION}`;
      for (let i = 1; i < prompt.messages.length; i++) {
        const { role, content: content2 } = prompt.messages[i];
        switch (role) {
          case "user": {
            const textContent = validateContentIsString(content2, prompt);
            text13 += `${BEGIN_SEGMENT}${BEGIN_INSTRUCTION}${textContent}${END_INSTRUCTION}`;
            break;
          }
          case "assistant": {
            text13 += `${validateContentIsString(content2, prompt)}${END_SEGMENT2}`;
            break;
          }
          case "tool": {
            throw new InvalidPromptError(
              "Tool messages are not supported.",
              prompt
            );
          }
          default: {
            const _exhaustiveCheck = role;
            throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
          }
        }
      }
      return text13;
    },
    stopSequences: [END_SEGMENT2]
  };
}
function validateLlama2Prompt(chatPrompt) {
  const messages = chatPrompt.messages;
  if (messages.length < 1) {
    throw new InvalidPromptError(
      "ChatPrompt should have at least one message.",
      chatPrompt
    );
  }
  for (let i = 0; i < messages.length; i++) {
    const expectedRole = i % 2 === 0 ? "user" : "assistant";
    const role = messages[i].role;
    if (role !== expectedRole) {
      throw new InvalidPromptError(
        `Message at index ${i} should have role '${expectedRole}', but has role '${role}'.`,
        chatPrompt
      );
    }
  }
  if (messages.length % 2 === 0) {
    throw new InvalidPromptError(
      "The last message must be a user message.",
      chatPrompt
    );
  }
}

// src/model-function/generate-text/prompt-template/MistralInstructPromptTemplate.ts
var MistralInstructPromptTemplate_exports = {};
__export(MistralInstructPromptTemplate_exports, {
  chat: () => chat4,
  instruction: () => instruction4,
  text: () => text4,
  validateMistralPrompt: () => validateMistralPrompt
});
var BEGIN_SEGMENT2 = "<s>";
var END_SEGMENT3 = "</s>";
var BEGIN_INSTRUCTION2 = "[INST] ";
var END_INSTRUCTION2 = " [/INST] ";
function text4() {
  return {
    stopSequences: [END_SEGMENT3],
    format(prompt) {
      return `${BEGIN_SEGMENT2}${BEGIN_INSTRUCTION2}${prompt}${END_INSTRUCTION2}`;
    }
  };
}
function instruction4() {
  return {
    stopSequences: [END_SEGMENT3],
    format(prompt) {
      const instruction13 = validateContentIsString(prompt.instruction, prompt);
      if (prompt.system != null) {
        return `${BEGIN_SEGMENT2}${BEGIN_INSTRUCTION2}${prompt.system}${END_INSTRUCTION2}${END_SEGMENT3}${BEGIN_INSTRUCTION2}${instruction13}${END_INSTRUCTION2}${prompt.responsePrefix ?? ""}`;
      }
      return `${BEGIN_SEGMENT2}${BEGIN_INSTRUCTION2}${instruction13}${END_INSTRUCTION2}${prompt.responsePrefix ?? ""}`;
    }
  };
}
function chat4() {
  return {
    format(prompt) {
      validateMistralPrompt(prompt);
      let text13 = "";
      let i = 0;
      if (prompt.system != null) {
        text13 += `${BEGIN_SEGMENT2}${BEGIN_INSTRUCTION2}${prompt.system}${END_INSTRUCTION2}${END_SEGMENT3}`;
      } else {
        text13 = `${BEGIN_SEGMENT2}${BEGIN_INSTRUCTION2}${prompt.messages[0].content}${END_INSTRUCTION2}`;
        if (prompt.messages.length > 1) {
          text13 += `${prompt.messages[1].content}${END_SEGMENT3}`;
        }
        i = 2;
      }
      for (; i < prompt.messages.length; i++) {
        const { role, content } = prompt.messages[i];
        switch (role) {
          case "user": {
            const textContent = validateContentIsString(content, prompt);
            text13 += `${BEGIN_INSTRUCTION2}${textContent}${END_INSTRUCTION2}`;
            break;
          }
          case "assistant": {
            text13 += validateContentIsString(content, prompt);
            break;
          }
          case "tool": {
            throw new InvalidPromptError(
              "Tool messages are not supported.",
              prompt
            );
          }
          default: {
            const _exhaustiveCheck = role;
            throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
          }
        }
      }
      return text13;
    },
    stopSequences: [END_SEGMENT3]
  };
}
function validateMistralPrompt(chatPrompt) {
  const messages = chatPrompt.messages;
  if (messages.length < 1) {
    throw new InvalidPromptError(
      "ChatPrompt should have at least one message.",
      chatPrompt
    );
  }
  for (let i = 0; i < messages.length; i++) {
    const expectedRole = i % 2 === 0 ? "user" : "assistant";
    const role = messages[i].role;
    if (role !== expectedRole) {
      throw new InvalidPromptError(
        `Message at index ${i} should have role '${expectedRole}', but has role '${role}'.`,
        chatPrompt
      );
    }
  }
  if (messages.length % 2 === 0) {
    throw new InvalidPromptError(
      "The last message must be a user message.",
      chatPrompt
    );
  }
}

// src/model-function/generate-text/prompt-template/NeuralChatPromptTemplate.ts
var NeuralChatPromptTemplate_exports = {};
__export(NeuralChatPromptTemplate_exports, {
  chat: () => chat5,
  instruction: () => instruction5,
  text: () => text5
});
var roleNames = {
  system: "System",
  user: "User",
  assistant: "Assistant"
};
function segmentStart2(role) {
  return `### ${roleNames[role]}:
`;
}
function segment2(role, text13) {
  return text13 == null ? "" : `${segmentStart2(role)}${text13}
`;
}
function text5() {
  return {
    stopSequences: [],
    format(prompt) {
      return segment2("user", prompt) + segmentStart2("assistant");
    }
  };
}
var instruction5 = () => ({
  stopSequences: [],
  format(prompt) {
    const instruction13 = validateContentIsString(prompt.instruction, prompt);
    return segment2("system", prompt.system) + segment2("user", instruction13) + segmentStart2("assistant") + (prompt.responsePrefix ?? "");
  }
});
function chat5() {
  return {
    format(prompt) {
      let text13 = prompt.system != null ? segment2("system", prompt.system) : "";
      for (const { role, content } of prompt.messages) {
        switch (role) {
          case "user": {
            const textContent = validateContentIsString(content, prompt);
            text13 += segment2("user", textContent);
            break;
          }
          case "assistant": {
            text13 += segment2(
              "assistant",
              validateContentIsString(content, prompt)
            );
            break;
          }
          case "tool": {
            throw new InvalidPromptError(
              "Tool messages are not supported.",
              prompt
            );
          }
          default: {
            const _exhaustiveCheck = role;
            throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
          }
        }
      }
      text13 += segmentStart2("assistant");
      return text13;
    },
    stopSequences: [`
${roleNames.user}:`]
  };
}

// src/model-function/generate-text/prompt-template/SynthiaPromptTemplate.ts
var SynthiaPromptTemplate_exports = {};
__export(SynthiaPromptTemplate_exports, {
  chat: () => chat6,
  instruction: () => instruction6,
  text: () => text6
});
var text6 = () => ({
  stopSequences: [],
  format: (prompt) => `USER: ${prompt}
ASSISTANT: `
});
var instruction6 = () => ({
  stopSequences: [`
USER:`],
  format(prompt) {
    let text13 = prompt.system != null ? `SYSTEM: ${prompt.system}
` : "";
    text13 += `USER: ${validateContentIsString(prompt.instruction, prompt)}
`;
    text13 += `ASSISTANT: ${prompt.responsePrefix ?? ""}`;
    return text13;
  }
});
var chat6 = () => ({
  format(prompt) {
    let text13 = prompt.system != null ? `SYSTEM: ${prompt.system}
` : "";
    for (const { role, content } of prompt.messages) {
      switch (role) {
        case "user": {
          text13 += `USER: ${validateContentIsString(content, prompt)}
`;
          break;
        }
        case "assistant": {
          text13 += `ASSISTANT: ${validateContentIsString(content, prompt)}
`;
          break;
        }
        case "tool": {
          throw new InvalidPromptError(
            "Tool messages are not supported.",
            prompt
          );
        }
        default: {
          const _exhaustiveCheck = role;
          throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
        }
      }
    }
    text13 += `ASSISTANT: `;
    return text13;
  },
  stopSequences: [`
USER:`]
});

// src/model-function/generate-text/prompt-template/TextPrompt.ts
function createTextPrompt(promptFunction) {
  return (input) => markAsPromptFunction(async () => ({
    input,
    prompt: await promptFunction(input)
  }));
}

// src/model-function/generate-text/prompt-template/TextPromptTemplate.ts
var TextPromptTemplate_exports = {};
__export(TextPromptTemplate_exports, {
  chat: () => chat7,
  instruction: () => instruction7,
  text: () => text7
});
var text7 = () => ({
  stopSequences: [],
  format: (prompt) => prompt
});
var instruction7 = () => ({
  stopSequences: [],
  format(prompt) {
    let text13 = "";
    if (prompt.system != null) {
      text13 += `${prompt.system}

`;
    }
    text13 += `${validateContentIsString(prompt.instruction, prompt)}

`;
    if (prompt.responsePrefix != null) {
      text13 += prompt.responsePrefix;
    }
    return text13;
  }
});
var chat7 = ({
  user = "user",
  assistant = "assistant",
  system
} = {}) => ({
  format(prompt) {
    let text13 = prompt.system != null ? `${system != null ? `${system}:` : ""}${prompt.system}

` : "";
    for (const { role, content } of prompt.messages) {
      switch (role) {
        case "user": {
          text13 += `${user}:
${validateContentIsString(content, prompt)}

`;
          break;
        }
        case "assistant": {
          text13 += `${assistant}:
${validateContentIsString(
            content,
            prompt
          )}

`;
          break;
        }
        case "tool": {
          throw new InvalidPromptError(
            "Tool messages are not supported.",
            prompt
          );
        }
        default: {
          const _exhaustiveCheck = role;
          throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
        }
      }
    }
    text13 += `${assistant}:
`;
    return text13;
  },
  stopSequences: [`
${user}:`]
});

// src/model-function/generate-text/prompt-template/VicunaPromptTemplate.ts
var VicunaPromptTemplate_exports = {};
__export(VicunaPromptTemplate_exports, {
  chat: () => chat8,
  instruction: () => instruction8,
  text: () => text8
});
var DEFAULT_SYSTEM_MESSAGE = "A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions.";
function text8() {
  return {
    stopSequences: [],
    format(prompt) {
      let text13 = DEFAULT_SYSTEM_MESSAGE;
      text13 += "\n\nUSER: ";
      text13 += prompt;
      text13 += "\n\nASSISTANT: ";
      return text13;
    }
  };
}
var instruction8 = () => ({
  stopSequences: [`
USER:`],
  format(prompt) {
    let text13 = prompt.system != null ? `${prompt.system}

` : `${DEFAULT_SYSTEM_MESSAGE}

`;
    text13 += `USER: ${validateContentIsString(prompt.instruction, prompt)}
`;
    text13 += `ASSISTANT: `;
    return text13;
  }
});
function chat8() {
  return {
    format(prompt) {
      let text13 = prompt.system != null ? `${prompt.system}

` : `${DEFAULT_SYSTEM_MESSAGE}

`;
      for (const { role, content } of prompt.messages) {
        switch (role) {
          case "user": {
            const textContent = validateContentIsString(content, prompt);
            text13 += `USER: ${textContent}
`;
            break;
          }
          case "assistant": {
            text13 += `ASSISTANT: ${validateContentIsString(content, prompt)}
`;
            break;
          }
          case "tool": {
            throw new InvalidPromptError(
              "Tool messages are not supported.",
              prompt
            );
          }
          default: {
            const _exhaustiveCheck = role;
            throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
          }
        }
      }
      text13 += `ASSISTANT: `;
      return text13;
    },
    stopSequences: [`
USER:`]
  };
}

// src/model-function/generate-text/prompt-template/trimChatPrompt.ts
async function trimChatPrompt({
  prompt,
  model,
  tokenLimit = model.contextWindowSize - (model.settings.maxGenerationTokens ?? model.contextWindowSize / 4)
}) {
  let minimalPrompt = {
    system: prompt.system,
    messages: [prompt.messages[prompt.messages.length - 1]]
    // last user message
  };
  const promptTokenCount = await model.countPromptTokens(minimalPrompt);
  if (promptTokenCount > tokenLimit) {
    return minimalPrompt;
  }
  const innerMessages = prompt.messages.slice(0, -1);
  for (let i = innerMessages.length - 1; i >= 0; i -= 2) {
    const assistantMessage = innerMessages[i];
    const userMessage = innerMessages[i - 1];
    const attemptedPrompt = {
      system: prompt.system,
      messages: [userMessage, assistantMessage, ...minimalPrompt.messages]
    };
    const tokenCount = await model.countPromptTokens(attemptedPrompt);
    if (tokenCount > tokenLimit) {
      break;
    }
    minimalPrompt = attemptedPrompt;
  }
  return minimalPrompt;
}

// src/model-function/generate-transcription/generateTranscription.ts
async function generateTranscription({
  model,
  audioData,
  mimeType,
  fullResponse,
  ...options
}) {
  const input = { mimeType, audioData };
  const callResponse = await executeStandardCall({
    functionType: "generate-transcription",
    input,
    model,
    options,
    generateResponse: async (options2) => {
      const result = await model.doTranscribe(input, options2);
      return {
        rawResponse: result.rawResponse,
        extractedValue: result.transcription
      };
    }
  });
  return fullResponse ? callResponse : callResponse.value;
}

// src/model-function/tokenize-text/countTokens.ts
async function countTokens(tokenizer, text13) {
  return (await tokenizer.tokenize(text13)).length;
}

// src/model-provider/automatic1111/Automatic1111ApiConfiguration.ts
var Automatic1111ApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      baseUrlDefaults: {
        protocol: "http",
        host: "127.0.0.1",
        port: "7860",
        path: "/sdapi/v1"
      }
    });
  }
};

// src/model-provider/automatic1111/Automatic1111Error.ts
import { z } from "zod";

// src/util/format/DataContent.ts
function convertDataContentToBase64String(content) {
  if (typeof content === "string") {
    return content;
  }
  if (content instanceof ArrayBuffer) {
    return uint8ArrayToBase64(new Uint8Array(content));
  }
  return uint8ArrayToBase64(content);
}
function convertDataContentToUint8Array(content) {
  if (content instanceof Uint8Array) {
    return content;
  }
  if (typeof content === "string") {
    return base64ToUint8Array(content);
  }
  if (content instanceof ArrayBuffer) {
    return new Uint8Array(content);
  }
  throw new Error(
    `Invalid data content. Expected a string, Uint8Array, ArrayBuffer, or Buffer, but got ${typeof content}.`
  );
}

// src/core/api/postToApi.ts
var createJsonErrorResponseHandler = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  if (responseBody.trim() === "") {
    return new ApiCallError({
      message: response.statusText,
      url,
      requestBodyValues,
      statusCode: response.status,
      responseBody,
      isRetryable: isRetryable?.(response)
    });
  }
  try {
    const parsedError = parseJSON({
      text: responseBody,
      schema: errorSchema
    });
    return new ApiCallError({
      message: errorToMessage(parsedError),
      url,
      requestBodyValues,
      statusCode: response.status,
      responseBody,
      data: parsedError,
      isRetryable: isRetryable?.(response, parsedError)
    });
  } catch (parseError) {
    return new ApiCallError({
      message: response.statusText,
      url,
      requestBodyValues,
      statusCode: response.status,
      responseBody,
      isRetryable: isRetryable?.(response)
    });
  }
};
var createTextErrorResponseHandler = ({
  isRetryable
} = {}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  return new ApiCallError({
    message: responseBody.trim() !== "" ? responseBody : response.statusText,
    url,
    requestBodyValues,
    statusCode: response.status,
    responseBody,
    isRetryable: isRetryable?.(response)
  });
};
var createJsonResponseHandler = (responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = safeParseJSON({
    text: responseBody,
    schema: responseSchema
  });
  if (!parsedResult.success) {
    throw new ApiCallError({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return parsedResult.value;
};
var createTextResponseHandler = () => async ({ response }) => response.text();
var createAudioMpegResponseHandler = () => async ({ response, url, requestBodyValues }) => {
  if (response.headers.get("Content-Type") !== "audio/mpeg") {
    throw new ApiCallError({
      message: "Invalid Content-Type (must be audio/mpeg)",
      statusCode: response.status,
      url,
      requestBodyValues
    });
  }
  return convertDataContentToUint8Array(await response.arrayBuffer());
};
var postJsonToApi = async ({
  url,
  headers,
  body,
  failedResponseHandler: failedResponseHandler2,
  successfulResponseHandler: successfulResponseHandler2,
  abortSignal
}) => postToApi({
  url,
  headers: {
    ...headers,
    "Content-Type": "application/json"
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler: failedResponseHandler2,
  successfulResponseHandler: successfulResponseHandler2,
  abortSignal
});
var postToApi = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler: successfulResponseHandler2,
  failedResponseHandler: failedResponseHandler2,
  abortSignal
}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: body.content,
      signal: abortSignal
    });
    if (!response.ok) {
      try {
        throw await failedResponseHandler2({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError" || error instanceof ApiCallError) {
            throw error;
          }
        }
        throw new ApiCallError({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          requestBodyValues: body.values
        });
      }
    }
    try {
      return await successfulResponseHandler2({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError" || error instanceof ApiCallError) {
          throw error;
        }
      }
      throw new ApiCallError({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw error;
      }
    }
    if (error instanceof TypeError && error.message === "fetch failed") {
      const cause = error.cause;
      if (cause != null) {
        throw new ApiCallError({
          message: `Cannot connect to API: ${cause.message}`,
          cause,
          url,
          requestBodyValues: body.values,
          isRetryable: true
        });
      }
    }
    throw error;
  }
};

// src/model-provider/automatic1111/Automatic1111Error.ts
var automatic1111ErrorDataSchema = z.object({
  error: z.string(),
  detail: z.string(),
  body: z.string(),
  errors: z.string()
});
var failedAutomatic1111CallResponseHandler = createJsonErrorResponseHandler({
  errorSchema: zodSchema(automatic1111ErrorDataSchema),
  errorToMessage: (error) => error.detail
});

// src/model-provider/automatic1111/Automatic1111Facade.ts
var Automatic1111Facade_exports = {};
__export(Automatic1111Facade_exports, {
  Api: () => Api,
  ImageGenerator: () => ImageGenerator
});

// src/model-provider/automatic1111/Automatic1111ImageGenerationModel.ts
import { z as z2 } from "zod";

// src/core/api/callWithRetryAndThrottle.ts
var callWithRetryAndThrottle = async ({
  retry = retryNever(),
  throttle = throttleOff(),
  call
}) => retry(async () => throttle(call));

// src/model-function/AbstractModel.ts
var AbstractModel = class {
  settings;
  constructor({ settings }) {
    this.settings = settings;
  }
  // implemented as a separate accessor to remove all other properties from the model
  get modelInformation() {
    return {
      provider: this.provider,
      modelName: this.modelName
    };
  }
};

// src/model-provider/automatic1111/Automatic1111ImageGenerationPrompt.ts
function mapBasicPromptToAutomatic1111Format() {
  return {
    format: (description) => ({ prompt: description })
  };
}

// src/model-provider/automatic1111/Automatic1111ImageGenerationModel.ts
var Automatic1111ImageGenerationModel = class _Automatic1111ImageGenerationModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "Automatic1111";
  get modelName() {
    return this.settings.model;
  }
  async callAPI(input, callOptions) {
    const api = this.settings.api ?? new Automatic1111ApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/txt2img`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          prompt: input.prompt,
          negative_prompt: input.negativePrompt,
          seed: this.settings.seed,
          batch_size: this.settings.numberOfGenerations,
          height: this.settings.height,
          width: this.settings.width,
          cfg_scale: this.settings.cfgScale,
          sampler_index: this.settings.sampler,
          steps: this.settings.steps,
          override_settings: {
            sd_model_checkpoint: this.settings.model
          }
        },
        failedResponseHandler: failedAutomatic1111CallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(Automatic1111ImageGenerationResponseSchema)
        ),
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      "height",
      "width",
      "sampler",
      "steps",
      "cfgScale",
      "seed"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  async doGenerateImages(prompt, options) {
    const rawResponse = await this.callAPI(prompt, options);
    return {
      rawResponse,
      base64Images: rawResponse.images
    };
  }
  withTextPrompt() {
    return this.withPromptTemplate(mapBasicPromptToAutomatic1111Format());
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateImageGenerationModel({
      model: this,
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _Automatic1111ImageGenerationModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var Automatic1111ImageGenerationResponseSchema = z2.object({
  images: z2.array(z2.string()),
  parameters: z2.object({}),
  info: z2.string()
});

// src/model-provider/automatic1111/Automatic1111Facade.ts
function Api(settings) {
  return new Automatic1111ApiConfiguration(settings);
}
function ImageGenerator(settings) {
  return new Automatic1111ImageGenerationModel(settings);
}

// src/core/api/LoadAPIKeyError.ts
var LoadAPIKeyError = class extends Error {
  constructor({ message }) {
    super(message);
    this.name = "LoadAPIKeyError";
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message
    };
  }
};

// src/core/api/loadApiKey.ts
function loadApiKey({
  apiKey,
  environmentVariableName,
  apiKeyParameterName = "apiKey",
  description
}) {
  if (apiKey != null) {
    return apiKey;
  }
  if (typeof process === "undefined") {
    throw new LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter into the API configuration. Environment variables is not supported in this environment.`
    });
  }
  apiKey = process.env[environmentVariableName];
  if (apiKey == null) {
    throw new LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter into the API configuration or set it as an environment variable named ${environmentVariableName}.`
    });
  }
  return apiKey;
}

// src/model-provider/cohere/CohereApiConfiguration.ts
var CohereApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      headers: {
        Authorization: `Bearer ${loadApiKey({
          apiKey: settings.apiKey,
          environmentVariableName: "COHERE_API_KEY",
          description: "Cohere"
        })}`
      },
      baseUrlDefaults: {
        protocol: "https",
        host: "api.cohere.ai",
        port: "443",
        path: "/v1"
      }
    });
  }
};

// src/model-provider/cohere/CohereError.ts
import { z as z3 } from "zod";
var cohereErrorDataSchema = z3.object({
  message: z3.string()
});
var failedCohereCallResponseHandler = createJsonErrorResponseHandler({
  errorSchema: zodSchema(cohereErrorDataSchema),
  errorToMessage: (error) => error.message
});

// src/model-provider/cohere/CohereFacade.ts
var CohereFacade_exports = {};
__export(CohereFacade_exports, {
  Api: () => Api2,
  TextEmbedder: () => TextEmbedder,
  TextGenerator: () => TextGenerator,
  Tokenizer: () => Tokenizer
});

// src/model-provider/cohere/CohereTextEmbeddingModel.ts
import { z as z5 } from "zod";

// src/model-provider/cohere/CohereTokenizer.ts
import { z as z4 } from "zod";
var CohereTokenizer = class {
  settings;
  constructor(settings) {
    this.settings = settings;
  }
  async callTokenizeAPI(text13, callOptions) {
    const api = this.settings.api ?? new CohereApiConfiguration();
    const abortSignal = callOptions?.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/tokenize`),
        headers: api.headers({
          functionType: "tokenize",
          functionId: callOptions?.functionId,
          run: callOptions?.run,
          callId: ""
        }),
        body: {
          model: this.settings.model,
          text: text13
        },
        failedResponseHandler: failedCohereCallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(cohereTokenizationResponseSchema)
        ),
        abortSignal
      })
    });
  }
  async callDeTokenizeAPI(tokens, callOptions) {
    const api = this.settings.api ?? new CohereApiConfiguration();
    const abortSignal = callOptions?.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/detokenize`),
        headers: api.headers({
          functionType: "detokenize",
          functionId: callOptions?.functionId,
          run: callOptions?.run,
          callId: ""
        }),
        body: {
          model: this.settings.model,
          tokens
        },
        failedResponseHandler: failedCohereCallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(cohereDetokenizationResponseSchema)
        ),
        abortSignal
      })
    });
  }
  async tokenize(text13) {
    return (await this.tokenizeWithTexts(text13)).tokens;
  }
  async tokenizeWithTexts(text13) {
    const response = await this.callTokenizeAPI(text13);
    return {
      tokens: response.tokens,
      tokenTexts: response.token_strings
    };
  }
  async detokenize(tokens) {
    const response = await this.callDeTokenizeAPI(tokens);
    return response.text;
  }
};
var cohereDetokenizationResponseSchema = z4.object({
  text: z4.string(),
  meta: z4.object({
    api_version: z4.object({
      version: z4.string()
    })
  })
});
var cohereTokenizationResponseSchema = z4.object({
  tokens: z4.array(z4.number()),
  token_strings: z4.array(z4.string()),
  meta: z4.object({
    api_version: z4.object({
      version: z4.string()
    })
  })
});

// src/model-provider/cohere/CohereTextEmbeddingModel.ts
var COHERE_TEXT_EMBEDDING_MODELS = {
  "embed-english-light-v2.0": {
    contextWindowSize: 512,
    dimensions: 1024
  },
  "embed-english-v2.0": {
    contextWindowSize: 512,
    dimensions: 4096
  },
  "embed-multilingual-v2.0": {
    contextWindowSize: 256,
    dimensions: 768
  },
  "embed-english-v3.0": {
    contextWindowSize: 512,
    dimensions: 1024
  },
  "embed-english-light-v3.0": {
    contextWindowSize: 512,
    dimensions: 384
  },
  "embed-multilingual-v3.0": {
    contextWindowSize: 512,
    dimensions: 1024
  },
  "embed-multilingual-light-v3.0": {
    contextWindowSize: 512,
    dimensions: 384
  }
};
var CohereTextEmbeddingModel = class _CohereTextEmbeddingModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
    this.contextWindowSize = COHERE_TEXT_EMBEDDING_MODELS[this.modelName].contextWindowSize;
    this.tokenizer = new CohereTokenizer({
      api: this.settings.api,
      model: this.settings.model
    });
    this.dimensions = COHERE_TEXT_EMBEDDING_MODELS[this.modelName].dimensions;
  }
  provider = "cohere";
  get modelName() {
    return this.settings.model;
  }
  maxValuesPerCall = 96;
  isParallelizable = true;
  dimensions;
  contextWindowSize;
  tokenizer;
  async tokenize(text13) {
    return this.tokenizer.tokenize(text13);
  }
  async tokenizeWithTexts(text13) {
    return this.tokenizer.tokenizeWithTexts(text13);
  }
  async detokenize(tokens) {
    return this.tokenizer.detokenize(tokens);
  }
  async callAPI(texts, callOptions) {
    if (texts.length > this.maxValuesPerCall) {
      throw new Error(
        `The Cohere embedding API only supports ${this.maxValuesPerCall} texts per API call.`
      );
    }
    const api = this.settings.api ?? new CohereApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/embed`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          model: this.settings.model,
          texts,
          input_type: this.settings.inputType,
          truncate: this.settings.truncate
        },
        failedResponseHandler: failedCohereCallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(cohereTextEmbeddingResponseSchema)
        ),
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    return {
      truncate: this.settings.truncate
    };
  }
  async doEmbedValues(texts, options) {
    const rawResponse = await this.callAPI(texts, options);
    return {
      rawResponse,
      embeddings: rawResponse.embeddings
    };
  }
  withSettings(additionalSettings) {
    return new _CohereTextEmbeddingModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var cohereTextEmbeddingResponseSchema = z5.object({
  id: z5.string(),
  texts: z5.array(z5.string()),
  embeddings: z5.array(z5.array(z5.number())),
  meta: z5.object({
    api_version: z5.object({
      version: z5.string()
    })
  })
});

// src/model-provider/cohere/CohereTextGenerationModel.ts
import { z as z6 } from "zod";

// src/util/streaming/parseJsonStream.ts
function parseJsonStream({
  schema,
  stream,
  process: process2,
  onDone
}) {
  function processLine(line) {
    process2(parseJSON({ text: line, schema }));
  }
  return (async () => {
    try {
      const reader = new ReadableStreamDefaultReader(stream);
      const utf8Decoder = new TextDecoder("utf-8");
      let unprocessedText = "";
      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) {
          break;
        }
        unprocessedText += utf8Decoder.decode(chunk, { stream: true });
        const processableLines = unprocessedText.split("\n");
        unprocessedText = processableLines.pop() ?? "";
        processableLines.forEach(processLine);
      }
      if (unprocessedText) {
        processLine(unprocessedText);
      }
    } finally {
      onDone?.();
    }
  })();
}

// src/util/streaming/parseJsonStreamAsAsyncIterable.ts
async function parseJsonStreamAsAsyncIterable({
  stream,
  schema
}) {
  const queue = new AsyncQueue();
  parseJsonStream({
    stream,
    schema,
    process(event) {
      queue.push({ type: "delta", deltaValue: event });
    },
    onDone() {
      queue.close();
    }
  });
  return queue;
}

// src/util/streaming/createJsonStreamResponseHandler.ts
var createJsonStreamResponseHandler = (schema) => ({ response }) => parseJsonStreamAsAsyncIterable({
  stream: response.body,
  schema
});

// src/model-provider/cohere/CohereTextGenerationModel.ts
var COHERE_TEXT_GENERATION_MODELS = {
  command: {
    contextWindowSize: 4096
  },
  "command-light": {
    contextWindowSize: 4096
  }
};
var CohereTextGenerationModel = class _CohereTextGenerationModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
    this.contextWindowSize = COHERE_TEXT_GENERATION_MODELS[this.settings.model].contextWindowSize;
    this.tokenizer = new CohereTokenizer({
      api: this.settings.api,
      model: this.settings.model
    });
  }
  provider = "cohere";
  get modelName() {
    return this.settings.model;
  }
  contextWindowSize;
  tokenizer;
  async countPromptTokens(input) {
    return countTokens(this.tokenizer, input);
  }
  async callAPI(prompt, callOptions, options) {
    const api = this.settings.api ?? new CohereApiConfiguration();
    const responseFormat = options.responseFormat;
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/generate`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          stream: responseFormat.stream,
          model: this.settings.model,
          prompt,
          num_generations: this.settings.numberOfGenerations,
          max_tokens: this.settings.maxGenerationTokens,
          temperature: this.settings.temperature,
          k: this.settings.k,
          p: this.settings.p,
          frequency_penalty: this.settings.frequencyPenalty,
          presence_penalty: this.settings.presencePenalty,
          end_sequences: this.settings.stopSequences,
          stop_sequences: this.settings.cohereStopSequences,
          return_likelihoods: this.settings.returnLikelihoods,
          logit_bias: this.settings.logitBias,
          truncate: this.settings.truncate
        },
        failedResponseHandler: failedCohereCallResponseHandler,
        successfulResponseHandler: responseFormat.handler,
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      ...textGenerationModelProperties,
      "temperature",
      "k",
      "p",
      "frequencyPenalty",
      "presencePenalty",
      "returnLikelihoods",
      "logitBias",
      "truncate",
      "cohereStopSequences"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  async doGenerateTexts(prompt, options) {
    return this.processTextGenerationResponse(
      await this.callAPI(prompt, options, {
        responseFormat: CohereTextGenerationResponseFormat.json
      })
    );
  }
  restoreGeneratedTexts(rawResponse) {
    return this.processTextGenerationResponse(
      validateTypes({
        value: rawResponse,
        schema: zodSchema(cohereTextGenerationResponseSchema)
      })
    );
  }
  processTextGenerationResponse(rawResponse) {
    return {
      rawResponse,
      textGenerationResults: rawResponse.generations.map((generation) => ({
        text: generation.text,
        finishReason: this.translateFinishReason(generation.finish_reason)
      }))
    };
  }
  translateFinishReason(finishReason) {
    switch (finishReason) {
      case "COMPLETE":
        return "stop";
      case "MAX_TOKENS":
        return "length";
      case "ERROR_TOXIC":
        return "content-filter";
      case "ERROR":
        return "error";
      default:
        return "unknown";
    }
  }
  doStreamText(prompt, options) {
    return this.callAPI(prompt, options, {
      responseFormat: CohereTextGenerationResponseFormat.deltaIterable
    });
  }
  extractTextDelta(delta) {
    const chunk = delta;
    return chunk.is_finished === true ? "" : chunk.text;
  }
  withJsonOutput() {
    return this;
  }
  withTextPrompt() {
    return this.withPromptTemplate(text7());
  }
  withInstructionPrompt() {
    return this.withPromptTemplate(instruction7());
  }
  withChatPrompt(options) {
    return this.withPromptTemplate(chat7(options));
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateTextStreamingModel({
      model: this.withSettings({
        stopSequences: [
          ...this.settings.stopSequences ?? [],
          ...promptTemplate.stopSequences
        ]
      }),
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _CohereTextGenerationModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var cohereTextGenerationResponseSchema = z6.object({
  id: z6.string(),
  generations: z6.array(
    z6.object({
      id: z6.string(),
      text: z6.string(),
      finish_reason: z6.string().optional()
    })
  ),
  prompt: z6.string(),
  meta: z6.object({
    api_version: z6.object({
      version: z6.string()
    })
  }).optional()
});
var cohereTextStreamChunkSchema = z6.discriminatedUnion("is_finished", [
  z6.object({
    text: z6.string(),
    is_finished: z6.literal(false)
  }),
  z6.object({
    is_finished: z6.literal(true),
    finish_reason: z6.string(),
    response: cohereTextGenerationResponseSchema
  })
]);
var CohereTextGenerationResponseFormat = {
  /**
   * Returns the response as a JSON object.
   */
  json: {
    stream: false,
    handler: createJsonResponseHandler(
      zodSchema(cohereTextGenerationResponseSchema)
    )
  },
  /**
   * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
   * of the response stream.
   */
  deltaIterable: {
    stream: true,
    handler: createJsonStreamResponseHandler(
      zodSchema(cohereTextStreamChunkSchema)
    )
  }
};

// src/model-provider/cohere/CohereFacade.ts
function Api2(settings) {
  return new CohereApiConfiguration(settings);
}
function TextGenerator(settings) {
  return new CohereTextGenerationModel(settings);
}
function TextEmbedder(settings) {
  return new CohereTextEmbeddingModel(settings);
}
function Tokenizer(settings) {
  return new CohereTokenizer(settings);
}

// src/model-provider/elevenlabs/ElevenLabsApiConfiguration.ts
var ElevenLabsApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      headers: {
        "xi-api-key": loadApiKey({
          apiKey: settings.apiKey,
          environmentVariableName: "ELEVENLABS_API_KEY",
          description: "ElevenLabs"
        })
      },
      baseUrlDefaults: {
        protocol: "https",
        host: "api.elevenlabs.io",
        port: "443",
        path: "/v1"
      }
    });
  }
  get apiKey() {
    return this.fixedHeadersValue["xi-api-key"];
  }
};

// src/model-provider/elevenlabs/ElevenLabsFacade.ts
var ElevenLabsFacade_exports = {};
__export(ElevenLabsFacade_exports, {
  Api: () => Api3,
  SpeechGenerator: () => SpeechGenerator
});

// src/model-provider/elevenlabs/ElevenLabsSpeechModel.ts
import { z as z7 } from "zod";

// src/util/SimpleWebSocket.ts
async function createSimpleWebSocket(url) {
  switch (detectRuntime()) {
    case "vercel-edge":
    case "cloudflare-workers":
    case "browser": {
      return new WebSocket(url);
    }
    case "node": {
      let WebSocket2;
      try {
        WebSocket2 = (await import("ws")).default;
      } catch (error) {
        try {
          WebSocket2 = __require("ws");
        } catch (error2) {
          throw new Error(`Failed to load 'ws' module dynamically.`);
        }
      }
      return new WebSocket2(url);
    }
    default: {
      throw new Error("Unknown runtime");
    }
  }
}

// src/model-provider/elevenlabs/ElevenLabsSpeechModel.ts
var defaultModel = "eleven_monolingual_v1";
var ElevenLabsSpeechModel = class _ElevenLabsSpeechModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "elevenlabs";
  get modelName() {
    return this.settings.voice;
  }
  async callAPI(text13, callOptions) {
    const api = this.settings.api ?? new ElevenLabsApiConfiguration();
    const abortSignal = callOptions?.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(
          `/text-to-speech/${this.settings.voice}${assembleQuery({
            optimize_streaming_latency: this.settings.optimizeStreamingLatency,
            output_format: this.settings.outputFormat
          })}`
        ),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          text: text13,
          model_id: this.settings.model ?? defaultModel,
          voice_settings: toApiVoiceSettings(this.settings.voiceSettings)
        },
        failedResponseHandler: createTextErrorResponseHandler(),
        successfulResponseHandler: createAudioMpegResponseHandler(),
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    return {
      model: this.settings.model,
      voice: this.settings.voice,
      voiceSettings: this.settings.voiceSettings
    };
  }
  doGenerateSpeechStandard(text13, options) {
    return this.callAPI(text13, options);
  }
  async doGenerateSpeechStreamDuplex(textStream) {
    const queue = new AsyncQueue();
    const model = this.settings.model ?? defaultModel;
    const socket = await createSimpleWebSocket(
      `wss://api.elevenlabs.io/v1/text-to-speech/${this.settings.voice}/stream-input${assembleQuery({
        model_id: model,
        optimize_streaming_latency: this.settings.optimizeStreamingLatency,
        output_format: this.settings.outputFormat
      })}`
    );
    socket.onopen = async () => {
      const api = this.settings.api ?? new ElevenLabsApiConfiguration();
      socket.send(
        JSON.stringify({
          // The JS WebSocket API does not support authorization headers, so we send the API key in the BOS message.
          // See https://stackoverflow.com/questions/4361173/http-headers-in-websockets-client-api
          xi_api_key: api.apiKey,
          text: " ",
          // first message
          voice_settings: toApiVoiceSettings(this.settings.voiceSettings),
          generation_config: toGenerationConfig(this.settings.generationConfig)
        })
      );
      let textBuffer = "";
      for await (const textDelta of textStream) {
        textBuffer += textDelta;
        const separator = textBuffer.lastIndexOf(". ");
        if (separator === -1) {
          continue;
        }
        const textToProcess = textBuffer.slice(0, separator);
        textBuffer = textBuffer.slice(separator + 1);
        socket.send(
          JSON.stringify({
            text: textToProcess,
            try_trigger_generation: true
          })
        );
      }
      if (textBuffer.length > 0) {
        socket.send(
          JSON.stringify({
            text: `${textBuffer} `,
            // append space
            try_trigger_generation: true
          })
        );
      }
      socket.send(JSON.stringify({ text: "" }));
    };
    socket.onmessage = (event) => {
      const parseResult = safeParseJSON({
        text: event.data,
        schema: zodSchema(streamingResponseSchema)
      });
      if (!parseResult.success) {
        queue.push({ type: "error", error: parseResult.error });
        return;
      }
      const response = parseResult.value;
      if ("error" in response) {
        queue.push({ type: "error", error: response });
        return;
      }
      if (!response.isFinal) {
        queue.push({
          type: "delta",
          deltaValue: base64ToUint8Array(response.audio)
        });
      }
    };
    socket.onerror = (error) => {
      queue.push({ type: "error", error });
    };
    socket.onclose = () => {
      queue.close();
    };
    return queue;
  }
  withSettings(additionalSettings) {
    return new _ElevenLabsSpeechModel({
      ...this.settings,
      ...additionalSettings
    });
  }
};
var streamingResponseSchema = z7.union([
  z7.object({
    audio: z7.string(),
    isFinal: z7.literal(false).nullable(),
    normalizedAlignment: z7.object({
      chars: z7.array(z7.string()),
      charStartTimesMs: z7.array(z7.number()),
      charDurationsMs: z7.array(z7.number())
    }).nullable()
  }),
  z7.object({
    isFinal: z7.literal(true)
  }),
  z7.object({
    message: z7.string(),
    error: z7.string(),
    code: z7.number()
  })
]);
function assembleQuery(parameters) {
  let query = "";
  let hasQuestionMark = false;
  for (const [key, value] of Object.entries(parameters)) {
    if (value == null) {
      continue;
    }
    if (!hasQuestionMark) {
      query += "?";
      hasQuestionMark = true;
    } else {
      query += "&";
    }
    query += `${key}=${value}`;
  }
  return query;
}
function toApiVoiceSettings(voiceSettings) {
  return voiceSettings != null ? {
    stability: voiceSettings.stability,
    similarity_boost: voiceSettings.similarityBoost,
    style: voiceSettings.style,
    use_speaker_boost: voiceSettings.useSpeakerBoost
  } : void 0;
}
function toGenerationConfig(generationConfig) {
  return generationConfig != null ? { chunk_length_schedule: generationConfig.chunkLengthSchedule } : void 0;
}

// src/model-provider/elevenlabs/ElevenLabsFacade.ts
function Api3(settings) {
  return new ElevenLabsApiConfiguration(settings);
}
function SpeechGenerator(settings) {
  return new ElevenLabsSpeechModel(settings);
}

// src/model-provider/huggingface/HuggingFaceApiConfiguration.ts
var HuggingFaceApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      headers: {
        Authorization: `Bearer ${loadApiKey({
          apiKey: settings.apiKey,
          environmentVariableName: "HUGGINGFACE_API_KEY",
          description: "Hugging Face"
        })}`
      },
      baseUrlDefaults: {
        protocol: "https",
        host: "api-inference.huggingface.co",
        port: "443",
        path: "/models"
      }
    });
  }
};

// src/model-provider/huggingface/HuggingFaceError.ts
import { z as z8 } from "zod";
var huggingFaceErrorDataSchema = z8.object({
  error: z8.array(z8.string()).or(z8.string())
});
var failedHuggingFaceCallResponseHandler = createJsonErrorResponseHandler({
  errorSchema: zodSchema(huggingFaceErrorDataSchema),
  errorToMessage: (data) => typeof data.error === "string" ? data.error : data.error.join("\n\n")
});

// src/model-provider/huggingface/HuggingFaceFacade.ts
var HuggingFaceFacade_exports = {};
__export(HuggingFaceFacade_exports, {
  Api: () => Api4,
  TextEmbedder: () => TextEmbedder2,
  TextGenerator: () => TextGenerator2
});

// src/model-provider/huggingface/HuggingFaceTextEmbeddingModel.ts
import { z as z9 } from "zod";
var HuggingFaceTextEmbeddingModel = class _HuggingFaceTextEmbeddingModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
    this.maxValuesPerCall = settings.maxValuesPerCall ?? 1024;
    this.dimensions = settings.dimensions;
  }
  provider = "huggingface";
  get modelName() {
    return this.settings.model;
  }
  maxValuesPerCall;
  isParallelizable = true;
  contextWindowSize = void 0;
  dimensions;
  tokenizer = void 0;
  async callAPI(texts, callOptions) {
    if (texts.length > this.maxValuesPerCall) {
      throw new Error(
        `The HuggingFace feature extraction API is configured to only support ${this.maxValuesPerCall} texts per API call.`
      );
    }
    const api = this.settings.api ?? new HuggingFaceApiConfiguration();
    const abortSignal = callOptions?.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/${this.settings.model}`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          inputs: texts,
          options: {
            use_cache: this.settings.options?.useCache ?? true,
            wait_for_model: this.settings.options?.waitForModel ?? true
          }
        },
        failedResponseHandler: failedHuggingFaceCallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(huggingFaceTextEmbeddingResponseSchema)
        ),
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    return {
      dimensions: this.settings.dimensions,
      options: this.settings.options
    };
  }
  countPromptTokens = void 0;
  async doEmbedValues(texts, options) {
    const rawResponse = await this.callAPI(texts, options);
    return {
      rawResponse,
      embeddings: rawResponse
    };
  }
  withSettings(additionalSettings) {
    return new _HuggingFaceTextEmbeddingModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var huggingFaceTextEmbeddingResponseSchema = z9.array(z9.array(z9.number()));

// src/model-provider/huggingface/HuggingFaceTextGenerationModel.ts
import { z as z10 } from "zod";
var HuggingFaceTextGenerationModel = class _HuggingFaceTextGenerationModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "huggingface";
  get modelName() {
    return this.settings.model;
  }
  contextWindowSize = void 0;
  tokenizer = void 0;
  countPromptTokens = void 0;
  async callAPI(prompt, callOptions) {
    const api = this.settings.api ?? new HuggingFaceApiConfiguration();
    const abortSignal = callOptions?.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/${this.settings.model}`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          inputs: prompt,
          top_k: this.settings.topK,
          top_p: this.settings.topP,
          temperature: this.settings.temperature,
          repetition_penalty: this.settings.repetitionPenalty,
          max_new_tokens: this.settings.maxGenerationTokens,
          max_time: this.settings.maxTime,
          num_return_sequences: this.settings.numberOfGenerations,
          do_sample: this.settings.doSample,
          options: {
            use_cache: true,
            wait_for_model: true
          }
        },
        failedResponseHandler: failedHuggingFaceCallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(huggingFaceTextGenerationResponseSchema)
        ),
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      ...textGenerationModelProperties,
      "topK",
      "topP",
      "temperature",
      "repetitionPenalty",
      "maxTime",
      "doSample"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  async doGenerateTexts(prompt, options) {
    return this.processTextGenerationResponse(
      await this.callAPI(prompt, options)
    );
  }
  restoreGeneratedTexts(rawResponse) {
    return this.processTextGenerationResponse(
      validateTypes({
        value: rawResponse,
        schema: zodSchema(huggingFaceTextGenerationResponseSchema)
      })
    );
  }
  processTextGenerationResponse(rawResponse) {
    return {
      rawResponse,
      textGenerationResults: rawResponse.map((response) => ({
        text: response.generated_text,
        finishReason: "unknown"
      }))
    };
  }
  withJsonOutput() {
    return this;
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateTextGenerationModel({
      model: this,
      // stop tokens are not supported by this model
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _HuggingFaceTextGenerationModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var huggingFaceTextGenerationResponseSchema = z10.array(
  z10.object({
    generated_text: z10.string()
  })
);

// src/model-provider/huggingface/HuggingFaceFacade.ts
function Api4(settings) {
  return new HuggingFaceApiConfiguration(settings);
}
function TextGenerator2(settings) {
  return new HuggingFaceTextGenerationModel(settings);
}
function TextEmbedder2(settings) {
  return new HuggingFaceTextEmbeddingModel(settings);
}

// src/model-provider/llamacpp/LlamaCppApiConfiguration.ts
var LlamaCppApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      baseUrlDefaults: {
        protocol: "http",
        host: "127.0.0.1",
        port: "8080",
        path: ""
      }
    });
  }
};

// src/model-provider/llamacpp/LlamaCppCompletionModel.ts
import { z as z13 } from "zod";

// src/util/streaming/convertReadableStreamToAsyncIterable.ts
async function* convertReadableStreamToAsyncIterable(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

// src/util/streaming/EventSourceParserStream.ts
import {
  createParser
} from "eventsource-parser";
var EventSourceParserStream = class extends TransformStream {
  constructor() {
    let parser;
    super({
      start(controller) {
        parser = createParser((event) => {
          if (event.type === "event") {
            controller.enqueue(event);
          }
        });
      },
      transform(chunk) {
        parser.feed(chunk);
      }
    });
  }
};

// src/util/streaming/parseEventSourceStream.ts
async function parseEventSourceStream({
  stream
}) {
  const eventStream = stream.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream());
  return convertReadableStreamToAsyncIterable(eventStream);
}

// src/model-provider/llamacpp/LlamaCppError.ts
import { z as z11 } from "zod";
var llamaCppErrorDataSchema = z11.object({
  error: z11.string()
});
var failedLlamaCppCallResponseHandler = createJsonErrorResponseHandler(
  {
    errorSchema: zodSchema(llamaCppErrorDataSchema),
    errorToMessage: (error) => error.error
  }
);

// src/model-provider/llamacpp/LlamaCppPrompt.ts
var LlamaCppPrompt_exports = {};
__export(LlamaCppPrompt_exports, {
  Alpaca: () => Alpaca,
  BakLLaVA1: () => BakLLaVA1,
  ChatML: () => ChatML,
  Llama2: () => Llama2,
  Mistral: () => Mistral,
  NeuralChat: () => NeuralChat,
  Synthia: () => Synthia,
  Text: () => Text,
  Vicuna: () => Vicuna,
  asLlamaCppPromptTemplate: () => asLlamaCppPromptTemplate,
  asLlamaCppTextPromptTemplateProvider: () => asLlamaCppTextPromptTemplateProvider
});

// src/model-provider/llamacpp/LlamaCppBakLLaVA1PromptTemplate.ts
var LlamaCppBakLLaVA1PromptTemplate_exports = {};
__export(LlamaCppBakLLaVA1PromptTemplate_exports, {
  chat: () => chat9,
  instruction: () => instruction9,
  text: () => text9
});
var DEFAULT_SYSTEM_MESSAGE2 = "A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions.";
function text9() {
  const delegate = text7();
  return {
    stopSequences: [],
    format(prompt) {
      return { text: delegate.format(prompt) };
    }
  };
}
function instruction9() {
  return {
    format(prompt) {
      let text13 = "";
      text13 += `${prompt.system ?? DEFAULT_SYSTEM_MESSAGE2}

`;
      text13 += `USER: `;
      const images = {};
      if (typeof prompt.instruction === "string") {
        text13 += `${prompt.instruction}
`;
      } else {
        let imageCounter = 1;
        for (const content of prompt.instruction) {
          switch (content.type) {
            case "text": {
              text13 += content.text;
              break;
            }
            case "image": {
              text13 += `[img-${imageCounter}]`;
              images[imageCounter.toString()] = convertDataContentToBase64String(content.image);
              imageCounter++;
              break;
            }
          }
          text13 += `${content}
`;
        }
      }
      text13 += `
ASSISTANT: `;
      return { text: text13, images };
    },
    stopSequences: [`
USER:`]
  };
}
function chat9() {
  return {
    format(prompt) {
      let text13 = "";
      text13 += `${prompt.system ?? DEFAULT_SYSTEM_MESSAGE2}

`;
      let imageCounter = 1;
      const images = {};
      for (const { role, content } of prompt.messages) {
        switch (role) {
          case "user": {
            text13 += `USER: `;
            if (typeof content === "string") {
              text13 += content;
              break;
            }
            for (const part of content) {
              switch (part.type) {
                case "text": {
                  text13 += part.text;
                  break;
                }
                case "image": {
                  text13 += `[img-${imageCounter}]`;
                  images[imageCounter.toString()] = convertDataContentToBase64String(part.image);
                  imageCounter++;
                  break;
                }
              }
            }
            break;
          }
          case "assistant": {
            text13 += `ASSISTANT: ${validateContentIsString(content, prompt)}`;
            break;
          }
          case "tool": {
            throw new InvalidPromptError(
              "Tool messages are not supported.",
              prompt
            );
          }
          default: {
            const _exhaustiveCheck = role;
            throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
          }
        }
        text13 += `

`;
      }
      text13 += `ASSISTANT: `;
      return { text: text13, images };
    },
    stopSequences: [`
USER:`]
  };
}

// src/model-provider/llamacpp/LlamaCppPrompt.ts
function asLlamaCppPromptTemplate(promptTemplate) {
  return {
    format: (prompt) => ({
      text: promptTemplate.format(prompt)
    }),
    stopSequences: promptTemplate.stopSequences
  };
}
function asLlamaCppTextPromptTemplateProvider(promptTemplateProvider) {
  return {
    text: () => asLlamaCppPromptTemplate(promptTemplateProvider.text()),
    instruction: () => asLlamaCppPromptTemplate(promptTemplateProvider.instruction()),
    chat: () => asLlamaCppPromptTemplate(promptTemplateProvider.chat())
  };
}
var Text = asLlamaCppTextPromptTemplateProvider(TextPromptTemplate_exports);
var Mistral = asLlamaCppTextPromptTemplateProvider(MistralInstructPromptTemplate_exports);
var ChatML = asLlamaCppTextPromptTemplateProvider(ChatMLPromptTemplate_exports);
var Llama2 = asLlamaCppTextPromptTemplateProvider(Llama2PromptTemplate_exports);
var NeuralChat = asLlamaCppTextPromptTemplateProvider(NeuralChatPromptTemplate_exports);
var Alpaca = asLlamaCppTextPromptTemplateProvider(AlpacaPromptTemplate_exports);
var Synthia = asLlamaCppTextPromptTemplateProvider(SynthiaPromptTemplate_exports);
var Vicuna = asLlamaCppTextPromptTemplateProvider(VicunaPromptTemplate_exports);
var BakLLaVA1 = LlamaCppBakLLaVA1PromptTemplate_exports;

// src/model-provider/llamacpp/LlamaCppTokenizer.ts
import { z as z12 } from "zod";
var LlamaCppTokenizer = class {
  api;
  constructor(api = new LlamaCppApiConfiguration()) {
    this.api = api;
  }
  async callTokenizeAPI(text13, callOptions) {
    const api = this.api;
    const abortSignal = callOptions?.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/tokenize`),
        headers: api.headers({
          functionType: "tokenize",
          functionId: callOptions?.functionId,
          run: callOptions?.run,
          callId: ""
        }),
        body: {
          content: text13
        },
        failedResponseHandler: failedLlamaCppCallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(llamaCppTokenizationResponseSchema)
        ),
        abortSignal
      })
    });
  }
  async tokenize(text13) {
    const response = await this.callTokenizeAPI(text13);
    return response.tokens;
  }
};
var llamaCppTokenizationResponseSchema = z12.object({
  tokens: z12.array(z12.number())
});

// src/model-provider/llamacpp/convertJsonSchemaToGBNF.ts
function convertJsonSchemaToGBNF(schema) {
  const rules = new RuleMap();
  rules.add("space", SPACE_RULE);
  visit(schema, void 0, rules);
  return rules.toGBNF();
}
var SPACE_RULE = '" "?';
var PRIMITIVE_RULES = {
  boolean: '("true" | "false") space',
  number: '("-"? ([0-9] | [1-9] [0-9]*)) ("." [0-9]+)? ([eE] [-+]? [0-9]+)? space',
  integer: '("-"? ([0-9] | [1-9] [0-9]*)) space',
  string: ` "\\"" ( [^"\\\\] | "\\\\" (["\\\\/bfnrt] | "u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]) )* "\\"" space`,
  null: '"null" space'
};
var RuleMap = class {
  rules = /* @__PURE__ */ new Map();
  add(name, rule) {
    const escapedName = this.escapeRuleName(name, rule);
    this.rules.set(escapedName, rule);
    return escapedName;
  }
  /**
   * Replace invalid characters in rule name with hyphens.
   * Disambiguate the name if it already exists.
   */
  escapeRuleName(name, rule) {
    const baseName = name.replace(/[^\dA-Za-z-]+/g, "-");
    if (!this.rules.has(baseName) || this.rules.get(baseName) === rule) {
      return baseName;
    }
    let i = 0;
    while (this.rules.has(`${baseName}${i}`)) {
      if (this.rules.get(`${baseName}${i}`) === rule) {
        return `${baseName}${i}`;
      }
      i++;
    }
    return `${baseName}${i}`;
  }
  toGBNF() {
    return Array.from(this.rules).map(([name, rule]) => `${name} ::= ${rule}`).join("\n");
  }
};
var GRAMMAR_LITERAL_ESCAPES = {
  "\r": "\\r",
  "\n": "\\n",
  '"': '\\"'
};
function formatLiteral(literal) {
  const escaped = JSON.stringify(literal).replace(
    /[\n\r"]/g,
    (m) => GRAMMAR_LITERAL_ESCAPES[m]
  );
  return `"${escaped}"`;
}
function visit(schema, name, rules) {
  const schemaType = schema.type;
  const ruleName = name || "root";
  if (schema.oneOf || schema.anyOf) {
    const rule = (schema.oneOf || schema.anyOf).map(
      (altSchema, i) => visit(altSchema, `${name}${name ? "-" : ""}${i}`, rules)
    ).join(" | ");
    return rules.add(ruleName, rule);
  } else if ("const" in schema) {
    return rules.add(ruleName, formatLiteral(schema.const));
  } else if ("enum" in schema) {
    const rule = schema.enum.map(formatLiteral).join(" | ");
    return rules.add(ruleName, rule);
  } else if (schemaType === "object" && "properties" in schema) {
    const propPairs = Object.entries(schema.properties);
    let rule = '"{" space';
    propPairs.forEach(([propName, propSchema], i) => {
      const propRuleName = visit(
        propSchema,
        `${name ?? ""}${name ? "-" : ""}${propName}`,
        rules
      );
      if (i > 0) {
        rule += ' "," space';
      }
      rule += ` ${formatLiteral(propName)} space ":" space ${propRuleName}`;
    });
    rule += ' "}" space';
    return rules.add(ruleName, rule);
  } else if (schemaType === "array" && "items" in schema) {
    const itemRuleName = visit(
      schema.items,
      `${name ?? ""}${name ? "-" : ""}item`,
      rules
    );
    const rule = `"[" space (${itemRuleName} ("," space ${itemRuleName})*)? "]" space`;
    return rules.add(ruleName, rule);
  } else {
    if (!PRIMITIVE_RULES[schemaType]) {
      throw new Error(`Unrecognized schema: ${JSON.stringify(schema)}`);
    }
    return rules.add(
      ruleName === "root" ? "root" : schemaType,
      PRIMITIVE_RULES[schemaType]
    );
  }
}

// src/model-provider/llamacpp/LlamaCppCompletionModel.ts
var LlamaCppCompletionModel = class _LlamaCppCompletionModel extends AbstractModel {
  constructor(settings = {}) {
    super({ settings });
    this.tokenizer = new LlamaCppTokenizer(this.settings.api);
  }
  provider = "llamacpp";
  get modelName() {
    return null;
  }
  get contextWindowSize() {
    return this.settings.contextWindowSize;
  }
  tokenizer;
  async callAPI(prompt, callOptions, options) {
    const api = this.settings.api ?? new LlamaCppApiConfiguration();
    const responseFormat = options.responseFormat;
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/completion`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          stream: responseFormat.stream,
          prompt: prompt.text,
          image_data: prompt.images != null ? Object.entries(prompt.images).map(([id, data]) => ({
            id: +id,
            data
          })) : void 0,
          temperature: this.settings.temperature,
          top_k: this.settings.topK,
          top_p: this.settings.topP,
          min_p: this.settings.minP,
          n_predict: this.settings.maxGenerationTokens,
          n_keep: this.settings.nKeep,
          stop: this.settings.stopSequences,
          tfs_z: this.settings.tfsZ,
          typical_p: this.settings.typicalP,
          repeat_penalty: this.settings.repeatPenalty,
          repeat_last_n: this.settings.repeatLastN,
          penalize_nl: this.settings.penalizeNl,
          presence_penalty: this.settings.presencePenalty,
          frequency_penalty: this.settings.frequencyPenalty,
          penalty_prompt: this.settings.penaltyPrompt,
          mirostat: this.settings.mirostat,
          mirostat_tau: this.settings.mirostatTau,
          mirostat_eta: this.settings.mirostatEta,
          grammar: this.settings.grammar,
          seed: this.settings.seed,
          ignore_eos: this.settings.ignoreEos,
          logit_bias: this.settings.logitBias,
          n_probs: this.settings.nProbs,
          cache_prompt: this.settings.cachePrompt,
          slot_id: this.settings.slotId
        },
        failedResponseHandler: failedLlamaCppCallResponseHandler,
        successfulResponseHandler: responseFormat.handler,
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      ...textGenerationModelProperties,
      "contextWindowSize",
      "temperature",
      "topK",
      "topP",
      "minP",
      "nKeep",
      "tfsZ",
      "typicalP",
      "repeatPenalty",
      "repeatLastN",
      "penalizeNl",
      "presencePenalty",
      "frequencyPenalty",
      "penaltyPrompt",
      "mirostat",
      "mirostatTau",
      "mirostatEta",
      "grammar",
      "seed",
      "ignoreEos",
      "logitBias",
      "nProbs",
      "cachePrompt",
      "slotId"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  async countPromptTokens(prompt) {
    const tokens = await this.tokenizer.tokenize(prompt.text);
    return tokens.length;
  }
  async doGenerateTexts(prompt, options) {
    return this.processTextGenerationResponse(
      await this.callAPI(prompt, options, {
        responseFormat: LlamaCppCompletionResponseFormat.json
      })
    );
  }
  restoreGeneratedTexts(rawResponse) {
    return this.processTextGenerationResponse(
      validateTypes({
        value: rawResponse,
        schema: zodSchema(llamaCppTextGenerationResponseSchema)
      })
    );
  }
  processTextGenerationResponse(rawResponse) {
    return {
      rawResponse,
      textGenerationResults: [
        {
          text: rawResponse.content,
          finishReason: rawResponse.stopped_eos || rawResponse.stopped_word ? "stop" : rawResponse.stopped_limit ? "length" : "unknown"
        }
      ],
      usage: {
        promptTokens: rawResponse.tokens_evaluated,
        completionTokens: rawResponse.tokens_predicted,
        totalTokens: rawResponse.tokens_evaluated + rawResponse.tokens_predicted
      }
    };
  }
  doStreamText(prompt, options) {
    return this.callAPI(prompt, options, {
      responseFormat: LlamaCppCompletionResponseFormat.deltaIterable
    });
  }
  extractTextDelta(delta) {
    return delta.content;
  }
  asObjectGenerationModel(promptTemplate) {
    return "adaptModel" in promptTemplate ? new ObjectFromTextStreamingModel({
      model: promptTemplate.adaptModel(this),
      template: promptTemplate
    }) : new ObjectFromTextStreamingModel({
      model: this,
      template: promptTemplate
    });
  }
  withJsonOutput(schema) {
    if (this.settings.grammar != null) {
      return this;
    }
    const grammar = convertJsonSchemaToGBNF(schema.getJsonSchema());
    return this.withSettings({
      grammar
    });
  }
  get promptTemplateProvider() {
    return this.settings.promptTemplate ?? Text;
  }
  withTextPrompt() {
    return this.withPromptTemplate(this.promptTemplateProvider.text());
  }
  withInstructionPrompt() {
    return this.withPromptTemplate(this.promptTemplateProvider.instruction());
  }
  withChatPrompt() {
    return this.withPromptTemplate(this.promptTemplateProvider.chat());
  }
  /**
   * Maps the prompt for the full Llama.cpp prompt template (incl. image support).
   */
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateTextStreamingModel({
      model: this.withSettings({
        stopSequences: [
          ...this.settings.stopSequences ?? [],
          ...promptTemplate.stopSequences
        ]
      }),
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _LlamaCppCompletionModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var llamaCppTextGenerationResponseSchema = z13.object({
  content: z13.string(),
  stop: z13.literal(true),
  generation_settings: z13.object({
    frequency_penalty: z13.number(),
    ignore_eos: z13.boolean(),
    logit_bias: z13.array(z13.number()),
    mirostat: z13.number(),
    mirostat_eta: z13.number(),
    mirostat_tau: z13.number(),
    model: z13.string(),
    n_ctx: z13.number(),
    n_keep: z13.number(),
    n_predict: z13.number(),
    n_probs: z13.number(),
    penalize_nl: z13.boolean(),
    presence_penalty: z13.number(),
    repeat_last_n: z13.number(),
    repeat_penalty: z13.number(),
    seed: z13.number(),
    stop: z13.array(z13.string()),
    stream: z13.boolean(),
    temperature: z13.number().optional(),
    // optional for backwards compatibility
    tfs_z: z13.number(),
    top_k: z13.number(),
    top_p: z13.number(),
    typical_p: z13.number()
  }),
  model: z13.string(),
  prompt: z13.string(),
  stopped_eos: z13.boolean(),
  stopped_limit: z13.boolean(),
  stopped_word: z13.boolean(),
  stopping_word: z13.string(),
  timings: z13.object({
    predicted_ms: z13.number(),
    predicted_n: z13.number(),
    predicted_per_second: z13.number().nullable(),
    predicted_per_token_ms: z13.number().nullable(),
    prompt_ms: z13.number().nullable().optional(),
    prompt_n: z13.number(),
    prompt_per_second: z13.number().nullable(),
    prompt_per_token_ms: z13.number().nullable()
  }),
  tokens_cached: z13.number(),
  tokens_evaluated: z13.number(),
  tokens_predicted: z13.number(),
  truncated: z13.boolean()
});
var llamaCppTextStreamChunkSchema = z13.discriminatedUnion("stop", [
  z13.object({
    content: z13.string(),
    stop: z13.literal(false)
  }),
  llamaCppTextGenerationResponseSchema
]);
async function createLlamaCppFullDeltaIterableQueue(stream) {
  const queue = new AsyncQueue();
  parseEventSourceStream({ stream }).then(async (events) => {
    try {
      for await (const event of events) {
        const data = event.data;
        const eventData = parseJSON({
          text: data,
          schema: zodSchema(llamaCppTextStreamChunkSchema)
        });
        queue.push({ type: "delta", deltaValue: eventData });
        if (eventData.stop) {
          queue.close();
        }
      }
    } catch (error) {
      queue.push({ type: "error", error });
      queue.close();
    }
  }).catch((error) => {
    queue.push({ type: "error", error });
    queue.close();
  });
  return queue;
}
var LlamaCppCompletionResponseFormat = {
  /**
   * Returns the response as a JSON object.
   */
  json: {
    stream: false,
    handler: createJsonResponseHandler(
      zodSchema(llamaCppTextGenerationResponseSchema)
    )
  },
  /**
   * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
   * of the response stream.
   */
  deltaIterable: {
    stream: true,
    handler: async ({ response }) => createLlamaCppFullDeltaIterableQueue(response.body)
  }
};

// src/model-provider/llamacpp/LlamaCppFacade.ts
var LlamaCppFacade_exports = {};
__export(LlamaCppFacade_exports, {
  Api: () => Api5,
  CompletionTextGenerator: () => CompletionTextGenerator,
  TextEmbedder: () => TextEmbedder3,
  Tokenizer: () => Tokenizer2,
  grammar: () => LlamaCppGrammars_exports,
  prompt: () => LlamaCppPrompt_exports
});

// src/model-provider/llamacpp/LlamaCppTextEmbeddingModel.ts
import { z as z14 } from "zod";
var LlamaCppTextEmbeddingModel = class _LlamaCppTextEmbeddingModel extends AbstractModel {
  constructor(settings = {}) {
    super({ settings });
    this.tokenizer = new LlamaCppTokenizer(this.settings.api);
  }
  provider = "llamacpp";
  get modelName() {
    return null;
  }
  maxValuesPerCall = 1;
  get isParallelizable() {
    return this.settings.isParallelizable ?? false;
  }
  contextWindowSize = void 0;
  get dimensions() {
    return this.settings.dimensions;
  }
  tokenizer;
  async tokenize(text13) {
    return this.tokenizer.tokenize(text13);
  }
  async callAPI(texts, callOptions) {
    if (texts.length > this.maxValuesPerCall) {
      throw new Error(
        `The Llama.cpp embedding API only supports ${this.maxValuesPerCall} texts per API call.`
      );
    }
    const api = this.settings.api ?? new LlamaCppApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: this.settings.api?.retry,
      throttle: this.settings.api?.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/embedding`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: { content: texts[0] },
        failedResponseHandler: failedLlamaCppCallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(llamaCppTextEmbeddingResponseSchema)
        ),
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    return {
      dimensions: this.settings.dimensions
    };
  }
  async doEmbedValues(texts, options) {
    const rawResponse = await this.callAPI(texts, options);
    return {
      rawResponse,
      embeddings: [rawResponse.embedding]
    };
  }
  withSettings(additionalSettings) {
    return new _LlamaCppTextEmbeddingModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var llamaCppTextEmbeddingResponseSchema = z14.object({
  embedding: z14.array(z14.number())
});

// src/model-provider/llamacpp/LlamaCppGrammars.ts
var LlamaCppGrammars_exports = {};
__export(LlamaCppGrammars_exports, {
  fromJsonSchema: () => convertJsonSchemaToGBNF,
  json: () => json,
  jsonArray: () => jsonArray,
  list: () => list
});
var json = `
root   ::= object
value  ::= object | array | string | number | ("true" | "false" | "null") ws

object ::=
  "{" ws (
            string ":" ws value
    ("," ws string ":" ws value)*
  )? "}" ws

array  ::=
  "[" ws (
            value
    ("," ws value)*
  )? "]" ws

string ::=
  "\\"" (
    [^"\\\\] |
    "\\\\" (["\\\\/bfnrt] | "u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]) # escapes
  )* "\\"" ws

number ::= ("-"? ([0-9] | [1-9] [0-9]*)) ("." [0-9]+)? ([eE] [-+]? [0-9]+)? ws

# Optional space: by convention, applied in this grammar after literal chars when allowed
ws ::= ([ 	
] ws)?
`;
var jsonArray = `
root   ::= arr
value  ::= object | array | string | number | ("true" | "false" | "null") ws

arr  ::=
  "[
" ws (
            value
    (",
" ws value)*
  )? "]"

object ::=
  "{" ws (
            string ":" ws value
    ("," ws string ":" ws value)*
  )? "}" ws

array  ::=
  "[" ws (
            value
    ("," ws value)*
  )? "]" ws

string ::=
  "\\"" (
    [^"\\\\] |
    "\\\\" (["\\\\/bfnrt] | "u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]) # escapes
  )* "\\"" ws

number ::= ("-"? ([0-9] | [1-9] [0-9]*)) ("." [0-9]+)? ([eE] [-+]? [0-9]+)? ws

# Optional space: by convention, applied in this grammar after literal chars when allowed
ws ::= ([ 	
] ws)?
`;
var list = `
root ::= item+

# Excludes various line break characters
item ::= "- " [^\r
\v\f\x85\u2028\u2029]+ "
"
`;

// src/model-provider/llamacpp/LlamaCppFacade.ts
function Api5(settings) {
  return new LlamaCppApiConfiguration(settings);
}
function CompletionTextGenerator(settings = {}) {
  return new LlamaCppCompletionModel(settings);
}
function TextEmbedder3(settings = {}) {
  return new LlamaCppTextEmbeddingModel(settings);
}
function Tokenizer2(api = new LlamaCppApiConfiguration()) {
  return new LlamaCppTokenizer(api);
}

// src/model-provider/lmnt/LmntApiConfiguration.ts
var LmntApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      headers: {
        "X-API-Key": loadApiKey({
          apiKey: settings.apiKey,
          environmentVariableName: "LMNT_API_KEY",
          description: "LMNT"
        })
      },
      baseUrlDefaults: {
        protocol: "https",
        host: "api.lmnt.com",
        port: "443",
        path: "/v1"
      }
    });
  }
};

// src/model-provider/lmnt/LmntFacade.ts
var LmntFacade_exports = {};
__export(LmntFacade_exports, {
  Api: () => Api6,
  SpeechGenerator: () => SpeechGenerator2
});

// src/model-provider/lmnt/LmntSpeechModel.ts
import { z as z15 } from "zod";
var LmntSpeechModel = class _LmntSpeechModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "lmnt";
  get modelName() {
    return this.settings.voice;
  }
  async callAPI(text13, callOptions) {
    const api = this.settings.api ?? new LmntApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => {
        const formData = new FormData();
        formData.append("text", text13);
        formData.append("voice", this.settings.voice);
        formData.append("format", "mp3");
        formData.append("return_durations", "true");
        if (this.settings.speed != null) {
          formData.append("speed", this.settings.speed.toString());
        }
        if (this.settings.seed != null) {
          formData.append("seed", this.settings.seed.toString());
        }
        if (this.settings.length != null) {
          formData.append("length", this.settings.length.toString());
        }
        return postToApi({
          url: api.assembleUrl(`/ai/speech`),
          headers: api.headers({
            functionType: callOptions.functionType,
            functionId: callOptions.functionId,
            run: callOptions.run,
            callId: callOptions.callId
          }),
          body: {
            content: formData,
            values: {
              text: text13,
              voice: this.settings.voice,
              speed: this.settings.speed,
              seed: this.settings.seed,
              length: this.settings.length
            }
          },
          failedResponseHandler: createTextErrorResponseHandler(),
          successfulResponseHandler: createJsonResponseHandler(
            zodSchema(lmntSpeechResponseSchema)
          ),
          abortSignal
        });
      }
    });
  }
  get settingsForEvent() {
    return {
      voice: this.settings.voice,
      speed: this.settings.speed,
      seed: this.settings.seed,
      length: this.settings.length
    };
  }
  async doGenerateSpeechStandard(text13, options) {
    const response = await this.callAPI(text13, options);
    return base64ToUint8Array(response.audio);
  }
  withSettings(additionalSettings) {
    return new _LmntSpeechModel({
      ...this.settings,
      ...additionalSettings
    });
  }
};
var lmntSpeechResponseSchema = z15.object({
  audio: z15.string(),
  durations: z15.array(
    z15.object({
      duration: z15.number(),
      start: z15.number(),
      text: z15.string()
    })
  ),
  seed: z15.number()
});

// src/model-provider/lmnt/LmntFacade.ts
function Api6(settings) {
  return new LmntApiConfiguration(settings);
}
function SpeechGenerator2(settings) {
  return new LmntSpeechModel(settings);
}

// src/model-provider/mistral/MistralApiConfiguration.ts
var MistralApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      headers: {
        Authorization: `Bearer ${loadApiKey({
          apiKey: settings.apiKey,
          environmentVariableName: "MISTRAL_API_KEY",
          description: "Mistral"
        })}`
      },
      baseUrlDefaults: {
        protocol: "https",
        host: "api.mistral.ai",
        port: "443",
        path: "/v1"
      }
    });
  }
};

// src/model-provider/mistral/MistralChatModel.ts
import { z as z17 } from "zod";

// src/util/streaming/parseEventSourceStreamAsAsyncIterable.ts
async function parseEventSourceStreamAsAsyncIterable({
  stream,
  schema
}) {
  const queue = new AsyncQueue();
  parseEventSourceStream({ stream }).then(async (events) => {
    try {
      for await (const event of events) {
        const data = event.data;
        if (data === "[DONE]") {
          queue.close();
          return;
        }
        const parseResult = safeParseJSON({
          text: data,
          schema
        });
        if (!parseResult.success) {
          queue.push({
            type: "error",
            error: parseResult.error
          });
          continue;
        }
        const completionChunk = parseResult.value;
        queue.push({
          type: "delta",
          deltaValue: completionChunk
        });
      }
    } catch (error) {
      queue.push({ type: "error", error });
      queue.close();
      return;
    }
  }).catch((error) => {
    queue.push({ type: "error", error });
    queue.close();
    return;
  });
  return queue;
}

// src/util/streaming/createEventSourceResponseHandler.ts
var createEventSourceResponseHandler = (schema) => ({ response }) => parseEventSourceStreamAsAsyncIterable({
  stream: response.body,
  schema
});

// src/model-provider/mistral/MistralChatPromptTemplate.ts
function text10() {
  return {
    format: (prompt) => [{ role: "user", content: prompt }],
    stopSequences: []
  };
}
function instruction10() {
  return {
    format(prompt) {
      const messages = [];
      if (prompt.system != null) {
        messages.push({ role: "system", content: prompt.system });
      }
      const instruction13 = validateContentIsString(prompt.instruction, prompt);
      messages.push({ role: "user", content: instruction13 });
      return messages;
    },
    stopSequences: []
  };
}
function chat10() {
  return {
    format(prompt) {
      const messages = [];
      if (prompt.system != null) {
        messages.push({ role: "system", content: prompt.system });
      }
      for (const { role, content } of prompt.messages) {
        switch (role) {
          case "user": {
            const textContent = validateContentIsString(content, prompt);
            messages.push({ role: "user", content: textContent });
            break;
          }
          case "assistant": {
            messages.push({
              role: "assistant",
              content: validateContentIsString(content, prompt)
            });
            break;
          }
          case "tool": {
            throw new InvalidPromptError(
              "Tool messages are not supported.",
              prompt
            );
          }
          default: {
            const _exhaustiveCheck = role;
            throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
          }
        }
      }
      return messages;
    },
    stopSequences: []
  };
}

// src/model-provider/mistral/MistralError.ts
import { z as z16 } from "zod";
var mistralErrorDataSchema = z16.object({
  object: z16.literal("error"),
  message: z16.string(),
  type: z16.string(),
  param: z16.string().nullable(),
  code: z16.string()
});
var failedMistralCallResponseHandler = createJsonErrorResponseHandler({
  errorSchema: zodSchema(mistralErrorDataSchema),
  errorToMessage: (error) => error.message
});

// src/model-provider/mistral/MistralChatModel.ts
var MistralChatModel = class _MistralChatModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "mistral";
  get modelName() {
    return this.settings.model;
  }
  contextWindowSize = void 0;
  tokenizer = void 0;
  countPromptTokens = void 0;
  async callAPI(prompt, callOptions, options) {
    const api = this.settings.api ?? new MistralApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    const stream = options.responseFormat.stream;
    const successfulResponseHandler2 = options.responseFormat.handler;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/chat/completions`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          stream,
          messages: prompt,
          model: this.settings.model,
          temperature: this.settings.temperature,
          top_p: this.settings.topP,
          max_tokens: this.settings.maxGenerationTokens,
          safe_mode: this.settings.safeMode,
          random_seed: this.settings.randomSeed
        },
        failedResponseHandler: failedMistralCallResponseHandler,
        successfulResponseHandler: successfulResponseHandler2,
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      ...textGenerationModelProperties,
      "temperature",
      "topP",
      "safeMode",
      "randomSeed"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  async doGenerateTexts(prompt, options) {
    return this.processTextGenerationResponse(
      await this.callAPI(prompt, options, {
        responseFormat: MistralChatResponseFormat.json
      })
    );
  }
  restoreGeneratedTexts(rawResponse) {
    return this.processTextGenerationResponse(
      validateTypes({
        value: rawResponse,
        schema: zodSchema(mistralChatResponseSchema)
      })
    );
  }
  processTextGenerationResponse(rawResponse) {
    return {
      rawResponse,
      textGenerationResults: rawResponse.choices.map((choice) => ({
        text: choice.message.content,
        finishReason: this.translateFinishReason(choice.finish_reason)
      }))
    };
  }
  translateFinishReason(finishReason) {
    switch (finishReason) {
      case "stop":
        return "stop";
      case "length":
      case "model_length":
        return "length";
      default:
        return "unknown";
    }
  }
  doStreamText(prompt, options) {
    return this.callAPI(prompt, options, {
      responseFormat: MistralChatResponseFormat.textDeltaIterable
    });
  }
  extractTextDelta(delta) {
    const chunk = delta;
    return chunk.choices[0].delta.content ?? void 0;
  }
  withTextPrompt() {
    return this.withPromptTemplate(text10());
  }
  withInstructionPrompt() {
    return this.withPromptTemplate(instruction10());
  }
  withChatPrompt() {
    return this.withPromptTemplate(chat10());
  }
  withJsonOutput() {
    return this;
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateTextStreamingModel({
      model: this,
      // stop tokens are not supported by this model
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _MistralChatModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var mistralChatResponseSchema = z17.object({
  id: z17.string(),
  object: z17.string(),
  created: z17.number(),
  model: z17.string(),
  choices: z17.array(
    z17.object({
      index: z17.number(),
      message: z17.object({
        role: z17.enum(["user", "assistant"]),
        content: z17.string()
      }),
      finish_reason: z17.enum(["stop", "length", "model_length"])
    })
  ),
  usage: z17.object({
    prompt_tokens: z17.number(),
    completion_tokens: z17.number(),
    total_tokens: z17.number()
  })
});
var mistralChatStreamChunkSchema = z17.object({
  id: z17.string(),
  object: z17.string().optional(),
  created: z17.number().optional(),
  model: z17.string(),
  choices: z17.array(
    z17.object({
      index: z17.number(),
      delta: z17.object({
        role: z17.enum(["assistant", "user"]).optional().nullable(),
        content: z17.string().nullable().optional()
      }),
      finish_reason: z17.enum(["stop", "length", "model_length"]).nullable().optional()
    })
  )
});
var MistralChatResponseFormat = {
  /**
   * Returns the response as a JSON object.
   */
  json: {
    stream: false,
    handler: createJsonResponseHandler(zodSchema(mistralChatResponseSchema))
  },
  /**
   * Returns an async iterable over the text deltas (only the tex different of the first choice).
   */
  textDeltaIterable: {
    stream: true,
    handler: createEventSourceResponseHandler(
      zodSchema(mistralChatStreamChunkSchema)
    )
  }
};

// src/model-provider/mistral/MistralFacade.ts
var MistralFacade_exports = {};
__export(MistralFacade_exports, {
  Api: () => Api7,
  ChatTextGenerator: () => ChatTextGenerator,
  TextEmbedder: () => TextEmbedder4
});

// src/model-provider/mistral/MistralTextEmbeddingModel.ts
import { z as z18 } from "zod";
var MistralTextEmbeddingModel = class _MistralTextEmbeddingModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "mistral";
  get modelName() {
    return this.settings.model;
  }
  maxValuesPerCall = 32;
  /**
   * Parallel calls are technically possible, but I have been hitting rate limits and disabled
   * them for now.
   */
  isParallelizable = false;
  dimensions = 1024;
  async callAPI(texts, callOptions) {
    if (texts.length > this.maxValuesPerCall) {
      throw new Error(
        `The Mistral embedding API only supports ${this.maxValuesPerCall} texts per API call.`
      );
    }
    const api = this.settings.api ?? new MistralApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    const model = this.settings.model;
    const encodingFormat = this.settings.encodingFormat ?? "float";
    return callWithRetryAndThrottle({
      retry: this.settings.api?.retry,
      throttle: this.settings.api?.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/embeddings`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          model,
          input: texts,
          encoding_format: encodingFormat
        },
        failedResponseHandler: failedMistralCallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(MistralTextEmbeddingResponseSchema)
        ),
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    return {
      encodingFormat: this.settings.encodingFormat
    };
  }
  async doEmbedValues(texts, options) {
    const rawResponse = await this.callAPI(texts, options);
    return {
      rawResponse,
      embeddings: rawResponse.data.map((entry) => entry.embedding)
    };
  }
  withSettings(additionalSettings) {
    return new _MistralTextEmbeddingModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var MistralTextEmbeddingResponseSchema = z18.object({
  id: z18.string(),
  object: z18.string(),
  data: z18.array(
    z18.object({
      object: z18.string(),
      embedding: z18.array(z18.number()),
      index: z18.number()
    })
  ),
  model: z18.string(),
  usage: z18.object({
    prompt_tokens: z18.number(),
    total_tokens: z18.number()
  })
});

// src/model-provider/mistral/MistralFacade.ts
function Api7(settings) {
  return new MistralApiConfiguration(settings);
}
function ChatTextGenerator(settings) {
  return new MistralChatModel(settings);
}
function TextEmbedder4(settings) {
  return new MistralTextEmbeddingModel(settings);
}

// src/model-provider/ollama/OllamaApiConfiguration.ts
var OllamaApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      baseUrlDefaults: {
        protocol: "http",
        host: "127.0.0.1",
        port: "11434",
        path: ""
      }
    });
  }
};

// src/model-provider/ollama/OllamaChatModel.ts
import { z as z20 } from "zod";

// src/model-provider/ollama/OllamaChatPromptTemplate.ts
function text11() {
  return {
    format: (prompt) => [{ role: "user", content: prompt }],
    stopSequences: []
  };
}
function instruction11() {
  return {
    format(prompt) {
      const messages = [];
      if (prompt.system != null) {
        messages.push({
          role: "system",
          content: prompt.system
        });
      }
      messages.push({
        role: "user",
        ...extractUserContent(prompt.instruction)
      });
      return messages;
    },
    stopSequences: []
  };
}
function chat11() {
  return {
    format(prompt) {
      const messages = [];
      if (prompt.system != null) {
        messages.push({ role: "system", content: prompt.system });
      }
      for (const { role, content } of prompt.messages) {
        switch (role) {
          case "user": {
            messages.push({
              role: "user",
              ...extractUserContent(content)
            });
            break;
          }
          case "assistant": {
            messages.push({
              role: "assistant",
              content: validateContentIsString(content, prompt)
            });
            break;
          }
          case "tool": {
            throw new InvalidPromptError(
              "Tool messages are not supported.",
              prompt
            );
          }
          default: {
            const _exhaustiveCheck = role;
            throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
          }
        }
      }
      return messages;
    },
    stopSequences: []
  };
}
function extractUserContent(input) {
  if (typeof input === "string") {
    return { content: input, images: void 0 };
  }
  const images = [];
  let content = "";
  for (const part of input) {
    if (part.type === "text") {
      content += part.text;
    } else {
      images.push(convertDataContentToBase64String(part.image));
    }
  }
  return { content, images };
}

// src/model-provider/ollama/OllamaError.ts
import { z as z19 } from "zod";
var ollamaErrorDataSchema = z19.object({
  error: z19.string()
});
var failedOllamaCallResponseHandler = createJsonErrorResponseHandler({
  errorSchema: zodSchema(ollamaErrorDataSchema),
  errorToMessage: (error) => error.error
});

// src/model-provider/ollama/OllamaChatModel.ts
var OllamaChatModel = class _OllamaChatModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "ollama";
  get modelName() {
    return this.settings.model;
  }
  tokenizer = void 0;
  countPromptTokens = void 0;
  contextWindowSize = void 0;
  async callAPI(prompt, callOptions, options) {
    const { responseFormat } = options;
    const api = this.settings.api ?? new OllamaApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/api/chat`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          stream: responseFormat.stream,
          model: this.settings.model,
          messages: prompt,
          format: this.settings.format,
          options: {
            mirostat: this.settings.mirostat,
            mirostat_eta: this.settings.mirostatEta,
            mirostat_tau: this.settings.mirostatTau,
            num_gpu: this.settings.numGpu,
            num_gqa: this.settings.numGqa,
            num_predict: this.settings.maxGenerationTokens,
            num_threads: this.settings.numThreads,
            repeat_last_n: this.settings.repeatLastN,
            repeat_penalty: this.settings.repeatPenalty,
            seed: this.settings.seed,
            stop: this.settings.stopSequences,
            temperature: this.settings.temperature,
            tfs_z: this.settings.tfsZ,
            top_k: this.settings.topK,
            top_p: this.settings.topP
          },
          template: this.settings.template
        },
        failedResponseHandler: failedOllamaCallResponseHandler,
        successfulResponseHandler: responseFormat.handler,
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      ...textGenerationModelProperties,
      "temperature",
      "mirostat",
      "mirostatEta",
      "mirostatTau",
      "numGqa",
      "numGpu",
      "numThreads",
      "repeatLastN",
      "repeatPenalty",
      "seed",
      "tfsZ",
      "topK",
      "topP",
      "template",
      "format"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  async doGenerateTexts(prompt, options) {
    return this.processTextGenerationResponse(
      await this.callAPI(prompt, options, {
        responseFormat: OllamaChatResponseFormat.json
      })
    );
  }
  restoreGeneratedTexts(rawResponse) {
    return this.processTextGenerationResponse(
      validateTypes({
        value: rawResponse,
        schema: zodSchema(ollamaChatResponseSchema)
      })
    );
  }
  processTextGenerationResponse(rawResponse) {
    return {
      rawResponse,
      textGenerationResults: [
        {
          text: rawResponse.message.content,
          finishReason: "unknown"
        }
      ]
    };
  }
  doStreamText(prompt, options) {
    return this.callAPI(prompt, options, {
      responseFormat: OllamaChatResponseFormat.deltaIterable
    });
  }
  extractTextDelta(delta) {
    const chunk = delta;
    return chunk.done === true ? void 0 : chunk.message.content;
  }
  asToolCallGenerationModel(promptTemplate) {
    return new TextGenerationToolCallModel({
      model: this,
      template: promptTemplate
    });
  }
  asToolCallsOrTextGenerationModel(promptTemplate) {
    return new TextGenerationToolCallsModel({
      model: this,
      template: promptTemplate
    });
  }
  asObjectGenerationModel(promptTemplate) {
    return "adaptModel" in promptTemplate ? new ObjectFromTextStreamingModel({
      model: promptTemplate.adaptModel(this),
      template: promptTemplate
    }) : new ObjectFromTextStreamingModel({
      model: this,
      template: promptTemplate
    });
  }
  withTextPrompt() {
    return this.withPromptTemplate(text11());
  }
  withInstructionPrompt() {
    return this.withPromptTemplate(instruction11());
  }
  withChatPrompt() {
    return this.withPromptTemplate(chat11());
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateTextStreamingModel({
      model: this.withSettings({
        stopSequences: [
          ...this.settings.stopSequences ?? [],
          ...promptTemplate.stopSequences
        ]
      }),
      promptTemplate
    });
  }
  withJsonOutput() {
    return this.withSettings({ format: "json" });
  }
  withSettings(additionalSettings) {
    return new _OllamaChatModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var ollamaChatResponseSchema = z20.object({
  model: z20.string(),
  created_at: z20.string(),
  done: z20.literal(true),
  message: z20.object({
    role: z20.string(),
    content: z20.string()
  }),
  total_duration: z20.number(),
  load_duration: z20.number().optional(),
  prompt_eval_count: z20.number().optional(),
  prompt_eval_duration: z20.number().optional(),
  eval_count: z20.number(),
  eval_duration: z20.number()
});
var ollamaChatStreamChunkSchema = z20.discriminatedUnion("done", [
  z20.object({
    done: z20.literal(false),
    model: z20.string(),
    created_at: z20.string(),
    message: z20.object({
      role: z20.string(),
      content: z20.string()
    })
  }),
  z20.object({
    done: z20.literal(true),
    model: z20.string(),
    created_at: z20.string(),
    total_duration: z20.number(),
    load_duration: z20.number().optional(),
    prompt_eval_count: z20.number().optional(),
    prompt_eval_duration: z20.number().optional(),
    eval_count: z20.number(),
    eval_duration: z20.number()
  })
]);
var OllamaChatResponseFormat = {
  /**
   * Returns the response as a JSON object.
   */
  json: {
    stream: false,
    handler: async ({ response, url, requestBodyValues }) => {
      const responseBody = await response.text();
      const parsedResult = safeParseJSON({
        text: responseBody,
        schema: zodSchema(
          z20.union([
            ollamaChatResponseSchema,
            z20.object({
              done: z20.literal(false),
              model: z20.string(),
              created_at: z20.string()
            })
          ])
        )
      });
      if (!parsedResult.success) {
        throw new ApiCallError({
          message: "Invalid JSON response",
          cause: parsedResult.error,
          statusCode: response.status,
          responseBody,
          url,
          requestBodyValues
        });
      }
      if (parsedResult.value.done === false) {
        throw new ApiCallError({
          message: "Incomplete Ollama response received",
          statusCode: response.status,
          responseBody,
          url,
          requestBodyValues,
          isRetryable: true
        });
      }
      return parsedResult.value;
    }
  },
  /**
   * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
   * of the response stream.
   */
  deltaIterable: {
    stream: true,
    handler: createJsonStreamResponseHandler(
      zodSchema(ollamaChatStreamChunkSchema)
    )
  }
};

// src/model-provider/ollama/OllamaCompletionModel.ts
import { z as z21 } from "zod";

// src/model-provider/ollama/OllamaCompletionPrompt.ts
var OllamaCompletionPrompt_exports = {};
__export(OllamaCompletionPrompt_exports, {
  Alpaca: () => Alpaca2,
  ChatML: () => ChatML2,
  Llama2: () => Llama22,
  Mistral: () => Mistral2,
  NeuralChat: () => NeuralChat2,
  Synthia: () => Synthia2,
  Text: () => Text2,
  Vicuna: () => Vicuna2,
  asOllamaCompletionPromptTemplate: () => asOllamaCompletionPromptTemplate,
  asOllamaCompletionTextPromptTemplateProvider: () => asOllamaCompletionTextPromptTemplateProvider
});
function asOllamaCompletionPromptTemplate(promptTemplate) {
  return {
    format: (prompt) => ({
      prompt: promptTemplate.format(prompt)
    }),
    stopSequences: promptTemplate.stopSequences
  };
}
function asOllamaCompletionTextPromptTemplateProvider(promptTemplateProvider) {
  return {
    text: () => asOllamaCompletionPromptTemplate(promptTemplateProvider.text()),
    instruction: () => asOllamaCompletionPromptTemplate(promptTemplateProvider.instruction()),
    chat: () => asOllamaCompletionPromptTemplate(promptTemplateProvider.chat())
  };
}
var Text2 = asOllamaCompletionTextPromptTemplateProvider(TextPromptTemplate_exports);
var Mistral2 = asOllamaCompletionTextPromptTemplateProvider(MistralInstructPromptTemplate_exports);
var ChatML2 = asOllamaCompletionTextPromptTemplateProvider(ChatMLPromptTemplate_exports);
var Llama22 = asOllamaCompletionTextPromptTemplateProvider(Llama2PromptTemplate_exports);
var NeuralChat2 = asOllamaCompletionTextPromptTemplateProvider(NeuralChatPromptTemplate_exports);
var Alpaca2 = asOllamaCompletionTextPromptTemplateProvider(AlpacaPromptTemplate_exports);
var Synthia2 = asOllamaCompletionTextPromptTemplateProvider(SynthiaPromptTemplate_exports);
var Vicuna2 = asOllamaCompletionTextPromptTemplateProvider(VicunaPromptTemplate_exports);

// src/model-provider/ollama/OllamaCompletionModel.ts
var OllamaCompletionModel = class _OllamaCompletionModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "ollama";
  get modelName() {
    return this.settings.model;
  }
  tokenizer = void 0;
  countPromptTokens = void 0;
  get contextWindowSize() {
    return this.settings.contextWindowSize;
  }
  async callAPI(prompt, callOptions, options) {
    const { responseFormat } = options;
    const api = this.settings.api ?? new OllamaApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/api/generate`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          stream: responseFormat.stream,
          model: this.settings.model,
          prompt: prompt.prompt,
          images: prompt.images,
          format: this.settings.format,
          options: {
            mirostat: this.settings.mirostat,
            mirostat_eta: this.settings.mirostatEta,
            mirostat_tau: this.settings.mirostatTau,
            num_ctx: this.settings.contextWindowSize,
            num_gpu: this.settings.numGpu,
            num_gqa: this.settings.numGqa,
            num_predict: this.settings.maxGenerationTokens,
            num_threads: this.settings.numThreads,
            repeat_last_n: this.settings.repeatLastN,
            repeat_penalty: this.settings.repeatPenalty,
            seed: this.settings.seed,
            stop: this.settings.stopSequences,
            temperature: this.settings.temperature,
            tfs_z: this.settings.tfsZ,
            top_k: this.settings.topK,
            top_p: this.settings.topP
          },
          system: this.settings.system,
          template: this.settings.template,
          context: this.settings.context,
          raw: this.settings.raw
        },
        failedResponseHandler: failedOllamaCallResponseHandler,
        successfulResponseHandler: responseFormat.handler,
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      ...textGenerationModelProperties,
      "contextWindowSize",
      "temperature",
      "mirostat",
      "mirostatEta",
      "mirostatTau",
      "numGqa",
      "numGpu",
      "numThreads",
      "repeatLastN",
      "repeatPenalty",
      "seed",
      "tfsZ",
      "topK",
      "topP",
      "system",
      "template",
      "context",
      "format",
      "raw"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  async doGenerateTexts(prompt, options) {
    return this.processTextGenerationResponse(
      await this.callAPI(prompt, options, {
        responseFormat: OllamaCompletionResponseFormat.json
      })
    );
  }
  restoreGeneratedTexts(rawResponse) {
    return this.processTextGenerationResponse(
      validateTypes({
        value: rawResponse,
        schema: zodSchema(ollamaCompletionResponseSchema)
      })
    );
  }
  processTextGenerationResponse(rawResponse) {
    return {
      rawResponse,
      textGenerationResults: [
        {
          text: rawResponse.response,
          finishReason: "unknown"
        }
      ]
    };
  }
  doStreamText(prompt, options) {
    return this.callAPI(prompt, options, {
      ...options,
      responseFormat: OllamaCompletionResponseFormat.deltaIterable
    });
  }
  extractTextDelta(delta) {
    const chunk = delta;
    return chunk.done === true ? void 0 : chunk.response;
  }
  asObjectGenerationModel(promptTemplate) {
    return "adaptModel" in promptTemplate ? new ObjectFromTextStreamingModel({
      model: promptTemplate.adaptModel(this),
      template: promptTemplate
    }) : new ObjectFromTextStreamingModel({
      model: this,
      template: promptTemplate
    });
  }
  asToolCallGenerationModel(promptTemplate) {
    return new TextGenerationToolCallModel({
      model: this,
      template: promptTemplate
    });
  }
  asToolCallsOrTextGenerationModel(promptTemplate) {
    return new TextGenerationToolCallsModel({
      model: this,
      template: promptTemplate
    });
  }
  get promptTemplateProvider() {
    return this.settings.promptTemplate ?? Text2;
  }
  withJsonOutput() {
    return this.withSettings({ format: "json" });
  }
  withTextPrompt() {
    return this.withPromptTemplate(this.promptTemplateProvider.text());
  }
  withInstructionPrompt() {
    return this.withPromptTemplate(this.promptTemplateProvider.instruction());
  }
  withChatPrompt() {
    return this.withPromptTemplate(this.promptTemplateProvider.chat());
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateTextStreamingModel({
      model: this.withSettings({
        stopSequences: [
          ...this.settings.stopSequences ?? [],
          ...promptTemplate.stopSequences
        ]
      }),
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _OllamaCompletionModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var ollamaCompletionResponseSchema = z21.object({
  done: z21.literal(true),
  model: z21.string(),
  created_at: z21.string(),
  response: z21.string(),
  total_duration: z21.number(),
  load_duration: z21.number().optional(),
  prompt_eval_count: z21.number().optional(),
  prompt_eval_duration: z21.number().optional(),
  eval_count: z21.number(),
  eval_duration: z21.number(),
  context: z21.array(z21.number()).optional()
});
var ollamaCompletionStreamChunkSchema = z21.discriminatedUnion("done", [
  z21.object({
    done: z21.literal(false),
    model: z21.string(),
    created_at: z21.string(),
    response: z21.string()
  }),
  z21.object({
    done: z21.literal(true),
    model: z21.string(),
    created_at: z21.string(),
    total_duration: z21.number(),
    load_duration: z21.number().optional(),
    sample_count: z21.number().optional(),
    sample_duration: z21.number().optional(),
    prompt_eval_count: z21.number().optional(),
    prompt_eval_duration: z21.number().optional(),
    eval_count: z21.number(),
    eval_duration: z21.number(),
    context: z21.array(z21.number()).optional()
  })
]);
var OllamaCompletionResponseFormat = {
  /**
   * Returns the response as a JSON object.
   */
  json: {
    stream: false,
    handler: async ({ response, url, requestBodyValues }) => {
      const responseBody = await response.text();
      const parsedResult = safeParseJSON({
        text: responseBody,
        schema: zodSchema(
          z21.union([
            ollamaCompletionResponseSchema,
            z21.object({
              done: z21.literal(false),
              model: z21.string(),
              created_at: z21.string(),
              response: z21.string()
            })
          ])
        )
      });
      if (!parsedResult.success) {
        throw new ApiCallError({
          message: "Invalid JSON response",
          cause: parsedResult.error,
          statusCode: response.status,
          responseBody,
          url,
          requestBodyValues
        });
      }
      if (parsedResult.value.done === false) {
        throw new ApiCallError({
          message: "Incomplete Ollama response received",
          statusCode: response.status,
          responseBody,
          url,
          requestBodyValues,
          isRetryable: true
        });
      }
      return parsedResult.value;
    }
  },
  /**
   * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
   * of the response stream.
   */
  deltaIterable: {
    stream: true,
    handler: createJsonStreamResponseHandler(
      zodSchema(ollamaCompletionStreamChunkSchema)
    )
  }
};

// src/model-provider/ollama/OllamaFacade.ts
var OllamaFacade_exports = {};
__export(OllamaFacade_exports, {
  Api: () => Api8,
  ChatTextGenerator: () => ChatTextGenerator2,
  CompletionTextGenerator: () => CompletionTextGenerator2,
  TextEmbedder: () => TextEmbedder5,
  prompt: () => OllamaCompletionPrompt_exports
});

// src/model-provider/ollama/OllamaTextEmbeddingModel.ts
import { z as z22 } from "zod";
var OllamaTextEmbeddingModel = class _OllamaTextEmbeddingModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "ollama";
  get modelName() {
    return null;
  }
  maxValuesPerCall = 1;
  get isParallelizable() {
    return this.settings.isParallelizable ?? false;
  }
  get dimensions() {
    return this.settings.dimensions;
  }
  async callAPI(texts, callOptions) {
    if (texts.length > this.maxValuesPerCall) {
      throw new Error(
        `The Ollama embedding API only supports ${this.maxValuesPerCall} texts per API call.`
      );
    }
    const api = this.settings.api ?? new OllamaApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/api/embeddings`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          model: this.settings.model,
          prompt: texts[0]
        },
        failedResponseHandler: failedOllamaCallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(ollamaTextEmbeddingResponseSchema)
        ),
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    return {
      dimensions: this.settings.dimensions
    };
  }
  async doEmbedValues(texts, options) {
    const rawResponse = await this.callAPI(texts, options);
    return {
      rawResponse,
      embeddings: [rawResponse.embedding]
    };
  }
  withSettings(additionalSettings) {
    return new _OllamaTextEmbeddingModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var ollamaTextEmbeddingResponseSchema = z22.object({
  embedding: z22.array(z22.number())
});

// src/model-provider/ollama/OllamaFacade.ts
function Api8(settings) {
  return new OllamaApiConfiguration(settings);
}
function CompletionTextGenerator2(settings) {
  return new OllamaCompletionModel(settings);
}
function ChatTextGenerator2(settings) {
  return new OllamaChatModel(settings);
}
function TextEmbedder5(settings) {
  return new OllamaTextEmbeddingModel(settings);
}

// src/model-provider/openai/AbstractOpenAIChatModel.ts
import { z as z24 } from "zod";

// src/model-provider/openai/OpenAIApiConfiguration.ts
var OpenAIApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      headers: {
        Authorization: `Bearer ${loadApiKey({
          apiKey: settings.apiKey,
          environmentVariableName: "OPENAI_API_KEY",
          description: "OpenAI"
        })}`
      },
      baseUrlDefaults: {
        protocol: "https",
        host: "api.openai.com",
        port: "443",
        path: "/v1"
      }
    });
  }
};

// src/model-provider/openai/OpenAIError.ts
import { z as z23 } from "zod";
var openAIErrorDataSchema = z23.object({
  error: z23.object({
    message: z23.string(),
    type: z23.string(),
    param: z23.any().nullable(),
    code: z23.string().nullable()
  })
});
var failedOpenAICallResponseHandler = createJsonErrorResponseHandler({
  errorSchema: zodSchema(openAIErrorDataSchema),
  errorToMessage: (data) => data.error.message,
  isRetryable: (response, error) => response.status >= 500 || response.status === 429 && // insufficient_quota is also reported as a 429, but it's not retryable:
  error?.error.type !== "insufficient_quota"
});

// src/model-provider/openai/AbstractOpenAIChatModel.ts
var AbstractOpenAIChatModel = class extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  async callAPI(messages, callOptions, options) {
    const api = this.settings.api ?? new OpenAIApiConfiguration();
    const responseFormat = options.responseFormat;
    const abortSignal = callOptions.run?.abortSignal;
    const user = this.settings.isUserIdForwardingEnabled ? callOptions.run?.userId : void 0;
    const openAIResponseFormat = this.settings.responseFormat;
    const functions = options.functions ?? this.settings.functions;
    const functionCall = options.functionCall ?? this.settings.functionCall;
    const tools = options.tools ?? this.settings.tools;
    const toolChoice = options.toolChoice ?? this.settings.toolChoice;
    let { stopSequences } = this.settings;
    return callWithRetryAndThrottle({
      retry: this.settings.api?.retry,
      throttle: this.settings.api?.throttle,
      call: async () => {
        if (stopSequences != null && Array.isArray(stopSequences) && stopSequences.length === 0) {
          stopSequences = void 0;
        }
        return postJsonToApi({
          url: api.assembleUrl("/chat/completions"),
          headers: api.headers({
            functionType: callOptions.functionType,
            functionId: callOptions.functionId,
            run: callOptions.run,
            callId: callOptions.callId
          }),
          body: {
            stream: responseFormat.stream,
            model: this.settings.model,
            messages,
            functions,
            function_call: functionCall,
            tools,
            tool_choice: toolChoice,
            temperature: this.settings.temperature,
            top_p: this.settings.topP,
            n: this.settings.numberOfGenerations,
            stop: stopSequences,
            max_tokens: this.settings.maxGenerationTokens,
            presence_penalty: this.settings.presencePenalty,
            frequency_penalty: this.settings.frequencyPenalty,
            logit_bias: this.settings.logitBias,
            seed: this.settings.seed,
            response_format: openAIResponseFormat,
            user
          },
          failedResponseHandler: failedOpenAICallResponseHandler,
          successfulResponseHandler: responseFormat.handler,
          abortSignal
        });
      }
    });
  }
  async doGenerateTexts(prompt, options) {
    return this.processTextGenerationResponse(
      await this.callAPI(prompt, options, {
        responseFormat: OpenAIChatResponseFormat.json
      })
    );
  }
  restoreGeneratedTexts(rawResponse) {
    return this.processTextGenerationResponse(
      validateTypes({
        value: rawResponse,
        schema: zodSchema(openAIChatResponseSchema)
      })
    );
  }
  processTextGenerationResponse(rawResponse) {
    return {
      rawResponse,
      textGenerationResults: rawResponse.choices.map((choice) => ({
        text: choice.message.content ?? "",
        finishReason: this.translateFinishReason(choice.finish_reason)
      })),
      usage: this.extractUsage(rawResponse)
    };
  }
  translateFinishReason(finishReason) {
    switch (finishReason) {
      case "stop":
        return "stop";
      case "length":
        return "length";
      case "content_filter":
        return "content-filter";
      case "function_call":
      case "tool_calls":
        return "tool-calls";
      default:
        return "unknown";
    }
  }
  doStreamText(prompt, options) {
    return this.callAPI(prompt, options, {
      responseFormat: OpenAIChatResponseFormat.deltaIterable
    });
  }
  extractTextDelta(delta) {
    const chunk = delta;
    if (chunk.object !== "chat.completion.chunk" && chunk.object !== "chat.completion") {
      return void 0;
    }
    const chatChunk = chunk;
    const firstChoice = chatChunk.choices[0];
    if (firstChoice.index > 0) {
      return void 0;
    }
    return firstChoice.delta.content ?? void 0;
  }
  async doGenerateToolCall(tool, prompt, options) {
    const rawResponse = await this.callAPI(prompt, options, {
      responseFormat: OpenAIChatResponseFormat.json,
      toolChoice: {
        type: "function",
        function: { name: tool.name }
      },
      tools: [
        {
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters.getJsonSchema()
          }
        }
      ]
    });
    const toolCalls = rawResponse.choices[0]?.message.tool_calls;
    return {
      rawResponse,
      toolCall: toolCalls == null || toolCalls.length === 0 ? null : {
        id: toolCalls[0].id,
        args: parseJSON({ text: toolCalls[0].function.arguments })
      },
      usage: this.extractUsage(rawResponse)
    };
  }
  async doGenerateToolCalls(tools, prompt, options) {
    const rawResponse = await this.callAPI(prompt, options, {
      responseFormat: OpenAIChatResponseFormat.json,
      toolChoice: "auto",
      tools: tools.map((tool) => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters.getJsonSchema()
        }
      }))
    });
    const message = rawResponse.choices[0]?.message;
    return {
      rawResponse,
      text: message.content ?? null,
      toolCalls: message.tool_calls?.map((toolCall) => ({
        id: toolCall.id,
        name: toolCall.function.name,
        args: parseJSON({ text: toolCall.function.arguments })
      })) ?? null,
      usage: this.extractUsage(rawResponse)
    };
  }
  extractUsage(response) {
    return {
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens
    };
  }
};
var openAIChatResponseSchema = z24.object({
  id: z24.string(),
  choices: z24.array(
    z24.object({
      message: z24.object({
        role: z24.literal("assistant"),
        content: z24.string().nullable(),
        function_call: z24.object({
          name: z24.string(),
          arguments: z24.string()
        }).optional(),
        tool_calls: z24.array(
          z24.object({
            id: z24.string(),
            type: z24.literal("function"),
            function: z24.object({
              name: z24.string(),
              arguments: z24.string()
            })
          })
        ).optional()
      }),
      index: z24.number().optional(),
      // optional for OpenAI compatible models
      logprobs: z24.nullable(z24.any()),
      finish_reason: z24.enum([
        "stop",
        "length",
        "tool_calls",
        "content_filter",
        "function_call"
      ]).optional().nullable()
    })
  ),
  created: z24.number(),
  model: z24.string(),
  system_fingerprint: z24.string().optional().nullable(),
  object: z24.literal("chat.completion"),
  usage: z24.object({
    prompt_tokens: z24.number(),
    completion_tokens: z24.number(),
    total_tokens: z24.number()
  })
});
var openaiChatChunkSchema = z24.object({
  object: z24.string(),
  // generalized for openai compatible providers, z.literal("chat.completion.chunk")
  id: z24.string(),
  choices: z24.array(
    z24.object({
      delta: z24.object({
        role: z24.enum(["assistant", "user"]).optional(),
        content: z24.string().nullable().optional(),
        function_call: z24.object({
          name: z24.string().optional(),
          arguments: z24.string().optional()
        }).optional(),
        tool_calls: z24.array(
          z24.object({
            id: z24.string(),
            type: z24.literal("function"),
            function: z24.object({
              name: z24.string(),
              arguments: z24.string()
            })
          })
        ).optional()
      }),
      finish_reason: z24.enum([
        "stop",
        "length",
        "tool_calls",
        "content_filter",
        "function_call"
      ]).nullable().optional(),
      index: z24.number()
    })
  ),
  created: z24.number(),
  model: z24.string().optional(),
  // optional for OpenAI compatible models
  system_fingerprint: z24.string().optional().nullable()
});
var OpenAIChatResponseFormat = {
  /**
   * Returns the response as a JSON object.
   */
  json: {
    stream: false,
    handler: createJsonResponseHandler(zodSchema(openAIChatResponseSchema))
  },
  /**
   * Returns an async iterable over the text deltas (only the tex different of the first choice).
   */
  deltaIterable: {
    stream: true,
    handler: createEventSourceResponseHandler(zodSchema(openaiChatChunkSchema))
  }
};

// src/model-provider/openai/AbstractOpenAICompletionModel.ts
import { z as z25 } from "zod";
var AbstractOpenAICompletionModel = class extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  async callAPI(prompt, callOptions, options) {
    const api = this.settings.api ?? new OpenAIApiConfiguration();
    const user = this.settings.isUserIdForwardingEnabled ? callOptions.run?.userId : void 0;
    const abortSignal = callOptions.run?.abortSignal;
    const openaiResponseFormat = options.responseFormat;
    const stopSequences = this.settings.stopSequences != null && Array.isArray(this.settings.stopSequences) && this.settings.stopSequences.length === 0 ? void 0 : this.settings.stopSequences;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl("/completions"),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          stream: openaiResponseFormat.stream,
          model: this.settings.model,
          prompt,
          suffix: this.settings.suffix,
          max_tokens: this.settings.maxGenerationTokens,
          temperature: this.settings.temperature,
          top_p: this.settings.topP,
          n: this.settings.numberOfGenerations,
          logprobs: this.settings.logprobs,
          echo: this.settings.echo,
          stop: stopSequences,
          seed: this.settings.seed,
          presence_penalty: this.settings.presencePenalty,
          frequency_penalty: this.settings.frequencyPenalty,
          best_of: this.settings.bestOf,
          logit_bias: this.settings.logitBias,
          user
        },
        failedResponseHandler: failedOpenAICallResponseHandler,
        successfulResponseHandler: openaiResponseFormat.handler,
        abortSignal
      })
    });
  }
  async doGenerateTexts(prompt, options) {
    return this.processTextGenerationResponse(
      await this.callAPI(prompt, options, {
        responseFormat: OpenAITextResponseFormat.json
      })
    );
  }
  restoreGeneratedTexts(rawResponse) {
    return this.processTextGenerationResponse(
      validateTypes({
        value: rawResponse,
        schema: zodSchema(OpenAICompletionResponseSchema)
      })
    );
  }
  processTextGenerationResponse(rawResponse) {
    return {
      rawResponse,
      textGenerationResults: rawResponse.choices.map((choice) => {
        return {
          finishReason: this.translateFinishReason(choice.finish_reason),
          text: choice.text
        };
      }),
      usage: {
        promptTokens: rawResponse.usage.prompt_tokens,
        completionTokens: rawResponse.usage.completion_tokens,
        totalTokens: rawResponse.usage.total_tokens
      }
    };
  }
  translateFinishReason(finishReason) {
    switch (finishReason) {
      case "stop":
        return "stop";
      case "length":
        return "length";
      case "content_filter":
        return "content-filter";
      default:
        return "unknown";
    }
  }
  doStreamText(prompt, options) {
    return this.callAPI(prompt, options, {
      responseFormat: OpenAITextResponseFormat.deltaIterable
    });
  }
  extractTextDelta(delta) {
    const chunk = delta;
    const firstChoice = chunk.choices[0];
    if (firstChoice.index > 0) {
      return void 0;
    }
    return chunk.choices[0].text;
  }
  withJsonOutput() {
    return this;
  }
};
var OpenAICompletionResponseSchema = z25.object({
  id: z25.string(),
  choices: z25.array(
    z25.object({
      finish_reason: z25.enum(["stop", "length", "content_filter"]).optional().nullable(),
      index: z25.number(),
      logprobs: z25.nullable(z25.any()),
      text: z25.string()
    })
  ),
  created: z25.number(),
  model: z25.string(),
  system_fingerprint: z25.string().optional(),
  object: z25.literal("text_completion"),
  usage: z25.object({
    prompt_tokens: z25.number(),
    completion_tokens: z25.number(),
    total_tokens: z25.number()
  })
});
var openaiCompletionStreamChunkSchema = z25.object({
  choices: z25.array(
    z25.object({
      text: z25.string(),
      finish_reason: z25.enum(["stop", "length", "content_filter"]).optional().nullable(),
      index: z25.number()
    })
  ),
  created: z25.number(),
  id: z25.string(),
  model: z25.string(),
  system_fingerprint: z25.string().optional(),
  object: z25.literal("text_completion")
});
var OpenAITextResponseFormat = {
  /**
   * Returns the response as a JSON object.
   */
  json: {
    stream: false,
    handler: createJsonResponseHandler(
      zodSchema(OpenAICompletionResponseSchema)
    )
  },
  /**
   * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
   * of the response stream.
   */
  deltaIterable: {
    stream: true,
    handler: createEventSourceResponseHandler(
      zodSchema(openaiCompletionStreamChunkSchema)
    )
  }
};

// src/model-provider/openai/AbstractOpenAITextEmbeddingModel.ts
import { z as z26 } from "zod";
var AbstractOpenAITextEmbeddingModel = class extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  get maxValuesPerCall() {
    return this.settings.maxValuesPerCall ?? 2048;
  }
  isParallelizable = true;
  async callAPI(texts, callOptions) {
    const api = this.settings.api ?? new OpenAIApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl("/embeddings"),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          model: this.modelName,
          input: texts,
          dimensions: this.settings.dimensions,
          user: this.settings.isUserIdForwardingEnabled ? callOptions.run?.userId : void 0
        },
        failedResponseHandler: failedOpenAICallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(openAITextEmbeddingResponseSchema)
        ),
        abortSignal
      })
    });
  }
  async doEmbedValues(texts, callOptions) {
    if (texts.length > this.maxValuesPerCall) {
      throw new Error(
        `The OpenAI embedding API only supports ${this.maxValuesPerCall} texts per API call.`
      );
    }
    const rawResponse = await this.callAPI(texts, callOptions);
    return {
      rawResponse,
      embeddings: rawResponse.data.map((data) => data.embedding)
    };
  }
};
var openAITextEmbeddingResponseSchema = z26.object({
  object: z26.literal("list"),
  data: z26.array(
    z26.object({
      object: z26.literal("embedding"),
      embedding: z26.array(z26.number()),
      index: z26.number()
    })
  ),
  model: z26.string(),
  usage: z26.object({
    prompt_tokens: z26.number(),
    total_tokens: z26.number()
  }).optional()
  // for openai-compatible models
});

// src/model-provider/openai/AzureOpenAIApiConfiguration.ts
var AzureOpenAIApiConfiguration = class extends AbstractApiConfiguration {
  resourceName;
  deploymentId;
  apiVersion;
  fixedHeaderValue;
  constructor({
    resourceName,
    deploymentId,
    apiVersion,
    apiKey,
    retry,
    throttle
  }) {
    super({ retry, throttle });
    this.resourceName = resourceName;
    this.deploymentId = deploymentId;
    this.apiVersion = apiVersion;
    this.fixedHeaderValue = {
      "api-key": loadApiKey({
        apiKey,
        environmentVariableName: "AZURE_OPENAI_API_KEY",
        description: "Azure OpenAI"
      })
    };
  }
  assembleUrl(path) {
    return `https://${this.resourceName}.openai.azure.com/openai/deployments/${this.deploymentId}${path}?api-version=${this.apiVersion}`;
  }
  fixedHeaders() {
    return this.fixedHeaderValue;
  }
};

// src/model-provider/openai/OpenAIChatMessage.ts
var OpenAIChatMessage = {
  /**
   * Creates a system chat message.
   */
  system(content) {
    return { role: "system", content };
  },
  /**
   * Creates a user chat message. The message can be a string or a multi-modal input.
   */
  user(content, options) {
    return {
      role: "user",
      content: typeof content === "string" ? content : content.map((part) => {
        switch (part.type) {
          case "text": {
            return { type: "text", text: part.text };
          }
          case "image": {
            return {
              type: "image_url",
              image_url: `data:${part.mimeType ?? "image/jpeg"};base64,${convertDataContentToBase64String(part.image)}`
            };
          }
        }
      }),
      name: options?.name
    };
  },
  /**
   * Creates an assistant chat message.
   * The assistant message can optionally contain tool calls
   * or a function call (function calls are deprecated).
   */
  assistant(content, options) {
    return {
      role: "assistant",
      content,
      function_call: options?.functionCall == null ? void 0 : {
        name: options.functionCall.name,
        arguments: options.functionCall.arguments
      },
      tool_calls: options?.toolCalls?.map((toolCall) => ({
        id: toolCall.id,
        type: "function",
        function: {
          name: toolCall.name,
          arguments: JSON.stringify(toolCall.args)
        }
      })) ?? void 0
    };
  },
  /**
   * Creates a function result chat message for tool call results.
   *
   * @deprecated OpenAI functions are deprecated in favor of tools.
   */
  fn({
    fnName,
    content
  }) {
    return { role: "function", name: fnName, content: JSON.stringify(content) };
  },
  /**
   * Creates a tool result chat message with the result of a tool call.
   */
  tool({
    toolCallId,
    content
  }) {
    return {
      role: "tool",
      tool_call_id: toolCallId,
      content: JSON.stringify(content)
    };
  }
};

// src/model-provider/openai/OpenAIChatFunctionCallObjectGenerationModel.ts
import SecureJSON3 from "secure-json-parse";

// src/model-provider/openai/OpenAIChatPromptTemplate.ts
function identity() {
  return { format: (prompt) => prompt, stopSequences: [] };
}
function text12() {
  return {
    format: (prompt) => [OpenAIChatMessage.user(prompt)],
    stopSequences: []
  };
}
function instruction12() {
  return {
    format(prompt) {
      const messages = [];
      if (prompt.system != null) {
        messages.push(OpenAIChatMessage.system(prompt.system));
      }
      messages.push(OpenAIChatMessage.user(prompt.instruction));
      return messages;
    },
    stopSequences: []
  };
}
function chat12() {
  return {
    format(prompt) {
      const messages = [];
      if (prompt.system != null) {
        messages.push(OpenAIChatMessage.system(prompt.system));
      }
      for (const { role, content } of prompt.messages) {
        switch (role) {
          case "user": {
            messages.push(OpenAIChatMessage.user(content));
            break;
          }
          case "assistant": {
            if (typeof content === "string") {
              messages.push(OpenAIChatMessage.assistant(content));
            } else {
              let text13 = "";
              const toolCalls = [];
              for (const part of content) {
                switch (part.type) {
                  case "text": {
                    text13 += part.text;
                    break;
                  }
                  case "tool-call": {
                    toolCalls.push({
                      id: part.id,
                      type: "function",
                      function: {
                        name: part.name,
                        arguments: JSON.stringify(part.args)
                      }
                    });
                    break;
                  }
                  default: {
                    const _exhaustiveCheck = part;
                    throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
                  }
                }
              }
              messages.push({
                role: "assistant",
                content: text13,
                tool_calls: toolCalls
              });
            }
            break;
          }
          case "tool": {
            for (const toolResponse of content) {
              messages.push({
                role: "tool",
                tool_call_id: toolResponse.id,
                content: JSON.stringify(toolResponse.response)
              });
            }
            break;
          }
          default: {
            const _exhaustiveCheck = role;
            throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
          }
        }
      }
      return messages;
    },
    stopSequences: []
  };
}

// src/model-provider/openai/OpenAIChatFunctionCallObjectGenerationModel.ts
var OpenAIChatFunctionCallObjectGenerationModel = class _OpenAIChatFunctionCallObjectGenerationModel {
  model;
  fnName;
  fnDescription;
  promptTemplate;
  constructor({
    model,
    fnName,
    fnDescription,
    promptTemplate
  }) {
    this.model = model;
    this.fnName = fnName;
    this.fnDescription = fnDescription;
    this.promptTemplate = promptTemplate;
  }
  get modelInformation() {
    return this.model.modelInformation;
  }
  get settings() {
    return {
      ...this.model.settings,
      fnName: this.fnName,
      fnDescription: this.fnDescription
    };
  }
  get settingsForEvent() {
    return {
      ...this.model.settingsForEvent,
      fnName: this.fnName,
      fnDescription: this.fnDescription
    };
  }
  /**
   * Returns this model with a text prompt template.
   */
  withTextPrompt() {
    return this.withPromptTemplate(text12());
  }
  /**
   * Returns this model with an instruction prompt template.
   */
  withInstructionPrompt() {
    return this.withPromptTemplate(instruction12());
  }
  /**
   * Returns this model with a chat prompt template.
   */
  withChatPrompt() {
    return this.withPromptTemplate(chat12());
  }
  withPromptTemplate(promptTemplate) {
    return new _OpenAIChatFunctionCallObjectGenerationModel({
      model: this.model,
      fnName: this.fnName,
      fnDescription: this.fnDescription,
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _OpenAIChatFunctionCallObjectGenerationModel({
      model: this.model.withSettings(additionalSettings),
      fnName: this.fnName,
      fnDescription: this.fnDescription,
      promptTemplate: this.promptTemplate
    });
  }
  /**
   * JSON generation uses the OpenAI GPT function calling API.
   * It provides a single function specification and instructs the model to provide parameters for calling the function.
   * The result is returned as parsed JSON.
   *
   * @see https://platform.openai.com/docs/guides/gpt/function-calling
   */
  async doGenerateObject(schema, prompt, options) {
    const expandedPrompt = this.promptTemplate.format(prompt);
    const rawResponse = await this.model.withSettings({
      stopSequences: [
        ...this.settings.stopSequences ?? [],
        ...this.promptTemplate.stopSequences
      ]
    }).callAPI(expandedPrompt, options, {
      responseFormat: OpenAIChatResponseFormat.json,
      functionCall: { name: this.fnName },
      functions: [
        {
          name: this.fnName,
          description: this.fnDescription,
          parameters: schema.getJsonSchema()
        }
      ]
    });
    const valueText = rawResponse.choices[0].message.function_call.arguments;
    try {
      return {
        rawResponse,
        valueText,
        value: SecureJSON3.parse(valueText),
        usage: this.model.extractUsage(rawResponse)
      };
    } catch (error) {
      throw new ObjectParseError({
        valueText,
        cause: error
      });
    }
  }
  async doStreamObject(schema, prompt, options) {
    const expandedPrompt = this.promptTemplate.format(prompt);
    return this.model.callAPI(expandedPrompt, options, {
      responseFormat: OpenAIChatResponseFormat.deltaIterable,
      functionCall: { name: this.fnName },
      functions: [
        {
          name: this.fnName,
          description: this.fnDescription,
          parameters: schema.getJsonSchema()
        }
      ]
    });
  }
  extractObjectTextDelta(delta) {
    const chunk = delta;
    if (chunk.object !== "chat.completion.chunk") {
      return void 0;
    }
    const chatChunk = chunk;
    const firstChoice = chatChunk.choices[0];
    if (firstChoice.index > 0) {
      return void 0;
    }
    return firstChoice.delta.function_call?.arguments;
  }
  parseAccumulatedObjectText(accumulatedText) {
    return parsePartialJson(accumulatedText);
  }
};

// src/model-provider/openai/TikTokenTokenizer.ts
import { Tiktoken } from "js-tiktoken/lite";
import cl100k_base from "js-tiktoken/ranks/cl100k_base";

// src/util/never.ts
function never(_) {
}

// src/model-provider/openai/TikTokenTokenizer.ts
var TikTokenTokenizer = class {
  /**
   * Get a TikToken tokenizer for a specific model or encoding.
   */
  constructor(settings) {
    this.tiktoken = new Tiktoken(getTiktokenBPE(settings.model));
  }
  tiktoken;
  async tokenize(text13) {
    return this.tiktoken.encode(text13);
  }
  async tokenizeWithTexts(text13) {
    const tokens = this.tiktoken.encode(text13);
    return {
      tokens,
      tokenTexts: tokens.map((token) => this.tiktoken.decode([token]))
    };
  }
  async detokenize(tokens) {
    return this.tiktoken.decode(tokens);
  }
};
function getTiktokenBPE(model) {
  switch (model) {
    case "gpt-3.5-turbo":
    case "gpt-3.5-turbo-0301":
    case "gpt-3.5-turbo-0613":
    case "gpt-3.5-turbo-1106":
    case "gpt-3.5-turbo-0125":
    case "gpt-3.5-turbo-16k":
    case "gpt-3.5-turbo-16k-0613":
    case "gpt-3.5-turbo-instruct":
    case "gpt-4":
    case "gpt-4o":
    case "gpt-4-0314":
    case "gpt-4-0613":
    case "gpt-4-turbo-preview":
    case "gpt-4-1106-preview":
    case "gpt-4-0125-preview":
    case "gpt-4-vision-preview":
    case "gpt-4-32k":
    case "gpt-4-32k-0314":
    case "gpt-4-32k-0613":
    case "text-embedding-3-small":
    case "text-embedding-3-large":
    case "text-embedding-ada-002": {
      return cl100k_base;
    }
    default: {
      never(model);
      throw new Error(`Unknown model: ${model}`);
    }
  }
}

// src/model-provider/openai/countOpenAIChatMessageTokens.ts
var OPENAI_CHAT_PROMPT_BASE_TOKEN_COUNT = 2;
var OPENAI_CHAT_MESSAGE_BASE_TOKEN_COUNT = 5;
async function countOpenAIChatMessageTokens({
  message,
  model
}) {
  const tokenizer = new TikTokenTokenizer({
    model: getOpenAIChatModelInformation(model).baseModel
  });
  if (message.content == null) {
    return OPENAI_CHAT_MESSAGE_BASE_TOKEN_COUNT;
  }
  if (typeof message.content === "string") {
    return OPENAI_CHAT_MESSAGE_BASE_TOKEN_COUNT + await countTokens(tokenizer, message.content);
  }
  let contentTokenCount = OPENAI_CHAT_MESSAGE_BASE_TOKEN_COUNT;
  for (const content of message.content) {
    if (content.type === "text") {
      contentTokenCount += await countTokens(tokenizer, content.text);
    }
  }
  return contentTokenCount;
}
async function countOpenAIChatPromptTokens({
  messages,
  model
}) {
  let tokens = OPENAI_CHAT_PROMPT_BASE_TOKEN_COUNT;
  for (const message of messages) {
    tokens += await countOpenAIChatMessageTokens({ message, model });
  }
  return tokens;
}

// src/model-provider/openai/OpenAIChatModel.ts
var CHAT_MODEL_CONTEXT_WINDOW_SIZES = {
  "gpt-4": 8192,
  "gpt-4o": 128e3,
  "gpt-4-0314": 8192,
  "gpt-4-0613": 8192,
  "gpt-4-turbo-preview": 128e3,
  "gpt-4-1106-preview": 128e3,
  "gpt-4-0125-preview": 128e3,
  "gpt-4-vision-preview": 128e3,
  "gpt-4-32k": 32768,
  "gpt-4-32k-0314": 32768,
  "gpt-4-32k-0613": 32768,
  "gpt-3.5-turbo": 4096,
  "gpt-3.5-turbo-0125": 16385,
  "gpt-3.5-turbo-1106": 16385,
  "gpt-3.5-turbo-0301": 4096,
  "gpt-3.5-turbo-0613": 4096,
  "gpt-3.5-turbo-16k": 16384,
  "gpt-3.5-turbo-16k-0613": 16384
};
function getOpenAIChatModelInformation(model) {
  if (model in CHAT_MODEL_CONTEXT_WINDOW_SIZES) {
    const contextWindowSize = CHAT_MODEL_CONTEXT_WINDOW_SIZES[model];
    return {
      baseModel: model,
      isFineTuned: false,
      contextWindowSize
    };
  }
  const [_, baseModel, ___, ____, _____] = model.split(":");
  if (["gpt-3.5-turbo", "gpt-3.5-turbo-0613", "gpt-4-0613", "gpt-4o"].includes(
    baseModel
  )) {
    const contextWindowSize = CHAT_MODEL_CONTEXT_WINDOW_SIZES[baseModel];
    return {
      baseModel,
      isFineTuned: true,
      contextWindowSize
    };
  }
  throw new Error(`Unknown OpenAI chat base model ${baseModel}.`);
}
var OpenAIChatModel = class _OpenAIChatModel extends AbstractOpenAIChatModel {
  constructor(settings) {
    super(settings);
    const modelInformation = getOpenAIChatModelInformation(this.settings.model);
    this.tokenizer = new TikTokenTokenizer({
      model: modelInformation.baseModel
    });
    this.contextWindowSize = modelInformation.contextWindowSize;
  }
  provider = "openai";
  get modelName() {
    return this.settings.model;
  }
  contextWindowSize;
  tokenizer;
  /**
   * Counts the prompt tokens required for the messages. This includes the message base tokens
   * and the prompt base tokens.
   */
  countPromptTokens(messages) {
    return countOpenAIChatPromptTokens({
      messages,
      model: this.modelName
    });
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      ...textGenerationModelProperties,
      "functions",
      "functionCall",
      "temperature",
      "topP",
      "presencePenalty",
      "frequencyPenalty",
      "logitBias",
      "seed",
      "responseFormat"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  asFunctionCallObjectGenerationModel({
    fnName,
    fnDescription
  }) {
    return new OpenAIChatFunctionCallObjectGenerationModel({
      model: this,
      fnName,
      fnDescription,
      promptTemplate: identity()
    });
  }
  asObjectGenerationModel(promptTemplate) {
    return "adaptModel" in promptTemplate ? new ObjectFromTextStreamingModel({
      model: promptTemplate.adaptModel(this),
      template: promptTemplate
    }) : new ObjectFromTextStreamingModel({
      model: this,
      template: promptTemplate
    });
  }
  withTextPrompt() {
    return this.withPromptTemplate(text12());
  }
  withInstructionPrompt() {
    return this.withPromptTemplate(instruction12());
  }
  withChatPrompt() {
    return this.withPromptTemplate(chat12());
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateFullTextModel({
      model: this.withSettings({
        stopSequences: [
          ...this.settings.stopSequences ?? [],
          ...promptTemplate.stopSequences
        ]
      }),
      promptTemplate
    });
  }
  withJsonOutput() {
    return this.withSettings({ responseFormat: { type: "json_object" } });
  }
  withSettings(additionalSettings) {
    return new _OpenAIChatModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};

// src/model-provider/openai/OpenAICompletionModel.ts
var OPENAI_TEXT_GENERATION_MODELS = {
  "gpt-3.5-turbo-instruct": {
    contextWindowSize: 4097
  }
};
function getOpenAICompletionModelInformation(model) {
  return OPENAI_TEXT_GENERATION_MODELS[model];
}
var OpenAICompletionModel = class _OpenAICompletionModel extends AbstractOpenAICompletionModel {
  constructor(settings) {
    super(settings);
    const modelInformation = getOpenAICompletionModelInformation(
      this.settings.model
    );
    this.tokenizer = new TikTokenTokenizer({
      model: this.settings.model
    });
    this.contextWindowSize = modelInformation.contextWindowSize;
  }
  provider = "openai";
  get modelName() {
    return this.settings.model;
  }
  contextWindowSize;
  tokenizer;
  async countPromptTokens(input) {
    return countTokens(this.tokenizer, input);
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      ...textGenerationModelProperties,
      "suffix",
      "temperature",
      "topP",
      "logprobs",
      "echo",
      "presencePenalty",
      "frequencyPenalty",
      "bestOf",
      "logitBias",
      "seed"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  withTextPrompt() {
    return this.withPromptTemplate(text7());
  }
  withInstructionPrompt() {
    return this.withPromptTemplate(instruction7());
  }
  withChatPrompt(options) {
    return this.withPromptTemplate(chat7(options));
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateTextStreamingModel({
      model: this.withSettings({
        stopSequences: [
          ...this.settings.stopSequences ?? [],
          ...promptTemplate.stopSequences
        ]
      }),
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _OpenAICompletionModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};

// src/model-provider/openai/OpenAIFacade.ts
var OpenAIFacade_exports = {};
__export(OpenAIFacade_exports, {
  Api: () => Api9,
  AzureApi: () => AzureApi,
  ChatMessage: () => OpenAIChatMessage,
  ChatTextGenerator: () => ChatTextGenerator3,
  CompletionTextGenerator: () => CompletionTextGenerator3,
  ImageGenerator: () => ImageGenerator2,
  SpeechGenerator: () => SpeechGenerator3,
  TextEmbedder: () => TextEmbedder6,
  Tokenizer: () => Tokenizer3,
  Transcriber: () => Transcriber
});

// src/model-provider/openai/OpenAIImageGenerationModel.ts
import { z as z27 } from "zod";
var OpenAIImageGenerationModel = class _OpenAIImageGenerationModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "openai";
  get modelName() {
    return this.settings.model;
  }
  async callAPI(prompt, callOptions, options) {
    const api = this.settings.api ?? new OpenAIApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    const userId = callOptions.run?.userId;
    const responseFormat = options.responseFormat;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl("/images/generations"),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          prompt,
          n: this.settings.numberOfGenerations,
          size: this.settings.size,
          response_format: responseFormat.type,
          user: this.settings.isUserIdForwardingEnabled ? userId : void 0
        },
        failedResponseHandler: failedOpenAICallResponseHandler,
        successfulResponseHandler: responseFormat.handler,
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    const eventSettingProperties = [
      "numberOfGenerations",
      "size",
      "quality",
      "style"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  async doGenerateImages(prompt, options) {
    const rawResponse = await this.callAPI(prompt, options, {
      responseFormat: OpenAIImageGenerationResponseFormat.base64Json
    });
    return {
      rawResponse,
      base64Images: rawResponse.data.map((item) => item.b64_json)
    };
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateImageGenerationModel({
      model: this,
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _OpenAIImageGenerationModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var openAIImageGenerationUrlSchema = z27.object({
  created: z27.number(),
  data: z27.array(
    z27.object({
      url: z27.string()
    })
  )
});
var openAIImageGenerationBase64JsonSchema = z27.object({
  created: z27.number(),
  data: z27.array(
    z27.object({
      b64_json: z27.string()
    })
  )
});
var OpenAIImageGenerationResponseFormat = {
  url: {
    type: "url",
    handler: createJsonResponseHandler(
      zodSchema(openAIImageGenerationUrlSchema)
    )
  },
  base64Json: {
    type: "b64_json",
    handler: createJsonResponseHandler(
      zodSchema(openAIImageGenerationBase64JsonSchema)
    )
  }
};

// src/model-provider/openai/OpenAISpeechModel.ts
var OpenAISpeechModel = class _OpenAISpeechModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "openai";
  get voice() {
    return this.settings.voice;
  }
  get modelName() {
    return this.settings.model;
  }
  async callAPI(text13, callOptions) {
    const api = this.settings.api ?? new OpenAIApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(`/audio/speech`),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          input: text13,
          voice: this.settings.voice,
          speed: this.settings.speed,
          model: this.settings.model,
          response_format: this.settings.responseFormat
        },
        failedResponseHandler: failedOpenAICallResponseHandler,
        successfulResponseHandler: createAudioMpegResponseHandler(),
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    return {
      voice: this.settings.voice,
      speed: this.settings.speed,
      model: this.settings.model,
      responseFormat: this.settings.responseFormat
    };
  }
  doGenerateSpeechStandard(text13, options) {
    return this.callAPI(text13, options);
  }
  withSettings(additionalSettings) {
    return new _OpenAISpeechModel({
      ...this.settings,
      ...additionalSettings
    });
  }
};

// src/model-provider/openai/OpenAITextEmbeddingModel.ts
import z28 from "zod";
var OPENAI_TEXT_EMBEDDING_MODELS = {
  "text-embedding-3-small": {
    contextWindowSize: 8192,
    dimensions: 1536
  },
  "text-embedding-3-large": {
    contextWindowSize: 8192,
    dimensions: 3072
  },
  "text-embedding-ada-002": {
    contextWindowSize: 8192,
    dimensions: 1536
  }
};
var openAITextEmbeddingResponseSchema2 = z28.object({
  object: z28.literal("list"),
  data: z28.array(
    z28.object({
      object: z28.literal("embedding"),
      embedding: z28.array(z28.number()),
      index: z28.number()
    })
  ),
  model: z28.string(),
  usage: z28.object({
    prompt_tokens: z28.number(),
    total_tokens: z28.number()
  }).optional()
  // for openai-compatible models
});
var OpenAITextEmbeddingModel = class _OpenAITextEmbeddingModel extends AbstractOpenAITextEmbeddingModel {
  constructor(settings) {
    super(settings);
    this.tokenizer = new TikTokenTokenizer({ model: this.modelName });
    this.contextWindowSize = OPENAI_TEXT_EMBEDDING_MODELS[this.modelName].contextWindowSize;
    this.dimensions = this.settings.dimensions ?? OPENAI_TEXT_EMBEDDING_MODELS[this.modelName].dimensions;
  }
  provider = "openai";
  get modelName() {
    return this.settings.model;
  }
  dimensions;
  tokenizer;
  contextWindowSize;
  async countTokens(input) {
    return countTokens(this.tokenizer, input);
  }
  get settingsForEvent() {
    return {};
  }
  withSettings(additionalSettings) {
    return new _OpenAITextEmbeddingModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};

// src/model-provider/openai/OpenAITranscriptionModel.ts
import { z as z29 } from "zod";

// src/util/audio/getAudioFileExtension.ts
function getAudioFileExtension(mimeType) {
  const normalizedMimeType = mimeType.split(";")[0].toLowerCase();
  switch (normalizedMimeType) {
    case "audio/webm":
      return "webm";
    case "audio/mp3":
      return "mp3";
    case "audio/wav":
      return "wav";
    case "audio/mp4":
      return "mp4";
    case "audio/mpeg":
    case "audio/mpga":
      return "mpeg";
    case "audio/ogg":
    case "audio/oga":
      return "ogg";
    case "audio/flac":
      return "flac";
    case "audio/m4a":
      return "m4a";
    default:
      throw new Error(`Unsupported audio format: ${mimeType}`);
  }
}

// src/model-provider/openai/OpenAITranscriptionModel.ts
var OpenAITranscriptionModel = class _OpenAITranscriptionModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "openai";
  get modelName() {
    return this.settings.model;
  }
  async doTranscribe({
    audioData,
    mimeType
  }, options) {
    const rawResponse = await this.callAPI(
      {
        fileExtension: getAudioFileExtension(mimeType),
        audioData: convertDataContentToUint8Array(audioData)
      },
      options,
      { responseFormat: OpenAITranscriptionResponseFormat.verboseJson }
    );
    return {
      rawResponse,
      transcription: rawResponse.text
    };
  }
  async callAPI(input, callOptions, options) {
    const api = this.settings.api ?? new OpenAIApiConfiguration();
    const abortSignal = callOptions?.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => {
        const fileName = `audio.${input.fileExtension}`;
        const formData = new FormData();
        formData.append("file", new Blob([input.audioData]), fileName);
        formData.append("model", this.settings.model);
        if (this.settings.prompt != null) {
          formData.append("prompt", this.settings.prompt);
        }
        if (options.responseFormat != null) {
          formData.append("response_format", options.responseFormat.type);
        }
        if (this.settings.temperature != null) {
          formData.append("temperature", this.settings.temperature.toString());
        }
        if (this.settings.language != null) {
          formData.append("language", this.settings.language);
        }
        return postToApi({
          url: api.assembleUrl("/audio/transcriptions"),
          headers: api.headers({
            functionType: callOptions.functionType,
            functionId: callOptions.functionId,
            run: callOptions.run,
            callId: callOptions.callId
          }),
          body: {
            content: formData,
            values: {
              model: this.settings.model,
              prompt: this.settings.prompt,
              response_format: options.responseFormat,
              temperature: this.settings.temperature,
              language: this.settings.language
            }
          },
          failedResponseHandler: failedOpenAICallResponseHandler,
          successfulResponseHandler: options.responseFormat.handler,
          abortSignal
        });
      }
    });
  }
  get settingsForEvent() {
    return {
      language: this.settings.language,
      temperature: this.settings.temperature
    };
  }
  withSettings(additionalSettings) {
    return new _OpenAITranscriptionModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var openAITranscriptionJsonSchema = z29.object({
  text: z29.string()
});
var openAITranscriptionVerboseJsonSchema = z29.object({
  task: z29.literal("transcribe"),
  language: z29.string(),
  duration: z29.number(),
  segments: z29.array(
    z29.object({
      id: z29.number(),
      seek: z29.number(),
      start: z29.number(),
      end: z29.number(),
      text: z29.string(),
      tokens: z29.array(z29.number()),
      temperature: z29.number(),
      avg_logprob: z29.number(),
      compression_ratio: z29.number(),
      no_speech_prob: z29.number(),
      transient: z29.boolean().optional()
    })
  ),
  text: z29.string()
});
var OpenAITranscriptionResponseFormat = {
  json: {
    type: "json",
    handler: createJsonResponseHandler(
      zodSchema(openAITranscriptionJsonSchema)
    )
  },
  verboseJson: {
    type: "verbose_json",
    handler: createJsonResponseHandler(
      zodSchema(openAITranscriptionVerboseJsonSchema)
    )
  },
  text: {
    type: "text",
    handler: createTextResponseHandler()
  },
  srt: {
    type: "srt",
    handler: createTextResponseHandler()
  },
  vtt: {
    type: "vtt",
    handler: createTextResponseHandler()
  }
};

// src/model-provider/openai/OpenAIFacade.ts
function Api9(settings) {
  return new OpenAIApiConfiguration(settings);
}
function AzureApi(settings) {
  return new AzureOpenAIApiConfiguration(settings);
}
function CompletionTextGenerator3(settings) {
  return new OpenAICompletionModel(settings);
}
function ChatTextGenerator3(settings) {
  return new OpenAIChatModel(settings);
}
function TextEmbedder6(settings) {
  return new OpenAITextEmbeddingModel(settings);
}
function SpeechGenerator3(settings) {
  return new OpenAISpeechModel(settings);
}
function Transcriber(settings) {
  return new OpenAITranscriptionModel(settings);
}
function ImageGenerator2(settings) {
  return new OpenAIImageGenerationModel(settings);
}
function Tokenizer3(settings) {
  return new TikTokenTokenizer(settings);
}

// src/model-provider/openai-compatible/FireworksAIApiConfiguration.ts
var FireworksAIApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      headers: {
        Authorization: `Bearer ${loadApiKey({
          apiKey: settings.apiKey,
          environmentVariableName: "FIREWORKS_API_KEY",
          description: "Fireworks AI"
        })}`
      },
      baseUrlDefaults: {
        protocol: "https",
        host: "api.fireworks.ai",
        port: "443",
        path: "/inference/v1"
      }
    });
  }
  provider = "openaicompatible-fireworksai";
};

// src/model-provider/openai-compatible/OpenAICompatibleChatModel.ts
var OpenAICompatibleChatModel = class _OpenAICompatibleChatModel extends AbstractOpenAIChatModel {
  constructor(settings) {
    super(settings);
  }
  get provider() {
    return this.settings.provider ?? this.settings.api.provider ?? "openaicompatible";
  }
  get modelName() {
    return this.settings.model;
  }
  contextWindowSize = void 0;
  tokenizer = void 0;
  countPromptTokens = void 0;
  get settingsForEvent() {
    const eventSettingProperties = [
      ...textGenerationModelProperties,
      "functions",
      "functionCall",
      "temperature",
      "topP",
      "presencePenalty",
      "frequencyPenalty",
      "logitBias",
      "seed",
      "responseFormat"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  asObjectGenerationModel(promptTemplate) {
    return "adaptModel" in promptTemplate ? new ObjectFromTextStreamingModel({
      model: promptTemplate.adaptModel(this),
      template: promptTemplate
    }) : new ObjectFromTextStreamingModel({
      model: this,
      template: promptTemplate
    });
  }
  withTextPrompt() {
    return this.withPromptTemplate(text12());
  }
  withInstructionPrompt() {
    return this.withPromptTemplate(instruction12());
  }
  withChatPrompt() {
    return this.withPromptTemplate(chat12());
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateFullTextModel({
      model: this.withSettings({
        stopSequences: [
          ...this.settings.stopSequences ?? [],
          ...promptTemplate.stopSequences
        ]
      }),
      promptTemplate
    });
  }
  withJsonOutput() {
    return this.withSettings({ responseFormat: { type: "json_object" } });
  }
  withSettings(additionalSettings) {
    return new _OpenAICompatibleChatModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};

// src/model-provider/openai-compatible/OpenAICompatibleCompletionModel.ts
var OpenAICompatibleCompletionModel = class _OpenAICompatibleCompletionModel extends AbstractOpenAICompletionModel {
  constructor(settings) {
    super(settings);
  }
  get provider() {
    return this.settings.provider ?? this.settings.api.provider ?? "openaicompatible";
  }
  get modelName() {
    return this.settings.model;
  }
  contextWindowSize = void 0;
  tokenizer = void 0;
  countPromptTokens = void 0;
  get settingsForEvent() {
    const eventSettingProperties = [
      ...textGenerationModelProperties,
      "suffix",
      "temperature",
      "topP",
      "logprobs",
      "echo",
      "presencePenalty",
      "frequencyPenalty",
      "bestOf",
      "logitBias",
      "seed"
    ];
    return Object.fromEntries(
      Object.entries(this.settings).filter(
        ([key]) => eventSettingProperties.includes(key)
      )
    );
  }
  withTextPrompt() {
    return this.withPromptTemplate(text7());
  }
  withInstructionPrompt() {
    return this.withPromptTemplate(instruction7());
  }
  withChatPrompt(options) {
    return this.withPromptTemplate(chat7(options));
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateTextStreamingModel({
      model: this.withSettings({
        stopSequences: [
          ...this.settings.stopSequences ?? [],
          ...promptTemplate.stopSequences
        ]
      }),
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _OpenAICompatibleCompletionModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};

// src/model-provider/openai-compatible/OpenAICompatibleFacade.ts
var OpenAICompatibleFacade_exports = {};
__export(OpenAICompatibleFacade_exports, {
  ChatTextGenerator: () => ChatTextGenerator4,
  CompletionTextGenerator: () => CompletionTextGenerator4,
  FireworksAIApi: () => FireworksAIApi,
  PerplexityApi: () => PerplexityApi,
  TextEmbedder: () => TextEmbedder7,
  TogetherAIApi: () => TogetherAIApi
});

// src/model-provider/openai-compatible/OpenAICompatibleTextEmbeddingModel.ts
var OpenAICompatibleTextEmbeddingModel = class _OpenAICompatibleTextEmbeddingModel extends AbstractOpenAITextEmbeddingModel {
  constructor(settings) {
    super(settings);
  }
  get provider() {
    return this.settings.provider ?? this.settings.api.provider ?? "openaicompatible";
  }
  get modelName() {
    return this.settings.model;
  }
  get dimensions() {
    return this.settings.dimensions;
  }
  get settingsForEvent() {
    return {
      dimensions: this.settings.dimensions
    };
  }
  withSettings(additionalSettings) {
    return new _OpenAICompatibleTextEmbeddingModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};

// src/model-provider/openai-compatible/PerplexityApiConfiguration.ts
var PerplexityApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      headers: {
        Authorization: `Bearer ${loadApiKey({
          apiKey: settings.apiKey,
          environmentVariableName: "PERPLEXITY_API_KEY",
          description: "Perplexity"
        })}`
      },
      baseUrlDefaults: {
        protocol: "https",
        host: "api.perplexity.ai",
        port: "443",
        path: ""
      }
    });
  }
  provider = "openaicompatible-perplexity";
};

// src/model-provider/openai-compatible/TogetherAIApiConfiguration.ts
var TogetherAIApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      headers: {
        Authorization: `Bearer ${loadApiKey({
          apiKey: settings.apiKey,
          environmentVariableName: "TOGETHER_API_KEY",
          description: "Together AI"
        })}`
      },
      baseUrlDefaults: {
        protocol: "https",
        host: "api.together.xyz",
        port: "443",
        path: "/v1"
      }
    });
  }
  provider = "openaicompatible-togetherai";
};

// src/model-provider/openai-compatible/OpenAICompatibleFacade.ts
function FireworksAIApi(settings = {}) {
  return new FireworksAIApiConfiguration(settings);
}
function PerplexityApi(settings = {}) {
  return new PerplexityApiConfiguration(settings);
}
function TogetherAIApi(settings = {}) {
  return new TogetherAIApiConfiguration(settings);
}
function CompletionTextGenerator4(settings) {
  return new OpenAICompatibleCompletionModel(settings);
}
function ChatTextGenerator4(settings) {
  return new OpenAICompatibleChatModel(settings);
}
function TextEmbedder7(settings) {
  return new OpenAICompatibleTextEmbeddingModel(settings);
}

// src/model-provider/stability/StabilityApiConfiguration.ts
var StabilityApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      headers: settings.headers ?? {
        Authorization: `Bearer ${loadApiKey({
          apiKey: settings.apiKey,
          environmentVariableName: "STABILITY_API_KEY",
          description: "Stability"
        })}`
      },
      baseUrlDefaults: {
        protocol: "https",
        host: "api.stability.ai",
        port: "443",
        path: "/v1"
      }
    });
  }
};

// src/model-provider/stability/StabilityError.ts
import { z as z30 } from "zod";
var stabilityErrorDataSchema = z30.object({
  message: z30.string()
});
var failedStabilityCallResponseHandler = createJsonErrorResponseHandler({
  errorSchema: zodSchema(stabilityErrorDataSchema),
  errorToMessage: (error) => error.message
});

// src/model-provider/stability/StabilityFacade.ts
var StabilityFacade_exports = {};
__export(StabilityFacade_exports, {
  Api: () => Api10,
  ImageGenerator: () => ImageGenerator3
});

// src/model-provider/stability/StabilityImageGenerationModel.ts
import { z as z31 } from "zod";

// src/model-provider/stability/StabilityImageGenerationPrompt.ts
function mapBasicPromptToStabilityFormat() {
  return {
    format: (description) => [{ text: description }]
  };
}

// src/model-provider/stability/StabilityImageGenerationModel.ts
var StabilityImageGenerationModel = class _StabilityImageGenerationModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "stability";
  get modelName() {
    return this.settings.model;
  }
  async callAPI(input, callOptions) {
    const api = this.settings.api ?? new StabilityApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: this.settings.api?.retry,
      throttle: this.settings.api?.throttle,
      call: async () => postJsonToApi({
        url: api.assembleUrl(
          `/generation/${this.settings.model}/text-to-image`
        ),
        headers: api.headers({
          functionType: callOptions.functionType,
          functionId: callOptions.functionId,
          run: callOptions.run,
          callId: callOptions.callId
        }),
        body: {
          height: this.settings.height,
          width: this.settings.width,
          text_prompts: input,
          cfg_scale: this.settings.cfgScale,
          clip_guidance_preset: this.settings.clipGuidancePreset,
          sampler: this.settings.sampler,
          samples: this.settings.numberOfGenerations,
          seed: this.settings.seed,
          steps: this.settings.steps,
          style_preset: this.settings.stylePreset
        },
        failedResponseHandler: failedStabilityCallResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          zodSchema(stabilityImageGenerationResponseSchema)
        ),
        abortSignal
      })
    });
  }
  get settingsForEvent() {
    return {
      numberOfGenerations: this.settings.numberOfGenerations,
      height: this.settings.height,
      width: this.settings.width,
      cfgScale: this.settings.cfgScale,
      clipGuidancePreset: this.settings.clipGuidancePreset,
      sampler: this.settings.sampler,
      seed: this.settings.seed,
      steps: this.settings.steps,
      stylePreset: this.settings.stylePreset
    };
  }
  async doGenerateImages(prompt, callOptions) {
    const rawResponse = await this.callAPI(prompt, callOptions);
    return {
      rawResponse,
      base64Images: rawResponse.artifacts.map((artifact) => artifact.base64)
    };
  }
  withTextPrompt() {
    return this.withPromptTemplate(mapBasicPromptToStabilityFormat());
  }
  withPromptTemplate(promptTemplate) {
    return new PromptTemplateImageGenerationModel({
      model: this,
      promptTemplate
    });
  }
  withSettings(additionalSettings) {
    return new _StabilityImageGenerationModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var stabilityImageGenerationResponseSchema = z31.object({
  artifacts: z31.array(
    z31.object({
      base64: z31.string(),
      seed: z31.number(),
      finishReason: z31.enum(["SUCCESS", "ERROR", "CONTENT_FILTERED"])
    })
  )
});

// src/model-provider/stability/StabilityFacade.ts
function Api10(settings) {
  return new StabilityApiConfiguration(settings);
}
function ImageGenerator3(settings) {
  return new StabilityImageGenerationModel(settings);
}

// src/model-provider/whispercpp/WhisperCppApiConfiguration.ts
var WhisperCppApiConfiguration = class extends BaseUrlApiConfigurationWithDefaults {
  constructor(settings = {}) {
    super({
      ...settings,
      baseUrlDefaults: {
        protocol: "http",
        host: "127.0.0.1",
        port: "8080",
        path: ""
      }
    });
  }
};

// src/model-provider/whispercpp/WhisperCppFacade.ts
var WhisperCppFacade_exports = {};
__export(WhisperCppFacade_exports, {
  Api: () => Api11,
  Transcriber: () => Transcriber2
});

// src/model-provider/whispercpp/WhisperCppTranscriptionModel.ts
import { z as z32 } from "zod";
var WhisperCppTranscriptionModel = class _WhisperCppTranscriptionModel extends AbstractModel {
  constructor(settings) {
    super({ settings });
  }
  provider = "whispercpp";
  modelName = null;
  async doTranscribe({
    audioData,
    mimeType
  }, options) {
    const rawResponse = await this.callAPI(
      {
        fileExtension: getAudioFileExtension(mimeType),
        audioData: convertDataContentToUint8Array(audioData)
      },
      options
    );
    return {
      rawResponse,
      transcription: rawResponse.text
    };
  }
  async callAPI(input, callOptions) {
    const { temperature } = this.settings;
    const api = this.settings.api ?? new WhisperCppApiConfiguration();
    const abortSignal = callOptions.run?.abortSignal;
    return callWithRetryAndThrottle({
      retry: api.retry,
      throttle: api.throttle,
      call: async () => {
        const formData = new FormData();
        formData.append(
          "file",
          new Blob([input.audioData]),
          `audio.${input.fileExtension}`
        );
        formData.append("response_format", "json");
        if (temperature != null) {
          formData.append("temperature", temperature.toString());
        }
        return postToApi({
          url: api.assembleUrl("/inference"),
          headers: api.headers({
            functionType: callOptions.functionType,
            functionId: callOptions.functionId,
            run: callOptions.run,
            callId: callOptions.callId
          }),
          body: {
            content: formData,
            values: { temperature }
          },
          failedResponseHandler,
          successfulResponseHandler,
          abortSignal
        });
      }
    });
  }
  get settingsForEvent() {
    return {
      temperature: this.settings.temperature
    };
  }
  withSettings(additionalSettings) {
    return new _WhisperCppTranscriptionModel(
      Object.assign({}, this.settings, additionalSettings)
    );
  }
};
var whisperCppTranscriptionJsonSchema = z32.union([
  z32.object({ text: z32.string() }),
  z32.object({ error: z32.string() })
]);
var successfulResponseHandler = async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = safeParseJSON({
    text: responseBody,
    schema: zodSchema(whisperCppTranscriptionJsonSchema)
  });
  if (!parsedResult.success) {
    throw new ApiCallError({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseBody,
      url,
      requestBodyValues
    });
  }
  if ("error" in parsedResult.value) {
    throw new ApiCallError({
      message: parsedResult.value.error,
      statusCode: response.status,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    text: parsedResult.value.text.trim()
  };
};
var failedResponseHandler = async ({
  response,
  url,
  requestBodyValues
}) => {
  const responseBody = await response.text();
  return new ApiCallError({
    message: responseBody,
    url,
    requestBodyValues,
    statusCode: response.status,
    responseBody
  });
};

// src/model-provider/whispercpp/WhisperCppFacade.ts
function Api11(settings) {
  return new WhisperCppApiConfiguration(settings);
}
function Transcriber2(settings = {}) {
  return new WhisperCppTranscriptionModel(settings);
}

// src/observability/helicone/HeliconeOpenAIApiConfiguration.ts
var HeliconeOpenAIApiConfiguration = class extends BaseUrlApiConfiguration {
  constructor({
    baseUrl = "https://oai.hconeai.com/v1",
    openAIApiKey,
    heliconeApiKey,
    retry,
    throttle,
    customCallHeaders
  } = {}) {
    super({
      baseUrl,
      headers: {
        Authorization: `Bearer ${loadApiKey({
          apiKey: openAIApiKey,
          environmentVariableName: "OPENAI_API_KEY",
          apiKeyParameterName: "openAIApiKey",
          description: "OpenAI"
        })}`,
        "Helicone-Auth": `Bearer ${loadApiKey({
          apiKey: heliconeApiKey,
          environmentVariableName: "HELICONE_API_KEY",
          apiKeyParameterName: "heliconeApiKey",
          description: "Helicone"
        })}`
      },
      retry,
      throttle,
      customCallHeaders
    });
  }
};

// src/retriever/retrieve.ts
async function retrieve(retriever, query, options) {
  return executeFunctionCall({
    options,
    input: query,
    functionType: "retrieve",
    execute: (options2) => retriever.retrieve(query, options2),
    inputPropertyName: "query",
    outputPropertyName: "results"
  });
}

// src/text-chunk/split/splitOnSeparator.ts
function splitOnSeparator({
  separator
}) {
  return async ({ text: text13 }) => text13.split(separator);
}

// src/text-chunk/split/splitRecursively.ts
function splitRecursively({
  maxChunkSize,
  segments
}) {
  if (segments.length < maxChunkSize) {
    return Array.isArray(segments) ? [segments.join("")] : [segments];
  }
  const half = Math.ceil(segments.length / 2);
  const left = segments.slice(0, half);
  const right = segments.slice(half);
  return [
    ...splitRecursively({
      segments: left,
      maxChunkSize
    }),
    ...splitRecursively({
      segments: right,
      maxChunkSize
    })
  ];
}
var splitAtCharacter = ({
  maxCharactersPerChunk
}) => async ({ text: text13 }) => splitRecursively({
  maxChunkSize: maxCharactersPerChunk,
  segments: text13
});
var splitAtToken = ({
  tokenizer,
  maxTokensPerChunk
}) => async ({ text: text13 }) => splitRecursively({
  maxChunkSize: maxTokensPerChunk,
  segments: (await tokenizer.tokenizeWithTexts(text13)).tokenTexts
});

// src/text-chunk/split/splitTextChunks.ts
async function splitTextChunks(splitFunction, inputs) {
  const pageChunks = await Promise.all(
    inputs.map((input) => splitTextChunk(splitFunction, input))
  );
  return pageChunks.flat();
}
async function splitTextChunk(splitFunction, input) {
  const parts = await splitFunction(input);
  return parts.map((text13) => ({
    ...input,
    text: text13
  }));
}

// src/tool/NoSuchToolDefinitionError.ts
var NoSuchToolDefinitionError = class extends Error {
  toolName;
  cause;
  parameters;
  constructor({
    toolName,
    parameters
  }) {
    super(
      `Tool definition '${toolName}' not found. Parameters: ${JSON.stringify(parameters)}.`
    );
    this.name = "NoSuchToolDefinitionError";
    this.toolName = toolName;
    this.parameters = parameters;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      stack: this.stack,
      toolName: this.toolName,
      parameter: this.parameters
    };
  }
};

// src/tool/Tool.ts
var Tool = class {
  /**
   * The name of the tool.
   * Should be understandable for language models and unique among the tools that they know.
   */
  name;
  /**
   * A optional description of what the tool does. Will be used by the language model to decide whether to use the tool.
   */
  description;
  /**
   * The schema of the input that the tool expects. The language model will use this to generate the input.
   * Use descriptions to make the input understandable for the language model.
   */
  parameters;
  /**
   * An optional schema of the output that the tool produces. This will be used to validate the output.
   */
  returnType;
  /**
   * The actual execution function of the tool.
   */
  execute;
  constructor({
    name,
    description,
    parameters,
    returnType,
    execute
  }) {
    this.name = name;
    this.description = description;
    this.parameters = parameters;
    this.returnType = returnType;
    this.execute = execute;
  }
};

// src/tool/ObjectGeneratorTool.ts
var ObjectGeneratorTool = class extends Tool {
  constructor({
    name = "object-generator",
    // eslint-disable-line @typescript-eslint/no-explicit-any
    description,
    model,
    parameters,
    objectSchema,
    prompt
  }) {
    super({
      name,
      description,
      parameters,
      execute: async (input, options) => generateObject({
        model,
        schema: objectSchema,
        prompt: prompt(input),
        ...options
      })
    });
  }
};

// src/tool/ToolCallArgumentsValidationError.ts
var ToolCallArgumentsValidationError = class extends Error {
  toolName;
  cause;
  args;
  constructor({
    toolName,
    args,
    cause
  }) {
    super(
      `Argument validation failed for tool '${toolName}'.
Arguments: ${JSON.stringify(args)}.
Error message: ${getErrorMessage(cause)}`
    );
    this.name = "ToolCallArgumentsValidationError";
    this.toolName = toolName;
    this.cause = cause;
    this.args = args;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      stack: this.stack,
      toolName: this.toolName,
      args: this.args
    };
  }
};

// src/tool/ToolCallError.ts
var ToolCallError = class extends Error {
  toolCall;
  cause;
  constructor({
    cause,
    toolCall,
    message = getErrorMessage(cause)
  }) {
    super(`Tool call for tool '${toolCall.name}' failed: ${message}`);
    this.name = "ToolCallError";
    this.toolCall = toolCall;
    this.cause = cause;
  }
  toJSON() {
    return {
      name: this.name,
      cause: this.cause,
      message: this.message,
      stack: this.stack,
      toolCall: this.toolCall
    };
  }
};

// src/tool/ToolCallGenerationError.ts
var ToolCallGenerationError = class extends Error {
  toolName;
  cause;
  constructor({ toolName, cause }) {
    super(
      `Tool call generation failed for tool '${toolName}'. Error message: ${getErrorMessage(cause)}`
    );
    this.name = "ToolCallsGenerationError";
    this.toolName = toolName;
    this.cause = cause;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      stack: this.stack,
      toolName: this.toolName
    };
  }
};

// src/tool/ToolExecutionError.ts
var ToolExecutionError = class extends Error {
  toolName;
  input;
  cause;
  constructor({
    toolName,
    input,
    cause,
    message = getErrorMessage(cause)
  }) {
    super(`Error executing tool '${toolName}': ${message}`);
    this.name = "ToolExecutionError";
    this.toolName = toolName;
    this.input = input;
    this.cause = cause;
  }
  toJSON() {
    return {
      name: this.name,
      cause: this.cause,
      message: this.message,
      stack: this.stack,
      toolName: this.toolName,
      input: this.input
    };
  }
};

// src/tool/WebSearchTool.ts
import { z as z33 } from "zod";
var RETURN_TYPE_SCHEMA = zodSchema(
  z33.object({
    results: z33.array(
      z33.object({
        title: z33.string(),
        link: z33.string().url(),
        snippet: z33.string()
      })
    )
  })
);
var createParameters = (description) => (
  // same schema, but with description:
  zodSchema(
    z33.object({
      query: z33.string().describe(description)
    })
  )
);
var WebSearchTool = class extends Tool {
  constructor({
    name,
    description,
    queryDescription = "Search query",
    execute
  }) {
    super({
      name,
      description,
      parameters: createParameters(queryDescription),
      returnType: RETURN_TYPE_SCHEMA,
      execute
    });
  }
};

// src/tool/execute-tool/executeTool.ts
import { nanoid as createId5 } from "nanoid";
async function executeTool({
  tool,
  args,
  fullResponse,
  ...options
}) {
  const callResponse = await doExecuteTool({ tool, args, ...options });
  return fullResponse ? callResponse : callResponse.output;
}
async function doExecuteTool({
  tool,
  args,
  ...options
}) {
  const run = await getRun(options?.run);
  const eventSource = new FunctionEventSource({
    observers: [
      ...getFunctionCallLogger(options?.logging ?? getLogFormat()),
      ...getFunctionObservers(),
      ...run?.functionObserver != null ? [run.functionObserver] : [],
      ...options?.observers ?? []
    ],
    errorHandler: run?.errorHandler
  });
  const durationMeasurement = startDurationMeasurement();
  const metadata = {
    functionType: "execute-tool",
    callId: `call-${createId5()}`,
    parentCallId: options?.callId,
    runId: run?.runId,
    sessionId: run?.sessionId,
    userId: run?.userId,
    functionId: options?.functionId,
    toolName: tool.name,
    input: args
  };
  eventSource.notify({
    ...metadata,
    eventType: "started",
    timestamp: durationMeasurement.startDate,
    startTimestamp: durationMeasurement.startDate
  });
  const result = await runSafe(
    () => tool.execute(args, {
      functionType: metadata.functionType,
      callId: metadata.callId,
      functionId: options?.functionId,
      logging: options?.logging,
      observers: options?.observers,
      run
    })
  );
  const finishMetadata = {
    ...metadata,
    eventType: "finished",
    timestamp: /* @__PURE__ */ new Date(),
    startTimestamp: durationMeasurement.startDate,
    finishTimestamp: /* @__PURE__ */ new Date(),
    durationInMs: durationMeasurement.durationInMs
  };
  if (!result.ok) {
    if (result.isAborted) {
      eventSource.notify({
        ...finishMetadata,
        result: {
          status: "abort"
        }
      });
      throw new AbortError();
    }
    eventSource.notify({
      ...finishMetadata,
      result: {
        status: "error",
        error: result.error
      }
    });
    throw new ToolExecutionError({
      toolName: tool.name,
      input: args,
      cause: result.error,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: result.error?.message
    });
  }
  const output = result.value;
  eventSource.notify({
    ...finishMetadata,
    result: {
      status: "success",
      value: output
    }
  });
  return {
    output,
    metadata: finishMetadata
  };
}

// src/tool/generate-tool-call/generateToolCall.ts
async function generateToolCall({
  model,
  tool,
  prompt,
  fullResponse,
  ...options
}) {
  const expandedPrompt = typeof prompt === "function" ? prompt(tool) : prompt;
  const callResponse = await executeStandardCall({
    functionType: "generate-tool-call",
    input: expandedPrompt,
    model,
    options,
    generateResponse: async (options2) => {
      try {
        const result = await model.doGenerateToolCall(
          tool,
          expandedPrompt,
          options2
        );
        const toolCall = result.toolCall;
        if (toolCall === null) {
          throw new ToolCallGenerationError({
            toolName: tool.name,
            cause: "No tool call generated."
          });
        }
        const parseResult = tool.parameters.validate(toolCall.args);
        if (!parseResult.success) {
          throw new ToolCallArgumentsValidationError({
            toolName: tool.name,
            args: toolCall.args,
            cause: parseResult.error
          });
        }
        return {
          rawResponse: result.rawResponse,
          extractedValue: {
            id: toolCall.id,
            name: tool.name,
            args: parseResult.value
          },
          usage: result.usage
        };
      } catch (error) {
        if (error instanceof ToolCallArgumentsValidationError || error instanceof ToolCallGenerationError) {
          throw error;
        }
        throw new ToolCallGenerationError({
          toolName: tool.name,
          cause: error
        });
      }
    }
  });
  return fullResponse ? {
    toolCall: callResponse.value,
    rawResponse: callResponse.rawResponse,
    metadata: callResponse.metadata
  } : callResponse.value;
}

// src/tool/generate-tool-call/jsonToolCallPrompt.ts
import { nanoid } from "nanoid";
var DEFAULT_TOOL_PROMPT = (tool) => [
  `You are calling the function "${tool.name}".`,
  tool.description != null ? `Function description: ${tool.description}` : null,
  `Function parameters JSON schema: ${JSON.stringify(
    tool.parameters.getJsonSchema()
  )}`,
  ``,
  `You MUST answer with a JSON object that matches the JSON schema above.`
].filter(Boolean).join("\n");
var jsonToolCallPrompt = {
  text({
    toolPrompt
  } = {}) {
    return {
      createPrompt(prompt, tool) {
        return {
          system: createSystemPrompt2({ tool, toolPrompt }),
          instruction: prompt
        };
      },
      extractToolCall,
      withJsonOutput: ({ model, schema }) => model.withJsonOutput(schema)
    };
  },
  instruction({
    toolPrompt
  } = {}) {
    return {
      createPrompt(prompt, tool) {
        return {
          system: createSystemPrompt2({
            originalSystemPrompt: prompt.system,
            tool,
            toolPrompt
          }),
          instruction: prompt.instruction
        };
      },
      extractToolCall,
      withJsonOutput: ({ model, schema }) => model.withJsonOutput(schema)
    };
  }
};
function createSystemPrompt2({
  originalSystemPrompt,
  toolPrompt = DEFAULT_TOOL_PROMPT,
  tool
}) {
  return [
    originalSystemPrompt,
    originalSystemPrompt != null ? "" : null,
    toolPrompt(tool)
  ].filter(Boolean).join("\n");
}
function extractToolCall(response) {
  return { id: nanoid(), args: parseJSON({ text: response }) };
}

// src/tool/generate-tool-calls/generateToolCalls.ts
async function generateToolCalls({
  model,
  tools,
  prompt,
  fullResponse,
  ...options
}) {
  const expandedPrompt = typeof prompt === "function" ? prompt(tools) : prompt;
  const callResponse = await executeStandardCall({
    functionType: "generate-tool-calls",
    input: expandedPrompt,
    model,
    options,
    generateResponse: async (options2) => {
      const result = await model.doGenerateToolCalls(
        tools,
        expandedPrompt,
        options2
      );
      const { text: text13, toolCalls: rawToolCalls } = result;
      if (rawToolCalls == null) {
        return {
          rawResponse: result.rawResponse,
          extractedValue: { text: text13, toolCalls: null },
          usage: result.usage
        };
      }
      const toolCalls = rawToolCalls.map((rawToolCall) => {
        const tool = tools.find((tool2) => tool2.name === rawToolCall.name);
        if (tool == void 0) {
          throw new NoSuchToolDefinitionError({
            toolName: rawToolCall.name,
            parameters: rawToolCall.args
          });
        }
        const parseResult = tool.parameters.validate(rawToolCall.args);
        if (!parseResult.success) {
          throw new ToolCallArgumentsValidationError({
            toolName: tool.name,
            args: rawToolCall.args,
            cause: parseResult.error
          });
        }
        return {
          id: rawToolCall.id,
          name: tool.name,
          args: parseResult.value
        };
      });
      return {
        rawResponse: result.rawResponse,
        extractedValue: {
          text: text13,
          toolCalls
        },
        usage: result.usage
      };
    }
  });
  return fullResponse ? callResponse : callResponse.value;
}

// src/tool/execute-tool/safeExecuteToolCall.ts
async function safeExecuteToolCall(tool, toolCall, options) {
  try {
    return {
      tool: toolCall.name,
      toolCall,
      args: toolCall.args,
      ok: true,
      result: await executeTool({ tool, args: toolCall.args, ...options })
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    return {
      tool: toolCall.name,
      toolCall,
      args: toolCall.args,
      ok: false,
      result: new ToolCallError({
        toolCall,
        cause: error instanceof ToolExecutionError ? error.cause : error
      })
    };
  }
}

// src/tool/run-tool/runTool.ts
async function runTool({
  model,
  tool,
  prompt,
  ...options
}) {
  const expandedPrompt = typeof prompt === "function" ? prompt(tool) : prompt;
  return executeFunctionCall({
    options,
    input: expandedPrompt,
    functionType: "run-tool",
    execute: async (options2) => safeExecuteToolCall(
      tool,
      await generateToolCall({ model, tool, prompt: expandedPrompt, ...options2 }),
      options2
    )
  });
}

// src/tool/run-tools/runTools.ts
async function runTools({
  model,
  tools,
  prompt,
  ...options
}) {
  const expandedPrompt = typeof prompt === "function" ? prompt(tools) : prompt;
  return executeFunctionCall({
    options,
    input: expandedPrompt,
    functionType: "run-tools",
    execute: async (options2) => {
      const modelResponse = await generateToolCalls({
        model,
        tools,
        prompt: expandedPrompt,
        fullResponse: false,
        ...options2
      });
      const { toolCalls, text: text13 } = modelResponse;
      if (toolCalls == null) {
        return { text: text13, toolResults: null };
      }
      const toolResults = await Promise.all(
        toolCalls.map(async (toolCall) => {
          const tool = tools.find((tool2) => tool2.name === toolCall.name);
          if (tool == null) {
            return {
              tool: toolCall.name,
              toolCall,
              args: toolCall.args,
              ok: false,
              result: new ToolCallError({
                message: `No tool with name '${toolCall.name}' found.`,
                toolCall
              })
            };
          }
          return await safeExecuteToolCall(
            tool,
            toolCall,
            options2
          );
        })
      );
      return {
        text: text13,
        toolResults
      };
    }
  });
}

// src/util/streaming/createEventSourceStream.ts
var textEncoder = new TextEncoder();
function createEventSourceStream(events) {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of events) {
          controller.enqueue(
            textEncoder.encode(`data: ${JSON.stringify(event)}

`)
          );
        }
      } finally {
        controller.close();
      }
    }
  });
}

// src/vector-index/VectorIndexRetriever.ts
var VectorIndexRetriever = class _VectorIndexRetriever {
  vectorIndex;
  embeddingModel;
  settings;
  constructor({
    vectorIndex,
    embeddingModel,
    maxResults,
    similarityThreshold,
    filter
  }) {
    this.vectorIndex = vectorIndex;
    this.embeddingModel = embeddingModel;
    this.settings = {
      maxResults,
      similarityThreshold,
      filter
    };
  }
  async retrieve(query, options) {
    const embedding = await embed({
      model: this.embeddingModel,
      value: query,
      ...options
    });
    const queryResult = await this.vectorIndex.queryByVector({
      queryVector: embedding,
      maxResults: this.settings.maxResults ?? 1,
      similarityThreshold: this.settings.similarityThreshold,
      filter: this.settings?.filter
    });
    return queryResult.map((item) => item.data);
  }
  withSettings(additionalSettings) {
    return new _VectorIndexRetriever(
      Object.assign({}, this.settings, additionalSettings, {
        vectorIndex: this.vectorIndex,
        embeddingModel: this.embeddingModel
      })
    );
  }
};

// src/vector-index/memory/MemoryVectorIndex.ts
import { z as z34 } from "zod";
var jsonDataSchema = zodSchema(
  z34.array(
    z34.object({
      id: z34.string(),
      vector: z34.array(z34.number()),
      data: z34.unknown()
    })
  )
);
var MemoryVectorIndex = class _MemoryVectorIndex {
  static async deserialize({
    serializedData,
    schema
  }) {
    const json2 = parseJSON({ text: serializedData, schema: jsonDataSchema });
    if (schema != null) {
      for (const entry of json2) {
        const validationResult = schema.validate(entry.data);
        if (!validationResult.success) {
          throw validationResult.error;
        }
      }
    }
    const vectorIndex = new _MemoryVectorIndex();
    vectorIndex.upsertMany(
      json2
    );
    return vectorIndex;
  }
  entries = /* @__PURE__ */ new Map();
  async upsertMany(data) {
    for (const entry of data) {
      this.entries.set(entry.id, entry);
    }
  }
  async queryByVector({
    queryVector,
    similarityThreshold,
    maxResults,
    filter
  }) {
    const results = [...this.entries.values()].filter((value) => filter?.(value.data) ?? true).map((entry) => ({
      id: entry.id,
      similarity: cosineSimilarity(entry.vector, queryVector),
      data: entry.data
    })).filter(
      (entry) => similarityThreshold == void 0 || entry.similarity == void 0 || entry.similarity > similarityThreshold
    );
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, maxResults);
  }
  serialize() {
    return JSON.stringify([...this.entries.values()]);
  }
  asIndex() {
    return this;
  }
};

// src/vector-index/upsertIntoVectorIndex.ts
import { nanoid as createId6 } from "nanoid";
async function upsertIntoVectorIndex({
  vectorIndex,
  embeddingModel,
  generateId = createId6,
  objects,
  getValueToEmbed,
  getId
}, options) {
  return executeFunctionCall({
    options,
    input: objects,
    functionType: "upsert-into-vector-index",
    inputPropertyName: "objects",
    execute: async (options2) => {
      const embeddings = await embedMany({
        model: embeddingModel,
        values: objects.map(getValueToEmbed),
        ...options2
      });
      await vectorIndex.upsertMany(
        objects.map((object, i) => ({
          id: getId?.(object, i) ?? generateId(),
          vector: embeddings[i],
          data: object
        }))
      );
    }
  });
}
export {
  AbortError,
  AbstractOpenAIChatModel,
  AbstractOpenAICompletionModel,
  AbstractOpenAITextEmbeddingModel,
  AlpacaPromptTemplate_exports as AlpacaPrompt,
  ApiCallError,
  AsyncQueue,
  Automatic1111ApiConfiguration,
  Automatic1111ImageGenerationModel,
  AzureOpenAIApiConfiguration,
  BaseUrlApiConfiguration,
  BaseUrlApiConfigurationWithDefaults,
  CHAT_MODEL_CONTEXT_WINDOW_SIZES,
  COHERE_TEXT_EMBEDDING_MODELS,
  COHERE_TEXT_GENERATION_MODELS,
  ChatMLPromptTemplate_exports as ChatMLPrompt,
  ChatMessage,
  CohereApiConfiguration,
  CohereTextEmbeddingModel,
  CohereTextGenerationModel,
  CohereTextGenerationResponseFormat,
  CohereTokenizer,
  DefaultRun,
  ElevenLabsApiConfiguration,
  ElevenLabsSpeechModel,
  EmbeddingSimilarityClassifier,
  FireworksAIApiConfiguration,
  FunctionEventSource,
  HeliconeOpenAIApiConfiguration,
  HuggingFaceApiConfiguration,
  HuggingFaceTextEmbeddingModel,
  HuggingFaceTextGenerationModel,
  InvalidPromptError,
  JSONParseError,
  Llama2PromptTemplate_exports as Llama2Prompt,
  LlamaCppApiConfiguration,
  LlamaCppCompletionModel,
  LlamaCppCompletionResponseFormat,
  LlamaCppTextEmbeddingModel,
  LlamaCppTokenizer,
  LmntApiConfiguration,
  LmntSpeechModel,
  MemoryCache,
  MemoryVectorIndex,
  MistralApiConfiguration,
  MistralChatModel,
  MistralChatResponseFormat,
  MistralInstructPromptTemplate_exports as MistralInstructPrompt,
  MistralTextEmbeddingModel,
  NeuralChatPromptTemplate_exports as NeuralChatPrompt,
  NoSuchToolDefinitionError,
  OPENAI_CHAT_MESSAGE_BASE_TOKEN_COUNT,
  OPENAI_CHAT_PROMPT_BASE_TOKEN_COUNT,
  OPENAI_TEXT_EMBEDDING_MODELS,
  OPENAI_TEXT_GENERATION_MODELS,
  ObjectFromTextGenerationModel,
  ObjectFromTextStreamingModel,
  ObjectGeneratorTool,
  ObjectParseError,
  ObjectStreamFromResponse,
  ObjectStreamResponse,
  ObjectValidationError,
  OllamaApiConfiguration,
  OllamaChatModel,
  OllamaChatResponseFormat,
  OllamaCompletionModel,
  OllamaCompletionResponseFormat,
  OllamaTextEmbeddingModel,
  OpenAIApiConfiguration,
  OpenAIChatMessage,
  OpenAIChatModel,
  OpenAIChatResponseFormat,
  OpenAICompatibleChatModel,
  OpenAICompatibleCompletionModel,
  OpenAICompatibleTextEmbeddingModel,
  OpenAICompletionModel,
  OpenAIImageGenerationModel,
  OpenAIImageGenerationResponseFormat,
  OpenAISpeechModel,
  OpenAITextEmbeddingModel,
  OpenAITextResponseFormat,
  OpenAITranscriptionModel,
  OpenAITranscriptionResponseFormat,
  PerplexityApiConfiguration,
  PromptTemplateFullTextModel,
  PromptTemplateImageGenerationModel,
  PromptTemplateTextGenerationModel,
  PromptTemplateTextStreamingModel,
  RetryError,
  StabilityApiConfiguration,
  StabilityImageGenerationModel,
  SynthiaPromptTemplate_exports as SynthiaPrompt,
  TextGenerationToolCallModel,
  TextGenerationToolCallsModel,
  TextPromptTemplate_exports as TextPrompt,
  TikTokenTokenizer,
  TogetherAIApiConfiguration,
  Tool,
  ToolCallArgumentsValidationError,
  ToolCallError,
  ToolCallGenerationError,
  ToolCallParseError,
  ToolCallsParseError,
  ToolExecutionError,
  TypeValidationError,
  UncheckedSchema,
  VectorIndexRetriever,
  VicunaPromptTemplate_exports as VicunaPrompt,
  WebSearchTool,
  WhisperCppApiConfiguration,
  WhisperCppTranscriptionModel,
  ZodSchema,
  ApiFacade_exports as api,
  Automatic1111Facade_exports as automatic1111,
  classify,
  CohereFacade_exports as cohere,
  convertDataContentToBase64String,
  convertDataContentToUint8Array,
  cosineSimilarity,
  countOpenAIChatMessageTokens,
  countOpenAIChatPromptTokens,
  countTokens,
  createChatPrompt,
  createEventSourceStream,
  createInstructionPrompt,
  createTextPrompt,
  delay,
  ElevenLabsFacade_exports as elevenlabs,
  embed,
  embedMany,
  executeFunction,
  executeTool,
  generateImage,
  generateObject,
  generateSpeech,
  generateText,
  generateToolCall,
  generateToolCalls,
  generateTranscription,
  getAudioFileExtension,
  getOpenAIChatModelInformation,
  getOpenAICompletionModelInformation,
  getRun,
  HuggingFaceFacade_exports as huggingface,
  isPromptFunction,
  jsonObjectPrompt,
  jsonToolCallPrompt,
  LlamaCppFacade_exports as llamacpp,
  LmntFacade_exports as lmnt,
  mapBasicPromptToAutomatic1111Format,
  mapBasicPromptToStabilityFormat,
  markAsPromptFunction,
  MistralFacade_exports as mistral,
  ModelFusionConfiguration_exports as modelfusion,
  OllamaFacade_exports as ollama,
  openAITextEmbeddingResponseSchema2 as openAITextEmbeddingResponseSchema,
  OpenAIFacade_exports as openai,
  OpenAICompatibleFacade_exports as openaicompatible,
  parseJSON,
  retrieve,
  retryNever,
  retryWithExponentialBackoff,
  runTool,
  runTools,
  safeParseJSON,
  safeValidateTypes,
  splitAtCharacter,
  splitAtToken,
  splitOnSeparator,
  splitTextChunk,
  splitTextChunks,
  StabilityFacade_exports as stability,
  streamObject,
  streamSpeech,
  streamText,
  textGenerationModelProperties,
  throttleMaxConcurrency,
  throttleOff,
  trimChatPrompt,
  uncheckedSchema,
  upsertIntoVectorIndex,
  validateContentIsString,
  validateTypes,
  WhisperCppFacade_exports as whispercpp,
  withRun,
  zodSchema
};
//# sourceMappingURL=index.js.map