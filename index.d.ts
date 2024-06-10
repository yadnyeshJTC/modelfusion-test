import { PartialDeep } from 'type-fest';
import z$1, { z } from 'zod';

type ErrorHandler = (error: unknown) => void;

interface ToolCallGenerationStartedEvent extends BaseModelCallStartedEvent {
    functionType: "generate-tool-call";
}
type ToolCallGenerationFinishedEventResult = {
    status: "success";
    rawResponse: unknown;
    value: unknown;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
type ToolCallGenerationFinishedEvent = BaseModelCallFinishedEvent & {
    functionType: "generate-tool-call";
    result: ToolCallGenerationFinishedEventResult;
};

interface ToolCallsGenerationStartedEvent extends BaseModelCallStartedEvent {
    functionType: "generate-tool-calls";
}
type ToolCallsGenerationFinishedEventResult = {
    status: "success";
    rawResponse: unknown;
    value: unknown;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
type ToolCallsGenerationFinishedEvent = BaseModelCallFinishedEvent & {
    functionType: "generate-tool-calls";
    result: ToolCallsGenerationFinishedEventResult;
};

type ModelInformation = {
    provider: string;
    modelName: string | null;
};

interface ClassifyStartedEvent extends BaseModelCallStartedEvent {
    functionType: "classify";
    input: unknown | Array<unknown>;
}
type ClassifyFinishedEventResult = {
    status: "success";
    rawResponse: unknown;
    value: unknown;
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
interface ClassifyFinishedEvent extends BaseModelCallFinishedEvent {
    functionType: "classify";
    input: unknown;
    result: ClassifyFinishedEventResult;
}

/**
 * A vector is an array of numbers.
 * It is e.g. used to represent a text as a vector of word embeddings.
 */
type Vector = Array<number>;

interface EmbeddingStartedEvent extends BaseModelCallStartedEvent {
    functionType: "embed";
    input: unknown | Array<unknown>;
}
type EmbeddingFinishedEventResult = {
    status: "success";
    rawResponse: unknown;
    value: Vector | Array<Vector>;
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
interface EmbeddingFinishedEvent extends BaseModelCallFinishedEvent {
    functionType: "embed";
    input: unknown | Array<unknown>;
    result: EmbeddingFinishedEventResult;
}

interface ImageGenerationStartedEvent extends BaseModelCallStartedEvent {
    functionType: "generate-image";
}
type ImageGenerationFinishedEventResult = {
    status: "success";
    rawResponse: unknown;
    value: string;
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
interface ImageGenerationFinishedEvent extends BaseModelCallFinishedEvent {
    functionType: "generate-image";
    result: ImageGenerationFinishedEventResult;
}

interface SpeechGenerationStartedEvent extends BaseModelCallStartedEvent {
    functionType: "generate-speech";
    input: string;
}
type SpeechGenerationFinishedEventResult = {
    status: "success";
    rawResponse: unknown;
    value: Uint8Array;
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
interface SpeechGenerationFinishedEvent extends BaseModelCallFinishedEvent {
    functionType: "generate-speech";
    input: string;
    result: SpeechGenerationFinishedEventResult;
}
interface SpeechStreamingStartedEvent extends BaseModelCallStartedEvent {
    functionType: "stream-speech";
}
interface SpeechStreamingFinishedEvent extends BaseModelCallFinishedEvent {
    functionType: "stream-speech";
}

interface ObjectGenerationStartedEvent extends BaseModelCallStartedEvent {
    functionType: "generate-object";
}
type ObjectGenerationFinishedEventResult = {
    status: "success";
    rawResponse: unknown;
    value: unknown;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
type ObjectGenerationFinishedEvent = BaseModelCallFinishedEvent & {
    functionType: "generate-object";
    result: ObjectGenerationFinishedEventResult;
};

interface ObjectStreamingStartedEvent extends BaseModelCallStartedEvent {
    functionType: "stream-object";
}
interface ObjectStreamingFinishedEvent extends BaseModelCallFinishedEvent {
    functionType: "stream-object";
}

interface TextGenerationStartedEvent extends BaseModelCallStartedEvent {
    functionType: "generate-text";
}
type TextGenerationFinishedEventResult = {
    status: "success";
    rawResponse: unknown;
    value: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
interface TextGenerationFinishedEvent extends BaseModelCallFinishedEvent {
    functionType: "generate-text";
    result: TextGenerationFinishedEventResult;
}
interface TextStreamingStartedEvent extends BaseModelCallStartedEvent {
    functionType: "stream-text";
}
interface TextStreamingFinishedEvent extends BaseModelCallFinishedEvent {
    functionType: "stream-text";
}

interface TranscriptionStartedEvent extends BaseModelCallStartedEvent {
    functionType: "generate-transcription";
}
type TranscriptionFinishedEventResult = {
    status: "success";
    rawResponse: unknown;
    value: string;
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
interface TranscriptionFinishedEvent extends BaseModelCallFinishedEvent {
    functionType: "generate-transcription";
    result: TranscriptionFinishedEventResult;
}

interface BaseModelCallStartedEvent extends BaseFunctionStartedEvent {
    model: ModelInformation;
    /**
     * The main input to the model call. The type depends on the call type or model.
     */
    input: unknown;
    /**
     * The model settings used for the call. The type depends on the model.
     */
    settings: unknown;
}
type BaseModelCallFinishedEventResult = {
    status: "success";
    /**
     * The original model response.
     */
    rawResponse: unknown;
    value: unknown;
    /**
     * Optional usage information for the model call. The type depends on the call type.
     */
    usage?: unknown;
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
interface BaseModelCallFinishedEvent extends BaseFunctionFinishedEvent {
    model: ModelInformation;
    /**
     * The main input to the model call. The type depends on the call type or model.
     */
    input: unknown;
    /**
     * The model settings used for the call. The type depends on the model.
     */
    settings: unknown;
    /**
     * The result of the model call. Can be "success", "error", or "abort". Additional information is provided depending on the status.
     */
    result: BaseModelCallFinishedEventResult;
}
type ModelCallStartedEvent = ClassifyStartedEvent | EmbeddingStartedEvent | ImageGenerationStartedEvent | SpeechGenerationStartedEvent | SpeechStreamingStartedEvent | ObjectGenerationStartedEvent | ObjectStreamingStartedEvent | TextGenerationStartedEvent | TextStreamingStartedEvent | ToolCallGenerationStartedEvent | ToolCallsGenerationStartedEvent | TranscriptionStartedEvent;
type ModelCallFinishedEvent = ClassifyFinishedEvent | EmbeddingFinishedEvent | ImageGenerationFinishedEvent | SpeechGenerationFinishedEvent | SpeechStreamingFinishedEvent | ObjectGenerationFinishedEvent | ObjectStreamingFinishedEvent | TextGenerationFinishedEvent | TextStreamingFinishedEvent | ToolCallGenerationFinishedEvent | ToolCallsGenerationFinishedEvent | TranscriptionFinishedEvent;

interface RetrieveStartedEvent extends BaseFunctionStartedEvent {
    functionType: "retrieve";
    query: unknown;
}
interface RetrieveFinishedEvent extends BaseFunctionFinishedEvent {
    functionType: "retrieve";
    query: unknown;
    results: unknown;
}

interface ExecuteToolStartedEvent extends BaseFunctionStartedEvent {
    functionType: "execute-tool";
    toolName: string;
    input: unknown;
}
interface ExecuteToolFinishedEvent extends BaseFunctionFinishedEvent {
    functionType: "execute-tool";
    toolName: string;
    input: unknown;
}

interface runToolStartedEvent extends BaseFunctionStartedEvent {
    functionType: "run-tool";
}
interface runToolFinishedEvent extends BaseFunctionFinishedEvent {
    functionType: "run-tool";
}

interface runToolsStartedEvent extends BaseFunctionStartedEvent {
    functionType: "run-tools";
}
interface runToolsFinishedEvent extends BaseFunctionFinishedEvent {
    functionType: "run-tools";
}

interface UpsertIntoVectorIndexStartedEvent extends BaseFunctionStartedEvent {
    functionType: "upsert-into-vector-index";
    objects: unknown[];
}
interface UpsertIntoVectorIndexFinishedEvent extends BaseFunctionFinishedEvent {
    functionType: "upsert-into-vector-index";
    objects: unknown[];
}

interface ExecuteFunctionStartedEvent extends BaseFunctionStartedEvent {
    functionType: "execute-function";
}
interface ExecuteFunctionFinishedEvent extends BaseFunctionFinishedEvent {
    functionType: "execute-function";
}

interface ExtensionFunctionStartedEvent extends BaseFunctionStartedEvent {
    functionType: "extension";
    extension: string;
    data: unknown;
}
interface ExtensionFunctionFinishedEvent extends BaseFunctionFinishedEvent {
    functionType: "extension";
    extension: string;
    data: unknown;
}

interface BaseFunctionEvent {
    /**
     * Unique identifier for the function call.
     */
    callId: string | undefined;
    /**
     * Unique identifier of the call id of the parent function.
     */
    parentCallId?: string | undefined;
    /**
     * Optional unique identifier for the function.
     */
    functionId?: string | undefined;
    /**
     * Unique identifier for the run.
     * Only available if the function is part of a run.
     */
    runId?: string | undefined;
    /**
     * Unique identifier for the session.
     * Only available if the function is part of a run with a session.
     */
    sessionId?: string | undefined;
    /**
     * Unique identifier for the user.
     * Only available if the function is part of a run with a user.
     */
    userId?: string | undefined;
    /**
     * Timestamp of the event.
     */
    timestamp: Date;
    /**
     * Type of the event. Defined in the subclasses.
     */
    eventType: "started" | "finished";
    /**
     * Type of the function. Defined in the subclasses.
     */
    functionType: string;
}
interface BaseFunctionStartedEvent extends BaseFunctionEvent {
    eventType: "started";
    /**
     * Timestamp when the function call started.
     */
    startTimestamp: Date;
}
type BaseFunctionFinishedEventResult = {
    status: "success";
    value: unknown;
} | {
    status: "error";
    error: unknown;
} | {
    status: "abort";
};
interface BaseFunctionFinishedEvent extends BaseFunctionEvent {
    eventType: "finished";
    /**
     * Timestamp when the function call started.
     */
    startTimestamp: Date;
    /**
     * Timestamp when the function call finished.
     */
    finishTimestamp: Date;
    /**
     * Duration of the function call in milliseconds.
     */
    durationInMs: number;
    /**
     * Result of the function call.
     */
    result: BaseFunctionFinishedEventResult;
}
type FunctionEvent = ExecuteFunctionStartedEvent | ExecuteFunctionFinishedEvent | ExecuteToolStartedEvent | ExecuteToolFinishedEvent | ExtensionFunctionStartedEvent | ExtensionFunctionFinishedEvent | ModelCallStartedEvent | ModelCallFinishedEvent | RetrieveStartedEvent | RetrieveFinishedEvent | UpsertIntoVectorIndexStartedEvent | UpsertIntoVectorIndexFinishedEvent | runToolStartedEvent | runToolFinishedEvent | runToolsStartedEvent | runToolsFinishedEvent;

interface FunctionObserver {
    /**
     * Called when a function event occurs.
     */
    onFunctionEvent(event: FunctionEvent): void;
}

interface Run {
    /**
     * Unique identifier for a specific run. Primarily utilized for efficient referencing
     * and tracking within logs.
     */
    runId?: string;
    /**
     * Unique identifier for a session. A session can contain multiple runs. For example, in
     * a chatbot where each message is processed as a separate run, all those runs could be
     * part of a single session. Useful for tracking and logging.
     */
    sessionId?: string;
    /**
     * The user ID of the individual who initiates the call. Useful for logging and can be
     * configured to be forwarded to the model provider (like OpenAI).
     */
    userId?: string;
    /**
     * An AbortSignal that can be used to cancel any ongoing asynchronous operations tied
     * to the run.
     */
    abortSignal?: AbortSignal;
    /**
     * Optional field that represents the run as a function observer. When it is defined,
     * the run will be notified of all function events.
     */
    functionObserver?: FunctionObserver;
    errorHandler?: ErrorHandler;
}

declare class DefaultRun implements Run {
    readonly runId: string;
    readonly sessionId?: string;
    readonly userId?: string;
    readonly abortSignal?: AbortSignal;
    readonly errorHandler: ErrorHandler;
    readonly events: FunctionEvent[];
    private functionEventSource;
    constructor({ runId, sessionId, userId, abortSignal, observers, errorHandler, }?: {
        runId?: string;
        sessionId?: string;
        userId?: string;
        abortSignal?: AbortSignal;
        observers?: FunctionObserver[];
        errorHandler?: ErrorHandler;
    });
    readonly functionObserver: {
        onFunctionEvent: (event: FunctionEvent) => void;
    };
    getSuccessfulModelCalls(): (ModelCallFinishedEvent & {
        result: {
            status: "success";
        };
    })[];
}

declare class FunctionEventSource {
    readonly observers: FunctionObserver[];
    readonly errorHandler: ErrorHandler;
    constructor({ observers, errorHandler, }: {
        observers: FunctionObserver[];
        errorHandler?: ErrorHandler;
    });
    notify(event: FunctionEvent): void;
}

/**
 * The logging output format to use, e.g. for functions. Logs are sent to the console.
 *
 * - `off` or undefined: No logging.
 * - `basic-text`: Log the timestamp and the type of event as a single line of text.
 * - `detailed-object`: Log everything except the original response as an object to the console.
 * - `detailed-json`: Log everything except the original response as a JSON string to the console.
 */
type LogFormat = undefined | "off" | "basic-text" | "detailed-object" | "detailed-json";

interface Cache {
    lookupValue(key: {
        functionType: string;
        functionId?: string | undefined;
        input: unknown;
    }): Promise<object | null>;
    storeValue(key: {
        functionType: string;
        functionId?: string | undefined;
        input: unknown;
    }, value: unknown): Promise<void>;
}

/**
 * Additional settings for ModelFusion functions.
 */
type FunctionOptions = {
    /**
     * Optional function identifier. Used in events and logging.
     */
    functionId?: string;
    /**
     * Optional logging to use for the function. Logs are sent to the console.
     * Overrides the global function logging setting.
     */
    logging?: LogFormat;
    /**
     * Optional observers that are called when the function is invoked.
     */
    observers?: Array<FunctionObserver>;
    /**
     * Optional cache that can be used by the function to store and retrieve cached values.
     * Not supported by all functions.
     */
    cache?: Cache;
    /**
     * Optional run as part of which this function is called. Used in events and logging.
     * Run callbacks are invoked when it is provided.
     */
    run?: Run;
    /**
     * Unique identifier of the call id of the parent function. Used in events and logging.
     *
     * It has the same name as the `callId` in `FunctionCallOptions` to allow for easy
     * propagation of the call id.
     *
     * However, in the `FunctionOptions`, it is the call ID for the parent call, and it is optional.
     */
    callId?: string | undefined;
};
/**
 * Extended options that are passed to models when functions are called. They are passed
 * into e.g. API providers to create custom headers.
 */
type FunctionCallOptions = Omit<FunctionOptions, "callId"> & {
    functionType: string;
    callId: string;
};

declare function setFunctionObservers(functionObservers: FunctionObserver[]): void;
declare function getFunctionObservers(): FunctionObserver[];
declare function setLogFormat(format: LogFormat): void;
declare function getLogFormat(): LogFormat;

declare const ModelFusionConfiguration_getFunctionObservers: typeof getFunctionObservers;
declare const ModelFusionConfiguration_getLogFormat: typeof getLogFormat;
declare const ModelFusionConfiguration_setFunctionObservers: typeof setFunctionObservers;
declare const ModelFusionConfiguration_setLogFormat: typeof setLogFormat;
declare namespace ModelFusionConfiguration {
  export { ModelFusionConfiguration_getFunctionObservers as getFunctionObservers, ModelFusionConfiguration_getLogFormat as getLogFormat, ModelFusionConfiguration_setFunctionObservers as setFunctionObservers, ModelFusionConfiguration_setLogFormat as setLogFormat };
}

type PromptFunction<INPUT, PROMPT> = (() => PromiseLike<{
    input: INPUT;
    prompt: PROMPT;
}>) & {
    [promptFunctionMarker]: true;
};
declare const promptFunctionMarker: unique symbol;
/**
 * Marks a function as a PromptFunction by setting a unique symbol.
 * @param {() => PromiseLike<{input: INPUT; prompt: PROMPT;}>} fn - The function to mark.
 * @returns {PromptFunction<INPUT, PROMPT>} - The marked function.
 */
declare function markAsPromptFunction<INPUT, PROMPT>(fn: () => PromiseLike<{
    input: INPUT;
    prompt: PROMPT;
}>): PromptFunction<INPUT, PROMPT>;
/**
 * Checks if a function is a PromptFunction by checking for the unique symbol.
 * @param {unknown} fn - The function to check.
 * @returns {boolean} - True if the function is a PromptFunction, false otherwise.
 */
declare function isPromptFunction<INPUT, PROMPT>(fn: unknown): fn is PromptFunction<INPUT, PROMPT>;

declare class AbortError extends Error {
    constructor(message?: string);
}

declare class ApiCallError extends Error {
    readonly url: string;
    readonly requestBodyValues: unknown;
    readonly statusCode?: number;
    readonly responseBody?: string;
    readonly cause?: unknown;
    readonly isRetryable: boolean;
    readonly data?: unknown;
    constructor({ message, url, requestBodyValues, statusCode, responseBody, cause, isRetryable, data, }: {
        message: string;
        url: string;
        requestBodyValues: unknown;
        statusCode?: number;
        responseBody?: string;
        cause?: unknown;
        isRetryable?: boolean;
        data?: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        url: string;
        requestBodyValues: unknown;
        statusCode: number | undefined;
        responseBody: string | undefined;
        cause: unknown;
        isRetryable: boolean;
        data: unknown;
    };
}

type RetryFunction = <OUTPUT>(fn: () => PromiseLike<OUTPUT>) => PromiseLike<OUTPUT>;

type ThrottleFunction = <OUTPUT>(fn: () => PromiseLike<OUTPUT>) => PromiseLike<OUTPUT>;

type HeaderParameters = {
    functionType: string;
    functionId?: string;
    run?: Run;
    callId: string;
};
/**
 * Settings for how to call an API, e.g. OpenAI.
 *
 * This interfaces enables creating pre-defined API configuration for certain API (e.g., OpenAI),
 * pre-defined proxy configurations (e.g. Helicone OpenAI),
 * and fully custom setups (e.g. your own internal OpenAI proxy with custom headers).
 */
interface ApiConfiguration {
    /**
     * Creates a full URL given a inner path.
     *
     * The inner path always starts with a slash, e.g. `/generate`.
     */
    assembleUrl(path: string): string;
    /**
     * Returns the headers that should be included in every request to the API.
     * This is intended for authentication headers and proxy settings.
     *
     * The model may add additional headers, in particular "Content-Type"."
     *
     * @param params Parameters that can be used to create the headers.
     */
    headers(params: HeaderParameters): Record<string, string>;
    /**
     * Defines how failed API calls should be retried.
     */
    readonly retry?: RetryFunction;
    /**
     * Defines how API calls should be rate limited.
     */
    readonly throttle?: ThrottleFunction;
}

/**
 * The `retryNever` strategy never retries a failed API call.
 */
declare const retryNever: () => <OUTPUT>(f: () => PromiseLike<OUTPUT>) => Promise<OUTPUT>;

/**
 * The `retryWithExponentialBackoff` strategy retries a failed API call with an exponential backoff.
 * You can configure the maximum number of tries, the initial delay, and the backoff factor.
 */
declare const retryWithExponentialBackoff: ({ maxTries, initialDelayInMs, backoffFactor, }?: {
    maxTries?: number | undefined;
    initialDelayInMs?: number | undefined;
    backoffFactor?: number | undefined;
}) => RetryFunction;

/**
 * The `throttleMaxConcurrency` strategy limits the number of parallel API calls.
 */
declare function throttleMaxConcurrency({ maxConcurrentCalls, }: {
    maxConcurrentCalls: number;
}): ThrottleFunction;

/**
 * The `throttleOff` strategy does not limit parallel API calls.
 */
declare const throttleOff: () => ThrottleFunction;

declare const ApiFacade_retryNever: typeof retryNever;
declare const ApiFacade_retryWithExponentialBackoff: typeof retryWithExponentialBackoff;
declare const ApiFacade_throttleMaxConcurrency: typeof throttleMaxConcurrency;
declare const ApiFacade_throttleOff: typeof throttleOff;
declare namespace ApiFacade {
  export { ApiFacade_retryNever as retryNever, ApiFacade_retryWithExponentialBackoff as retryWithExponentialBackoff, ApiFacade_throttleMaxConcurrency as throttleMaxConcurrency, ApiFacade_throttleOff as throttleOff };
}

type CustomHeaderProvider = (headerParameters: HeaderParameters) => Record<string, string | undefined>;

declare abstract class AbstractApiConfiguration implements ApiConfiguration {
    readonly retry?: RetryFunction;
    readonly throttle?: ThrottleFunction;
    protected readonly customCallHeaders: CustomHeaderProvider;
    constructor({ retry, throttle, customCallHeaders, }: {
        retry?: RetryFunction;
        throttle?: ThrottleFunction;
        customCallHeaders?: CustomHeaderProvider;
    });
    abstract assembleUrl(path: string): string;
    protected abstract fixedHeaders(params: HeaderParameters): Record<string, string>;
    headers(params: HeaderParameters): Record<string, string>;
}

type UrlParts = {
    protocol: string;
    host: string;
    port: string;
    path: string;
};
type BaseUrlPartsApiConfigurationOptions = {
    baseUrl: string | UrlParts;
    headers?: Record<string, string>;
    customCallHeaders?: CustomHeaderProvider;
    retry?: RetryFunction;
    throttle?: ThrottleFunction;
};
/**
 * An API configuration that uses different URL parts and a set of headers.
 *
 * You can use it to configure custom APIs for models, e.g. your own internal OpenAI proxy with custom headers.
 */
declare class BaseUrlApiConfiguration extends AbstractApiConfiguration {
    readonly baseUrl: UrlParts;
    protected readonly fixedHeadersValue: Record<string, string>;
    constructor({ baseUrl, headers, retry, throttle, customCallHeaders, }: BaseUrlPartsApiConfigurationOptions);
    fixedHeaders(): Record<string, string>;
    assembleUrl(path: string): string;
}
type PartialBaseUrlPartsApiConfigurationOptions = Omit<BaseUrlPartsApiConfigurationOptions, "baseUrl"> & {
    baseUrl?: string | Partial<UrlParts>;
};
declare class BaseUrlApiConfigurationWithDefaults extends BaseUrlApiConfiguration {
    constructor({ baseUrlDefaults, baseUrl, headers, retry, throttle, customCallHeaders, }: {
        baseUrlDefaults: UrlParts;
    } & PartialBaseUrlPartsApiConfigurationOptions);
}

type RetryErrorReason = "maxTriesExceeded" | "errorNotRetryable" | "abort";
declare class RetryError extends Error {
    readonly reason: RetryErrorReason;
    readonly lastError: unknown;
    readonly errors: Array<unknown>;
    constructor({ message, reason, errors, }: {
        message: string;
        reason: RetryErrorReason;
        errors: Array<unknown>;
    });
    toJSON(): {
        name: string;
        message: string;
        reason: RetryErrorReason;
        lastError: unknown;
        errors: unknown[];
    };
}

declare class MemoryCache implements Cache {
    private readonly cache;
    private hashKey;
    lookupValue(key: {
        functionType: string;
        functionId?: string | undefined;
        input: unknown;
    }): Promise<object | null>;
    storeValue(key: {
        functionType: string;
        functionId?: string | undefined;
        input: unknown;
    }, value: unknown): Promise<void>;
}

declare function executeFunction<INPUT, OUTPUT>(fn: (input: INPUT, options: FunctionCallOptions) => PromiseLike<OUTPUT>, input: INPUT, options?: FunctionOptions): Promise<OUTPUT>;

/**
 * Returns the run stored in an AsyncLocalStorage if running in Node.js. It can be set with `withRun()`.
 */
declare function getRun(run?: Run): Promise<Run | undefined>;
/**
 * Stores the run in an AsyncLocalStorage if running in Node.js. It can be retrieved with `getRun()`.
 */
declare function withRun(run: Run, callback: (run: Run) => PromiseLike<void>): Promise<void>;

declare class JSONParseError extends Error {
    readonly text: string;
    readonly cause: unknown;
    constructor({ text, cause }: {
        text: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        valueText: string;
    };
}

/**
 * A schema defines the typed structure of a JSON object.
 */
interface JsonSchemaProducer {
    /**
     * Returns the JSON schema for this schema. The schema has to be a valid JSON schema in object form.
     */
    getJsonSchema(): unknown;
}

/**
 * Validates that the structure of a value matches this schema.
 */
interface Schema<OBJECT> {
    /**
     * Validates that the structure of a value matches this schema,
     * and returns a typed version of the value if it does.
     */
    validate(value: unknown): {
        success: true;
        value: OBJECT;
    } | {
        success: false;
        error: unknown;
    };
    /**
     * Only used for type inference.
     */
    readonly _type: OBJECT;
}

declare class TypeValidationError extends Error {
    readonly value: unknown;
    readonly cause: unknown;
    constructor({ value, cause }: {
        value: unknown;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        value: unknown;
    };
}

declare function uncheckedSchema<OBJECT>(jsonSchema?: unknown): UncheckedSchema<OBJECT>;
declare class UncheckedSchema<OBJECT> implements Schema<OBJECT>, JsonSchemaProducer {
    private readonly jsonSchema?;
    constructor(jsonSchema?: unknown);
    validate(value: unknown): {
        success: true;
        value: OBJECT;
    } | {
        success: false;
        error: unknown;
    };
    getJsonSchema(): unknown;
    readonly _type: OBJECT;
}

declare function zodSchema<OBJECT>(zodSchema: z.Schema<OBJECT>): ZodSchema<OBJECT>;
declare class ZodSchema<OBJECT> implements Schema<OBJECT>, JsonSchemaProducer {
    readonly zodSchema: z.Schema<OBJECT>;
    constructor(zodSchema: z.Schema<OBJECT>);
    validate(value: unknown): {
        success: true;
        value: OBJECT;
    } | {
        success: false;
        error: unknown;
    };
    getJsonSchema(): unknown;
    /**
     * Use only for typing purposes. The value is always `undefined`.
     */
    readonly _type: OBJECT;
    /**
     * Use only for typing purposes. The value is always `undefined`.
     */
    readonly _partialType: PartialDeep<OBJECT, {
        recurseIntoArrays: true;
    }>;
}

/**
 * Parses a JSON string into an unknown object.
 *
 * @param text - The JSON string to parse.
 * @returns {unknown} - The parsed JSON object.
 */
declare function parseJSON({ text }: {
    text: string;
}): unknown;
/**
 * Parses a JSON string into a strongly-typed object using the provided schema.
 *
 * @template T - The type of the object to parse the JSON into.
 * @param {string} text - The JSON string to parse.
 * @param {Schema<T>} schema - The schema to use for parsing the JSON.
 * @returns {T} - The parsed object.
 */
declare function parseJSON<T>({ text, schema, }: {
    text: string;
    schema: Schema<T>;
}): T;
/**
 * Safely parses a JSON string and returns the result as an object of type `unknown`.
 *
 * @param text - The JSON string to parse.
 * @returns {object} Either an object with `success: true` and the parsed data, or an object with `success: false` and the error that occurred.
 */
declare function safeParseJSON({ text, }: {
    text: string;
}): {
    success: true;
    value: unknown;
} | {
    success: false;
    error: JSONParseError | TypeValidationError;
};
/**
 * Safely parses a JSON string into a strongly-typed object, using a provided schema to validate the object.
 *
 * @template T - The type of the object to parse the JSON into.
 * @param {string} text - The JSON string to parse.
 * @param {Schema<T>} schema - The schema to use for parsing the JSON.
 * @returns An object with either a `success` flag and the parsed and typed data, or a `success` flag and an error object.
 */
declare function safeParseJSON<T>({ text, schema, }: {
    text: string;
    schema: Schema<T>;
}): {
    success: true;
    value: T;
} | {
    success: false;
    error: JSONParseError | TypeValidationError;
};

/**
 * Validates the types of an unknown object using a schema and
 * return a strongly-typed object.
 *
 * @template T - The type of the object to validate.
 * @param {string} options.value - The object to validate.
 * @param {Schema<T>} options.schema - The schema to use for validating the JSON.
 * @returns {T} - The typed object.
 */
declare function validateTypes<T>({ value, schema, }: {
    value: unknown;
    schema: Schema<T>;
}): T;
/**
 * Safely validates the types of an unknown object using a schema and
 * return a strongly-typed object.
 *
 * @template T - The type of the object to validate.
 * @param {string} options.value - The JSON object to validate.
 * @param {Schema<T>} options.schema - The schema to use for validating the JSON.
 * @returns An object with either a `success` flag and the parsed and typed data, or a `success` flag and an error object.
 */
declare function safeValidateTypes<T>({ value, schema, }: {
    value: unknown;
    schema: Schema<T>;
}): {
    success: true;
    value: T;
} | {
    success: false;
    error: TypeValidationError;
};

type Delta<T> = {
    type: "delta";
    deltaValue: T;
} | {
    type: "error";
    error: unknown;
};

interface ModelSettings {
    /**
     * Observers that are called when the model is used in run functions.
     */
    observers?: Array<FunctionObserver>;
}
interface Model<SETTINGS extends ModelSettings> {
    modelInformation: ModelInformation;
    readonly settings: SETTINGS;
    /**
     * Returns settings that should be recorded in observability events.
     * Security-related settings (e.g. API keys) should not be included here.
     */
    get settingsForEvent(): Partial<SETTINGS>;
    /**
     * The `withSettings` method creates a new model with the same configuration as the original model, but with the specified settings changed.
     *
     * @example
     * const model = new OpenAICompletionModel({
     *   model: "gpt-3.5-turbo-instruct",
     *   maxGenerationTokens: 500,
     * });
     *
     * const modelWithMoreTokens = model.withSettings({
     *   maxGenerationTokens: 1000,
     * });
     */
    withSettings(additionalSettings: Partial<SETTINGS>): this;
}

type ModelCallMetadata = {
    model: ModelInformation;
    callId: string;
    runId?: string;
    sessionId?: string;
    userId?: string;
    functionId?: string;
    startTimestamp: Date;
    finishTimestamp: Date;
    durationInMs: number;
    usage?: unknown;
};

/**
 * Prompt templates format a source prompt as a target prompt.
 */
interface PromptTemplate<SOURCE_PROMPT, TARGET_PROMPT> {
    /**
     * Formats the source prompt as a target prompt.
     */
    format(sourcePrompt: SOURCE_PROMPT): TARGET_PROMPT;
}

interface ClassifierSettings extends ModelSettings {
}
interface Classifier<VALUE, CLASS extends string | null, SETTINGS extends ClassifierSettings = ClassifierSettings> extends Model<SETTINGS> {
    doClassify(value: VALUE, options: FunctionCallOptions): PromiseLike<{
        rawResponse: unknown | undefined;
        class: CLASS;
    }>;
}

interface EmbeddingModelSettings extends ModelSettings {
}
interface EmbeddingModel<VALUE, SETTINGS extends EmbeddingModelSettings = EmbeddingModelSettings> extends Model<SETTINGS> {
    /**
     * The size of the embedding vector.
     */
    readonly dimensions: number | undefined;
    /**
     * Limit of how many values can be sent in a single API call.
     */
    readonly maxValuesPerCall: number | undefined;
    /**
     * True if the model can handle multiple embedding calls in parallel.
     */
    readonly isParallelizable: boolean;
    doEmbedValues(values: VALUE[], options: FunctionCallOptions): PromiseLike<{
        rawResponse: unknown;
        embeddings: Vector[];
    }>;
}

interface ValueCluster<VALUE, NAME extends string> {
    name: NAME;
    values: VALUE[];
}
interface EmbeddingSimilarityClassifierSettings<VALUE, CLUSTERS extends Array<ValueCluster<VALUE, string>>> extends ClassifierSettings {
    clusters: CLUSTERS;
    embeddingModel: EmbeddingModel<VALUE>;
    similarityThreshold: number;
}
/**
 * Classifies values based on their distance to the values from a set of clusters.
 * When the distance is below a certain threshold, the value is classified as belonging to the cluster,
 * and the cluster name is returned. Otherwise, the value is classified as null.
 */
declare class EmbeddingSimilarityClassifier<VALUE, CLUSTERS extends Array<ValueCluster<VALUE, string>>> implements Classifier<VALUE, ClusterNames<CLUSTERS> | null, EmbeddingSimilarityClassifierSettings<VALUE, CLUSTERS>> {
    readonly settings: EmbeddingSimilarityClassifierSettings<VALUE, CLUSTERS>;
    readonly modelInformation: {
        provider: string;
        modelName: string;
    };
    private embeddings;
    constructor(settings: EmbeddingSimilarityClassifierSettings<VALUE, CLUSTERS>);
    getEmbeddings(options: FunctionCallOptions): Promise<{
        embedding: Vector;
        clusterValue: VALUE;
        clusterName: string;
    }[]>;
    doClassify(value: VALUE, options: FunctionCallOptions): Promise<{
        class: ClusterNames<CLUSTERS> | null;
        rawResponse: undefined;
    }>;
    get settingsForEvent(): Partial<EmbeddingSimilarityClassifierSettings<VALUE, CLUSTERS>>;
    withSettings(additionalSettings: Partial<EmbeddingSimilarityClassifierSettings<VALUE, CLUSTERS>>): this;
}
type ClusterNames<CLUSTERS> = CLUSTERS extends Array<ValueCluster<unknown, infer NAME>> ? NAME : never;

declare function classify<VALUE, CLASS extends string | null>(args: {
    model: Classifier<VALUE, CLASS, ClassifierSettings>;
    value: VALUE;
    fullResponse?: false;
} & FunctionOptions): Promise<CLASS>;
declare function classify<VALUE, CLASS extends string | null>(args: {
    model: Classifier<VALUE, CLASS, ClassifierSettings>;
    value: VALUE;
    fullResponse: true;
} & FunctionOptions): Promise<{
    class: CLASS;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;

/**
 * Generate embeddings for multiple values.
 *
 * @see https://modelfusion.dev/guide/function/embed
 *
 * @example
 * const embeddings = await embedMany({
 *   embedder: openai.TextEmbedder(...),
 *   values: [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * });
 *
 * @param {EmbeddingModel<VALUE, EmbeddingModelSettings>} model - The model to use for generating embeddings.
 * @param {VALUE[]} values - The values to generate embeddings for.
 *
 * @returns {Promise<Vector[]>} - A promise that resolves to an array of vectors representing the embeddings.
 */
declare function embedMany<VALUE>(args: {
    model: EmbeddingModel<VALUE, EmbeddingModelSettings>;
    values: VALUE[];
    fullResponse?: false;
} & FunctionOptions): Promise<Vector[]>;
declare function embedMany<VALUE>(args: {
    model: EmbeddingModel<VALUE, EmbeddingModelSettings>;
    values: VALUE[];
    fullResponse: true;
} & FunctionOptions): Promise<{
    embeddings: Vector[];
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;
/**
 * Generate an embedding for a single value.
 *
 * @see https://modelfusion.dev/guide/function/embed
 *
 * @example
 * const embedding = await embed({
 *   model: openai.TextEmbedder(...),
 *   value: "At first, Nox didn't know what to do with the pup."
 * });
 *
 * @param {EmbeddingModel<VALUE, EmbeddingModelSettings>} model - The model to use for generating the embedding.
 * @param {VALUE} value - The value to generate an embedding for.
 *
 * @returns {Promise<Vector>} - A promise that resolves to a vector representing the embedding.
 */
declare function embed<VALUE>(args: {
    model: EmbeddingModel<VALUE, EmbeddingModelSettings>;
    value: VALUE;
    fullResponse?: false;
} & FunctionOptions): Promise<Vector>;
declare function embed<VALUE>(args: {
    model: EmbeddingModel<VALUE, EmbeddingModelSettings>;
    value: VALUE;
    fullResponse: true;
} & FunctionOptions): Promise<{
    embedding: Vector;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;

interface ImageGenerationModelSettings extends ModelSettings {
    /**
     * Number of images to generate.
     *
     * Specifies the number of images the model should generate for a given prompt.
     *
     * Does nothing if the model does not support this setting.
     *
     * Example: `numberOfGenerations: 2` // The model will produce 2 images
     */
    numberOfGenerations?: number;
}
interface ImageGenerationModel<PROMPT, SETTINGS extends ImageGenerationModelSettings = ImageGenerationModelSettings> extends Model<SETTINGS> {
    doGenerateImages(prompt: PROMPT, options: FunctionCallOptions): PromiseLike<{
        rawResponse: unknown;
        base64Images: string[];
    }>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: PromptTemplate<INPUT_PROMPT, PROMPT>): ImageGenerationModel<INPUT_PROMPT, SETTINGS>;
}

declare class PromptTemplateImageGenerationModel<PROMPT, MODEL_PROMPT, SETTINGS extends ImageGenerationModelSettings, MODEL extends ImageGenerationModel<MODEL_PROMPT, SETTINGS>> implements ImageGenerationModel<PROMPT, SETTINGS> {
    readonly model: MODEL;
    readonly promptTemplate: PromptTemplate<PROMPT, MODEL_PROMPT>;
    constructor({ model, promptTemplate, }: {
        model: MODEL;
        promptTemplate: PromptTemplate<PROMPT, MODEL_PROMPT>;
    });
    get modelInformation(): ModelInformation;
    get settings(): SETTINGS;
    doGenerateImages(prompt: PROMPT, options: FunctionCallOptions): PromiseLike<{
        rawResponse: unknown;
        base64Images: string[];
    }>;
    get settingsForEvent(): Partial<SETTINGS>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: PromptTemplate<INPUT_PROMPT, PROMPT>): PromptTemplateImageGenerationModel<INPUT_PROMPT, PROMPT, SETTINGS, this>;
    withSettings(additionalSettings: Partial<SETTINGS>): this;
}

/**
 * Generates an image using a prompt.
 *
 * The prompt depends on the model. For example, OpenAI image models expect a string prompt,
 * and Stability AI models expect an array of text prompts with optional weights.
 *
 * @see https://modelfusion.dev/guide/function/generate-image
 *
 * @example
 * const image = await generateImage({
 *   imageGenerator: stability.ImageGenerator(...),
 *   prompt: [
 *     { text: "the wicked witch of the west" },
 *     { text: "style of early 19th century painting", weight: 0.5 },
 *   ]
 * });
 *
 * @param {ImageGenerationModel<PROMPT, ImageGenerationModelSettings>} model - The image generation model to be used.
 * @param {PROMPT} prompt - The prompt to be used for image generation.
 *
 * @returns {Promise} - Returns a promise that resolves to the generated image.
 * The image is a Uint8Array containing the image data in PNG format.
 */
declare function generateImage<PROMPT>(args: {
    model: ImageGenerationModel<PROMPT, ImageGenerationModelSettings>;
    prompt: PROMPT;
    fullResponse?: false;
} & FunctionOptions): Promise<Uint8Array>;
declare function generateImage<PROMPT>(args: {
    model: ImageGenerationModel<PROMPT, ImageGenerationModelSettings>;
    prompt: PROMPT;
    fullResponse: true;
} & FunctionOptions): Promise<{
    image: Uint8Array;
    imageBase64: string;
    images: Uint8Array[];
    imagesBase64: string[];
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;

interface SpeechGenerationModelSettings extends ModelSettings {
}
interface SpeechGenerationModel<SETTINGS extends SpeechGenerationModelSettings = SpeechGenerationModelSettings> extends Model<SETTINGS> {
    /**
     * Generates an mp3 audio Uint8Array that contains the speech for the given text.
     */
    doGenerateSpeechStandard(text: string, options: FunctionCallOptions): PromiseLike<Uint8Array>;
}
interface StreamingSpeechGenerationModel<SETTINGS extends SpeechGenerationModelSettings = SpeechGenerationModelSettings> extends SpeechGenerationModel<SETTINGS> {
    doGenerateSpeechStreamDuplex(textStream: AsyncIterable<string>, options: FunctionCallOptions): PromiseLike<AsyncIterable<Delta<Uint8Array>>>;
}

/**
 * Synthesizes speech from text. Also called text-to-speech (TTS).
 *
 * @see https://modelfusion.dev/guide/function/generate-speech
 *
 * @example
 * const speech = await generateSpeech({
 *   model: lmnt.SpeechGenerator(...),
 *   text: "Good evening, ladies and gentlemen! Exciting news on the airwaves tonight " +
 *    "as The Rolling Stones unveil 'Hackney Diamonds.'
 * });
 *
 * @param {SpeechGenerationModel<SpeechGenerationModelSettings>} model - The speech generation model.
 * @param {string} text - The text to be converted to speech.
 *
 * @returns {Promise<Uint8Array>} - A promise that resolves to a Uint8Array containing the synthesized speech.
 */
declare function generateSpeech(args: {
    model: SpeechGenerationModel<SpeechGenerationModelSettings>;
    text: string;
    fullResponse?: false;
} & FunctionOptions): Promise<Uint8Array>;
declare function generateSpeech(args: {
    model: SpeechGenerationModel<SpeechGenerationModelSettings>;
    text: string;
    fullResponse: true;
} & FunctionOptions): Promise<{
    speech: Uint8Array;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;

/**
 * Stream synthesized speech from text. Also called text-to-speech (TTS).
 * Duplex streaming where both the input and output are streamed is supported.
 *
 * @see https://modelfusion.dev/guide/function/generate-speech
 *
 * @example
 * const textStream = await streamText(...);
 *
 * const speechStream = await streamSpeech({
 *   model: elevenlabs.SpeechGenerator(...),
 *   text: textStream
 * });
 *
 * for await (const speechPart of speechStream) {
 *   // ...
 * }
 *
 * @param {StreamingSpeechGenerationModel<SpeechGenerationModelSettings>} model - The speech generation model.
 * @param {AsyncIterable<string> | string} text - The text to be converted to speech. Can be a string or an async iterable of strings.
 * @param {FunctionOptions} [options] - Optional function options.
 *
 * @returns {AsyncIterableResultPromise<Uint8Array>} An async iterable promise that contains the synthesized speech chunks.
 */
declare function streamSpeech(args: {
    model: StreamingSpeechGenerationModel<SpeechGenerationModelSettings>;
    text: AsyncIterable<string> | string;
    fullResponse?: false;
} & FunctionOptions): Promise<AsyncIterable<Uint8Array>>;
declare function streamSpeech(args: {
    model: StreamingSpeechGenerationModel<SpeechGenerationModelSettings>;
    text: AsyncIterable<string> | string;
    fullResponse: true;
} & FunctionOptions): Promise<{
    speechStream: AsyncIterable<Uint8Array>;
    metadata: Omit<ModelCallMetadata, "durationInMs" | "finishTimestamp">;
}>;

/**
 * Interface for a basic tokenizer capable of converting text into tokens.
 *
 * This serves as the base for tokenization functionalities where the focus is on the transformation of input text into a series of numeric tokens.
 */
interface BasicTokenizer {
    /**
     * Asynchronously tokenize the given text into a sequence of numeric tokens.
     *
     * @param text - Input text string that needs to be tokenized.
     * @returns A promise containing an array of numbers, where each number is a token representing a part or the whole of the input text.
     */
    tokenize: (text: string) => PromiseLike<Array<number>>;
}
/**
 * Interface for a comprehensive tokenizer that extends the basic tokenization capabilities.
 *
 * In addition to basic tokenization, this interface provides methods for detokenization and
 * retrieving the original text corresponding to each token, enabling a more informative and reversible transformation process.
 */
interface FullTokenizer extends BasicTokenizer {
    /**
     * Asynchronously tokenize the given text, providing both the numeric tokens and their corresponding text.
     *
     * @param text - Input text string to be tokenized.
     * @returns A promise containing an object with two arrays:
     *          1. `tokens` - An array of numbers where each number is a token.
     *          2. `tokenTexts` - An array of strings where each string represents the original text corresponding to each token.
     */
    tokenizeWithTexts: (text: string) => PromiseLike<{
        tokens: Array<number>;
        tokenTexts: Array<string>;
    }>;
    /**
     * Asynchronously revert a sequence of numeric tokens back into the original text.
     * Detokenization is the process of transforming tokens back to a human-readable format, and it's essential in scenarios
     * where the output needs to be interpretable or when the tokenization process has to be reversible.
     *
     * @param tokens - An array of numeric tokens to be converted back to text.
     * @returns A promise containing a string that represents the original text corresponding to the sequence of input tokens.
     */
    detokenize: (tokens: Array<number>) => PromiseLike<string>;
}

/**
 * Prompt templates format a source prompt as a target prompt.
 */
interface TextGenerationPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT> extends PromptTemplate<SOURCE_PROMPT, TARGET_PROMPT> {
    /**
     * The texts that should be used as default stop sequences.
     * This is e.g. important for chat formats.
     */
    stopSequences: string[];
}

type TextGenerationResult = {
    /**
     * The generated text.
     */
    text: string;
    /**
     * The reason why the generation stopped.
     */
    finishReason: TextGenerationFinishReason;
};
type TextGenerationFinishReason = "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" | "unknown";

/**
 * A tool call contains all information required to execute a tool.
 * It can be generated by a language model.
 *
 * @template NAME - The name of the tool as a string.
 * @template PARAMETERS - The parameters for the tool.
 */
interface ToolCall<NAME extends string, PARAMETERS> {
    /** The id of the tool call. */
    id: string;
    /** The name of the tool. */
    name: NAME;
    /** The arguments for the tool. */
    args: PARAMETERS;
}

declare class ToolCallError extends Error {
    readonly toolCall: ToolCall<string, unknown>;
    readonly cause: unknown | undefined;
    constructor({ cause, toolCall, message, }: {
        toolCall: ToolCall<string, unknown>;
        cause?: unknown;
        message?: string;
    });
    toJSON(): {
        name: string;
        cause: unknown;
        message: string;
        stack: string | undefined;
        toolCall: ToolCall<string, unknown>;
    };
}

type ToolCallResult<NAME extends string, PARAMETERS, RETURN_TYPE> = {
    tool: NAME;
    toolCall: ToolCall<NAME, PARAMETERS>;
    args: PARAMETERS;
} & ({
    ok: true;
    result: RETURN_TYPE;
} | {
    ok: false;
    result: ToolCallError;
});

/**
 * Data content. Can either be a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer.
 */
type DataContent = string | Uint8Array | ArrayBuffer | Buffer;
declare function convertDataContentToBase64String(content: DataContent): string;
declare function convertDataContentToUint8Array(content: DataContent): Uint8Array;

interface TextPart {
    type: "text";
    /**
     * The text content.
     */
    text: string;
}
interface ImagePart {
    type: "image";
    /**
     * Image data. Can either be a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer.
     */
    image: DataContent;
    /**
     * Optional mime type of the image.
     */
    mimeType?: string;
}
interface ToolCallPart {
    type: "tool-call";
    id: string;
    name: string;
    args: unknown;
}
interface ToolResponsePart {
    type: "tool-response";
    id: string;
    response: unknown;
}
declare function validateContentIsString(content: string | unknown, prompt: unknown): string;

/**
 * A chat prompt is a combination of a system message and a list
 * of user, assistant, and tool messages.
 *
 * The user messages can contain multi-modal content.
 * The assistant messages can contain tool calls.
 *
 * Note: Not all models and prompt formats support multi-modal inputs and tool calls.
 * The validation happens at runtime.
 *
 * @example
 * ```ts
 * const chatPrompt: ChatPrompt = {
 *   system: "You are a celebrated poet.",
 *   messages: [
 *    { role: "user", content: "Write a short story about a robot learning to love." },
 *    { role: "assistant", content: "Once upon a time, there was a robot who learned to love." },
 *    { role: "user", content: "That's a great start!" },
 *  ],
 * };
 * ```
 */
interface ChatPrompt {
    system?: string;
    messages: Array<ChatMessage>;
}
type UserContent = string | Array<TextPart | ImagePart>;
type AssistantContent = string | Array<TextPart | ToolCallPart>;
type ToolContent = Array<ToolResponsePart>;
/**
 * A message in a chat prompt.
 *
 * @see ChatPrompt
 */
type ChatMessage = {
    role: "user";
    content: UserContent;
} | {
    role: "assistant";
    content: AssistantContent;
} | {
    role: "tool";
    content: ToolContent;
};
declare const ChatMessage: {
    user({ text }: {
        text: string;
    }): ChatMessage;
    tool({ toolResults, }: {
        toolResults: ToolCallResult<string, unknown, unknown>[] | null;
    }): ChatMessage;
    assistant({ text, toolResults, }: {
        text: string | null;
        toolResults: ToolCallResult<string, unknown, unknown>[] | null;
    }): ChatMessage;
};
declare function createChatPrompt<INPUT>(promptFunction: (input: INPUT) => Promise<ChatPrompt>): (input: INPUT) => PromptFunction<INPUT, ChatPrompt>;

/**
 * A single text instruction prompt. It can contain an optional system message to define
 * the role and behavior of the language model.
 *
 * The instruction can be a text instruction or a multi-modal instruction.
 *
 * @example
 * ```ts
 * {
 *   system: "You are a celebrated poet.", // optional
 *   instruction: "Write a story about a robot learning to love",
 * }
 * ```
 */
interface InstructionPrompt {
    /**
     * Optional system message to provide context for the language model. Note that for some models,
     * changing the system message can impact the results, because the model may be trained on the default system message.
     */
    system?: string;
    /**
     * The instruction for the model.
     */
    instruction: InstructionContent;
    /**
     * Response prefix that will be injected in the prompt at the beginning of the response.
     * This is useful for guiding the model by starting its response with a specific text.
     */
    responsePrefix?: string;
}
type InstructionContent = string | Array<TextPart | ImagePart>;
declare function createInstructionPrompt<INPUT>(promptFunction: (input: INPUT) => Promise<InstructionPrompt>): (input: INPUT) => PromptFunction<INPUT, InstructionPrompt>;

declare const textGenerationModelProperties: readonly ["maxGenerationTokens", "stopSequences", "numberOfGenerations", "trimWhitespace"];
interface TextGenerationModelSettings extends ModelSettings {
    /**
     * Specifies the maximum number of tokens (words, punctuation, parts of words) that the model can generate in a single response.
     * It helps to control the length of the output.
     *
     * Does nothing if the model does not support this setting.
     *
     * Example: `maxGenerationTokens: 1000`
     */
    maxGenerationTokens?: number | undefined;
    /**
     * Stop sequences to use.
     * Stop sequences are an array of strings or a single string that the model will recognize as end-of-text indicators.
     * The model stops generating more content when it encounters any of these strings.
     * This is particularly useful in scripted or formatted text generation, where a specific end point is required.
     * Stop sequences not included in the generated text.
     *
     * Does nothing if the model does not support this setting.
     *
     * Example: `stopSequences: ['\n', 'END']`
     */
    stopSequences?: string[] | undefined;
    /**
     * Number of texts to generate.
     *
     * Specifies the number of responses or completions the model should generate for a given prompt.
     * This is useful when you need multiple different outputs or ideas for a single prompt.
     * The model will generate 'n' distinct responses, each based on the same initial prompt.
     * In a streaming model this will result in both responses streamed back in real time.
     *
     * Does nothing if the model does not support this setting.
     *
     * Example: `numberOfGenerations: 3` // The model will produce 3 different responses.
     */
    numberOfGenerations?: number;
    /**
     * When true, the leading and trailing white space and line terminator characters
     * are removed from the generated text.
     *
     * Default: true.
     */
    trimWhitespace?: boolean;
}
interface HasContextWindowSize {
    contextWindowSize: number;
}
interface HasTokenizer<PROMPT> {
    tokenizer: BasicTokenizer | FullTokenizer;
    countPromptTokens(prompt: PROMPT): PromiseLike<number>;
}
interface TextGenerationModel<PROMPT, SETTINGS extends TextGenerationModelSettings = TextGenerationModelSettings> extends Model<SETTINGS> {
    readonly contextWindowSize: number | undefined;
    readonly tokenizer: BasicTokenizer | FullTokenizer | undefined;
    /**
     * Optional. Implement if you have a tokenizer and want to count the number of tokens in a prompt.
     */
    readonly countPromptTokens: ((prompt: PROMPT) => PromiseLike<number>) | undefined;
    doGenerateTexts(prompt: PROMPT, options?: FunctionCallOptions): PromiseLike<{
        rawResponse: unknown;
        textGenerationResults: TextGenerationResult[];
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: unknown;
        textGenerationResults: TextGenerationResult[];
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    /**
     * When possible, limit the output generation to the specified JSON schema,
     * or super sets of it (e.g. JSON in general).
     */
    withJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): this;
}
interface TextGenerationBaseModel<PROMPT, SETTINGS extends TextGenerationModelSettings = TextGenerationModelSettings> extends TextGenerationModel<PROMPT, SETTINGS> {
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt(): TextGenerationModel<string, SETTINGS>;
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt(): TextGenerationModel<InstructionPrompt, SETTINGS>;
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(): TextGenerationModel<ChatPrompt, SETTINGS>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, PROMPT>): TextGenerationModel<INPUT_PROMPT, SETTINGS>;
}
interface TextStreamingModel<PROMPT, SETTINGS extends TextGenerationModelSettings = TextGenerationModelSettings> extends TextGenerationModel<PROMPT, SETTINGS> {
    doStreamText(prompt: PROMPT, options?: FunctionCallOptions): PromiseLike<AsyncIterable<Delta<unknown>>>;
    extractTextDelta(delta: unknown): string | undefined;
}
interface TextStreamingBaseModel<PROMPT, SETTINGS extends TextGenerationModelSettings = TextGenerationModelSettings> extends TextStreamingModel<PROMPT, SETTINGS> {
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt(): TextStreamingModel<string, SETTINGS>;
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt(): TextStreamingModel<InstructionPrompt, SETTINGS>;
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(): TextStreamingModel<ChatPrompt, SETTINGS>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, PROMPT>): TextStreamingModel<INPUT_PROMPT, SETTINGS>;
}

type ObjectFromTextPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT> = {
    createPrompt: (prompt: SOURCE_PROMPT, schema: Schema<unknown> & JsonSchemaProducer) => TARGET_PROMPT;
    extractObject: (response: string) => unknown;
    withJsonOutput?({ model, schema, }: {
        model: {
            withJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): typeof model;
        };
        schema: Schema<unknown> & JsonSchemaProducer;
    }): typeof model;
};
type FlexibleObjectFromTextPromptTemplate<SOURCE_PROMPT, INTERMEDIATE_PROMPT> = {
    createPrompt: (prompt: SOURCE_PROMPT, schema: Schema<unknown> & JsonSchemaProducer) => INTERMEDIATE_PROMPT;
    extractObject: (response: string) => unknown;
    adaptModel: (model: TextStreamingModel<never> & {
        withTextPrompt(): TextStreamingModel<string>;
        withInstructionPrompt(): TextStreamingModel<InstructionPrompt>;
        withChatPrompt(): TextStreamingModel<ChatPrompt>;
    }) => TextStreamingModel<INTERMEDIATE_PROMPT>;
    withJsonOutput?({ model, schema, }: {
        model: {
            withJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): typeof model;
        };
        schema: Schema<unknown> & JsonSchemaProducer;
    }): typeof model;
};

interface ObjectGenerationModelSettings extends ModelSettings {
}
interface ObjectGenerationModel<PROMPT, SETTINGS extends ObjectGenerationModelSettings = ObjectGenerationModelSettings> extends Model<SETTINGS> {
    doGenerateObject(schema: Schema<unknown> & JsonSchemaProducer, prompt: PROMPT, options?: FunctionOptions): PromiseLike<{
        rawResponse: unknown;
        valueText: string;
        value: unknown;
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
}
interface ObjectStreamingModel<PROMPT, SETTINGS extends ObjectGenerationModelSettings = ObjectGenerationModelSettings> extends ObjectGenerationModel<PROMPT, SETTINGS> {
    doStreamObject(schema: Schema<unknown> & JsonSchemaProducer, prompt: PROMPT, options?: FunctionOptions): PromiseLike<AsyncIterable<Delta<unknown>>>;
    extractObjectTextDelta(delta: unknown): string | undefined;
    parseAccumulatedObjectText(accumulatedText: string): unknown;
}

declare class ObjectFromTextGenerationModel<SOURCE_PROMPT, TARGET_PROMPT, MODEL extends TextGenerationModel<TARGET_PROMPT, TextGenerationModelSettings>> implements ObjectGenerationModel<SOURCE_PROMPT, MODEL["settings"]> {
    protected readonly model: MODEL;
    protected readonly template: ObjectFromTextPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    constructor({ model, template, }: {
        model: MODEL;
        template: ObjectFromTextPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    });
    get modelInformation(): ModelInformation;
    get settings(): TextGenerationModelSettings;
    get settingsForEvent(): Partial<MODEL["settings"]>;
    getModelWithJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): MODEL;
    doGenerateObject(schema: Schema<unknown> & JsonSchemaProducer, prompt: SOURCE_PROMPT, options?: FunctionOptions): Promise<{
        rawResponse: unknown;
        value: unknown;
        valueText: string;
    }>;
    withSettings(additionalSettings: Partial<MODEL["settings"]>): this;
}

/**
 * `AsyncQueue` is a class that represents an asynchronous queue.
 * It allows values to be pushed onto it and consumed (pulled) by an iterator.
 * The queue is async-iterable, making it compatible with async/await syntax.
 *
 * @template T The type of elements contained in the queue.
 * @example
 * const queue = new AsyncQueue<number>();
 * queue.push(1);
 * (async () => {
 *   for await (const value of queue) {
 *     console.log(value);
 *   }
 * })();
 */
declare class AsyncQueue<T> implements AsyncIterable<T> {
    private values;
    private pendingResolvers;
    private closed;
    private processPendingResolvers;
    /**
     * Pushes an element onto the queue. If the queue is closed, an error is thrown.
     *
     * @param {T} value - The element to add to the queue.
     * @throws {Error} Throws an error if the queue is closed.
     * @example
     * queue.push(2);
     */
    push(value: T): void;
    error(error: unknown): void;
    /**
     * Closes the queue, preventing more elements from being pushed onto it.
     *
     * @example
     * queue.close();
     */
    close(): void;
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
    [Symbol.asyncIterator](): AsyncIterator<T>;
}

declare class ObjectFromTextStreamingModel<SOURCE_PROMPT, TARGET_PROMPT, MODEL extends TextStreamingModel<TARGET_PROMPT, TextGenerationModelSettings>> extends ObjectFromTextGenerationModel<SOURCE_PROMPT, TARGET_PROMPT, MODEL> implements ObjectStreamingModel<SOURCE_PROMPT, MODEL["settings"]> {
    constructor(options: {
        model: MODEL;
        template: ObjectFromTextPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    });
    doStreamObject(schema: Schema<unknown> & JsonSchemaProducer, prompt: SOURCE_PROMPT, options?: FunctionOptions): Promise<AsyncQueue<Delta<string>>>;
    extractObjectTextDelta(delta: unknown): string;
    parseAccumulatedObjectText(accumulatedText: string): unknown;
    withSettings(additionalSettings: Partial<MODEL["settings"]>): this;
}

declare class ObjectParseError extends Error {
    readonly cause: unknown;
    readonly valueText: string;
    constructor({ valueText, cause }: {
        valueText: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        cause: unknown;
        message: string;
        stack: string | undefined;
        valueText: string;
    };
}

type ObjectStream<OBJECT> = AsyncIterable<{
    partialObject: PartialDeep<OBJECT, {
        recurseIntoArrays: true;
    }>;
    partialText: string;
    textDelta: string;
}>;
/**
 * Response for ObjectStream. The object stream is encoded as a text stream.
 *
 * Example:
 * ```ts
 * return new ObjectStreamResponse(objectStream);
 * ```
 */
declare class ObjectStreamResponse extends Response {
    constructor(stream: ObjectStream<unknown>, init?: ResponseInit);
}
/**
 * Convert a Response to a lightweight ObjectStream. The response must be created
 * using ObjectStreamResponse on the server.
 *
 * @see ObjectStreamResponse
 */
declare function ObjectStreamFromResponse<OBJECT>({ response, }: {
    schema: Schema<OBJECT>;
    response: Response;
}): AsyncGenerator<{
    partialObject: OBJECT;
}, void, unknown>;

declare class ObjectValidationError extends Error {
    readonly cause: unknown;
    readonly valueText: string;
    readonly value: unknown;
    constructor({ value, valueText, cause, }: {
        value: unknown;
        valueText: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        value: unknown;
        valueText: string;
    };
}

/**
 * Generate a typed object for a prompt and a schema.
 *
 * @see https://modelfusion.dev/guide/function/generate-object
 *
 * @example
 * const sentiment = await generateObject({
 *   model: openai.ChatTextGenerator(...).asFunctionCallObjectGenerationModel(...),
 *
 *   schema: zodSchema(z.object({
 *     sentiment: z
 *       .enum(["positive", "neutral", "negative"])
 *       .describe("Sentiment."),
 *   })),
 *
 *   prompt: [
 *     openai.ChatMessage.system(
 *       "You are a sentiment evaluator. " +
 *         "Analyze the sentiment of the following product review:"
 *     ),
 *     openai.ChatMessage.user(
 *       "After I opened the package, I was met by a very unpleasant smell " +
 *         "that did not disappear even after washing. Never again!"
 *     ),
 *   ]
 * });
 *
 * @param {ObjectGenerationModel<PROMPT, SETTINGS>} options.model - The model to generate the object.
 * @param {Schema<OBJECT>} options.schema - The schema to be used.
 * @param {PROMPT | ((schema: Schema<OBJECT>) => PROMPT)} options.prompt
 * The prompt to be used.
 * You can also pass a function that takes the schema as an argument and returns the prompt.
 *
 * @returns {Promise<OBJECT>} - Returns a promise that resolves to the generated object.
 */
declare function generateObject<OBJECT, PROMPT, SETTINGS extends ObjectGenerationModelSettings>(args: {
    model: ObjectGenerationModel<PROMPT, SETTINGS>;
    schema: Schema<OBJECT> & JsonSchemaProducer;
    prompt: PROMPT | PromptFunction<unknown, PROMPT> | ((schema: Schema<OBJECT>) => PROMPT | PromptFunction<unknown, PROMPT>);
    fullResponse?: false;
} & FunctionOptions): Promise<OBJECT>;
declare function generateObject<OBJECT, PROMPT, SETTINGS extends ObjectGenerationModelSettings>(args: {
    model: ObjectGenerationModel<PROMPT, SETTINGS>;
    schema: Schema<OBJECT> & JsonSchemaProducer;
    prompt: PROMPT | PromptFunction<unknown, PROMPT> | ((schema: Schema<OBJECT>) => PROMPT | PromptFunction<unknown, PROMPT>);
    fullResponse: true;
} & FunctionOptions): Promise<{
    value: OBJECT;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;

declare const jsonObjectPrompt: {
    custom<SOURCE_PROMPT, TARGET_PROMPT>(createPrompt: (prompt: SOURCE_PROMPT, schema: Schema<unknown> & JsonSchemaProducer) => TARGET_PROMPT): ObjectFromTextPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    text({ schemaPrefix, schemaSuffix, }?: {
        schemaPrefix?: string | undefined;
        schemaSuffix?: string | undefined;
    }): FlexibleObjectFromTextPromptTemplate<string, InstructionPrompt>;
    instruction({ schemaPrefix, schemaSuffix, }?: {
        schemaPrefix?: string | undefined;
        schemaSuffix?: string | undefined;
    }): FlexibleObjectFromTextPromptTemplate<InstructionPrompt, InstructionPrompt>;
};

/**
 * Generate and stream an object for a prompt and a schema.
 *
 * @see https://modelfusion.dev/guide/function/generate-object
 *
 * @example
 * const objectStream = await streamObject({
 *   model: openai.ChatTextGenerator(...).asFunctionCallObjectGenerationModel(...),
 *   schema: zodSchema(
 *     z.array(
 *       z.object({
 *         name: z.string(),
 *         class: z
 *           .string()
 *           .describe("Character class, e.g. warrior, mage, or thief."),
 *         description: z.string(),
 *       })
 *     ),
 *   prompt: [
 *     openai.ChatMessage.user(
 *       "Generate 3 character descriptions for a fantasy role playing game."
 *     ),
 *   ]
 * });
 *
 * for await (const { partialObject } of objectStream) {
 *   // ...
 * }
 *
 * @param {ObjectStreamingModel<PROMPT>} options.model - The model that generates the object
 * @param {Schema<OBJECT>} options.schema - The schema of the object to be generated.
 * @param {PROMPT | ((schema: Schema<OBJECT>) => PROMPT)} options.prompt
 * The prompt to be used.
 * You can also pass a function that takes the schema as an argument and returns the prompt.
 */
declare function streamObject<OBJECT, PROMPT>(args: {
    model: ObjectStreamingModel<PROMPT>;
    schema: Schema<OBJECT> & JsonSchemaProducer;
    prompt: PROMPT | PromptFunction<unknown, PROMPT> | ((schema: Schema<OBJECT>) => PROMPT | PromptFunction<unknown, PROMPT>);
    fullResponse?: false;
} & FunctionOptions): Promise<ObjectStream<OBJECT>>;
declare function streamObject<OBJECT, PROMPT>(args: {
    model: ObjectStreamingModel<PROMPT>;
    schema: Schema<OBJECT> & JsonSchemaProducer;
    prompt: PROMPT | PromptFunction<unknown, PROMPT> | ((schema: Schema<OBJECT>) => PROMPT | PromptFunction<unknown, PROMPT>);
    fullResponse: true;
} & FunctionOptions): Promise<{
    objectStream: ObjectStream<OBJECT>;
    objectPromise: PromiseLike<OBJECT>;
    metadata: Omit<ModelCallMetadata, "durationInMs" | "finishTimestamp">;
}>;

interface ToolDefinition<NAME extends string, PARAMETERS> {
    name: NAME;
    description?: string;
    parameters: Schema<PARAMETERS> & JsonSchemaProducer;
}

interface ToolCallGenerationModelSettings extends ModelSettings {
}
interface ToolCallGenerationModel<PROMPT, SETTINGS extends ToolCallGenerationModelSettings = ToolCallGenerationModelSettings> extends Model<SETTINGS> {
    doGenerateToolCall(tool: ToolDefinition<string, unknown>, prompt: PROMPT, options?: FunctionOptions): PromiseLike<{
        rawResponse: unknown;
        toolCall: {
            id: string;
            args: unknown;
        } | null;
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
}

interface ToolCallsGenerationModelSettings extends ModelSettings {
}
interface ToolCallsGenerationModel<PROMPT, SETTINGS extends ToolCallsGenerationModelSettings> extends Model<SETTINGS> {
    doGenerateToolCalls(tools: Array<ToolDefinition<string, unknown>>, prompt: PROMPT, options?: FunctionOptions): PromiseLike<{
        rawResponse: unknown;
        text: string | null;
        toolCalls: Array<{
            id: string;
            name: string;
            args: unknown;
        }> | null;
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
}

interface ToolCallPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT> {
    createPrompt(prompt: SOURCE_PROMPT, tool: ToolDefinition<string, unknown>): TARGET_PROMPT;
    extractToolCall(response: string, tool: ToolDefinition<string, unknown>): {
        id: string;
        args: unknown;
    } | null;
    withJsonOutput?({ model, schema, }: {
        model: {
            withJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): typeof model;
        };
        schema: Schema<unknown> & JsonSchemaProducer;
    }): typeof model;
}

declare class TextGenerationToolCallModel<SOURCE_PROMPT, TARGET_PROMPT, MODEL extends TextGenerationModel<TARGET_PROMPT, TextGenerationModelSettings>> implements ToolCallGenerationModel<SOURCE_PROMPT, MODEL["settings"]> {
    private readonly model;
    private readonly template;
    constructor({ model, template, }: {
        model: MODEL;
        template: ToolCallPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    });
    get modelInformation(): ModelInformation;
    get settings(): TextGenerationModelSettings;
    get settingsForEvent(): Partial<MODEL["settings"]>;
    getModelWithJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): MODEL;
    doGenerateToolCall(tool: ToolDefinition<string, unknown>, prompt: SOURCE_PROMPT, options?: FunctionOptions): Promise<{
        rawResponse: unknown;
        toolCall: {
            id: string;
            args: unknown;
        } | null;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        } | undefined;
    }>;
    withSettings(additionalSettings: Partial<MODEL["settings"]>): this;
}

interface ToolCallsPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT> {
    createPrompt: (prompt: SOURCE_PROMPT, tools: Array<ToolDefinition<string, unknown>>) => TARGET_PROMPT;
    extractToolCallsAndText: (response: string) => {
        text: string | null;
        toolCalls: Array<{
            id: string;
            name: string;
            args: unknown;
        }> | null;
    };
}

declare class TextGenerationToolCallsModel<SOURCE_PROMPT, TARGET_PROMPT, MODEL extends TextGenerationModel<TARGET_PROMPT, ToolCallsGenerationModelSettings>> implements ToolCallsGenerationModel<SOURCE_PROMPT, MODEL["settings"]> {
    private readonly model;
    private readonly template;
    constructor({ model, template, }: {
        model: MODEL;
        template: ToolCallsPromptTemplate<SOURCE_PROMPT, TARGET_PROMPT>;
    });
    get modelInformation(): ModelInformation;
    get settings(): ToolCallsGenerationModelSettings;
    get settingsForEvent(): Partial<MODEL["settings"]>;
    doGenerateToolCalls(tools: Array<ToolDefinition<string, unknown>>, prompt: SOURCE_PROMPT, options?: FunctionOptions): Promise<{
        rawResponse: unknown;
        text: string | null;
        toolCalls: {
            id: string;
            name: string;
            args: unknown;
        }[] | null;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        } | undefined;
    }>;
    withSettings(additionalSettings: Partial<MODEL["settings"]>): this;
}

declare class PromptTemplateTextGenerationModel<PROMPT, MODEL_PROMPT, SETTINGS extends TextGenerationModelSettings, MODEL extends TextGenerationModel<MODEL_PROMPT, SETTINGS>> implements TextGenerationModel<PROMPT, SETTINGS> {
    readonly model: MODEL;
    readonly promptTemplate: TextGenerationPromptTemplate<PROMPT, MODEL_PROMPT>;
    constructor({ model, promptTemplate, }: {
        model: MODEL;
        promptTemplate: TextGenerationPromptTemplate<PROMPT, MODEL_PROMPT>;
    });
    get modelInformation(): ModelInformation;
    get settings(): SETTINGS;
    get tokenizer(): MODEL["tokenizer"];
    get contextWindowSize(): MODEL["contextWindowSize"];
    get countPromptTokens(): MODEL["countPromptTokens"] extends undefined ? undefined : (prompt: PROMPT) => PromiseLike<number>;
    doGenerateTexts(prompt: PROMPT, options?: FunctionCallOptions): PromiseLike<{
        rawResponse: unknown;
        textGenerationResults: TextGenerationResult[];
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        } | undefined;
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: unknown;
        textGenerationResults: TextGenerationResult[];
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        } | undefined;
    };
    get settingsForEvent(): Partial<SETTINGS>;
    asToolCallGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallPromptTemplate<INPUT_PROMPT, PROMPT>): TextGenerationToolCallModel<INPUT_PROMPT, PROMPT, this>;
    asToolCallsOrTextGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallsPromptTemplate<INPUT_PROMPT, PROMPT>): TextGenerationToolCallsModel<INPUT_PROMPT, PROMPT, this>;
    asObjectGenerationModel<INPUT_PROMPT>(promptTemplate: ObjectFromTextPromptTemplate<INPUT_PROMPT, PROMPT>): ObjectFromTextGenerationModel<INPUT_PROMPT, PROMPT, this>;
    withJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): this;
    withSettings(additionalSettings: Partial<SETTINGS>): this;
}

declare class PromptTemplateTextStreamingModel<PROMPT, MODEL_PROMPT, SETTINGS extends TextGenerationModelSettings, MODEL extends TextStreamingModel<MODEL_PROMPT, SETTINGS>> extends PromptTemplateTextGenerationModel<PROMPT, MODEL_PROMPT, SETTINGS, MODEL> implements TextStreamingModel<PROMPT, SETTINGS> {
    constructor(options: {
        model: MODEL;
        promptTemplate: TextGenerationPromptTemplate<PROMPT, MODEL_PROMPT>;
    });
    doStreamText(prompt: PROMPT, options?: FunctionCallOptions): PromiseLike<AsyncIterable<Delta<unknown>>>;
    extractTextDelta(delta: unknown): string | undefined;
    asObjectGenerationModel<INPUT_PROMPT>(promptTemplate: ObjectFromTextPromptTemplate<INPUT_PROMPT, PROMPT>): ObjectFromTextStreamingModel<INPUT_PROMPT, PROMPT, this>;
    withJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): this;
    withSettings(additionalSettings: Partial<SETTINGS>): this;
}

declare class PromptTemplateFullTextModel<PROMPT, MODEL_PROMPT, SETTINGS extends TextGenerationModelSettings, MODEL extends TextStreamingModel<MODEL_PROMPT, SETTINGS> & ToolCallGenerationModel<MODEL_PROMPT, SETTINGS> & ToolCallsGenerationModel<MODEL_PROMPT, SETTINGS>> extends PromptTemplateTextStreamingModel<PROMPT, MODEL_PROMPT, SETTINGS, MODEL> implements TextStreamingModel<PROMPT, SETTINGS>, ToolCallGenerationModel<PROMPT, SETTINGS>, ToolCallsGenerationModel<PROMPT, SETTINGS> {
    constructor(options: {
        model: MODEL;
        promptTemplate: TextGenerationPromptTemplate<PROMPT, MODEL_PROMPT>;
    });
    doGenerateToolCall(tool: ToolDefinition<string, unknown>, prompt: PROMPT, options?: FunctionOptions | undefined): PromiseLike<{
        rawResponse: unknown;
        toolCall: {
            id: string;
            args: unknown;
        } | null;
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        } | undefined;
    }>;
    doGenerateToolCalls(tools: ToolDefinition<string, unknown>[], prompt: PROMPT, options?: FunctionOptions | undefined): PromiseLike<{
        rawResponse: unknown;
        text: string | null;
        toolCalls: {
            id: string;
            name: string;
            args: unknown;
        }[] | null;
        usage?: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        } | undefined;
    }>;
    withSettings(additionalSettings: Partial<SETTINGS>): this;
}

/**
 * Generate text for a prompt and return it as a string.
 *
 * The prompt depends on the model used.
 * For instance, OpenAI completion models expect a string prompt,
 * whereas OpenAI chat models expect an array of chat messages.
 *
 * @see https://modelfusion.dev/guide/function/generate-text
 *
 * @example
 * const text = await generateText({
 *   model: openai.CompletionTextGenerator(...),
 *   prompt: "Write a short story about a robot learning to love:\n\n"
 * });
 *
 * @param {TextGenerationModel<PROMPT, TextGenerationModelSettings>} model - The text generation model to use.
 * @param {PROMPT} prompt - The prompt to use for text generation.
 *
 * @returns {Promise<string>} - A promise that resolves to the generated text.
 */
declare function generateText<PROMPT>(args: {
    model: TextGenerationModel<PROMPT, TextGenerationModelSettings>;
    prompt: PROMPT | PromptFunction<unknown, PROMPT>;
    fullResponse?: false;
} & FunctionOptions): Promise<string>;
declare function generateText<PROMPT>(args: {
    model: TextGenerationModel<PROMPT, TextGenerationModelSettings>;
    prompt: PROMPT | PromptFunction<unknown, PROMPT>;
    fullResponse: true;
} & FunctionOptions): Promise<{
    text: string;
    finishReason: TextGenerationFinishReason;
    texts: string[];
    textGenerationResults: TextGenerationResult[];
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;

/**
 * Formats a text prompt as an Alpaca prompt.
 */
declare function text$8(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as an Alpaca prompt.
 *
 * If the instruction has a system prompt, it overrides the default system prompt
 * (which can impact the results, because the model may be trained on the default system prompt).
 *
 * Prompt template with input:
 * ```
 * Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.
 *
 * ### Instruction:
 *
 * {instruction}
 *
 * ### Input:
 *
 * {input}
 *
 * ### Response:
 *
 * ```
 *
 * Prompt template without input:
 * ```
 * Below is an instruction that describes a task. Write a response that appropriately completes the request.
 *
 * ### Instruction:
 *
 * {instruction}
 *
 * ### Response:
 *
 * ```
 *
 * @see https://github.com/tatsu-lab/stanford_alpaca#data-release
 */
declare function instruction$8(): TextGenerationPromptTemplate<InstructionPrompt & {
    input?: string;
}, // optional input supported by Alpaca
string>;
/**
 * Not supported by Alpaca.
 */
declare function chat$8(): TextGenerationPromptTemplate<ChatPrompt, string>;

declare namespace AlpacaPromptTemplate {
  export { chat$8 as chat, instruction$8 as instruction, text$8 as text };
}

/**
 * Formats a text prompt using the ChatML format.
 */
declare function text$7(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt using the ChatML format.
 *
 * ChatML prompt template:
 * ```
 * <|im_start|>system
 * ${ system prompt }<|im_end|>
 * <|im_start|>user
 * ${ instruction }<|im_end|>
 * <|im_start|>assistant
 * ${response prefix}
 * ```
 */
declare function instruction$7(): TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt using the ChatML format.
 *
 * ChatML prompt template:
 * ```
 * <|im_start|>system
 * You are a helpful assistant that answers questions about the world.<|im_end|>
 * <|im_start|>user
 * What is the capital of France?<|im_end|>
 * <|im_start|>assistant
 * Paris<|im_end|>
 * ```
 */
declare function chat$7(): TextGenerationPromptTemplate<ChatPrompt, string>;

declare namespace ChatMLPromptTemplate {
  export { chat$7 as chat, instruction$7 as instruction, text$7 as text };
}

/**
 * Error thrown when a prompt validation fails.
 */
declare class InvalidPromptError extends Error {
    readonly prompt: unknown;
    constructor(message: string, prompt: unknown);
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        prompt: unknown;
    };
}

/**
 * Formats a text prompt as a Llama 2 prompt.
 *
 * Llama 2 prompt template:
 * ```
 * <s>[INST] { instruction } [/INST]
 * ```
 *
 * @see https://www.philschmid.de/llama-2#how-to-prompt-llama-2-chat
 */
declare function text$6(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a Llama 2 prompt.
 *
 * Llama 2 prompt template:
 * ```
 * <s>[INST] <<SYS>>
 * ${ system prompt }
 * <</SYS>>
 * ${ instruction }
 * [/INST]
 * ${ response prefix }
 * ```
 *
 * @see https://www.philschmid.de/llama-2#how-to-prompt-llama-2-chat
 */
declare function instruction$6(): TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a Llama 2 prompt.
 *
 * Llama 2 prompt template:
 * ```
 * <s>[INST] <<SYS>>
 * ${ system prompt }
 * <</SYS>>
 *
 * ${ user msg 1 } [/INST] ${ model response 1 } </s><s>[INST] ${ user msg 2 } [/INST] ${ model response 2 } </s><s>[INST] ${ user msg 3 } [/INST]
 * ```
 */
declare function chat$6(): TextGenerationPromptTemplate<ChatPrompt, string>;
/**
 * Checks if a Llama2 chat prompt is valid. Throws a {@link ChatPromptValidationError} if it's not.
 *
 * - The first message of the chat must be a user message.
 * - Then it must be alternating between an assistant message and a user message.
 * - The last message must always be a user message (when submitting to a model).
 *
 * The type checking is done at runtime when you submit a chat prompt to a model with a prompt template.
 *
 * @throws {@link ChatPromptValidationError}
 */
declare function validateLlama2Prompt(chatPrompt: ChatPrompt): void;

declare const Llama2PromptTemplate_validateLlama2Prompt: typeof validateLlama2Prompt;
declare namespace Llama2PromptTemplate {
  export { chat$6 as chat, instruction$6 as instruction, text$6 as text, Llama2PromptTemplate_validateLlama2Prompt as validateLlama2Prompt };
}

/**
 * Formats a text prompt as a Mistral instruct prompt.
 *
 * Mistral prompt template:
 * ```
 * <s>[INST] { instruction } [/INST]
 * ```
 *
 * @see https://docs.mistral.ai/models/#chat-template
 */
declare function text$5(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a Mistral instruct prompt.
 *
 * Note that Mistral does not support system prompts. We emulate them.
 *
 * Mistral prompt template when system prompt is set:
 * ```
 * <s>[INST] ${ system prompt } [/INST] </s>[INST] ${instruction} [/INST] ${ response prefix }
 * ```
 *
 * Mistral prompt template when there is no system prompt:
 * ```
 * <s>[INST] ${ instruction } [/INST] ${ response prefix }
 * ```
 *
 * @see https://docs.mistral.ai/models/#chat-template
 */
declare function instruction$5(): TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a Mistral instruct prompt.
 *
 * Note that Mistral does not support system prompts. We emulate them.
 *
 * Mistral prompt template when system prompt is set:
 * ```
 * <s>[INST] ${ system prompt } [/INST] </s> [INST] ${ user msg 1 } [/INST] ${ model response 1 } [INST] ${ user msg 2 } [/INST] ${ model response 2 } [INST] ${ user msg 3 } [/INST]
 * ```
 *
 * Mistral prompt template when there is no system prompt:
 * ```
 * <s>[INST] ${ user msg 1 } [/INST] ${ model response 1 } </s>[INST] ${ user msg 2 } [/INST] ${ model response 2 } [INST] ${ user msg 3 } [/INST]
 * ```
 *
 * @see https://docs.mistral.ai/models/#chat-template
 */
declare function chat$5(): TextGenerationPromptTemplate<ChatPrompt, string>;
/**
 * Checks if a Mistral chat prompt is valid. Throws a {@link ChatPromptValidationError} if it's not.
 *
 * - The first message of the chat must be a user message.
 * - Then it must be alternating between an assistant message and a user message.
 * - The last message must always be a user message (when submitting to a model).
 *
 * The type checking is done at runtime when you submit a chat prompt to a model with a prompt template.
 *
 * @throws {@link ChatPromptValidationError}
 */
declare function validateMistralPrompt(chatPrompt: ChatPrompt): void;

declare const MistralInstructPromptTemplate_validateMistralPrompt: typeof validateMistralPrompt;
declare namespace MistralInstructPromptTemplate {
  export { chat$5 as chat, instruction$5 as instruction, text$5 as text, MistralInstructPromptTemplate_validateMistralPrompt as validateMistralPrompt };
}

/**
 * Formats a text prompt as a neural chat prompt.
 *
 * @see https://huggingface.co/Intel/neural-chat-7b-v3-1#prompt-template
 */
declare function text$4(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a neural chat prompt.
 *
 * @see https://huggingface.co/Intel/neural-chat-7b-v3-1#prompt-template
 */
declare const instruction$4: () => TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a basic text prompt.
 *
 * @param user The label of the user in the chat. Default to "user".
 * @param assistant The label of the assistant in the chat. Default to "assistant".
 * @param system The label of the system in the chat. Optional, defaults to no prefix.
 */
declare function chat$4(): TextGenerationPromptTemplate<ChatPrompt, string>;

declare namespace NeuralChatPromptTemplate {
  export { chat$4 as chat, instruction$4 as instruction, text$4 as text };
}

interface TextGenerationPromptTemplateProvider<TARGET_PROMPT> {
    text(): TextGenerationPromptTemplate<string, TARGET_PROMPT>;
    instruction(): TextGenerationPromptTemplate<InstructionPrompt, TARGET_PROMPT>;
    chat(): TextGenerationPromptTemplate<ChatPrompt, TARGET_PROMPT>;
}

/**
 * Formats a text prompt as a Synthia text prompt.
 *
 * Synthia prompt template:
 * ```
 * USER: text
 * ASSISTANT:
 * ```
 */
declare const text$3: () => TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a Synthia prompt.
 *
 * Synthia prompt template:
 * ```
 * SYSTEM: system message
 * USER: instruction
 * ASSISTANT: response prefix
 * ```
 */
declare const instruction$3: () => TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a Synthia prompt.
 *
 * Synthia prompt template:
 * ```
 * SYSTEM: system message
 * USER: user message
 * ASSISTANT: assistant message
 * ```
 */
declare const chat$3: () => TextGenerationPromptTemplate<ChatPrompt, string>;

declare namespace SynthiaPromptTemplate {
  export { chat$3 as chat, instruction$3 as instruction, text$3 as text };
}

declare function createTextPrompt<INPUT>(promptFunction: (input: INPUT) => Promise<string>): (input: INPUT) => PromptFunction<INPUT, string>;

/**
 * Formats a text prompt as a basic text prompt. Does not change the text prompt in any way.
 */
declare const text$2: () => TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a basic text prompt.
 */
declare const instruction$2: () => TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a basic text prompt.
 *
 * @param user The label of the user in the chat. Default to "user".
 * @param assistant The label of the assistant in the chat. Default to "assistant".
 * @param system The label of the system in the chat. Optional, defaults to no prefix.
 */
declare const chat$2: (options?: {
    user?: string;
    assistant?: string;
    system?: string;
}) => TextGenerationPromptTemplate<ChatPrompt, string>;

declare namespace TextPromptTemplate {
  export { chat$2 as chat, instruction$2 as instruction, text$2 as text };
}

/**
 * Formats a text prompt as a Vicuna prompt.
 */
declare function text$1(): TextGenerationPromptTemplate<string, string>;
/**
 * Formats an instruction prompt as a Vicuna prompt.
 */
declare const instruction$1: () => TextGenerationPromptTemplate<InstructionPrompt, string>;
/**
 * Formats a chat prompt as a Vicuna prompt.
 *
 * Overriding the system message in the first chat message can affect model responses.
 *
 * Vicuna prompt template:
 * ```
 * A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions.
 *
 * USER: {prompt}
 * ASSISTANT:
 * ```
 */
declare function chat$1(): TextGenerationPromptTemplate<ChatPrompt, string>;

declare namespace VicunaPromptTemplate {
  export { chat$1 as chat, instruction$1 as instruction, text$1 as text };
}

/**
 * Keeps only the most recent messages in the prompt, while leaving enough space for the completion.
 *
 * It will remove user-ai message pairs that don't fit. The result is always a valid chat prompt.
 *
 * When the minimal chat prompt (system message + last user message) is already too long, it will only
 * return this minimal chat prompt.
 *
 * @see https://modelfusion.dev/guide/function/generate-text#limiting-the-chat-length
 */
declare function trimChatPrompt({ prompt, model, tokenLimit, }: {
    prompt: ChatPrompt;
    model: TextGenerationModel<ChatPrompt, TextGenerationModelSettings> & HasTokenizer<ChatPrompt> & HasContextWindowSize;
    tokenLimit?: number;
}): Promise<ChatPrompt>;

/**
 * Stream the generated text for a prompt as an async iterable.
 *
 * The prompt depends on the model used.
 * For instance, OpenAI completion models expect a string prompt,
 * whereas OpenAI chat models expect an array of chat messages.
 *
 * @see https://modelfusion.dev/guide/function/generate-text
 *
 * @example
 * const textStream = await streamText({
 *   model: openai.CompletionTextGenerator(...),
 *   prompt: "Write a short story about a robot learning to love:\n\n"
 * });
 *
 * for await (const textPart of textStream) {
 *   // ...
 * }
 *
 * @param {TextStreamingModel<PROMPT>} model - The model to stream text from.
 * @param {PROMPT} prompt - The prompt to use for text generation.
 * @param {FunctionOptions} [options] - Optional parameters for the function.
 *
 * @returns {AsyncIterableResultPromise<string>} An async iterable promise that yields the generated text.
 */
declare function streamText<PROMPT>(args: {
    model: TextStreamingModel<PROMPT>;
    prompt: PROMPT | PromptFunction<unknown, PROMPT>;
    fullResponse?: false;
} & FunctionOptions): Promise<AsyncIterable<string>>;
declare function streamText<PROMPT>(args: {
    model: TextStreamingModel<PROMPT>;
    prompt: PROMPT | PromptFunction<unknown, PROMPT>;
    fullResponse: true;
} & FunctionOptions): Promise<{
    textStream: AsyncIterable<string>;
    textPromise: PromiseLike<string>;
    metadata: Omit<ModelCallMetadata, "durationInMs" | "finishTimestamp">;
}>;

interface TranscriptionModelSettings extends ModelSettings {
}
interface TranscriptionModel<SETTINGS extends TranscriptionModelSettings = TranscriptionModelSettings> extends Model<SETTINGS> {
    doTranscribe: (input: {
        mimeType: string;
        audioData: DataContent;
    }, options: FunctionCallOptions) => PromiseLike<{
        rawResponse: unknown;
        transcription: string;
    }>;
}

type AudioMimeType = "audio/webm" | "audio/mp3" | "audio/wav" | "audio/mp4" | "audio/mpeg" | "audio/mpga" | "audio/ogg" | "audio/oga" | "audio/flac" | "audio/m4a";

/**
 * Transcribe audio data into text. Also called speech-to-text (STT) or automatic speech recognition (ASR).
 *
 * @see https://modelfusion.dev/guide/function/generate-transcription
 *
 * @example
 * const audioData = await fs.promises.readFile("data/test.mp3");
 *
 * const transcription = await generateTranscription({
 *   model: openai.Transcriber({ model: "whisper-1" }),
 *   mimeType: "audio/mp3",
 *   audioData,
 * });
 *
 * @param {TranscriptionModel<DATA, TranscriptionModelSettings>} options.model - The model to use for transcription.
 * @param {AudioMimeType} options.model - The MIME type of the audio data.
 * @param {DataContent} options.model - The audio data to transcribe. Can be a base64-encoded string, a Uint8Array, or a Buffer.
 *
 * @returns {Promise<string>} A promise that resolves to the transcribed text.
 */
declare function generateTranscription(args: {
    model: TranscriptionModel<TranscriptionModelSettings>;
    mimeType: AudioMimeType | (string & {});
    audioData: DataContent;
    fullResponse?: false;
} & FunctionOptions): Promise<string>;
declare function generateTranscription(args: {
    model: TranscriptionModel<TranscriptionModelSettings>;
    mimeType: AudioMimeType | (string & {});
    audioData: DataContent;
    fullResponse: true;
} & FunctionOptions): Promise<{
    value: string;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;

/**
 * Count the number of tokens in the given text.
 */
declare function countTokens(tokenizer: BasicTokenizer, text: string): Promise<number>;

/**
 * Creates an API configuration for the AUTOMATIC1111 Stable Diffusion Web UI API.
 * It calls the API at http://127.0.0.1:7860/sdapi/v1 by default.
 */
declare class Automatic1111ApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions);
}

type ResponseHandler<T> = (options: {
    url: string;
    requestBodyValues: unknown;
    response: Response;
}) => PromiseLike<T>;

declare const automatic1111ErrorDataSchema: z.ZodObject<{
    error: z.ZodString;
    detail: z.ZodString;
    body: z.ZodString;
    errors: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: string;
    errors: string;
    body: string;
    detail: string;
}, {
    error: string;
    errors: string;
    body: string;
    detail: string;
}>;
type Automatic1111ErrorData = z.infer<typeof automatic1111ErrorDataSchema>;

declare abstract class AbstractModel<SETTINGS extends ModelSettings> implements Model<SETTINGS> {
    readonly settings: SETTINGS;
    constructor({ settings }: {
        settings: SETTINGS;
    });
    abstract readonly provider: string;
    abstract readonly modelName: string | null;
    get modelInformation(): ModelInformation;
    abstract get settingsForEvent(): Partial<SETTINGS>;
    abstract withSettings(additionalSettings: Partial<SETTINGS>): this;
}

type Automatic1111ImageGenerationPrompt = {
    prompt: string;
    negativePrompt?: string;
};
/**
 * Formats a basic text prompt as an Automatic1111 prompt.
 */
declare function mapBasicPromptToAutomatic1111Format(): PromptTemplate<string, Automatic1111ImageGenerationPrompt>;

interface Automatic1111ImageGenerationSettings extends ImageGenerationModelSettings {
    api?: ApiConfiguration;
    /**
     * Stable Diffusion checkpoint.
     */
    model: string;
    height?: number;
    width?: number;
    /**
     * Sampling method.
     */
    sampler?: string;
    /**
     * Sampling steps.
     */
    steps?: number;
    /**
     * CFG Scale.
     */
    cfgScale?: number;
    seed?: number;
}
/**
 * Create an image generation model that calls the AUTOMATIC1111 Stable Diffusion Web UI API.
 *
 * @see https://github.com/AUTOMATIC1111/stable-diffusion-webui
 */
declare class Automatic1111ImageGenerationModel extends AbstractModel<Automatic1111ImageGenerationSettings> implements ImageGenerationModel<Automatic1111ImageGenerationPrompt, Automatic1111ImageGenerationSettings> {
    constructor(settings: Automatic1111ImageGenerationSettings);
    readonly provider: "Automatic1111";
    get modelName(): string;
    callAPI(input: Automatic1111ImageGenerationPrompt, callOptions: FunctionCallOptions): Promise<Automatic1111ImageGenerationResponse>;
    get settingsForEvent(): Partial<Automatic1111ImageGenerationSettings>;
    doGenerateImages(prompt: Automatic1111ImageGenerationPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            images: string[];
            parameters: {};
            info: string;
        };
        base64Images: string[];
    }>;
    withTextPrompt(): PromptTemplateImageGenerationModel<string, Automatic1111ImageGenerationPrompt, Automatic1111ImageGenerationSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: PromptTemplate<INPUT_PROMPT, Automatic1111ImageGenerationPrompt>): PromptTemplateImageGenerationModel<INPUT_PROMPT, Automatic1111ImageGenerationPrompt, Automatic1111ImageGenerationSettings, this>;
    withSettings(additionalSettings: Partial<Automatic1111ImageGenerationSettings>): this;
}
declare const Automatic1111ImageGenerationResponseSchema: z.ZodObject<{
    images: z.ZodArray<z.ZodString, "many">;
    parameters: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    info: z.ZodString;
}, "strip", z.ZodTypeAny, {
    images: string[];
    parameters: {};
    info: string;
}, {
    images: string[];
    parameters: {};
    info: string;
}>;
type Automatic1111ImageGenerationResponse = z.infer<typeof Automatic1111ImageGenerationResponseSchema>;

/**
 * Creates an API configuration for the AUTOMATIC1111 Stable Diffusion Web UI API.
 * It calls the API at http://127.0.0.1:7860/sdapi/v1 by default.
 */
declare function Api$a(settings: PartialBaseUrlPartsApiConfigurationOptions): Automatic1111ApiConfiguration;
/**
 * Create an image generation model that calls the AUTOMATIC1111 Stable Diffusion Web UI API.
 *
 * @see https://github.com/AUTOMATIC1111/stable-diffusion-webui
 *
 * @return A new instance of ${@link Automatic1111ImageGenerationModel}.
 */
declare function ImageGenerator$2(settings: Automatic1111ImageGenerationSettings): Automatic1111ImageGenerationModel;

declare namespace Automatic1111Facade {
  export { Api$a as Api, ImageGenerator$2 as ImageGenerator };
}

/**
 * Creates an API configuration for the Cohere API.
 * It calls the API at https://api.cohere.ai/v1 and uses the `COHERE_API_KEY` env variable by default.
 */
declare class CohereApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}

declare const cohereErrorDataSchema: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
type CohereErrorData = z.infer<typeof cohereErrorDataSchema>;

declare const COHERE_TEXT_EMBEDDING_MODELS: {
    "embed-english-light-v2.0": {
        contextWindowSize: number;
        dimensions: number;
    };
    "embed-english-v2.0": {
        contextWindowSize: number;
        dimensions: number;
    };
    "embed-multilingual-v2.0": {
        contextWindowSize: number;
        dimensions: number;
    };
    "embed-english-v3.0": {
        contextWindowSize: number;
        dimensions: number;
    };
    "embed-english-light-v3.0": {
        contextWindowSize: number;
        dimensions: number;
    };
    "embed-multilingual-v3.0": {
        contextWindowSize: number;
        dimensions: number;
    };
    "embed-multilingual-light-v3.0": {
        contextWindowSize: number;
        dimensions: number;
    };
};
type CohereTextEmbeddingModelType = keyof typeof COHERE_TEXT_EMBEDDING_MODELS;
interface CohereTextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    model: CohereTextEmbeddingModelType;
    inputType?: "search_document" | "search_query" | "classification" | "clustering";
    truncate?: "NONE" | "START" | "END";
}
/**
 * Create a text embedding model that calls the Cohere Co.Embed API.
 *
 * @see https://docs.cohere.com/reference/embed
 *
 * @example
 * const embeddings = await embedMany(
 *   new CohereTextEmbeddingModel({ model: "embed-english-light-v2.0" }),
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 */
declare class CohereTextEmbeddingModel extends AbstractModel<CohereTextEmbeddingModelSettings> implements EmbeddingModel<string, CohereTextEmbeddingModelSettings>, FullTokenizer {
    constructor(settings: CohereTextEmbeddingModelSettings);
    readonly provider: "cohere";
    get modelName(): "embed-english-light-v2.0" | "embed-english-v2.0" | "embed-multilingual-v2.0" | "embed-english-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-v3.0" | "embed-multilingual-light-v3.0";
    readonly maxValuesPerCall = 96;
    readonly isParallelizable = true;
    readonly dimensions: number;
    readonly contextWindowSize: number;
    private readonly tokenizer;
    tokenize(text: string): Promise<number[]>;
    tokenizeWithTexts(text: string): Promise<{
        tokens: number[];
        tokenTexts: string[];
    }>;
    detokenize(tokens: number[]): Promise<string>;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<CohereTextEmbeddingResponse>;
    get settingsForEvent(): Partial<CohereTextEmbeddingModelSettings>;
    doEmbedValues(texts: string[], options: FunctionCallOptions): Promise<{
        rawResponse: {
            embeddings: number[][];
            id: string;
            texts: string[];
            meta: {
                api_version: {
                    version: string;
                };
            };
        };
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: Partial<CohereTextEmbeddingModelSettings>): this;
}
declare const cohereTextEmbeddingResponseSchema: z.ZodObject<{
    id: z.ZodString;
    texts: z.ZodArray<z.ZodString, "many">;
    embeddings: z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
    meta: z.ZodObject<{
        api_version: z.ZodObject<{
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            version: string;
        }, {
            version: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        api_version: {
            version: string;
        };
    }, {
        api_version: {
            version: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    embeddings: number[][];
    id: string;
    texts: string[];
    meta: {
        api_version: {
            version: string;
        };
    };
}, {
    embeddings: number[][];
    id: string;
    texts: string[];
    meta: {
        api_version: {
            version: string;
        };
    };
}>;
type CohereTextEmbeddingResponse = z.infer<typeof cohereTextEmbeddingResponseSchema>;

type CohereTokenizerModelType = CohereTextGenerationModelType | CohereTextEmbeddingModelType;
interface CohereTokenizerSettings {
    api?: ApiConfiguration;
    model: CohereTokenizerModelType;
}
/**
 * Tokenizer for the Cohere models. It uses the Co.Tokenize and Co.Detokenize APIs.
 *
 * @see https://docs.cohere.com/reference/tokenize
 * @see https://docs.cohere.com/reference/detokenize
 *
 * @example
 * const tokenizer = new CohereTokenizer({ model: "command" });
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 */
declare class CohereTokenizer implements FullTokenizer {
    readonly settings: CohereTokenizerSettings;
    constructor(settings: CohereTokenizerSettings);
    callTokenizeAPI(text: string, callOptions?: FunctionCallOptions): Promise<CohereTokenizationResponse>;
    callDeTokenizeAPI(tokens: number[], callOptions?: FunctionCallOptions): Promise<CohereDetokenizationResponse>;
    tokenize(text: string): Promise<number[]>;
    tokenizeWithTexts(text: string): Promise<{
        tokens: number[];
        tokenTexts: string[];
    }>;
    detokenize(tokens: number[]): Promise<string>;
}
declare const cohereDetokenizationResponseSchema: z.ZodObject<{
    text: z.ZodString;
    meta: z.ZodObject<{
        api_version: z.ZodObject<{
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            version: string;
        }, {
            version: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        api_version: {
            version: string;
        };
    }, {
        api_version: {
            version: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    text: string;
    meta: {
        api_version: {
            version: string;
        };
    };
}, {
    text: string;
    meta: {
        api_version: {
            version: string;
        };
    };
}>;
type CohereDetokenizationResponse = z.infer<typeof cohereDetokenizationResponseSchema>;
declare const cohereTokenizationResponseSchema: z.ZodObject<{
    tokens: z.ZodArray<z.ZodNumber, "many">;
    token_strings: z.ZodArray<z.ZodString, "many">;
    meta: z.ZodObject<{
        api_version: z.ZodObject<{
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            version: string;
        }, {
            version: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        api_version: {
            version: string;
        };
    }, {
        api_version: {
            version: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    tokens: number[];
    token_strings: string[];
    meta: {
        api_version: {
            version: string;
        };
    };
}, {
    tokens: number[];
    token_strings: string[];
    meta: {
        api_version: {
            version: string;
        };
    };
}>;
type CohereTokenizationResponse = z.infer<typeof cohereTokenizationResponseSchema>;

declare const COHERE_TEXT_GENERATION_MODELS: {
    command: {
        contextWindowSize: number;
    };
    "command-light": {
        contextWindowSize: number;
    };
};
type CohereTextGenerationModelType = keyof typeof COHERE_TEXT_GENERATION_MODELS;
interface CohereTextGenerationModelSettings extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    model: CohereTextGenerationModelType;
    temperature?: number;
    k?: number;
    p?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    returnLikelihoods?: "GENERATION" | "ALL" | "NONE";
    logitBias?: Record<string, number>;
    truncate?: "NONE" | "START" | "END";
    cohereStopSequences?: string[];
}
/**
 * Create a text generation model that calls the Cohere Co.Generate API.
 *
 * @see https://docs.cohere.com/reference/generate
 *
 * @example
 * const model = new CohereTextGenerationModel({
 *   model: "command",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 * });
 *
 * const text = await generateText(
 *    model,
 *   "Write a short story about a robot learning to love:\n\n"
 * );
 */
declare class CohereTextGenerationModel extends AbstractModel<CohereTextGenerationModelSettings> implements TextStreamingBaseModel<string, CohereTextGenerationModelSettings> {
    constructor(settings: CohereTextGenerationModelSettings);
    readonly provider: "cohere";
    get modelName(): "command" | "command-light";
    readonly contextWindowSize: number;
    readonly tokenizer: CohereTokenizer;
    countPromptTokens(input: string): Promise<number>;
    callAPI<RESPONSE>(prompt: string, callOptions: FunctionCallOptions, options: {
        responseFormat: CohereTextGenerationResponseFormatType<RESPONSE>;
    }): Promise<RESPONSE>;
    get settingsForEvent(): Partial<CohereTextGenerationModelSettings>;
    doGenerateTexts(prompt: string, options: FunctionCallOptions): Promise<{
        rawResponse: {
            prompt: string;
            id: string;
            generations: {
                text: string;
                id: string;
                finish_reason?: string | undefined;
            }[];
            meta?: {
                api_version: {
                    version: string;
                };
            } | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            prompt: string;
            id: string;
            generations: {
                text: string;
                id: string;
                finish_reason?: string | undefined;
            }[];
            meta?: {
                api_version: {
                    version: string;
                };
            } | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    };
    processTextGenerationResponse(rawResponse: CohereTextGenerationResponse): {
        rawResponse: {
            prompt: string;
            id: string;
            generations: {
                text: string;
                id: string;
                finish_reason?: string | undefined;
            }[];
            meta?: {
                api_version: {
                    version: string;
                };
            } | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    };
    private translateFinishReason;
    doStreamText(prompt: string, options: FunctionCallOptions): Promise<AsyncIterable<Delta<{
        text: string;
        is_finished: false;
    } | {
        response: {
            prompt: string;
            id: string;
            generations: {
                text: string;
                id: string;
                finish_reason?: string | undefined;
            }[];
            meta?: {
                api_version: {
                    version: string;
                };
            } | undefined;
        };
        finish_reason: string;
        is_finished: true;
    }>>>;
    extractTextDelta(delta: unknown): string;
    withJsonOutput(): this;
    withTextPrompt(): PromptTemplateTextStreamingModel<string, string, CohereTextGenerationModelSettings, this>;
    withInstructionPrompt(): PromptTemplateTextStreamingModel<InstructionPrompt, string, CohereTextGenerationModelSettings, this>;
    withChatPrompt(options?: {
        user?: string;
        assistant?: string;
    }): PromptTemplateTextStreamingModel<ChatPrompt, string, CohereTextGenerationModelSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, string>): PromptTemplateTextStreamingModel<INPUT_PROMPT, string, CohereTextGenerationModelSettings, this>;
    withSettings(additionalSettings: Partial<CohereTextGenerationModelSettings>): this;
}
declare const cohereTextGenerationResponseSchema: z.ZodObject<{
    id: z.ZodString;
    generations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        finish_reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        id: string;
        finish_reason?: string | undefined;
    }, {
        text: string;
        id: string;
        finish_reason?: string | undefined;
    }>, "many">;
    prompt: z.ZodString;
    meta: z.ZodOptional<z.ZodObject<{
        api_version: z.ZodObject<{
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            version: string;
        }, {
            version: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        api_version: {
            version: string;
        };
    }, {
        api_version: {
            version: string;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    id: string;
    generations: {
        text: string;
        id: string;
        finish_reason?: string | undefined;
    }[];
    meta?: {
        api_version: {
            version: string;
        };
    } | undefined;
}, {
    prompt: string;
    id: string;
    generations: {
        text: string;
        id: string;
        finish_reason?: string | undefined;
    }[];
    meta?: {
        api_version: {
            version: string;
        };
    } | undefined;
}>;
type CohereTextGenerationResponse = z.infer<typeof cohereTextGenerationResponseSchema>;
declare const cohereTextStreamChunkSchema: z.ZodDiscriminatedUnion<"is_finished", [z.ZodObject<{
    text: z.ZodString;
    is_finished: z.ZodLiteral<false>;
}, "strip", z.ZodTypeAny, {
    text: string;
    is_finished: false;
}, {
    text: string;
    is_finished: false;
}>, z.ZodObject<{
    is_finished: z.ZodLiteral<true>;
    finish_reason: z.ZodString;
    response: z.ZodObject<{
        id: z.ZodString;
        generations: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            text: z.ZodString;
            finish_reason: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }, {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }>, "many">;
        prompt: z.ZodString;
        meta: z.ZodOptional<z.ZodObject<{
            api_version: z.ZodObject<{
                version: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                version: string;
            }, {
                version: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            api_version: {
                version: string;
            };
        }, {
            api_version: {
                version: string;
            };
        }>>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        id: string;
        generations: {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }[];
        meta?: {
            api_version: {
                version: string;
            };
        } | undefined;
    }, {
        prompt: string;
        id: string;
        generations: {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }[];
        meta?: {
            api_version: {
                version: string;
            };
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    response: {
        prompt: string;
        id: string;
        generations: {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }[];
        meta?: {
            api_version: {
                version: string;
            };
        } | undefined;
    };
    finish_reason: string;
    is_finished: true;
}, {
    response: {
        prompt: string;
        id: string;
        generations: {
            text: string;
            id: string;
            finish_reason?: string | undefined;
        }[];
        meta?: {
            api_version: {
                version: string;
            };
        } | undefined;
    };
    finish_reason: string;
    is_finished: true;
}>]>;
type CohereTextStreamChunk = z.infer<typeof cohereTextStreamChunkSchema>;
type CohereTextGenerationResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
declare const CohereTextGenerationResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: boolean;
        handler: ResponseHandler<{
            prompt: string;
            id: string;
            generations: {
                text: string;
                id: string;
                finish_reason?: string | undefined;
            }[];
            meta?: {
                api_version: {
                    version: string;
                };
            } | undefined;
        }>;
    };
    /**
     * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
     * of the response stream.
     */
    deltaIterable: {
        stream: boolean;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<Delta<{
            text: string;
            is_finished: false;
        } | {
            response: {
                prompt: string;
                id: string;
                generations: {
                    text: string;
                    id: string;
                    finish_reason?: string | undefined;
                }[];
                meta?: {
                    api_version: {
                        version: string;
                    };
                } | undefined;
            };
            finish_reason: string;
            is_finished: true;
        }>>>;
    };
};

/**
 * Creates an API configuration for the Cohere API.
 * It calls the API at https://api.cohere.ai/v1 and uses the `COHERE_API_KEY` env variable by default.
 */
declare function Api$9(settings: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): CohereApiConfiguration;
/**
 * Create a text generation model that calls the Cohere Co.Generate API.
 *
 * @see https://docs.cohere.com/reference/generate
 *
 * @example
 * const model = cohere.TextGenerator({
 *   model: "command",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 * });
 *
 * const text = await generateText(
 *    model,
 *   "Write a short story about a robot learning to love:\n\n"
 * );
 *
 * @returns A new instance of {@link CohereTextGenerationModel}.
 */
declare function TextGenerator$1(settings: CohereTextGenerationModelSettings): CohereTextGenerationModel;
/**
 * Create a text embedding model that calls the Cohere Co.Embed API.
 *
 * @see https://docs.cohere.com/reference/embed
 *
 * @example
 * const embeddings = await embedMany(
 *   cohere.TextEmbedder({ model: "embed-english-light-v2.0" }),
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 *
 * @returns A new instance of {@link CohereTextEmbeddingModel}.
 */
declare function TextEmbedder$6(settings: CohereTextEmbeddingModelSettings): CohereTextEmbeddingModel;
/**
 * Tokenizer for the Cohere models. It uses the Co.Tokenize and Co.Detokenize APIs.
 *
 * @see https://docs.cohere.com/reference/tokenize
 * @see https://docs.cohere.com/reference/detokenize-1
 *
 * @example
 * const tokenizer = cohere.Tokenizer({ model: "command" });
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 *
 * @returns A new instance of {@link CohereTokenizer}.
 */
declare function Tokenizer$2(settings: CohereTokenizerSettings): CohereTokenizer;

declare namespace CohereFacade {
  export { Api$9 as Api, TextEmbedder$6 as TextEmbedder, TextGenerator$1 as TextGenerator, Tokenizer$2 as Tokenizer };
}

/**
 * Creates an API configuration for ElevenLabs API.
 * It calls the API at https://api.elevenlabs.io/v1 and uses the `ELEVENLABS_API_KEY` env variable by default.
 */
declare class ElevenLabsApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
    get apiKey(): string;
}

declare const elevenLabsModels: readonly ["eleven_multilingual_v2", "eleven_multilingual_v1", "eleven_monolingual_v1", "eleven_turbo_v2"];
interface ElevenLabsSpeechModelSettings extends SpeechGenerationModelSettings {
    api?: ApiConfiguration & {
        apiKey: string;
    };
    voice: string;
    model?: (typeof elevenLabsModels)[number] | (string & {});
    optimizeStreamingLatency?: 0 | 1 | 2 | 3 | 4;
    outputFormat?: "mp3_44100" | "pcm_16000" | "pcm_22050" | "pcm_24000" | "pcm_44100";
    voiceSettings?: {
        stability: number;
        similarityBoost: number;
        style?: number;
        useSpeakerBoost?: boolean;
    };
    generationConfig?: {
        chunkLengthSchedule: number[];
    };
}
/**
 * Synthesize speech using the ElevenLabs Text to Speech API.
 *
 * Both regular text-to-speech and full duplex text-to-speech streaming are supported.
 *
 * @see https://docs.elevenlabs.io/api-reference/text-to-speech
 * @see https://docs.elevenlabs.io/api-reference/text-to-speech-websockets
 */
declare class ElevenLabsSpeechModel extends AbstractModel<ElevenLabsSpeechModelSettings> implements StreamingSpeechGenerationModel<ElevenLabsSpeechModelSettings> {
    constructor(settings: ElevenLabsSpeechModelSettings);
    readonly provider = "elevenlabs";
    get modelName(): string;
    private callAPI;
    get settingsForEvent(): Partial<ElevenLabsSpeechModelSettings>;
    doGenerateSpeechStandard(text: string, options: FunctionCallOptions): Promise<Uint8Array>;
    doGenerateSpeechStreamDuplex(textStream: AsyncIterable<string>): Promise<AsyncIterable<Delta<Uint8Array>>>;
    withSettings(additionalSettings: Partial<ElevenLabsSpeechModelSettings>): this;
}

/**
 * Creates an API configuration for the ElevenLabs API.
 * It calls the API at https://api.elevenlabs.io/v1 and uses the `ELEVENLABS_API_KEY` env variable by default.
 */
declare function Api$8(settings: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): ElevenLabsApiConfiguration;
/**
 * Synthesize speech using the ElevenLabs Text to Speech API.
 *
 * Both regular text-to-speech and full duplex text-to-speech streaming are supported.
 *
 * @see https://docs.elevenlabs.io/api-reference/text-to-speech
 * @see https://docs.elevenlabs.io/api-reference/text-to-speech-websockets
 *
 * @returns A new instance of {@link ElevenLabsSpeechModel}.
 */
declare function SpeechGenerator$2(settings: ElevenLabsSpeechModelSettings): ElevenLabsSpeechModel;

declare namespace ElevenLabsFacade {
  export { Api$8 as Api, SpeechGenerator$2 as SpeechGenerator };
}

/**
 * Creates an API configuration for the HuggingFace API.
 * It calls the API at https://api-inference.huggingface.co/models and uses the `HUGGINGFACE_API_KEY` env variable by default.
 */
declare class HuggingFaceApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}

declare const huggingFaceErrorDataSchema: z.ZodObject<{
    error: z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodString]>;
}, "strip", z.ZodTypeAny, {
    error: (string | string[]) & (string | string[] | undefined);
}, {
    error: (string | string[]) & (string | string[] | undefined);
}>;
type HuggingFaceErrorData = z.infer<typeof huggingFaceErrorDataSchema>;

interface HuggingFaceTextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    model: string;
    maxValuesPerCall?: number;
    dimensions?: number;
    options?: {
        useCache?: boolean;
        waitForModel?: boolean;
    };
}
/**
 * Create a text embedding model that calls a Hugging Face Inference API Feature Extraction Task.
 *
 * @see https://huggingface.co/docs/api-inference/detailed_parameters#feature-extraction-task
 *
 * @example
 * const model = new HuggingFaceTextGenerationModel({
 *   model: "intfloat/e5-base-v2",
 *   maxTexstsPerCall: 5,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const embeddings = await embedMany(
 *   model,
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 */
declare class HuggingFaceTextEmbeddingModel extends AbstractModel<HuggingFaceTextEmbeddingModelSettings> implements EmbeddingModel<string, HuggingFaceTextEmbeddingModelSettings> {
    constructor(settings: HuggingFaceTextEmbeddingModelSettings);
    readonly provider = "huggingface";
    get modelName(): string;
    readonly maxValuesPerCall: number;
    readonly isParallelizable = true;
    readonly contextWindowSize: undefined;
    readonly dimensions: number | undefined;
    readonly tokenizer: undefined;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<HuggingFaceTextEmbeddingResponse>;
    get settingsForEvent(): Partial<HuggingFaceTextEmbeddingModelSettings>;
    readonly countPromptTokens: undefined;
    doEmbedValues(texts: string[], options: FunctionCallOptions): Promise<{
        rawResponse: number[][];
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: Partial<HuggingFaceTextEmbeddingModelSettings>): this;
}
declare const huggingFaceTextEmbeddingResponseSchema: z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
type HuggingFaceTextEmbeddingResponse = z.infer<typeof huggingFaceTextEmbeddingResponseSchema>;

interface HuggingFaceTextGenerationModelSettings extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    model: string;
    topK?: number;
    topP?: number;
    temperature?: number;
    repetitionPenalty?: number;
    maxTime?: number;
    doSample?: boolean;
}
/**
 * Create a text generation model that calls a Hugging Face Inference API Text Generation Task.
 *
 * @see https://huggingface.co/docs/api-inference/detailed_parameters#text-generation-task
 *
 * @example
 * const model = new HuggingFaceTextGenerationModel({
 *   model: "tiiuae/falcon-7b",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const text = await generateText(
 *   model,
 *   "Write a short story about a robot learning to love:\n\n"
 * );
 */
declare class HuggingFaceTextGenerationModel extends AbstractModel<HuggingFaceTextGenerationModelSettings> implements TextGenerationModel<string, HuggingFaceTextGenerationModelSettings> {
    constructor(settings: HuggingFaceTextGenerationModelSettings);
    readonly provider = "huggingface";
    get modelName(): string;
    readonly contextWindowSize: undefined;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    callAPI(prompt: string, callOptions: FunctionCallOptions): Promise<HuggingFaceTextGenerationResponse>;
    get settingsForEvent(): Partial<HuggingFaceTextGenerationModelSettings>;
    doGenerateTexts(prompt: string, options: FunctionCallOptions): Promise<{
        rawResponse: {
            generated_text: string;
        }[];
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            generated_text: string;
        }[];
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    };
    processTextGenerationResponse(rawResponse: HuggingFaceTextGenerationResponse): {
        rawResponse: {
            generated_text: string;
        }[];
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    };
    withJsonOutput(): this;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, string>): PromptTemplateTextGenerationModel<INPUT_PROMPT, string, HuggingFaceTextGenerationModelSettings, this>;
    withSettings(additionalSettings: Partial<HuggingFaceTextGenerationModelSettings>): this;
}
declare const huggingFaceTextGenerationResponseSchema: z.ZodArray<z.ZodObject<{
    generated_text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    generated_text: string;
}, {
    generated_text: string;
}>, "many">;
type HuggingFaceTextGenerationResponse = z.infer<typeof huggingFaceTextGenerationResponseSchema>;

/**
 * Creates an API configuration for the HuggingFace API.
 * It calls the API at https://api-inference.huggingface.co/models and uses the `HUGGINGFACE_API_KEY` env variable by default.
 */
declare function Api$7(settings: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): HuggingFaceApiConfiguration;
/**
 * Create a text generation model that calls a Hugging Face Inference API Text Generation Task.
 *
 * @see https://huggingface.co/docs/api-inference/detailed_parameters#text-generation-task
 *
 * @example
 * const model = huggingface.TextGenerator({
 *   model: "tiiuae/falcon-7b",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const text = await generateText(
 *   model,
 *   "Write a short story about a robot learning to love:\n\n"
 * );
 *
 * @returns A new instance of {@link HuggingFaceTextGenerationModel}.
 */
declare function TextGenerator(settings: HuggingFaceTextGenerationModelSettings): HuggingFaceTextGenerationModel;
/**
 * Create a text embedding model that calls a Hugging Face Inference API Feature Extraction Task.
 *
 * @see https://huggingface.co/docs/api-inference/detailed_parameters#feature-extraction-task
 *
 * @example
 * const model = huggingface.TextEmbedder({
 *   model: "intfloat/e5-base-v2",
 *   maxTexstsPerCall: 5,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const embeddings = await embedMany(
 *   model,
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 *
 * @returns A new instance of {@link HuggingFaceTextEmbeddingModel}.
 */
declare function TextEmbedder$5(settings: HuggingFaceTextEmbeddingModelSettings): HuggingFaceTextEmbeddingModel;

declare const HuggingFaceFacade_TextGenerator: typeof TextGenerator;
declare namespace HuggingFaceFacade {
  export { Api$7 as Api, TextEmbedder$5 as TextEmbedder, HuggingFaceFacade_TextGenerator as TextGenerator };
}

/**
 * Creates an API configuration for the Llama.cpp server.
 * It calls the API at http://127.0.0.1:8080 by default.
 */
declare class LlamaCppApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions);
}

/**
 * Tokenizer for LlamaCpp.

 * @example
 * const tokenizer = new LlamaCppTokenizer();
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 */
declare class LlamaCppTokenizer implements BasicTokenizer {
    readonly api: ApiConfiguration;
    constructor(api?: ApiConfiguration);
    callTokenizeAPI(text: string, callOptions?: FunctionCallOptions): Promise<LlamaCppTokenizationResponse>;
    tokenize(text: string): Promise<number[]>;
}
declare const llamaCppTokenizationResponseSchema: z.ZodObject<{
    tokens: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    tokens: number[];
}, {
    tokens: number[];
}>;
type LlamaCppTokenizationResponse = z.infer<typeof llamaCppTokenizationResponseSchema>;

interface LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE extends number | undefined> extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    /**
     * Specify the context window size of the model that you have loaded in your
     * Llama.cpp server.
     */
    contextWindowSize?: CONTEXT_WINDOW_SIZE;
    /**
     * Adjust the randomness of the generated text (default: 0.8).
     */
    temperature?: number;
    /**
     * Limit the next token selection to the K most probable tokens (default: 40).
     */
    topK?: number;
    /**
     * Limit the next token selection to a subset of tokens with a cumulative probability above a threshold P (default: 0.95).
     */
    topP?: number;
    /**
     * The minimum probability for a token to be considered, relative to the probability of the most likely token (default: 0.05).
     */
    minP?: number;
    /**
     * Specify the number of tokens from the prompt to retain when the context size is exceeded
     * and tokens need to be discarded. By default, this value is set to 0 (meaning no tokens
     * are kept). Use -1 to retain all tokens from the prompt.
     */
    nKeep?: number;
    /**
     * Enable tail free sampling with parameter z (default: 1.0, 1.0 = disabled).
     */
    tfsZ?: number;
    /**
     * Enable locally typical sampling with parameter p (default: 1.0, 1.0 = disabled).
     */
    typicalP?: number;
    /**
     * Control the repetition of token sequences in the generated text (default: 1.1).
     */
    repeatPenalty?: number;
    /**
     * Last n tokens to consider for penalizing repetition (default: 64, 0 = disabled, -1 = ctx-size).
     */
    repeatLastN?: number;
    /**
     * Penalize newline tokens when applying the repeat penalty (default: true).
     */
    penalizeNl?: boolean;
    /**
     * Repeat alpha presence penalty (default: 0.0, 0.0 = disabled).
     */
    presencePenalty?: number;
    /**
     * Repeat alpha frequency penalty (default: 0.0, 0.0 = disabled).
     */
    frequencyPenalty?: number;
    /**
     * This will replace the prompt for the purpose of the penalty evaluation.
     * Can be either null, a string or an array of numbers representing tokens
     * (default: null = use the original prompt).
     */
    penaltyPrompt?: string | number[];
    /**
     * Enable Mirostat sampling, controlling perplexity during text generation
     * (default: 0, 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0).
     */
    mirostat?: number;
    /**
     * Set the Mirostat target entropy, parameter tau (default: 5.0).
     */
    mirostatTau?: number;
    /**
     * Set the Mirostat learning rate, parameter eta (default: 0.1).
     */
    mirostatEta?: number;
    /**
     * Set grammar for grammar-based sampling (default: no grammar)
     *
     * @see https://github.com/ggerganov/llama.cpp/blob/master/grammars/README.md
     */
    grammar?: string;
    /**
     * Set the random number generator (RNG) seed
     * (default: -1, -1 = random seed).
     */
    seed?: number;
    /**
     * Ignore end of stream token and continue generating (default: false).
     */
    ignoreEos?: boolean;
    /**
     * Modify the likelihood of a token appearing in the generated text completion.
     * For example, use "logit_bias": [[15043,1.0]] to increase the likelihood of the token
     * 'Hello', or "logit_bias": [[15043,-1.0]] to decrease its likelihood.
     * Setting the value to false, "logit_bias": [[15043,false]] ensures that the token Hello is
     * never produced (default: []).
     */
    logitBias?: Array<[number, number | false]>;
    /**
     * If greater than 0, the response also contains the probabilities of top N tokens
     * for each generated token (default: 0)
     */
    nProbs?: number;
    /**
     * Save the prompt and generation for avoid reprocess entire prompt if a part of this isn't change (default: false)
     */
    cachePrompt?: boolean;
    /**
     * Assign the completion task to an specific slot.
     * If is -1 the task will be assigned to a Idle slot (default: -1)
     */
    slotId?: number;
    /**
     * Prompt template provider that is used when calling `.withTextPrompt()`, `withInstructionPrompt()` or `withChatPrompt()`.
     */
    promptTemplate?: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
}
interface LlamaCppCompletionPrompt {
    /**
     * Text prompt. Images can be included through references such as `[img-ID]`, e.g. `[img-1]`.
     */
    text: string;
    /**
     * Maps image id to image base data.
     */
    images?: Record<number, string>;
}
declare class LlamaCppCompletionModel<CONTEXT_WINDOW_SIZE extends number | undefined> extends AbstractModel<LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>> implements TextStreamingBaseModel<LlamaCppCompletionPrompt, LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>> {
    constructor(settings?: LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>);
    readonly provider = "llamacpp";
    get modelName(): null;
    get contextWindowSize(): CONTEXT_WINDOW_SIZE;
    readonly tokenizer: LlamaCppTokenizer;
    callAPI<RESPONSE>(prompt: LlamaCppCompletionPrompt, callOptions: FunctionCallOptions, options: {
        responseFormat: LlamaCppCompletionResponseFormatType<RESPONSE>;
    }): Promise<RESPONSE>;
    get settingsForEvent(): Partial<LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>>;
    countPromptTokens(prompt: LlamaCppCompletionPrompt): Promise<number>;
    doGenerateTexts(prompt: LlamaCppCompletionPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            model: string;
            prompt: string;
            stop: true;
            content: string;
            generation_settings: {
                model: string;
                stream: boolean;
                stop: string[];
                seed: number;
                mirostat: number;
                frequency_penalty: number;
                ignore_eos: boolean;
                logit_bias: number[];
                mirostat_eta: number;
                mirostat_tau: number;
                n_ctx: number;
                n_keep: number;
                n_predict: number;
                n_probs: number;
                penalize_nl: boolean;
                presence_penalty: number;
                repeat_last_n: number;
                repeat_penalty: number;
                tfs_z: number;
                top_k: number;
                top_p: number;
                typical_p: number;
                temperature?: number | undefined;
            };
            stopped_eos: boolean;
            stopped_limit: boolean;
            stopped_word: boolean;
            stopping_word: string;
            timings: {
                predicted_ms: number;
                predicted_n: number;
                predicted_per_second: number | null;
                predicted_per_token_ms: number | null;
                prompt_n: number;
                prompt_per_second: number | null;
                prompt_per_token_ms: number | null;
                prompt_ms?: number | null | undefined;
            };
            tokens_cached: number;
            tokens_evaluated: number;
            tokens_predicted: number;
            truncated: boolean;
        };
        textGenerationResults: {
            text: string;
            finishReason: "length" | "stop" | "unknown";
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            model: string;
            prompt: string;
            stop: true;
            content: string;
            generation_settings: {
                model: string;
                stream: boolean;
                stop: string[];
                seed: number;
                mirostat: number;
                frequency_penalty: number;
                ignore_eos: boolean;
                logit_bias: number[];
                mirostat_eta: number;
                mirostat_tau: number;
                n_ctx: number;
                n_keep: number;
                n_predict: number;
                n_probs: number;
                penalize_nl: boolean;
                presence_penalty: number;
                repeat_last_n: number;
                repeat_penalty: number;
                tfs_z: number;
                top_k: number;
                top_p: number;
                typical_p: number;
                temperature?: number | undefined;
            };
            stopped_eos: boolean;
            stopped_limit: boolean;
            stopped_word: boolean;
            stopping_word: string;
            timings: {
                predicted_ms: number;
                predicted_n: number;
                predicted_per_second: number | null;
                predicted_per_token_ms: number | null;
                prompt_n: number;
                prompt_per_second: number | null;
                prompt_per_token_ms: number | null;
                prompt_ms?: number | null | undefined;
            };
            tokens_cached: number;
            tokens_evaluated: number;
            tokens_predicted: number;
            truncated: boolean;
        };
        textGenerationResults: {
            text: string;
            finishReason: "length" | "stop" | "unknown";
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    processTextGenerationResponse(rawResponse: LlamaCppTextGenerationResponse): {
        rawResponse: {
            model: string;
            prompt: string;
            stop: true;
            content: string;
            generation_settings: {
                model: string;
                stream: boolean;
                stop: string[];
                seed: number;
                mirostat: number;
                frequency_penalty: number;
                ignore_eos: boolean;
                logit_bias: number[];
                mirostat_eta: number;
                mirostat_tau: number;
                n_ctx: number;
                n_keep: number;
                n_predict: number;
                n_probs: number;
                penalize_nl: boolean;
                presence_penalty: number;
                repeat_last_n: number;
                repeat_penalty: number;
                tfs_z: number;
                top_k: number;
                top_p: number;
                typical_p: number;
                temperature?: number | undefined;
            };
            stopped_eos: boolean;
            stopped_limit: boolean;
            stopped_word: boolean;
            stopping_word: string;
            timings: {
                predicted_ms: number;
                predicted_n: number;
                predicted_per_second: number | null;
                predicted_per_token_ms: number | null;
                prompt_n: number;
                prompt_per_second: number | null;
                prompt_per_token_ms: number | null;
                prompt_ms?: number | null | undefined;
            };
            tokens_cached: number;
            tokens_evaluated: number;
            tokens_predicted: number;
            truncated: boolean;
        };
        textGenerationResults: {
            text: string;
            finishReason: "length" | "stop" | "unknown";
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    doStreamText(prompt: LlamaCppCompletionPrompt, options: FunctionCallOptions): Promise<AsyncIterable<Delta<{
        model: string;
        prompt: string;
        stop: true;
        content: string;
        generation_settings: {
            model: string;
            stream: boolean;
            stop: string[];
            seed: number;
            mirostat: number;
            frequency_penalty: number;
            ignore_eos: boolean;
            logit_bias: number[];
            mirostat_eta: number;
            mirostat_tau: number;
            n_ctx: number;
            n_keep: number;
            n_predict: number;
            n_probs: number;
            penalize_nl: boolean;
            presence_penalty: number;
            repeat_last_n: number;
            repeat_penalty: number;
            tfs_z: number;
            top_k: number;
            top_p: number;
            typical_p: number;
            temperature?: number | undefined;
        };
        stopped_eos: boolean;
        stopped_limit: boolean;
        stopped_word: boolean;
        stopping_word: string;
        timings: {
            predicted_ms: number;
            predicted_n: number;
            predicted_per_second: number | null;
            predicted_per_token_ms: number | null;
            prompt_n: number;
            prompt_per_second: number | null;
            prompt_per_token_ms: number | null;
            prompt_ms?: number | null | undefined;
        };
        tokens_cached: number;
        tokens_evaluated: number;
        tokens_predicted: number;
        truncated: boolean;
    } | {
        stop: false;
        content: string;
    }>>>;
    extractTextDelta(delta: unknown): string;
    asObjectGenerationModel<INPUT_PROMPT, LlamaCppPrompt>(promptTemplate: ObjectFromTextPromptTemplate<INPUT_PROMPT, LlamaCppPrompt> | FlexibleObjectFromTextPromptTemplate<INPUT_PROMPT, unknown>): ObjectFromTextStreamingModel<INPUT_PROMPT, unknown, TextStreamingModel<unknown, TextGenerationModelSettings>> | ObjectFromTextStreamingModel<INPUT_PROMPT, LlamaCppPrompt, TextStreamingModel<LlamaCppPrompt, TextGenerationModelSettings>>;
    withJsonOutput(schema: Schema<unknown> & JsonSchemaProducer): this;
    private get promptTemplateProvider();
    withTextPrompt(): PromptTemplateTextStreamingModel<string, LlamaCppCompletionPrompt, LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withInstructionPrompt(): PromptTemplateTextStreamingModel<InstructionPrompt, LlamaCppCompletionPrompt, LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withChatPrompt(): PromptTemplateTextStreamingModel<ChatPrompt, LlamaCppCompletionPrompt, LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    /**
     * Maps the prompt for the full Llama.cpp prompt template (incl. image support).
     */
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, LlamaCppCompletionPrompt>): PromptTemplateTextStreamingModel<INPUT_PROMPT, LlamaCppCompletionPrompt, LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withSettings(additionalSettings: Partial<LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>>): this;
}
declare const llamaCppTextGenerationResponseSchema: z.ZodObject<{
    content: z.ZodString;
    stop: z.ZodLiteral<true>;
    generation_settings: z.ZodObject<{
        frequency_penalty: z.ZodNumber;
        ignore_eos: z.ZodBoolean;
        logit_bias: z.ZodArray<z.ZodNumber, "many">;
        mirostat: z.ZodNumber;
        mirostat_eta: z.ZodNumber;
        mirostat_tau: z.ZodNumber;
        model: z.ZodString;
        n_ctx: z.ZodNumber;
        n_keep: z.ZodNumber;
        n_predict: z.ZodNumber;
        n_probs: z.ZodNumber;
        penalize_nl: z.ZodBoolean;
        presence_penalty: z.ZodNumber;
        repeat_last_n: z.ZodNumber;
        repeat_penalty: z.ZodNumber;
        seed: z.ZodNumber;
        stop: z.ZodArray<z.ZodString, "many">;
        stream: z.ZodBoolean;
        temperature: z.ZodOptional<z.ZodNumber>;
        tfs_z: z.ZodNumber;
        top_k: z.ZodNumber;
        top_p: z.ZodNumber;
        typical_p: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    }, {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    }>;
    model: z.ZodString;
    prompt: z.ZodString;
    stopped_eos: z.ZodBoolean;
    stopped_limit: z.ZodBoolean;
    stopped_word: z.ZodBoolean;
    stopping_word: z.ZodString;
    timings: z.ZodObject<{
        predicted_ms: z.ZodNumber;
        predicted_n: z.ZodNumber;
        predicted_per_second: z.ZodNullable<z.ZodNumber>;
        predicted_per_token_ms: z.ZodNullable<z.ZodNumber>;
        prompt_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        prompt_n: z.ZodNumber;
        prompt_per_second: z.ZodNullable<z.ZodNumber>;
        prompt_per_token_ms: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    }, {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    }>;
    tokens_cached: z.ZodNumber;
    tokens_evaluated: z.ZodNumber;
    tokens_predicted: z.ZodNumber;
    truncated: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    model: string;
    prompt: string;
    stop: true;
    content: string;
    generation_settings: {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    };
    stopped_eos: boolean;
    stopped_limit: boolean;
    stopped_word: boolean;
    stopping_word: string;
    timings: {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    };
    tokens_cached: number;
    tokens_evaluated: number;
    tokens_predicted: number;
    truncated: boolean;
}, {
    model: string;
    prompt: string;
    stop: true;
    content: string;
    generation_settings: {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    };
    stopped_eos: boolean;
    stopped_limit: boolean;
    stopped_word: boolean;
    stopping_word: string;
    timings: {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    };
    tokens_cached: number;
    tokens_evaluated: number;
    tokens_predicted: number;
    truncated: boolean;
}>;
type LlamaCppTextGenerationResponse = z.infer<typeof llamaCppTextGenerationResponseSchema>;
declare const llamaCppTextStreamChunkSchema: z.ZodDiscriminatedUnion<"stop", [z.ZodObject<{
    content: z.ZodString;
    stop: z.ZodLiteral<false>;
}, "strip", z.ZodTypeAny, {
    stop: false;
    content: string;
}, {
    stop: false;
    content: string;
}>, z.ZodObject<{
    content: z.ZodString;
    stop: z.ZodLiteral<true>;
    generation_settings: z.ZodObject<{
        frequency_penalty: z.ZodNumber;
        ignore_eos: z.ZodBoolean;
        logit_bias: z.ZodArray<z.ZodNumber, "many">;
        mirostat: z.ZodNumber;
        mirostat_eta: z.ZodNumber;
        mirostat_tau: z.ZodNumber;
        model: z.ZodString;
        n_ctx: z.ZodNumber;
        n_keep: z.ZodNumber;
        n_predict: z.ZodNumber;
        n_probs: z.ZodNumber;
        penalize_nl: z.ZodBoolean;
        presence_penalty: z.ZodNumber;
        repeat_last_n: z.ZodNumber;
        repeat_penalty: z.ZodNumber;
        seed: z.ZodNumber;
        stop: z.ZodArray<z.ZodString, "many">;
        stream: z.ZodBoolean;
        temperature: z.ZodOptional<z.ZodNumber>;
        tfs_z: z.ZodNumber;
        top_k: z.ZodNumber;
        top_p: z.ZodNumber;
        typical_p: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    }, {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    }>;
    model: z.ZodString;
    prompt: z.ZodString;
    stopped_eos: z.ZodBoolean;
    stopped_limit: z.ZodBoolean;
    stopped_word: z.ZodBoolean;
    stopping_word: z.ZodString;
    timings: z.ZodObject<{
        predicted_ms: z.ZodNumber;
        predicted_n: z.ZodNumber;
        predicted_per_second: z.ZodNullable<z.ZodNumber>;
        predicted_per_token_ms: z.ZodNullable<z.ZodNumber>;
        prompt_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        prompt_n: z.ZodNumber;
        prompt_per_second: z.ZodNullable<z.ZodNumber>;
        prompt_per_token_ms: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    }, {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    }>;
    tokens_cached: z.ZodNumber;
    tokens_evaluated: z.ZodNumber;
    tokens_predicted: z.ZodNumber;
    truncated: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    model: string;
    prompt: string;
    stop: true;
    content: string;
    generation_settings: {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    };
    stopped_eos: boolean;
    stopped_limit: boolean;
    stopped_word: boolean;
    stopping_word: string;
    timings: {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    };
    tokens_cached: number;
    tokens_evaluated: number;
    tokens_predicted: number;
    truncated: boolean;
}, {
    model: string;
    prompt: string;
    stop: true;
    content: string;
    generation_settings: {
        model: string;
        stream: boolean;
        stop: string[];
        seed: number;
        mirostat: number;
        frequency_penalty: number;
        ignore_eos: boolean;
        logit_bias: number[];
        mirostat_eta: number;
        mirostat_tau: number;
        n_ctx: number;
        n_keep: number;
        n_predict: number;
        n_probs: number;
        penalize_nl: boolean;
        presence_penalty: number;
        repeat_last_n: number;
        repeat_penalty: number;
        tfs_z: number;
        top_k: number;
        top_p: number;
        typical_p: number;
        temperature?: number | undefined;
    };
    stopped_eos: boolean;
    stopped_limit: boolean;
    stopped_word: boolean;
    stopping_word: string;
    timings: {
        predicted_ms: number;
        predicted_n: number;
        predicted_per_second: number | null;
        predicted_per_token_ms: number | null;
        prompt_n: number;
        prompt_per_second: number | null;
        prompt_per_token_ms: number | null;
        prompt_ms?: number | null | undefined;
    };
    tokens_cached: number;
    tokens_evaluated: number;
    tokens_predicted: number;
    truncated: boolean;
}>]>;
type LlamaCppTextStreamChunk = z.infer<typeof llamaCppTextStreamChunkSchema>;
type LlamaCppCompletionResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
declare const LlamaCppCompletionResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: false;
        handler: ResponseHandler<{
            model: string;
            prompt: string;
            stop: true;
            content: string;
            generation_settings: {
                model: string;
                stream: boolean;
                stop: string[];
                seed: number;
                mirostat: number;
                frequency_penalty: number;
                ignore_eos: boolean;
                logit_bias: number[];
                mirostat_eta: number;
                mirostat_tau: number;
                n_ctx: number;
                n_keep: number;
                n_predict: number;
                n_probs: number;
                penalize_nl: boolean;
                presence_penalty: number;
                repeat_last_n: number;
                repeat_penalty: number;
                tfs_z: number;
                top_k: number;
                top_p: number;
                typical_p: number;
                temperature?: number | undefined;
            };
            stopped_eos: boolean;
            stopped_limit: boolean;
            stopped_word: boolean;
            stopping_word: string;
            timings: {
                predicted_ms: number;
                predicted_n: number;
                predicted_per_second: number | null;
                predicted_per_token_ms: number | null;
                prompt_n: number;
                prompt_per_second: number | null;
                prompt_per_token_ms: number | null;
                prompt_ms?: number | null | undefined;
            };
            tokens_cached: number;
            tokens_evaluated: number;
            tokens_predicted: number;
            truncated: boolean;
        }>;
    };
    /**
     * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
     * of the response stream.
     */
    deltaIterable: {
        stream: true;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<Delta<{
            model: string;
            prompt: string;
            stop: true;
            content: string;
            generation_settings: {
                model: string;
                stream: boolean;
                stop: string[];
                seed: number;
                mirostat: number;
                frequency_penalty: number;
                ignore_eos: boolean;
                logit_bias: number[];
                mirostat_eta: number;
                mirostat_tau: number;
                n_ctx: number;
                n_keep: number;
                n_predict: number;
                n_probs: number;
                penalize_nl: boolean;
                presence_penalty: number;
                repeat_last_n: number;
                repeat_penalty: number;
                tfs_z: number;
                top_k: number;
                top_p: number;
                typical_p: number;
                temperature?: number | undefined;
            };
            stopped_eos: boolean;
            stopped_limit: boolean;
            stopped_word: boolean;
            stopping_word: string;
            timings: {
                predicted_ms: number;
                predicted_n: number;
                predicted_per_second: number | null;
                predicted_per_token_ms: number | null;
                prompt_n: number;
                prompt_per_second: number | null;
                prompt_per_token_ms: number | null;
                prompt_ms?: number | null | undefined;
            };
            tokens_cached: number;
            tokens_evaluated: number;
            tokens_predicted: number;
            truncated: boolean;
        } | {
            stop: false;
            content: string;
        }>>>;
    };
};

declare const llamaCppErrorDataSchema: z.ZodObject<{
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: string;
}, {
    error: string;
}>;
type LlamaCppErrorData = z.infer<typeof llamaCppErrorDataSchema>;

interface LlamaCppTextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    dimensions?: number;
    isParallelizable?: boolean;
}
declare class LlamaCppTextEmbeddingModel extends AbstractModel<LlamaCppTextEmbeddingModelSettings> implements EmbeddingModel<string, LlamaCppTextEmbeddingModelSettings> {
    constructor(settings?: LlamaCppTextEmbeddingModelSettings);
    readonly provider: "llamacpp";
    get modelName(): null;
    readonly maxValuesPerCall = 1;
    get isParallelizable(): boolean;
    readonly contextWindowSize: undefined;
    get dimensions(): number | undefined;
    private readonly tokenizer;
    tokenize(text: string): Promise<number[]>;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<LlamaCppTextEmbeddingResponse>;
    get settingsForEvent(): Partial<LlamaCppTextEmbeddingModelSettings>;
    doEmbedValues(texts: string[], options: FunctionCallOptions): Promise<{
        rawResponse: {
            embedding: number[];
        };
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: Partial<LlamaCppTextEmbeddingModelSettings>): this;
}
declare const llamaCppTextEmbeddingResponseSchema: z.ZodObject<{
    embedding: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    embedding: number[];
}, {
    embedding: number[];
}>;
type LlamaCppTextEmbeddingResponse = z.infer<typeof llamaCppTextEmbeddingResponseSchema>;

/**
 * Convert JSON Schema to a GBNF grammar.
 *
 * This is a modified version of
 * https://github.com/ggerganov/llama.cpp/blob/master/examples/server/public/json-schema-to-grammar.mjs
 */
declare function convertJsonSchemaToGBNF(schema: unknown): string;

/**
 * GBNF grammar for JSON.
 *
 * @see https://github.com/ggerganov/llama.cpp/blob/master/grammars/json.gbnf
 */
declare const json: string;
/**
 * GBNF grammar for JSON array outputs. Restricts whitespace at the end of the array.
 *
 * @see https://github.com/ggerganov/llama.cpp/blob/master/grammars/json_arr.gbnf
 */
declare const jsonArray: string;
/**
 * GBNF grammar for list outputs. List items are separated by newlines and start with `- `.
 *
 * @see https://github.com/ggerganov/llama.cpp/blob/master/grammars/list.gbnf
 */
declare const list: string;

declare const LlamaCppGrammars_json: typeof json;
declare const LlamaCppGrammars_jsonArray: typeof jsonArray;
declare const LlamaCppGrammars_list: typeof list;
declare namespace LlamaCppGrammars {
  export { convertJsonSchemaToGBNF as fromJsonSchema, LlamaCppGrammars_json as json, LlamaCppGrammars_jsonArray as jsonArray, LlamaCppGrammars_list as list };
}

/**
 * Text prompt.
 */
declare function text(): TextGenerationPromptTemplate<string, LlamaCppCompletionPrompt>;
/**
 * BakLLaVA 1 uses a Vicuna 1 prompt. This mapping combines it with the LlamaCpp prompt.
 *
 * @see https://github.com/SkunkworksAI/BakLLaVA
 */
declare function instruction(): TextGenerationPromptTemplate<InstructionPrompt, LlamaCppCompletionPrompt>;
declare function chat(): TextGenerationPromptTemplate<ChatPrompt, LlamaCppCompletionPrompt>;

declare const LlamaCppBakLLaVA1Prompt_chat: typeof chat;
declare const LlamaCppBakLLaVA1Prompt_instruction: typeof instruction;
declare const LlamaCppBakLLaVA1Prompt_text: typeof text;
declare namespace LlamaCppBakLLaVA1Prompt {
  export { LlamaCppBakLLaVA1Prompt_chat as chat, LlamaCppBakLLaVA1Prompt_instruction as instruction, LlamaCppBakLLaVA1Prompt_text as text };
}

declare function asLlamaCppPromptTemplate<SOURCE_PROMPT>(promptTemplate: TextGenerationPromptTemplate<SOURCE_PROMPT, string>): TextGenerationPromptTemplate<SOURCE_PROMPT, LlamaCppCompletionPrompt>;
declare function asLlamaCppTextPromptTemplateProvider(promptTemplateProvider: TextGenerationPromptTemplateProvider<string>): TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
declare const Text$1: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
/**
 * Formats text, instruction or chat prompts as a Mistral instruct prompt.
 *
 * Note that Mistral does not support system prompts. We emulate them.
 *
 * Text prompt:
 * ```
 * <s>[INST] { instruction } [/INST]
 * ```
 *
 * Instruction prompt when system prompt is set:
 * ```
 * <s>[INST] ${ system prompt } [/INST] </s>[INST] ${instruction} [/INST] ${ response prefix }
 * ```
 *
 * Instruction prompt template when there is no system prompt:
 * ```
 * <s>[INST] ${ instruction } [/INST] ${ response prefix }
 * ```
 *
 * Chat prompt when system prompt is set:
 * ```
 * <s>[INST] ${ system prompt } [/INST] </s> [INST] ${ user msg 1 } [/INST] ${ model response 1 } [INST] ${ user msg 2 } [/INST] ${ model response 2 } [INST] ${ user msg 3 } [/INST]
 * ```
 *
 * Chat prompt when there is no system prompt:
 * ```
 * <s>[INST] ${ user msg 1 } [/INST] ${ model response 1 } </s>[INST] ${ user msg 2 } [/INST] ${ model response 2 } [INST] ${ user msg 3 } [/INST]
 * ```
 *
 * @see https://docs.mistral.ai/models/#chat-template
 */
declare const Mistral$1: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
declare const ChatML$1: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
declare const Llama2$1: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
declare const NeuralChat$1: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
declare const Alpaca$1: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
declare const Synthia$1: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
declare const Vicuna$1: TextGenerationPromptTemplateProvider<LlamaCppCompletionPrompt>;
declare const BakLLaVA1: typeof LlamaCppBakLLaVA1Prompt;

declare const LlamaCppPrompt_BakLLaVA1: typeof BakLLaVA1;
declare const LlamaCppPrompt_asLlamaCppPromptTemplate: typeof asLlamaCppPromptTemplate;
declare const LlamaCppPrompt_asLlamaCppTextPromptTemplateProvider: typeof asLlamaCppTextPromptTemplateProvider;
declare namespace LlamaCppPrompt {
  export { Alpaca$1 as Alpaca, LlamaCppPrompt_BakLLaVA1 as BakLLaVA1, ChatML$1 as ChatML, Llama2$1 as Llama2, Mistral$1 as Mistral, NeuralChat$1 as NeuralChat, Synthia$1 as Synthia, Text$1 as Text, Vicuna$1 as Vicuna, LlamaCppPrompt_asLlamaCppPromptTemplate as asLlamaCppPromptTemplate, LlamaCppPrompt_asLlamaCppTextPromptTemplateProvider as asLlamaCppTextPromptTemplateProvider };
}

/**
 * Creates an API configuration for the Llama.cpp server.
 * It calls the API at http://127.0.0.1:8080 by default.
 */
declare function Api$6(settings: PartialBaseUrlPartsApiConfigurationOptions): LlamaCppApiConfiguration;
declare function CompletionTextGenerator$3<CONTEXT_WINDOW_SIZE extends number>(settings?: LlamaCppCompletionModelSettings<CONTEXT_WINDOW_SIZE>): LlamaCppCompletionModel<CONTEXT_WINDOW_SIZE>;
declare function TextEmbedder$4(settings?: LlamaCppTextEmbeddingModelSettings): LlamaCppTextEmbeddingModel;
declare function Tokenizer$1(api?: ApiConfiguration): LlamaCppTokenizer;

declare namespace LlamaCppFacade {
  export { Api$6 as Api, CompletionTextGenerator$3 as CompletionTextGenerator, TextEmbedder$4 as TextEmbedder, Tokenizer$1 as Tokenizer, LlamaCppGrammars as grammar, LlamaCppPrompt as prompt };
}

/**
 * Creates an API configuration for the LMNT API.
 * It calls the API at https://api.lmnt.com/v1 and uses the `LMNT_API_KEY` env variable by default.
 */
declare class LmntApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}

interface LmntSpeechModelSettings extends SpeechGenerationModelSettings {
    api?: ApiConfiguration;
    /**
     * The voice id of the voice to use for synthesis.
     */
    voice: string;
    /**
     * The talking speed of the generated speech. A Floating point value between 0.25 (slow) and 2.0 (fast); defaults to 1.0
     */
    speed?: number;
    /**
     * Seed used to specify a different take; defaults to random
     */
    seed?: number;
    /**
     * Produce speech of this length in seconds; maximum 300.0 (5 minutes)
     */
    length?: number;
}
/**
 * Synthesize speech using the LMNT API.
 *
 * @see https://docs.lmnt.com/api-reference/speech/synthesize-speech-1
 */
declare class LmntSpeechModel extends AbstractModel<LmntSpeechModelSettings> implements SpeechGenerationModel<LmntSpeechModelSettings> {
    constructor(settings: LmntSpeechModelSettings);
    readonly provider = "lmnt";
    get modelName(): string;
    private callAPI;
    get settingsForEvent(): Partial<LmntSpeechModelSettings>;
    doGenerateSpeechStandard(text: string, options: FunctionCallOptions): Promise<Uint8Array>;
    withSettings(additionalSettings: Partial<LmntSpeechModelSettings>): this;
}
declare const lmntSpeechResponseSchema: z.ZodObject<{
    audio: z.ZodString;
    durations: z.ZodArray<z.ZodObject<{
        duration: z.ZodNumber;
        start: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        duration: number;
        start: number;
    }, {
        text: string;
        duration: number;
        start: number;
    }>, "many">;
    seed: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    seed: number;
    audio: string;
    durations: {
        text: string;
        duration: number;
        start: number;
    }[];
}, {
    seed: number;
    audio: string;
    durations: {
        text: string;
        duration: number;
        start: number;
    }[];
}>;
type LmntSpeechResponse = z.infer<typeof lmntSpeechResponseSchema>;

/**
 * Creates an API configuration for the LMNT API.
 * It calls the API at https://api.lmnt.com/v1 and uses the `LMNT_API_KEY` env variable by default.
 */
declare function Api$5(settings: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): LmntApiConfiguration;
/**
 * Synthesize speech using the LMNT API.
 *
 * @see https://docs.lmnt.com/api-reference/speech/synthesize-speech-1
 *
 * @returns A new instance of {@link LmntSpeechModel}.
 */
declare function SpeechGenerator$1(settings: LmntSpeechModelSettings): LmntSpeechModel;

declare namespace LmntFacade {
  export { Api$5 as Api, SpeechGenerator$1 as SpeechGenerator };
}

/**
 * Creates an API configuration for the Mistral API.
 * It calls the API at https://api.mistral.ai/v1 and uses the `MISTRAL_API_KEY` env variable by default.
 */
declare class MistralApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}

type MistralChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};
type MistralChatPrompt = Array<MistralChatMessage>;
interface MistralChatModelSettings extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    model: "mistral-tiny" | "mistral-small" | "mistral-medium";
    /**
     * What sampling temperature to use, between 0.0 and 2.0.
     * Higher values like 0.8 will make the output more random,
     * while lower values like 0.2 will make it more focused and deterministic.
     *
     * We generally recommend altering this or top_p but not both.
     *
     * Default: 0.7
     */
    temperature?: number | null;
    /**
     * Nucleus sampling, where the model considers the results of the tokens
     * with top_p probability mass. So 0.1 means only the tokens comprising
     * the top 10% probability mass are considered.
     *
     * We generally recommend altering this or temperature but not both.
     *
     * Default: 1
     */
    topP?: number;
    /**
     * Whether to inject a safety prompt before all conversations.
     *
     * Default: false
     */
    safeMode?: boolean;
    /**
     * The seed to use for random sampling. If set, different calls will
     * generate deterministic results.
     */
    randomSeed?: number | null;
}
declare class MistralChatModel extends AbstractModel<MistralChatModelSettings> implements TextStreamingBaseModel<MistralChatPrompt, MistralChatModelSettings> {
    constructor(settings: MistralChatModelSettings);
    readonly provider = "mistral";
    get modelName(): "mistral-tiny" | "mistral-small" | "mistral-medium";
    readonly contextWindowSize: undefined;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    callAPI<RESULT>(prompt: MistralChatPrompt, callOptions: FunctionCallOptions, options: {
        responseFormat: MistralChatResponseFormatType<RESULT>;
    }): Promise<RESULT>;
    get settingsForEvent(): Partial<MistralChatModelSettings>;
    doGenerateTexts(prompt: MistralChatPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: string;
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "user" | "assistant";
                    content: string;
                };
                finish_reason: "length" | "stop" | "model_length";
                index: number;
            }[];
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            object: string;
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "user" | "assistant";
                    content: string;
                };
                finish_reason: "length" | "stop" | "model_length";
                index: number;
            }[];
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    };
    processTextGenerationResponse(rawResponse: MistralChatResponse): {
        rawResponse: {
            object: string;
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "user" | "assistant";
                    content: string;
                };
                finish_reason: "length" | "stop" | "model_length";
                index: number;
            }[];
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
    };
    private translateFinishReason;
    doStreamText(prompt: MistralChatPrompt, options: FunctionCallOptions): Promise<AsyncIterable<Delta<{
        model: string;
        id: string;
        choices: {
            delta: {
                role?: "user" | "assistant" | null | undefined;
                content?: string | null | undefined;
            };
            index: number;
            finish_reason?: "length" | "stop" | "model_length" | null | undefined;
        }[];
        object?: string | undefined;
        created?: number | undefined;
    }>>>;
    extractTextDelta(delta: unknown): string | undefined;
    withTextPrompt(): PromptTemplateTextStreamingModel<string, MistralChatPrompt, MistralChatModelSettings, this>;
    withInstructionPrompt(): PromptTemplateTextStreamingModel<InstructionPrompt, MistralChatPrompt, MistralChatModelSettings, this>;
    withChatPrompt(): PromptTemplateTextStreamingModel<ChatPrompt, MistralChatPrompt, MistralChatModelSettings, this>;
    withJsonOutput(): this;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, MistralChatPrompt>): PromptTemplateTextStreamingModel<INPUT_PROMPT, MistralChatPrompt, MistralChatModelSettings, this>;
    withSettings(additionalSettings: Partial<MistralChatModelSettings>): this;
}
declare const mistralChatResponseSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodString;
    created: z.ZodNumber;
    model: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        message: z.ZodObject<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            role: "user" | "assistant";
            content: string;
        }, {
            role: "user" | "assistant";
            content: string;
        }>;
        finish_reason: z.ZodEnum<["stop", "length", "model_length"]>;
    }, "strip", z.ZodTypeAny, {
        message: {
            role: "user" | "assistant";
            content: string;
        };
        finish_reason: "length" | "stop" | "model_length";
        index: number;
    }, {
        message: {
            role: "user" | "assistant";
            content: string;
        };
        finish_reason: "length" | "stop" | "model_length";
        index: number;
    }>, "many">;
    usage: z.ZodObject<{
        prompt_tokens: z.ZodNumber;
        completion_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    }, {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    }>;
}, "strip", z.ZodTypeAny, {
    object: string;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    id: string;
    created: number;
    choices: {
        message: {
            role: "user" | "assistant";
            content: string;
        };
        finish_reason: "length" | "stop" | "model_length";
        index: number;
    }[];
}, {
    object: string;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    id: string;
    created: number;
    choices: {
        message: {
            role: "user" | "assistant";
            content: string;
        };
        finish_reason: "length" | "stop" | "model_length";
        index: number;
    }[];
}>;
type MistralChatResponse = z.infer<typeof mistralChatResponseSchema>;
declare const mistralChatStreamChunkSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodOptional<z.ZodString>;
    created: z.ZodOptional<z.ZodNumber>;
    model: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        delta: z.ZodObject<{
            role: z.ZodNullable<z.ZodOptional<z.ZodEnum<["assistant", "user"]>>>;
            content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        }, {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        }>;
        finish_reason: z.ZodOptional<z.ZodNullable<z.ZodEnum<["stop", "length", "model_length"]>>>;
    }, "strip", z.ZodTypeAny, {
        delta: {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "model_length" | null | undefined;
    }, {
        delta: {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "model_length" | null | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    model: string;
    id: string;
    choices: {
        delta: {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "model_length" | null | undefined;
    }[];
    object?: string | undefined;
    created?: number | undefined;
}, {
    model: string;
    id: string;
    choices: {
        delta: {
            role?: "user" | "assistant" | null | undefined;
            content?: string | null | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "model_length" | null | undefined;
    }[];
    object?: string | undefined;
    created?: number | undefined;
}>;
type MistralChatStreamChunk = z.infer<typeof mistralChatStreamChunkSchema>;
type MistralChatResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
declare const MistralChatResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: boolean;
        handler: ResponseHandler<{
            object: string;
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "user" | "assistant";
                    content: string;
                };
                finish_reason: "length" | "stop" | "model_length";
                index: number;
            }[];
        }>;
    };
    /**
     * Returns an async iterable over the text deltas (only the tex different of the first choice).
     */
    textDeltaIterable: {
        stream: boolean;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<Delta<{
            model: string;
            id: string;
            choices: {
                delta: {
                    role?: "user" | "assistant" | null | undefined;
                    content?: string | null | undefined;
                };
                index: number;
                finish_reason?: "length" | "stop" | "model_length" | null | undefined;
            }[];
            object?: string | undefined;
            created?: number | undefined;
        }>>>;
    };
};

declare const mistralErrorDataSchema: z.ZodObject<{
    object: z.ZodLiteral<"error">;
    message: z.ZodString;
    type: z.ZodString;
    param: z.ZodNullable<z.ZodString>;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    object: "error";
    message: string;
    code: string;
    type: string;
    param: string | null;
}, {
    object: "error";
    message: string;
    code: string;
    type: string;
    param: string | null;
}>;
type MistralErrorData = z.infer<typeof mistralErrorDataSchema>;

interface MistralTextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    /**
     * The ID of the model to use for this request.
     */
    model: "mistral-embed";
    /**
     * The format of the output data.
     *
     * Default: "float"
     */
    encodingFormat?: "float";
}
declare class MistralTextEmbeddingModel extends AbstractModel<MistralTextEmbeddingModelSettings> implements EmbeddingModel<string, MistralTextEmbeddingModelSettings> {
    constructor(settings: MistralTextEmbeddingModelSettings);
    readonly provider: "mistral";
    get modelName(): "mistral-embed";
    readonly maxValuesPerCall = 32;
    /**
     * Parallel calls are technically possible, but I have been hitting rate limits and disabled
     * them for now.
     */
    readonly isParallelizable = false;
    readonly dimensions = 1024;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<MistralTextEmbeddingResponse>;
    get settingsForEvent(): Partial<MistralTextEmbeddingModelSettings>;
    doEmbedValues(texts: string[], options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: string;
            model: string;
            data: {
                object: string;
                embedding: number[];
                index: number;
            }[];
            usage: {
                prompt_tokens: number;
                total_tokens: number;
            };
            id: string;
        };
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: Partial<MistralTextEmbeddingModelSettings>): this;
}
declare const MistralTextEmbeddingResponseSchema: z.ZodObject<{
    id: z.ZodString;
    object: z.ZodString;
    data: z.ZodArray<z.ZodObject<{
        object: z.ZodString;
        embedding: z.ZodArray<z.ZodNumber, "many">;
        index: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        object: string;
        embedding: number[];
        index: number;
    }, {
        object: string;
        embedding: number[];
        index: number;
    }>, "many">;
    model: z.ZodString;
    usage: z.ZodObject<{
        prompt_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        prompt_tokens: number;
        total_tokens: number;
    }, {
        prompt_tokens: number;
        total_tokens: number;
    }>;
}, "strip", z.ZodTypeAny, {
    object: string;
    model: string;
    data: {
        object: string;
        embedding: number[];
        index: number;
    }[];
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
    id: string;
}, {
    object: string;
    model: string;
    data: {
        object: string;
        embedding: number[];
        index: number;
    }[];
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
    id: string;
}>;
type MistralTextEmbeddingResponse = z.infer<typeof MistralTextEmbeddingResponseSchema>;

/**
 * Creates an API configuration for the Mistral API.
 * It calls the API at https://api.mistral.ai/v1 and uses the `MISTRAL_API_KEY` env variable by default.
 */
declare function Api$4(settings: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): MistralApiConfiguration;
declare function ChatTextGenerator$3(settings: MistralChatModelSettings): MistralChatModel;
declare function TextEmbedder$3(settings: MistralTextEmbeddingModelSettings): MistralTextEmbeddingModel;

declare namespace MistralFacade {
  export { Api$4 as Api, type MistralChatMessage as ChatMessage, type MistralChatPrompt as ChatPrompt, ChatTextGenerator$3 as ChatTextGenerator, TextEmbedder$3 as TextEmbedder };
}

/**
 * Creates an API configuration for the Ollama API.
 * It calls the API at http://127.0.0.1:11434 by default.
 */
declare class OllamaApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions);
}

interface OllamaTextGenerationSettings extends TextGenerationModelSettings {
    /**
     * The name of the model to use. For example, 'mistral'.
     *
     * @see https://ollama.ai/library
     */
    model: string;
    /**
     * The temperature of the model. Increasing the temperature will make the model
     * answer more creatively. (Default: 0.8)
     */
    temperature?: number;
    /**
     * Enable Mirostat sampling for controlling perplexity.
     * (default: 0, 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0)
     */
    mirostat?: number;
    /**
     * Influences how quickly the algorithm responds to feedback from the generated text.
     * A lower learning rate will result in slower adjustments,
     * while a higher learning rate will make the algorithm more responsive. (Default: 0.1)
     */
    mirostatEta?: number;
    /**
     * Controls the balance between coherence and diversity of the output.
     * A lower value will result in more focused and coherent text. (Default: 5.0)
     */
    mirostatTau?: number;
    /**
     * The number of GQA groups in the transformer layer. Required for some models,
     * for example it is 8 for llama2:70b
     */
    numGqa?: number;
    /**
     * The number of layers to send to the GPU(s). On macOS it defaults to 1 to
     * enable metal support, 0 to disable.
     */
    numGpu?: number;
    /**
     * Sets the number of threads to use during computation. By default, Ollama will
     * detect this for optimal performance. It is recommended to set this value to the
     * number of physical CPU cores your system has (as opposed to the logical number of cores).
     */
    numThreads?: number;
    /**
     * Sets how far back for the model to look back to prevent repetition.
     * (Default: 64, 0 = disabled, -1 = num_ctx)
     */
    repeatLastN?: number;
    /**
     * Sets how strongly to penalize repetitions. A higher value (e.g., 1.5)
     * will penalize repetitions more strongly, while a lower value (e.g., 0.9)
     * will be more lenient. (Default: 1.1)
     */
    repeatPenalty?: number;
    /**
     * Sets the random number seed to use for generation. Setting this to a
     * specific number will make the model generate the same text for the same prompt.
     * (Default: 0)
     */
    seed?: number;
    /**
     * Tail free sampling is used to reduce the impact of less probable tokens
     * from the output. A higher value (e.g., 2.0) will reduce the impact more,
     * while a value of 1.0 disables this setting. (default: 1)
     */
    tfsZ?: number;
    /**
     * Reduces the probability of generating nonsense. A higher value (e.g. 100)
     * will give more diverse answers, while a lower value (e.g. 10) will be more
     *  conservative. (Default: 40)
     */
    topK?: number;
    /**
     * Works together with top-k. A higher value (e.g., 0.95) will lead to more
     * diverse text, while a lower value (e.g., 0.5) will generate more focused
     * and conservative text. (Default: 0.9)
     */
    topP?: number;
    /**
     * The format to return a response in. Currently the only accepted value is 'json'.
     * Leave undefined to return a string.
     */
    format?: "json";
    template?: string;
}

type OllamaChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
    /**
     Images. Supports base64-encoded `png` and `jpeg` images up to 100MB in size.
     */
    images?: Array<string>;
};
type OllamaChatPrompt = Array<OllamaChatMessage>;
interface OllamaChatModelSettings extends OllamaTextGenerationSettings {
    api?: ApiConfiguration;
}
/**
 * Text generation model that uses the Ollama chat API.
 */
declare class OllamaChatModel extends AbstractModel<OllamaChatModelSettings> implements TextStreamingBaseModel<OllamaChatPrompt, OllamaChatModelSettings> {
    constructor(settings: OllamaChatModelSettings);
    readonly provider = "ollama";
    get modelName(): string;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    readonly contextWindowSize: undefined;
    callAPI<RESPONSE>(prompt: OllamaChatPrompt, callOptions: FunctionCallOptions, options: {
        responseFormat: OllamaChatResponseFormatType<RESPONSE>;
    }): Promise<RESPONSE>;
    get settingsForEvent(): Partial<OllamaChatModelSettings>;
    doGenerateTexts(prompt: OllamaChatPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            model: string;
            message: {
                role: string;
                content: string;
            };
            done: true;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            model: string;
            message: {
                role: string;
                content: string;
            };
            done: true;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    };
    private processTextGenerationResponse;
    doStreamText(prompt: OllamaChatPrompt, options: FunctionCallOptions): Promise<AsyncIterable<Delta<{
        model: string;
        message: {
            role: string;
            content: string;
        };
        done: false;
        created_at: string;
    } | {
        model: string;
        done: true;
        created_at: string;
        total_duration: number;
        eval_count: number;
        eval_duration: number;
        load_duration?: number | undefined;
        prompt_eval_count?: number | undefined;
        prompt_eval_duration?: number | undefined;
    }>>>;
    extractTextDelta(delta: unknown): string | undefined;
    asToolCallGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallPromptTemplate<INPUT_PROMPT, OllamaChatPrompt>): TextGenerationToolCallModel<INPUT_PROMPT, OllamaChatPrompt, this>;
    asToolCallsOrTextGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallsPromptTemplate<INPUT_PROMPT, OllamaChatPrompt>): TextGenerationToolCallsModel<INPUT_PROMPT, OllamaChatPrompt, this>;
    asObjectGenerationModel<INPUT_PROMPT, OllamaChatPrompt>(promptTemplate: ObjectFromTextPromptTemplate<INPUT_PROMPT, OllamaChatPrompt> | FlexibleObjectFromTextPromptTemplate<INPUT_PROMPT, unknown>): ObjectFromTextStreamingModel<INPUT_PROMPT, unknown, TextStreamingModel<unknown, TextGenerationModelSettings>> | ObjectFromTextStreamingModel<INPUT_PROMPT, OllamaChatPrompt, TextStreamingModel<OllamaChatPrompt, TextGenerationModelSettings>>;
    withTextPrompt(): PromptTemplateTextStreamingModel<string, OllamaChatPrompt, OllamaChatModelSettings, this>;
    withInstructionPrompt(): PromptTemplateTextStreamingModel<InstructionPrompt, OllamaChatPrompt, OllamaChatModelSettings, this>;
    withChatPrompt(): PromptTemplateTextStreamingModel<ChatPrompt, OllamaChatPrompt, OllamaChatModelSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, OllamaChatPrompt>): PromptTemplateTextStreamingModel<INPUT_PROMPT, OllamaChatPrompt, OllamaChatModelSettings, this>;
    withJsonOutput(): this;
    withSettings(additionalSettings: Partial<OllamaChatModelSettings>): this;
}
declare const ollamaChatResponseSchema: z.ZodObject<{
    model: z.ZodString;
    created_at: z.ZodString;
    done: z.ZodLiteral<true>;
    message: z.ZodObject<{
        role: z.ZodString;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: string;
        content: string;
    }, {
        role: string;
        content: string;
    }>;
    total_duration: z.ZodNumber;
    load_duration: z.ZodOptional<z.ZodNumber>;
    prompt_eval_count: z.ZodOptional<z.ZodNumber>;
    prompt_eval_duration: z.ZodOptional<z.ZodNumber>;
    eval_count: z.ZodNumber;
    eval_duration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    model: string;
    message: {
        role: string;
        content: string;
    };
    done: true;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
}, {
    model: string;
    message: {
        role: string;
        content: string;
    };
    done: true;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
}>;
type OllamaChatResponse = z.infer<typeof ollamaChatResponseSchema>;
declare const ollamaChatStreamChunkSchema: z.ZodDiscriminatedUnion<"done", [z.ZodObject<{
    done: z.ZodLiteral<false>;
    model: z.ZodString;
    created_at: z.ZodString;
    message: z.ZodObject<{
        role: z.ZodString;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: string;
        content: string;
    }, {
        role: string;
        content: string;
    }>;
}, "strip", z.ZodTypeAny, {
    model: string;
    message: {
        role: string;
        content: string;
    };
    done: false;
    created_at: string;
}, {
    model: string;
    message: {
        role: string;
        content: string;
    };
    done: false;
    created_at: string;
}>, z.ZodObject<{
    done: z.ZodLiteral<true>;
    model: z.ZodString;
    created_at: z.ZodString;
    total_duration: z.ZodNumber;
    load_duration: z.ZodOptional<z.ZodNumber>;
    prompt_eval_count: z.ZodOptional<z.ZodNumber>;
    prompt_eval_duration: z.ZodOptional<z.ZodNumber>;
    eval_count: z.ZodNumber;
    eval_duration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    model: string;
    done: true;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
}, {
    model: string;
    done: true;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
}>]>;
type OllamaChatStreamChunk = z.infer<typeof ollamaChatStreamChunkSchema>;
type OllamaChatResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
declare const OllamaChatResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: false;
        handler: ({ response, url, requestBodyValues }: {
            url: string;
            requestBodyValues: unknown;
            response: Response;
        }) => Promise<{
            model: string;
            message: {
                role: string;
                content: string;
            };
            done: true;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
        }>;
    };
    /**
     * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
     * of the response stream.
     */
    deltaIterable: {
        stream: boolean;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<Delta<{
            model: string;
            message: {
                role: string;
                content: string;
            };
            done: false;
            created_at: string;
        } | {
            model: string;
            done: true;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
        }>>>;
    };
};

interface OllamaCompletionPrompt$1 {
    /**
     * Text prompt.
     */
    prompt: string;
    /**
     Images. Supports base64-encoded `png` and `jpeg` images up to 100MB in size.
     */
    images?: Array<string>;
}
/**
 * Text generation model that uses the Ollama completion API.
 *
 * @see https://github.com/jmorganca/ollama/blob/main/docs/api.md#generate-a-completion
 */
interface OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE extends number | undefined> extends OllamaTextGenerationSettings {
    api?: ApiConfiguration;
    /**
     * Specify the context window size of the model that you have loaded in your
     * Ollama server. (Default: 2048)
     */
    contextWindowSize?: CONTEXT_WINDOW_SIZE;
    /**
     * When set to true, no formatting will be applied to the prompt and no context
     * will be returned.
     */
    raw?: boolean;
    system?: string;
    context?: number[];
    /**
     * Prompt template provider that is used when calling `.withTextPrompt()`, `withInstructionPrompt()` or `withChatPrompt()`.
     */
    promptTemplate?: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt$1>;
}
declare class OllamaCompletionModel<CONTEXT_WINDOW_SIZE extends number | undefined> extends AbstractModel<OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>> implements TextStreamingBaseModel<OllamaCompletionPrompt$1, OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>> {
    constructor(settings: OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>);
    readonly provider = "ollama";
    get modelName(): string;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    get contextWindowSize(): CONTEXT_WINDOW_SIZE;
    callAPI<RESPONSE>(prompt: OllamaCompletionPrompt$1, callOptions: FunctionCallOptions, options: {
        responseFormat: OllamaCompletionResponseFormatType<RESPONSE>;
    }): Promise<RESPONSE>;
    get settingsForEvent(): Partial<OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>>;
    doGenerateTexts(prompt: OllamaCompletionPrompt$1, options: FunctionCallOptions): Promise<{
        rawResponse: {
            model: string;
            done: true;
            response: string;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
            context?: number[] | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            model: string;
            done: true;
            response: string;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
            context?: number[] | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    };
    processTextGenerationResponse(rawResponse: OllamaCompletionResponse): {
        rawResponse: {
            model: string;
            done: true;
            response: string;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
            context?: number[] | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: "unknown";
        }[];
    };
    doStreamText(prompt: OllamaCompletionPrompt$1, options: FunctionCallOptions): Promise<AsyncIterable<Delta<{
        model: string;
        done: false;
        response: string;
        created_at: string;
    } | {
        model: string;
        done: true;
        created_at: string;
        total_duration: number;
        eval_count: number;
        eval_duration: number;
        load_duration?: number | undefined;
        sample_count?: number | undefined;
        sample_duration?: number | undefined;
        prompt_eval_count?: number | undefined;
        prompt_eval_duration?: number | undefined;
        context?: number[] | undefined;
    }>>>;
    extractTextDelta(delta: unknown): string | undefined;
    asObjectGenerationModel<INPUT_PROMPT, OllamaCompletionPrompt>(promptTemplate: ObjectFromTextPromptTemplate<INPUT_PROMPT, OllamaCompletionPrompt> | FlexibleObjectFromTextPromptTemplate<INPUT_PROMPT, unknown>): ObjectFromTextStreamingModel<INPUT_PROMPT, unknown, TextStreamingModel<unknown, TextGenerationModelSettings>> | ObjectFromTextStreamingModel<INPUT_PROMPT, OllamaCompletionPrompt, TextStreamingModel<OllamaCompletionPrompt, TextGenerationModelSettings>>;
    asToolCallGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallPromptTemplate<INPUT_PROMPT, OllamaCompletionPrompt$1>): TextGenerationToolCallModel<INPUT_PROMPT, OllamaCompletionPrompt$1, this>;
    asToolCallsOrTextGenerationModel<INPUT_PROMPT>(promptTemplate: ToolCallsPromptTemplate<INPUT_PROMPT, OllamaCompletionPrompt$1>): TextGenerationToolCallsModel<INPUT_PROMPT, OllamaCompletionPrompt$1, this>;
    private get promptTemplateProvider();
    withJsonOutput(): this;
    withTextPrompt(): PromptTemplateTextStreamingModel<string, OllamaCompletionPrompt$1, OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withInstructionPrompt(): PromptTemplateTextStreamingModel<InstructionPrompt, OllamaCompletionPrompt$1, OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withChatPrompt(): PromptTemplateTextStreamingModel<ChatPrompt, OllamaCompletionPrompt$1, OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, OllamaCompletionPrompt$1>): PromptTemplateTextStreamingModel<INPUT_PROMPT, OllamaCompletionPrompt$1, OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>, this>;
    withSettings(additionalSettings: Partial<OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>>): this;
}
declare const ollamaCompletionResponseSchema: z.ZodObject<{
    done: z.ZodLiteral<true>;
    model: z.ZodString;
    created_at: z.ZodString;
    response: z.ZodString;
    total_duration: z.ZodNumber;
    load_duration: z.ZodOptional<z.ZodNumber>;
    prompt_eval_count: z.ZodOptional<z.ZodNumber>;
    prompt_eval_duration: z.ZodOptional<z.ZodNumber>;
    eval_count: z.ZodNumber;
    eval_duration: z.ZodNumber;
    context: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    model: string;
    done: true;
    response: string;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
    context?: number[] | undefined;
}, {
    model: string;
    done: true;
    response: string;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
    context?: number[] | undefined;
}>;
type OllamaCompletionResponse = z.infer<typeof ollamaCompletionResponseSchema>;
declare const ollamaCompletionStreamChunkSchema: z.ZodDiscriminatedUnion<"done", [z.ZodObject<{
    done: z.ZodLiteral<false>;
    model: z.ZodString;
    created_at: z.ZodString;
    response: z.ZodString;
}, "strip", z.ZodTypeAny, {
    model: string;
    done: false;
    response: string;
    created_at: string;
}, {
    model: string;
    done: false;
    response: string;
    created_at: string;
}>, z.ZodObject<{
    done: z.ZodLiteral<true>;
    model: z.ZodString;
    created_at: z.ZodString;
    total_duration: z.ZodNumber;
    load_duration: z.ZodOptional<z.ZodNumber>;
    sample_count: z.ZodOptional<z.ZodNumber>;
    sample_duration: z.ZodOptional<z.ZodNumber>;
    prompt_eval_count: z.ZodOptional<z.ZodNumber>;
    prompt_eval_duration: z.ZodOptional<z.ZodNumber>;
    eval_count: z.ZodNumber;
    eval_duration: z.ZodNumber;
    context: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    model: string;
    done: true;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    sample_count?: number | undefined;
    sample_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
    context?: number[] | undefined;
}, {
    model: string;
    done: true;
    created_at: string;
    total_duration: number;
    eval_count: number;
    eval_duration: number;
    load_duration?: number | undefined;
    sample_count?: number | undefined;
    sample_duration?: number | undefined;
    prompt_eval_count?: number | undefined;
    prompt_eval_duration?: number | undefined;
    context?: number[] | undefined;
}>]>;
type OllamaCompletionStreamChunk = z.infer<typeof ollamaCompletionStreamChunkSchema>;
type OllamaCompletionResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
declare const OllamaCompletionResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: false;
        handler: ({ response, url, requestBodyValues }: {
            url: string;
            requestBodyValues: unknown;
            response: Response;
        }) => Promise<{
            model: string;
            done: true;
            response: string;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
            context?: number[] | undefined;
        }>;
    };
    /**
     * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
     * of the response stream.
     */
    deltaIterable: {
        stream: boolean;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<Delta<{
            model: string;
            done: false;
            response: string;
            created_at: string;
        } | {
            model: string;
            done: true;
            created_at: string;
            total_duration: number;
            eval_count: number;
            eval_duration: number;
            load_duration?: number | undefined;
            sample_count?: number | undefined;
            sample_duration?: number | undefined;
            prompt_eval_count?: number | undefined;
            prompt_eval_duration?: number | undefined;
            context?: number[] | undefined;
        }>>>;
    };
};

declare const ollamaErrorDataSchema: z.ZodObject<{
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: string;
}, {
    error: string;
}>;
type OllamaErrorData = z.infer<typeof ollamaErrorDataSchema>;

interface OllamaTextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    model: string;
    dimensions?: number;
    isParallelizable?: boolean;
}
declare class OllamaTextEmbeddingModel extends AbstractModel<OllamaTextEmbeddingModelSettings> implements EmbeddingModel<string, OllamaTextEmbeddingModelSettings> {
    constructor(settings: OllamaTextEmbeddingModelSettings);
    readonly provider: "ollama";
    get modelName(): null;
    readonly maxValuesPerCall = 1;
    get isParallelizable(): boolean;
    get dimensions(): number | undefined;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<OllamaTextEmbeddingResponse>;
    get settingsForEvent(): Partial<OllamaTextEmbeddingModelSettings>;
    doEmbedValues(texts: string[], options: FunctionCallOptions): Promise<{
        rawResponse: {
            embedding: number[];
        };
        embeddings: number[][];
    }>;
    withSettings(additionalSettings: Partial<OllamaTextEmbeddingModelSettings>): this;
}
declare const ollamaTextEmbeddingResponseSchema: z.ZodObject<{
    embedding: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    embedding: number[];
}, {
    embedding: number[];
}>;
type OllamaTextEmbeddingResponse = z.infer<typeof ollamaTextEmbeddingResponseSchema>;

declare function asOllamaCompletionPromptTemplate<SOURCE_PROMPT>(promptTemplate: TextGenerationPromptTemplate<SOURCE_PROMPT, string>): TextGenerationPromptTemplate<SOURCE_PROMPT, OllamaCompletionPrompt$1>;
declare function asOllamaCompletionTextPromptTemplateProvider(promptTemplateProvider: TextGenerationPromptTemplateProvider<string>): TextGenerationPromptTemplateProvider<OllamaCompletionPrompt$1>;
declare const Text: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt$1>;
/**
 * Formats text, instruction or chat prompts as a Mistral instruct prompt.
 *
 * Note that Mistral does not support system prompts. We emulate them.
 *
 * Text prompt:
 * ```
 * <s>[INST] { instruction } [/INST]
 * ```
 *
 * Instruction prompt when system prompt is set:
 * ```
 * <s>[INST] ${ system prompt } [/INST] </s>[INST] ${instruction} [/INST] ${ response prefix }
 * ```
 *
 * Instruction prompt template when there is no system prompt:
 * ```
 * <s>[INST] ${ instruction } [/INST] ${ response prefix }
 * ```
 *
 * Chat prompt when system prompt is set:
 * ```
 * <s>[INST] ${ system prompt } [/INST] </s> [INST] ${ user msg 1 } [/INST] ${ model response 1 } [INST] ${ user msg 2 } [/INST] ${ model response 2 } [INST] ${ user msg 3 } [/INST]
 * ```
 *
 * Chat prompt when there is no system prompt:
 * ```
 * <s>[INST] ${ user msg 1 } [/INST] ${ model response 1 } </s>[INST] ${ user msg 2 } [/INST] ${ model response 2 } [INST] ${ user msg 3 } [/INST]
 * ```
 *
 * @see https://docs.mistral.ai/models/#chat-template
 */
declare const Mistral: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt$1>;
declare const ChatML: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt$1>;
declare const Llama2: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt$1>;
declare const NeuralChat: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt$1>;
declare const Alpaca: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt$1>;
declare const Synthia: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt$1>;
declare const Vicuna: TextGenerationPromptTemplateProvider<OllamaCompletionPrompt$1>;

declare const OllamaCompletionPrompt_Alpaca: typeof Alpaca;
declare const OllamaCompletionPrompt_ChatML: typeof ChatML;
declare const OllamaCompletionPrompt_Llama2: typeof Llama2;
declare const OllamaCompletionPrompt_Mistral: typeof Mistral;
declare const OllamaCompletionPrompt_NeuralChat: typeof NeuralChat;
declare const OllamaCompletionPrompt_Synthia: typeof Synthia;
declare const OllamaCompletionPrompt_Text: typeof Text;
declare const OllamaCompletionPrompt_Vicuna: typeof Vicuna;
declare const OllamaCompletionPrompt_asOllamaCompletionPromptTemplate: typeof asOllamaCompletionPromptTemplate;
declare const OllamaCompletionPrompt_asOllamaCompletionTextPromptTemplateProvider: typeof asOllamaCompletionTextPromptTemplateProvider;
declare namespace OllamaCompletionPrompt {
  export { OllamaCompletionPrompt_Alpaca as Alpaca, OllamaCompletionPrompt_ChatML as ChatML, OllamaCompletionPrompt_Llama2 as Llama2, OllamaCompletionPrompt_Mistral as Mistral, OllamaCompletionPrompt_NeuralChat as NeuralChat, OllamaCompletionPrompt_Synthia as Synthia, OllamaCompletionPrompt_Text as Text, OllamaCompletionPrompt_Vicuna as Vicuna, OllamaCompletionPrompt_asOllamaCompletionPromptTemplate as asOllamaCompletionPromptTemplate, OllamaCompletionPrompt_asOllamaCompletionTextPromptTemplateProvider as asOllamaCompletionTextPromptTemplateProvider };
}

/**
 * Creates an API configuration for the Ollama API.
 * It calls the API at http://127.0.0.1:11434 by default.
 */
declare function Api$3(settings: PartialBaseUrlPartsApiConfigurationOptions): OllamaApiConfiguration;
declare function CompletionTextGenerator$2<CONTEXT_WINDOW_SIZE extends number>(settings: OllamaCompletionModelSettings<CONTEXT_WINDOW_SIZE>): OllamaCompletionModel<CONTEXT_WINDOW_SIZE>;
declare function ChatTextGenerator$2(settings: OllamaChatModelSettings): OllamaChatModel;
declare function TextEmbedder$2(settings: OllamaTextEmbeddingModelSettings): OllamaTextEmbeddingModel;

declare namespace OllamaFacade {
  export { Api$3 as Api, type OllamaChatMessage as ChatMessage, type OllamaChatPrompt as ChatPrompt, ChatTextGenerator$2 as ChatTextGenerator, CompletionTextGenerator$2 as CompletionTextGenerator, TextEmbedder$2 as TextEmbedder, OllamaCompletionPrompt as prompt };
}

type OpenAIChatMessage = {
    role: "system";
    content: string;
    name?: string;
} | {
    role: "user";
    content: string | Array<{
        type: "text";
        text: string;
    } | {
        type: "image_url";
        image_url: string | {
            url: string;
            detail: "low" | "high" | "auto";
        };
    }>;
    name?: string;
} | {
    role: "assistant";
    content: string | null;
    name?: string;
    tool_calls?: Array<{
        id: string;
        type: "function";
        function: {
            name: string;
            arguments: string;
        };
    }>;
    function_call?: {
        name: string;
        arguments: string;
    };
} | {
    role: "tool";
    tool_call_id: string;
    content: string | null;
} | {
    role: "function";
    content: string;
    name: string;
};
declare const OpenAIChatMessage: {
    /**
     * Creates a system chat message.
     */
    system(content: string): OpenAIChatMessage;
    /**
     * Creates a user chat message. The message can be a string or a multi-modal input.
     */
    user(content: string | Array<TextPart | ImagePart>, options?: {
        name?: string;
    }): OpenAIChatMessage;
    /**
     * Creates an assistant chat message.
     * The assistant message can optionally contain tool calls
     * or a function call (function calls are deprecated).
     */
    assistant(content: string | null, options?: {
        functionCall?: {
            name: string;
            arguments: string;
        } | undefined;
        toolCalls?: Array<ToolCall<string, unknown>> | null | undefined;
    } | undefined): OpenAIChatMessage;
    /**
     * Creates a function result chat message for tool call results.
     *
     * @deprecated OpenAI functions are deprecated in favor of tools.
     */
    fn({ fnName, content, }: {
        fnName: string;
        content: unknown;
    }): OpenAIChatMessage;
    /**
     * Creates a tool result chat message with the result of a tool call.
     */
    tool({ toolCallId, content, }: {
        toolCallId: string;
        content: unknown;
    }): OpenAIChatMessage;
};

interface AbstractOpenAIChatSettings extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    model: string;
    functions?: Array<{
        name: string;
        description?: string;
        parameters: unknown;
    }>;
    functionCall?: "none" | "auto" | {
        name: string;
    };
    tools?: Array<{
        type: "function";
        function: {
            name: string;
            description?: string;
            parameters: unknown;
        };
    }>;
    toolChoice?: "none" | "auto" | {
        type: "function";
        function: {
            name: string;
        };
    };
    /**
     * `temperature`: Controls the randomness and creativity in the model's responses.
     * A lower temperature (close to 0) results in more predictable, conservative text, while a higher temperature (close to 1) produces more varied and creative output.
     * Adjust this to balance between consistency and creativity in the model's replies.
     * Example: temperature: 0.5
     */
    temperature?: number;
    /**
     *  This parameter sets a threshold for token selection based on probability.
     * The model will only consider the most likely tokens that cumulatively exceed this threshold while generating a response.
     * It's a way to control the randomness of the output, balancing between diverse responses and sticking to more likely words.
     * This means a topP of .1 will be far less random than one at .9
     * Example: topP: 0.2
     */
    topP?: number;
    /**
     * Used to set the initial state for the random number generator in the model.
     * Providing a specific seed value ensures consistent outputs for the same inputs across different runs - useful for testing and reproducibility.
     * A `null` value (or not setting it) results in varied, non-repeatable outputs each time.
     * Example: seed: 89 (or) seed: null
     */
    seed?: number | null;
    /**
     * Discourages the model from repeating the same information or context already mentioned in the conversation or prompt.
     * Increasing this value encourages the model to introduce new topics or ideas, rather than reiterating what has been said.
     * This is useful for maintaining a diverse and engaging conversation or for brainstorming sessions where varied ideas are needed.
     * Example: presencePenalty: 1.0 // Strongly discourages repeating the same content.
     */
    presencePenalty?: number;
    /**
     * This parameter reduces the likelihood of the model repeatedly using the same words or phrases in its responses.
     * A higher frequency penalty promotes a wider variety of language and expressions in the output.
     * This is particularly useful in creative writing or content generation tasks where diversity in language is desirable.
     * Example: frequencyPenalty: 0.5 // Moderately discourages repetitive language.
     */
    frequencyPenalty?: number;
    responseFormat?: {
        type?: "text" | "json_object";
    };
    logitBias?: Record<number, number>;
    isUserIdForwardingEnabled?: boolean;
}
type OpenAIChatPrompt = OpenAIChatMessage[];
/**
 * Abstract text generation model that calls an API that is compatible with the OpenAI chat API.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 */
declare abstract class AbstractOpenAIChatModel<SETTINGS extends AbstractOpenAIChatSettings> extends AbstractModel<SETTINGS> {
    constructor(settings: SETTINGS);
    callAPI<RESULT>(messages: OpenAIChatPrompt, callOptions: FunctionCallOptions, options: {
        responseFormat: OpenAIChatResponseFormatType<RESULT>;
        functions?: AbstractOpenAIChatSettings["functions"];
        functionCall?: AbstractOpenAIChatSettings["functionCall"];
        tools?: AbstractOpenAIChatSettings["tools"];
        toolChoice?: AbstractOpenAIChatSettings["toolChoice"];
    }): Promise<RESULT>;
    doGenerateTexts(prompt: OpenAIChatPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "chat.completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            object: "chat.completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    processTextGenerationResponse(rawResponse: OpenAIChatResponse): {
        rawResponse: {
            object: "chat.completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        textGenerationResults: {
            text: string;
            finishReason: TextGenerationFinishReason;
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    private translateFinishReason;
    doStreamText(prompt: OpenAIChatPrompt, options: FunctionCallOptions): Promise<AsyncIterable<Delta<{
        object: string;
        id: string;
        created: number;
        choices: {
            delta: {
                role?: "user" | "assistant" | undefined;
                content?: string | null | undefined;
                function_call?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                tool_calls?: {
                    function: {
                        name: string;
                        arguments: string;
                    };
                    type: "function";
                    id: string;
                }[] | undefined;
            };
            index: number;
            finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
        }[];
        model?: string | undefined;
        system_fingerprint?: string | null | undefined;
    }>>>;
    extractTextDelta(delta: unknown): string | undefined;
    doGenerateToolCall(tool: ToolDefinition<string, unknown>, prompt: OpenAIChatPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "chat.completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        toolCall: {
            id: string;
            args: unknown;
        } | null;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    doGenerateToolCalls(tools: Array<ToolDefinition<string, unknown>>, prompt: OpenAIChatPrompt, options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "chat.completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        text: string | null;
        toolCalls: {
            id: string;
            name: string;
            args: unknown;
        }[] | null;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    extractUsage(response: OpenAIChatResponse): {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
declare const openAIChatResponseSchema: z.ZodObject<{
    id: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        message: z.ZodObject<{
            role: z.ZodLiteral<"assistant">;
            content: z.ZodNullable<z.ZodString>;
            function_call: z.ZodOptional<z.ZodObject<{
                name: z.ZodString;
                arguments: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                arguments: string;
            }, {
                name: string;
                arguments: string;
            }>>;
            tool_calls: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                type: z.ZodLiteral<"function">;
                function: z.ZodObject<{
                    name: z.ZodString;
                    arguments: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    arguments: string;
                }, {
                    name: string;
                    arguments: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }, {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        }, {
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        }>;
        index: z.ZodOptional<z.ZodNumber>;
        logprobs: z.ZodNullable<z.ZodAny>;
        finish_reason: z.ZodNullable<z.ZodOptional<z.ZodEnum<["stop", "length", "tool_calls", "content_filter", "function_call"]>>>;
    }, "strip", z.ZodTypeAny, {
        message: {
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index?: number | undefined;
        logprobs?: any;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }, {
        message: {
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index?: number | undefined;
        logprobs?: any;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }>, "many">;
    created: z.ZodNumber;
    model: z.ZodString;
    system_fingerprint: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    object: z.ZodLiteral<"chat.completion">;
    usage: z.ZodObject<{
        prompt_tokens: z.ZodNumber;
        completion_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    }, {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    }>;
}, "strip", z.ZodTypeAny, {
    object: "chat.completion";
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    id: string;
    created: number;
    choices: {
        message: {
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index?: number | undefined;
        logprobs?: any;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }[];
    system_fingerprint?: string | null | undefined;
}, {
    object: "chat.completion";
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    id: string;
    created: number;
    choices: {
        message: {
            role: "assistant";
            content: string | null;
            function_call?: {
                name: string;
                arguments: string;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index?: number | undefined;
        logprobs?: any;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }[];
    system_fingerprint?: string | null | undefined;
}>;
type OpenAIChatResponse = z.infer<typeof openAIChatResponseSchema>;
declare const openaiChatChunkSchema: z.ZodObject<{
    object: z.ZodString;
    id: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        delta: z.ZodObject<{
            role: z.ZodOptional<z.ZodEnum<["assistant", "user"]>>;
            content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            function_call: z.ZodOptional<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                arguments: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name?: string | undefined;
                arguments?: string | undefined;
            }, {
                name?: string | undefined;
                arguments?: string | undefined;
            }>>;
            tool_calls: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                type: z.ZodLiteral<"function">;
                function: z.ZodObject<{
                    name: z.ZodString;
                    arguments: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    arguments: string;
                }, {
                    name: string;
                    arguments: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }, {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        }, {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        }>;
        finish_reason: z.ZodOptional<z.ZodNullable<z.ZodEnum<["stop", "length", "tool_calls", "content_filter", "function_call"]>>>;
        index: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        delta: {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }, {
        delta: {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }>, "many">;
    created: z.ZodNumber;
    model: z.ZodOptional<z.ZodString>;
    system_fingerprint: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    object: string;
    id: string;
    created: number;
    choices: {
        delta: {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }[];
    model?: string | undefined;
    system_fingerprint?: string | null | undefined;
}, {
    object: string;
    id: string;
    created: number;
    choices: {
        delta: {
            role?: "user" | "assistant" | undefined;
            content?: string | null | undefined;
            function_call?: {
                name?: string | undefined;
                arguments?: string | undefined;
            } | undefined;
            tool_calls?: {
                function: {
                    name: string;
                    arguments: string;
                };
                type: "function";
                id: string;
            }[] | undefined;
        };
        index: number;
        finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
    }[];
    model?: string | undefined;
    system_fingerprint?: string | null | undefined;
}>;
type OpenAIChatChunk = z.infer<typeof openaiChatChunkSchema>;
type OpenAIChatResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
declare const OpenAIChatResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: boolean;
        handler: ResponseHandler<{
            object: "chat.completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        }>;
    };
    /**
     * Returns an async iterable over the text deltas (only the tex different of the first choice).
     */
    deltaIterable: {
        stream: boolean;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<Delta<{
            object: string;
            id: string;
            created: number;
            choices: {
                delta: {
                    role?: "user" | "assistant" | undefined;
                    content?: string | null | undefined;
                    function_call?: {
                        name?: string | undefined;
                        arguments?: string | undefined;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index: number;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            model?: string | undefined;
            system_fingerprint?: string | null | undefined;
        }>>>;
    };
};

interface AbstractOpenAICompletionModelSettings extends TextGenerationModelSettings {
    api?: ApiConfiguration;
    model: string;
    suffix?: string;
    temperature?: number;
    topP?: number;
    logprobs?: number;
    echo?: boolean;
    presencePenalty?: number;
    frequencyPenalty?: number;
    bestOf?: number;
    logitBias?: Record<number, number>;
    seed?: number | null;
    isUserIdForwardingEnabled?: boolean;
}
/**
 * Abstract completion model that calls an API that is compatible with the OpenAI completions API.
 *
 * @see https://platform.openai.com/docs/api-reference/completions/create
 */
declare abstract class AbstractOpenAICompletionModel<SETTINGS extends AbstractOpenAICompletionModelSettings> extends AbstractModel<SETTINGS> {
    constructor(settings: SETTINGS);
    callAPI<RESULT>(prompt: string, callOptions: FunctionCallOptions, options: {
        responseFormat: OpenAITextResponseFormatType<RESULT>;
    }): Promise<RESULT>;
    doGenerateTexts(prompt: string, options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "text_completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                text: string;
                index: number;
                finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
                logprobs?: any;
            }[];
            system_fingerprint?: string | undefined;
        };
        textGenerationResults: {
            finishReason: TextGenerationFinishReason;
            text: string;
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    restoreGeneratedTexts(rawResponse: unknown): {
        rawResponse: {
            object: "text_completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                text: string;
                index: number;
                finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
                logprobs?: any;
            }[];
            system_fingerprint?: string | undefined;
        };
        textGenerationResults: {
            finishReason: TextGenerationFinishReason;
            text: string;
        }[];
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    };
    private processTextGenerationResponse;
    private translateFinishReason;
    doStreamText(prompt: string, options: FunctionCallOptions): Promise<AsyncIterable<Delta<{
        object: "text_completion";
        model: string;
        id: string;
        created: number;
        choices: {
            text: string;
            index: number;
            finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
        }[];
        system_fingerprint?: string | undefined;
    }>>>;
    extractTextDelta(delta: unknown): string | undefined;
    withJsonOutput(): this;
}
declare const OpenAICompletionResponseSchema: z.ZodObject<{
    id: z.ZodString;
    choices: z.ZodArray<z.ZodObject<{
        finish_reason: z.ZodNullable<z.ZodOptional<z.ZodEnum<["stop", "length", "content_filter"]>>>;
        index: z.ZodNumber;
        logprobs: z.ZodNullable<z.ZodAny>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        index: number;
        finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
        logprobs?: any;
    }, {
        text: string;
        index: number;
        finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
        logprobs?: any;
    }>, "many">;
    created: z.ZodNumber;
    model: z.ZodString;
    system_fingerprint: z.ZodOptional<z.ZodString>;
    object: z.ZodLiteral<"text_completion">;
    usage: z.ZodObject<{
        prompt_tokens: z.ZodNumber;
        completion_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    }, {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    }>;
}, "strip", z.ZodTypeAny, {
    object: "text_completion";
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    id: string;
    created: number;
    choices: {
        text: string;
        index: number;
        finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
        logprobs?: any;
    }[];
    system_fingerprint?: string | undefined;
}, {
    object: "text_completion";
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    id: string;
    created: number;
    choices: {
        text: string;
        index: number;
        finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
        logprobs?: any;
    }[];
    system_fingerprint?: string | undefined;
}>;
type OpenAICompletionResponse = z.infer<typeof OpenAICompletionResponseSchema>;
type OpenAITextResponseFormatType<T> = {
    stream: boolean;
    handler: ResponseHandler<T>;
};
declare const OpenAITextResponseFormat: {
    /**
     * Returns the response as a JSON object.
     */
    json: {
        stream: boolean;
        handler: ResponseHandler<{
            object: "text_completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                text: string;
                index: number;
                finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
                logprobs?: any;
            }[];
            system_fingerprint?: string | undefined;
        }>;
    };
    /**
     * Returns an async iterable over the full deltas (all choices, including full current state at time of event)
     * of the response stream.
     */
    deltaIterable: {
        stream: boolean;
        handler: ({ response }: {
            response: Response;
        }) => Promise<AsyncIterable<Delta<{
            object: "text_completion";
            model: string;
            id: string;
            created: number;
            choices: {
                text: string;
                index: number;
                finish_reason?: "length" | "stop" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | undefined;
        }>>>;
    };
};

interface AbstractOpenAITextEmbeddingModelSettings extends EmbeddingModelSettings {
    api?: ApiConfiguration;
    model: string;
    dimensions?: number;
    maxValuesPerCall?: number | undefined;
    isUserIdForwardingEnabled?: boolean;
}
/**
 * Abstract text embedding model that calls an API that is compatible with the OpenAI embedding API.
 *
 * @see https://platform.openai.com/docs/api-reference/embeddings
 */
declare abstract class AbstractOpenAITextEmbeddingModel<SETTINGS extends AbstractOpenAITextEmbeddingModelSettings> extends AbstractModel<SETTINGS> {
    constructor(settings: SETTINGS);
    get maxValuesPerCall(): number;
    readonly isParallelizable = true;
    callAPI(texts: Array<string>, callOptions: FunctionCallOptions): Promise<OpenAITextEmbeddingResponse>;
    doEmbedValues(texts: string[], callOptions: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "list";
            model: string;
            data: {
                object: "embedding";
                embedding: number[];
                index: number;
            }[];
            usage?: {
                prompt_tokens: number;
                total_tokens: number;
            } | undefined;
        };
        embeddings: number[][];
    }>;
}
declare const openAITextEmbeddingResponseSchema$1: z.ZodObject<{
    object: z.ZodLiteral<"list">;
    data: z.ZodArray<z.ZodObject<{
        object: z.ZodLiteral<"embedding">;
        embedding: z.ZodArray<z.ZodNumber, "many">;
        index: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        object: "embedding";
        embedding: number[];
        index: number;
    }, {
        object: "embedding";
        embedding: number[];
        index: number;
    }>, "many">;
    model: z.ZodString;
    usage: z.ZodOptional<z.ZodObject<{
        prompt_tokens: z.ZodNumber;
        total_tokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        prompt_tokens: number;
        total_tokens: number;
    }, {
        prompt_tokens: number;
        total_tokens: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    object: "list";
    model: string;
    data: {
        object: "embedding";
        embedding: number[];
        index: number;
    }[];
    usage?: {
        prompt_tokens: number;
        total_tokens: number;
    } | undefined;
}, {
    object: "list";
    model: string;
    data: {
        object: "embedding";
        embedding: number[];
        index: number;
    }[];
    usage?: {
        prompt_tokens: number;
        total_tokens: number;
    } | undefined;
}>;
type OpenAITextEmbeddingResponse = z.infer<typeof openAITextEmbeddingResponseSchema$1>;

type AzureOpenAIApiConfigurationOptions = {
    resourceName: string;
    deploymentId: string;
    apiVersion: string;
    apiKey?: string;
    retry?: RetryFunction;
    throttle?: ThrottleFunction;
};
/**
 * Configuration for the Azure OpenAI API. This class is responsible for constructing URLs specific to the Azure OpenAI deployment.
 * It creates URLs of the form
 * `https://[resourceName].openai.azure.com/openai/deployments/[deploymentId]/[path]?api-version=[apiVersion]`
 *
 * @see https://learn.microsoft.com/en-us/azure/ai-services/openai/reference
 */
declare class AzureOpenAIApiConfiguration extends AbstractApiConfiguration {
    readonly resourceName: string;
    readonly deploymentId: string;
    readonly apiVersion: string;
    readonly fixedHeaderValue: Record<string, string>;
    constructor({ resourceName, deploymentId, apiVersion, apiKey, retry, throttle, }: AzureOpenAIApiConfigurationOptions);
    assembleUrl(path: string): string;
    fixedHeaders(): Record<string, string>;
}

/**
 * Creates an API configuration for the OpenAI API.
 * It calls the API at https://api.openai.com/v1 and uses the `OPENAI_API_KEY` env variable by default.
 */
declare class OpenAIApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}

declare class OpenAIChatFunctionCallObjectGenerationModel<PROMPT_TEMPLATE extends TextGenerationPromptTemplate<unknown, OpenAIChatPrompt>> implements ObjectStreamingModel<Parameters<PROMPT_TEMPLATE["format"]>[0], // first argument of the function
OpenAIChatSettings> {
    readonly model: OpenAIChatModel;
    readonly fnName: string;
    readonly fnDescription?: string;
    readonly promptTemplate: PROMPT_TEMPLATE;
    constructor({ model, fnName, fnDescription, promptTemplate, }: {
        model: OpenAIChatModel;
        fnName: string;
        fnDescription?: string;
        promptTemplate: PROMPT_TEMPLATE;
    });
    get modelInformation(): ModelInformation;
    get settings(): {
        fnName: string;
        fnDescription: string | undefined;
        model: OpenAIChatModelType;
        api?: ApiConfiguration | undefined;
        functions?: {
            name: string;
            description?: string | undefined;
            parameters: unknown;
        }[] | undefined;
        functionCall?: "auto" | {
            name: string;
        } | "none" | undefined;
        tools?: {
            type: "function";
            function: {
                name: string;
                description?: string | undefined;
                parameters: unknown;
            };
        }[] | undefined;
        toolChoice?: "auto" | "none" | {
            type: "function";
            function: {
                name: string;
            };
        } | undefined;
        temperature?: number | undefined;
        topP?: number | undefined;
        seed?: number | null | undefined;
        presencePenalty?: number | undefined;
        frequencyPenalty?: number | undefined;
        responseFormat?: {
            type?: "text" | "json_object" | undefined;
        } | undefined;
        logitBias?: Record<number, number> | undefined;
        isUserIdForwardingEnabled?: boolean | undefined;
        maxGenerationTokens?: number | undefined;
        stopSequences?: string[] | undefined;
        numberOfGenerations?: number | undefined;
        trimWhitespace?: boolean | undefined;
        observers?: FunctionObserver[] | undefined;
    };
    get settingsForEvent(): {
        fnName: string;
        fnDescription: string | undefined;
        model?: OpenAIChatModelType | undefined;
        api?: ApiConfiguration | undefined;
        functions?: {
            name: string;
            description?: string | undefined;
            parameters: unknown;
        }[] | undefined;
        functionCall?: "auto" | {
            name: string;
        } | "none" | undefined;
        tools?: {
            type: "function";
            function: {
                name: string;
                description?: string | undefined;
                parameters: unknown;
            };
        }[] | undefined;
        toolChoice?: "auto" | "none" | {
            type: "function";
            function: {
                name: string;
            };
        } | undefined;
        temperature?: number | undefined;
        topP?: number | undefined;
        seed?: number | null | undefined;
        presencePenalty?: number | undefined;
        frequencyPenalty?: number | undefined;
        responseFormat?: {
            type?: "text" | "json_object" | undefined;
        } | undefined;
        logitBias?: Record<number, number> | undefined;
        isUserIdForwardingEnabled?: boolean | undefined;
        maxGenerationTokens?: number | undefined;
        stopSequences?: string[] | undefined;
        numberOfGenerations?: number | undefined;
        trimWhitespace?: boolean | undefined;
        observers?: FunctionObserver[] | undefined;
    };
    /**
     * Returns this model with a text prompt template.
     */
    withTextPrompt(): OpenAIChatFunctionCallObjectGenerationModel<TextGenerationPromptTemplate<string, OpenAIChatPrompt>>;
    /**
     * Returns this model with an instruction prompt template.
     */
    withInstructionPrompt(): OpenAIChatFunctionCallObjectGenerationModel<TextGenerationPromptTemplate<InstructionPrompt, OpenAIChatPrompt>>;
    /**
     * Returns this model with a chat prompt template.
     */
    withChatPrompt(): OpenAIChatFunctionCallObjectGenerationModel<TextGenerationPromptTemplate<ChatPrompt, OpenAIChatPrompt>>;
    withPromptTemplate<TARGET_PROMPT_FORMAT extends TextGenerationPromptTemplate<unknown, OpenAIChatPrompt>>(promptTemplate: TARGET_PROMPT_FORMAT): OpenAIChatFunctionCallObjectGenerationModel<TARGET_PROMPT_FORMAT>;
    withSettings(additionalSettings: Partial<OpenAIChatSettings>): this;
    /**
     * JSON generation uses the OpenAI GPT function calling API.
     * It provides a single function specification and instructs the model to provide parameters for calling the function.
     * The result is returned as parsed JSON.
     *
     * @see https://platform.openai.com/docs/guides/gpt/function-calling
     */
    doGenerateObject(schema: Schema<unknown> & JsonSchemaProducer, prompt: Parameters<PROMPT_TEMPLATE["format"]>[0], // first argument of the function
    options: FunctionCallOptions): Promise<{
        rawResponse: {
            object: "chat.completion";
            model: string;
            usage: {
                prompt_tokens: number;
                completion_tokens: number;
                total_tokens: number;
            };
            id: string;
            created: number;
            choices: {
                message: {
                    role: "assistant";
                    content: string | null;
                    function_call?: {
                        name: string;
                        arguments: string;
                    } | undefined;
                    tool_calls?: {
                        function: {
                            name: string;
                            arguments: string;
                        };
                        type: "function";
                        id: string;
                    }[] | undefined;
                };
                index?: number | undefined;
                logprobs?: any;
                finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
            }[];
            system_fingerprint?: string | null | undefined;
        };
        valueText: string;
        value: any;
        usage: {
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    }>;
    doStreamObject(schema: Schema<unknown> & JsonSchemaProducer, prompt: Parameters<PROMPT_TEMPLATE["format"]>[0], // first argument of the function
    options: FunctionCallOptions): Promise<AsyncIterable<Delta<{
        object: string;
        id: string;
        created: number;
        choices: {
            delta: {
                role?: "user" | "assistant" | undefined;
                content?: string | null | undefined;
                function_call?: {
                    name?: string | undefined;
                    arguments?: string | undefined;
                } | undefined;
                tool_calls?: {
                    function: {
                        name: string;
                        arguments: string;
                    };
                    type: "function";
                    id: string;
                }[] | undefined;
            };
            index: number;
            finish_reason?: "length" | "stop" | "function_call" | "tool_calls" | "content_filter" | null | undefined;
        }[];
        model?: string | undefined;
        system_fingerprint?: string | null | undefined;
    }>>>;
    extractObjectTextDelta(delta: unknown): string | undefined;
    parseAccumulatedObjectText(accumulatedText: string): unknown;
}

/**
 * @see https://platform.openai.com/docs/models/
 * @see https://openai.com/pricing
 */
declare const OPENAI_TEXT_GENERATION_MODELS: {
    "gpt-3.5-turbo-instruct": {
        contextWindowSize: number;
    };
};
declare function getOpenAICompletionModelInformation(model: OpenAICompletionModelType): {
    contextWindowSize: number;
};
type OpenAICompletionModelType = keyof typeof OPENAI_TEXT_GENERATION_MODELS;
interface OpenAICompletionModelSettings extends AbstractOpenAICompletionModelSettings {
    model: OpenAICompletionModelType;
}
/**
 * Create a text generation model that calls the OpenAI text completion API.
 *
 * @see https://platform.openai.com/docs/api-reference/completions/create
 *
 * @example
 * const model = new OpenAICompletionModel({
 *   model: "gpt-3.5-turbo-instruct",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const text = await generateText(
 *   model,
 *   "Write a short story about a robot learning to love:\n\n"
 * );
 */
declare class OpenAICompletionModel extends AbstractOpenAICompletionModel<OpenAICompletionModelSettings> implements TextStreamingBaseModel<string, OpenAICompletionModelSettings> {
    constructor(settings: OpenAICompletionModelSettings);
    readonly provider: "openai";
    get modelName(): "gpt-3.5-turbo-instruct";
    readonly contextWindowSize: number;
    readonly tokenizer: TikTokenTokenizer;
    countPromptTokens(input: string): Promise<number>;
    get settingsForEvent(): Partial<OpenAICompletionModelSettings>;
    withTextPrompt(): PromptTemplateTextStreamingModel<string, string, OpenAICompletionModelSettings, this>;
    withInstructionPrompt(): PromptTemplateTextStreamingModel<InstructionPrompt, string, OpenAICompletionModelSettings, this>;
    withChatPrompt(options?: {
        user?: string;
        assistant?: string;
    }): PromptTemplateTextStreamingModel<ChatPrompt, string, OpenAICompletionModelSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, string>): PromptTemplateTextStreamingModel<INPUT_PROMPT, string, OpenAICompletionModelSettings, this>;
    withSettings(additionalSettings: Partial<OpenAICompletionModelSettings>): this;
}

declare const OPENAI_TEXT_EMBEDDING_MODELS: {
    "text-embedding-3-small": {
        contextWindowSize: number;
        dimensions: number;
    };
    "text-embedding-3-large": {
        contextWindowSize: number;
        dimensions: number;
    };
    "text-embedding-ada-002": {
        contextWindowSize: number;
        dimensions: number;
    };
};
type OpenAITextEmbeddingModelType = keyof typeof OPENAI_TEXT_EMBEDDING_MODELS;
interface OpenAITextEmbeddingModelSettings extends AbstractOpenAITextEmbeddingModelSettings {
    model: OpenAITextEmbeddingModelType;
}
declare const openAITextEmbeddingResponseSchema: z$1.ZodObject<{
    object: z$1.ZodLiteral<"list">;
    data: z$1.ZodArray<z$1.ZodObject<{
        object: z$1.ZodLiteral<"embedding">;
        embedding: z$1.ZodArray<z$1.ZodNumber, "many">;
        index: z$1.ZodNumber;
    }, "strip", z$1.ZodTypeAny, {
        object: "embedding";
        embedding: number[];
        index: number;
    }, {
        object: "embedding";
        embedding: number[];
        index: number;
    }>, "many">;
    model: z$1.ZodString;
    usage: z$1.ZodOptional<z$1.ZodObject<{
        prompt_tokens: z$1.ZodNumber;
        total_tokens: z$1.ZodNumber;
    }, "strip", z$1.ZodTypeAny, {
        prompt_tokens: number;
        total_tokens: number;
    }, {
        prompt_tokens: number;
        total_tokens: number;
    }>>;
}, "strip", z$1.ZodTypeAny, {
    object: "list";
    model: string;
    data: {
        object: "embedding";
        embedding: number[];
        index: number;
    }[];
    usage?: {
        prompt_tokens: number;
        total_tokens: number;
    } | undefined;
}, {
    object: "list";
    model: string;
    data: {
        object: "embedding";
        embedding: number[];
        index: number;
    }[];
    usage?: {
        prompt_tokens: number;
        total_tokens: number;
    } | undefined;
}>;
/**
 * Create a text embedding model that calls the OpenAI embedding API.
 *
 * @see https://platform.openai.com/docs/api-reference/embeddings
 *
 * @example
 * const embeddings = await embedMany(
 *   new OpenAITextEmbeddingModel({ model: "text-embedding-ada-002" }),
 *   [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * );
 */
declare class OpenAITextEmbeddingModel extends AbstractOpenAITextEmbeddingModel<OpenAITextEmbeddingModelSettings> implements EmbeddingModel<string, OpenAITextEmbeddingModelSettings> {
    constructor(settings: OpenAITextEmbeddingModelSettings);
    readonly provider: "openai";
    get modelName(): "text-embedding-3-small" | "text-embedding-3-large" | "text-embedding-ada-002";
    readonly dimensions: number;
    readonly tokenizer: TikTokenTokenizer;
    readonly contextWindowSize: number;
    countTokens(input: string): Promise<number>;
    get settingsForEvent(): Partial<OpenAITextEmbeddingModelSettings>;
    withSettings(additionalSettings: OpenAITextEmbeddingModelSettings): this;
}

type TikTokenTokenizerSettings = {
    model: OpenAIChatBaseModelType | OpenAICompletionModelType | OpenAITextEmbeddingModelType;
};
/**
 * TikToken tokenizer for OpenAI language models.
 *
 * @see https://github.com/openai/tiktoken
 *
 * @example
 * const tokenizer = new TikTokenTokenizer({ model: "gpt-4" });
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 */
declare class TikTokenTokenizer implements FullTokenizer {
    /**
     * Get a TikToken tokenizer for a specific model or encoding.
     */
    constructor(settings: TikTokenTokenizerSettings);
    private readonly tiktoken;
    tokenize(text: string): Promise<number[]>;
    tokenizeWithTexts(text: string): Promise<{
        tokens: number[];
        tokenTexts: string[];
    }>;
    detokenize(tokens: number[]): Promise<string>;
}

declare const CHAT_MODEL_CONTEXT_WINDOW_SIZES: {
    readonly "gpt-4": 8192;
    readonly "gpt-4o": 128000;
    readonly "gpt-4-0314": 8192;
    readonly "gpt-4-0613": 8192;
    readonly "gpt-4-turbo-preview": 128000;
    readonly "gpt-4-1106-preview": 128000;
    readonly "gpt-4-0125-preview": 128000;
    readonly "gpt-4-vision-preview": 128000;
    readonly "gpt-4-32k": 32768;
    readonly "gpt-4-32k-0314": 32768;
    readonly "gpt-4-32k-0613": 32768;
    readonly "gpt-3.5-turbo": 4096;
    readonly "gpt-3.5-turbo-0125": 16385;
    readonly "gpt-3.5-turbo-1106": 16385;
    readonly "gpt-3.5-turbo-0301": 4096;
    readonly "gpt-3.5-turbo-0613": 4096;
    readonly "gpt-3.5-turbo-16k": 16384;
    readonly "gpt-3.5-turbo-16k-0613": 16384;
};
declare function getOpenAIChatModelInformation(model: OpenAIChatModelType): {
    baseModel: OpenAIChatBaseModelType;
    isFineTuned: boolean;
    contextWindowSize: number;
};
type FineTuneableOpenAIChatModelType = `gpt-3.5-turbo` | `gpt-3.5-turbo-0613` | `gpt-4-0613` | `gpt-4o`;
type FineTunedOpenAIChatModelType = `ft:${FineTuneableOpenAIChatModelType}:${string}:${string}:${string}`;
type OpenAIChatBaseModelType = keyof typeof CHAT_MODEL_CONTEXT_WINDOW_SIZES;
type OpenAIChatModelType = OpenAIChatBaseModelType | FineTunedOpenAIChatModelType;
interface OpenAIChatSettings extends AbstractOpenAIChatSettings {
    model: OpenAIChatModelType;
}
/**
 * Create a text generation model that calls the OpenAI chat API.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 *
 * @example
 * const model = new OpenAIChatModel({
 *   model: "gpt-3.5-turbo",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 * });
 *
 * const text = await generateText([
 *   model,
 *   openai.ChatMessage.system(
 *     "Write a short story about a robot learning to love:"
 *   ),
 * ]);
 */
declare class OpenAIChatModel extends AbstractOpenAIChatModel<OpenAIChatSettings> implements TextStreamingBaseModel<OpenAIChatPrompt, OpenAIChatSettings>, ToolCallGenerationModel<OpenAIChatPrompt, OpenAIChatSettings>, ToolCallsGenerationModel<OpenAIChatPrompt, OpenAIChatSettings> {
    constructor(settings: OpenAIChatSettings);
    readonly provider: "openai";
    get modelName(): OpenAIChatModelType;
    readonly contextWindowSize: number;
    readonly tokenizer: TikTokenTokenizer;
    /**
     * Counts the prompt tokens required for the messages. This includes the message base tokens
     * and the prompt base tokens.
     */
    countPromptTokens(messages: OpenAIChatPrompt): Promise<number>;
    get settingsForEvent(): Partial<OpenAIChatSettings>;
    asFunctionCallObjectGenerationModel({ fnName, fnDescription, }: {
        fnName: string;
        fnDescription?: string;
    }): OpenAIChatFunctionCallObjectGenerationModel<TextGenerationPromptTemplate<OpenAIChatPrompt, OpenAIChatPrompt>>;
    asObjectGenerationModel<INPUT_PROMPT, OpenAIChatPrompt>(promptTemplate: ObjectFromTextPromptTemplate<INPUT_PROMPT, OpenAIChatPrompt> | FlexibleObjectFromTextPromptTemplate<INPUT_PROMPT, unknown>): ObjectFromTextStreamingModel<INPUT_PROMPT, unknown, TextStreamingModel<unknown, TextGenerationModelSettings>> | ObjectFromTextStreamingModel<INPUT_PROMPT, OpenAIChatPrompt, TextStreamingModel<OpenAIChatPrompt, TextGenerationModelSettings>>;
    withTextPrompt(): PromptTemplateFullTextModel<string, OpenAIChatPrompt, OpenAIChatSettings, this>;
    withInstructionPrompt(): PromptTemplateFullTextModel<InstructionPrompt, OpenAIChatPrompt, OpenAIChatSettings, this>;
    withChatPrompt(): PromptTemplateFullTextModel<ChatPrompt, OpenAIChatPrompt, OpenAIChatSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, OpenAIChatPrompt>): PromptTemplateFullTextModel<INPUT_PROMPT, OpenAIChatPrompt, OpenAIChatSettings, this>;
    withJsonOutput(): this;
    withSettings(additionalSettings: Partial<OpenAIChatSettings>): this;
}

declare const openAIErrorDataSchema: z.ZodObject<{
    error: z.ZodObject<{
        message: z.ZodString;
        type: z.ZodString;
        param: z.ZodNullable<z.ZodAny>;
        code: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        code: string | null;
        type: string;
        param?: any;
    }, {
        message: string;
        code: string | null;
        type: string;
        param?: any;
    }>;
}, "strip", z.ZodTypeAny, {
    error: {
        message: string;
        code: string | null;
        type: string;
        param?: any;
    };
}, {
    error: {
        message: string;
        code: string | null;
        type: string;
        param?: any;
    };
}>;
type OpenAIErrorData = z.infer<typeof openAIErrorDataSchema>;

interface OpenAIImageGenerationCallSettings {
    model: "dall-e-2" | "dall-e-3";
    size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792";
    quality?: "standard" | "hd";
    style?: "vivid" | "natural";
}
interface OpenAIImageGenerationSettings extends ImageGenerationModelSettings, OpenAIImageGenerationCallSettings {
    api?: ApiConfiguration;
    isUserIdForwardingEnabled?: boolean;
}
/**
 * Create an image generation model that calls the OpenAI AI image creation API.
 *
 * @see https://platform.openai.com/docs/api-reference/images/create
 *
 * @example
 * const image = await generateImage(
 *   new OpenAIImageGenerationModel({ size: "512x512" }),
 *   "the wicked witch of the west in the style of early 19th century painting"
 * );
 */
declare class OpenAIImageGenerationModel extends AbstractModel<OpenAIImageGenerationSettings> implements ImageGenerationModel<string, OpenAIImageGenerationSettings> {
    constructor(settings: OpenAIImageGenerationSettings);
    readonly provider: "openai";
    get modelName(): "dall-e-2" | "dall-e-3";
    callAPI<RESULT>(prompt: string, callOptions: FunctionCallOptions, options: {
        responseFormat: OpenAIImageGenerationResponseFormatType<RESULT>;
    }): Promise<RESULT>;
    get settingsForEvent(): Partial<OpenAIImageGenerationSettings>;
    doGenerateImages(prompt: string, options: FunctionCallOptions): Promise<{
        rawResponse: {
            data: {
                b64_json: string;
            }[];
            created: number;
        };
        base64Images: string[];
    }>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: PromptTemplate<INPUT_PROMPT, string>): PromptTemplateImageGenerationModel<INPUT_PROMPT, string, OpenAIImageGenerationSettings, this>;
    withSettings(additionalSettings: Partial<OpenAIImageGenerationSettings>): this;
}
type OpenAIImageGenerationResponseFormatType<T> = {
    type: "b64_json" | "url";
    handler: ResponseHandler<T>;
};
declare const openAIImageGenerationUrlSchema: z.ZodObject<{
    created: z.ZodNumber;
    data: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
    }, {
        url: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    data: {
        url: string;
    }[];
    created: number;
}, {
    data: {
        url: string;
    }[];
    created: number;
}>;
type OpenAIImageGenerationUrlResponse = z.infer<typeof openAIImageGenerationUrlSchema>;
declare const openAIImageGenerationBase64JsonSchema: z.ZodObject<{
    created: z.ZodNumber;
    data: z.ZodArray<z.ZodObject<{
        b64_json: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        b64_json: string;
    }, {
        b64_json: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    data: {
        b64_json: string;
    }[];
    created: number;
}, {
    data: {
        b64_json: string;
    }[];
    created: number;
}>;
type OpenAIImageGenerationBase64JsonResponse = z.infer<typeof openAIImageGenerationBase64JsonSchema>;
declare const OpenAIImageGenerationResponseFormat: {
    url: {
        type: "url";
        handler: ResponseHandler<{
            data: {
                url: string;
            }[];
            created: number;
        }>;
    };
    base64Json: {
        type: "b64_json";
        handler: ResponseHandler<{
            data: {
                b64_json: string;
            }[];
            created: number;
        }>;
    };
};

type OpenAISpeechVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
type OpenAISpeechModelResponseFormat = "mp3" | "opus" | "aac" | "flac";
type OpenAISpeechModelType = "tts-1" | "tts-1-hd";
interface OpenAISpeechModelSettings extends SpeechGenerationModelSettings {
    api?: ApiConfiguration;
    voice: OpenAISpeechVoice;
    model: OpenAISpeechModelType;
    /**
     * The speed of the generated audio. Select a value from 0.25 to 4.0. 1.0 is the default.
     */
    speed?: number;
    /**
     * Defaults to mp3.
     */
    responseFormat?: OpenAISpeechModelResponseFormat;
}
/**
 * Synthesize speech using the OpenAI API.
 *
 * @see https://platform.openai.com/docs/api-reference/audio/createSpeech
 */
declare class OpenAISpeechModel extends AbstractModel<OpenAISpeechModelSettings> implements SpeechGenerationModel<OpenAISpeechModelSettings> {
    constructor(settings: OpenAISpeechModelSettings);
    readonly provider: "openai";
    get voice(): OpenAISpeechVoice;
    get modelName(): OpenAISpeechModelType;
    private callAPI;
    get settingsForEvent(): Partial<OpenAISpeechModelSettings>;
    doGenerateSpeechStandard(text: string, options: FunctionCallOptions): Promise<Uint8Array>;
    withSettings(additionalSettings: Partial<OpenAISpeechModelSettings>): this;
}

type OpenAITranscriptionModelType = "whisper-1";
interface OpenAITranscriptionModelSettings extends TranscriptionModelSettings {
    api?: ApiConfiguration;
    /**
     * ID of the model to use. Only whisper-1 is currently available.
     */
    model: OpenAITranscriptionModelType;
    /**
     * The language of the input audio. Supplying the input language in ISO-639-1 format will improve accuracy and latency.
     */
    language?: string;
    /**
     * The sampling temperature, between 0 and 1.
     * Higher values like 0.8 will make the output more random,
     * while lower values like 0.2 will make it more focused and deterministic.
     * If set to 0, the model will use log probability to automatically
     * increase the temperature until certain thresholds are hit.
     */
    temperature?: number;
    /**
     * An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.
     */
    prompt?: string;
}
/**
 * Create a transcription model that calls the OpenAI transcription API.
 *
 * @see https://platform.openai.com/docs/api-reference/audio/create
 *
 * @example
 * const data = await fs.promises.readFile("data/test.mp3");
 *
 * const transcription = await transcribe(
 *   new OpenAITranscriptionModel({ model: "whisper-1" }),
 *   {
 *     type: "mp3",
 *     data,
 *   }
 * );
 */
declare class OpenAITranscriptionModel extends AbstractModel<OpenAITranscriptionModelSettings> implements TranscriptionModel<OpenAITranscriptionModelSettings> {
    constructor(settings: OpenAITranscriptionModelSettings);
    readonly provider: "openai";
    get modelName(): "whisper-1";
    doTranscribe({ audioData, mimeType, }: {
        audioData: DataContent;
        mimeType: string;
    }, options: FunctionCallOptions): Promise<{
        rawResponse: {
            text: string;
            duration: number;
            language: string;
            task: "transcribe";
            segments: {
                text: string;
                id: number;
                temperature: number;
                tokens: number[];
                start: number;
                seek: number;
                end: number;
                avg_logprob: number;
                compression_ratio: number;
                no_speech_prob: number;
                transient?: boolean | undefined;
            }[];
        };
        transcription: string;
    }>;
    callAPI<RESULT>(input: {
        fileExtension: string;
        audioData: Uint8Array;
    }, callOptions: FunctionCallOptions, options: {
        responseFormat: OpenAITranscriptionResponseFormatType<RESULT>;
    }): Promise<RESULT>;
    get settingsForEvent(): Partial<OpenAITranscriptionModelSettings>;
    withSettings(additionalSettings: OpenAITranscriptionModelSettings): this;
}
declare const openAITranscriptionJsonSchema: z.ZodObject<{
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
}, {
    text: string;
}>;
type OpenAITranscriptionJsonResponse = z.infer<typeof openAITranscriptionJsonSchema>;
declare const openAITranscriptionVerboseJsonSchema: z.ZodObject<{
    task: z.ZodLiteral<"transcribe">;
    language: z.ZodString;
    duration: z.ZodNumber;
    segments: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        seek: z.ZodNumber;
        start: z.ZodNumber;
        end: z.ZodNumber;
        text: z.ZodString;
        tokens: z.ZodArray<z.ZodNumber, "many">;
        temperature: z.ZodNumber;
        avg_logprob: z.ZodNumber;
        compression_ratio: z.ZodNumber;
        no_speech_prob: z.ZodNumber;
        transient: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        id: number;
        temperature: number;
        tokens: number[];
        start: number;
        seek: number;
        end: number;
        avg_logprob: number;
        compression_ratio: number;
        no_speech_prob: number;
        transient?: boolean | undefined;
    }, {
        text: string;
        id: number;
        temperature: number;
        tokens: number[];
        start: number;
        seek: number;
        end: number;
        avg_logprob: number;
        compression_ratio: number;
        no_speech_prob: number;
        transient?: boolean | undefined;
    }>, "many">;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
    duration: number;
    language: string;
    task: "transcribe";
    segments: {
        text: string;
        id: number;
        temperature: number;
        tokens: number[];
        start: number;
        seek: number;
        end: number;
        avg_logprob: number;
        compression_ratio: number;
        no_speech_prob: number;
        transient?: boolean | undefined;
    }[];
}, {
    text: string;
    duration: number;
    language: string;
    task: "transcribe";
    segments: {
        text: string;
        id: number;
        temperature: number;
        tokens: number[];
        start: number;
        seek: number;
        end: number;
        avg_logprob: number;
        compression_ratio: number;
        no_speech_prob: number;
        transient?: boolean | undefined;
    }[];
}>;
type OpenAITranscriptionVerboseJsonResponse = z.infer<typeof openAITranscriptionVerboseJsonSchema>;
type OpenAITranscriptionResponseFormatType<T> = {
    type: "json" | "text" | "srt" | "verbose_json" | "vtt";
    handler: ResponseHandler<T>;
};
declare const OpenAITranscriptionResponseFormat: {
    json: {
        type: "json";
        handler: ResponseHandler<{
            text: string;
        }>;
    };
    verboseJson: {
        type: "verbose_json";
        handler: ResponseHandler<{
            text: string;
            duration: number;
            language: string;
            task: "transcribe";
            segments: {
                text: string;
                id: number;
                temperature: number;
                tokens: number[];
                start: number;
                seek: number;
                end: number;
                avg_logprob: number;
                compression_ratio: number;
                no_speech_prob: number;
                transient?: boolean | undefined;
            }[];
        }>;
    };
    text: {
        type: "text";
        handler: ResponseHandler<string>;
    };
    srt: {
        type: "srt";
        handler: ResponseHandler<string>;
    };
    vtt: {
        type: "vtt";
        handler: ResponseHandler<string>;
    };
};

/**
 * Creates an API configuration for the OpenAI API.
 * It calls the API at https://api.openai.com/v1 and uses the `OPENAI_API_KEY` env variable by default.
 */
declare function Api$2(settings: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): OpenAIApiConfiguration;
/**
 * Configuration for the Azure OpenAI API. This class is responsible for constructing URLs specific to the Azure OpenAI deployment.
 * It creates URLs of the form
 * `https://[resourceName].openai.azure.com/openai/deployments/[deploymentId]/[path]?api-version=[apiVersion]`
 *
 * @see https://learn.microsoft.com/en-us/azure/ai-services/openai/reference
 */
declare function AzureApi(settings: AzureOpenAIApiConfigurationOptions): AzureOpenAIApiConfiguration;
/**
 * Create a text generation model that calls the OpenAI text completion API.
 *
 * @see https://platform.openai.com/docs/api-reference/completions/create
 *
 * @example
 * const model = openai.CompletionTextGenerator({
 *   model: "gpt-3.5-turbo-instruct",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 *   retry: retryWithExponentialBackoff({ maxTries: 5 }),
 * });
 *
 * const text = await generateText({
 *   model,
 *   prompt: "Write a short story about a robot learning to love:\n\n"
 * });
 *
 * @return A new instance of {@link OpenAICompletionModel}.
 */
declare function CompletionTextGenerator$1(settings: OpenAICompletionModelSettings): OpenAICompletionModel;
/**
 * Create a text generation model that calls the OpenAI chat completion API.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 *
 * @example
 * const model = openai.ChatTextGenerator({
 *   model: "gpt-3.5-turbo",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 * });
 *
 * const text = await generateText({
 *   model,
 *   prompt: [
 *     openai.ChatMessage.system(
 *       "Write a short story about a robot learning to love:"
 *     ),
 *   ]
 * });
 */
declare function ChatTextGenerator$1(settings: OpenAIChatSettings): OpenAIChatModel;
/**
 * Create a text embedding model that calls the OpenAI embedding API.
 *
 * @see https://platform.openai.com/docs/api-reference/embeddings
 *
 * @example
 * const embeddings = await embedMany({
 *   model: openai.TextEmbedder({ model: "text-embedding-ada-002" }),
 *   values: [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * });
 *
 * @returns A new instance of {@link OpenAITextEmbeddingModel}.
 */
declare function TextEmbedder$1(settings: OpenAITextEmbeddingModelSettings): OpenAITextEmbeddingModel;
/**
 * Synthesize speech using the OpenAI API.
 *
 * @see https://platform.openai.com/docs/api-reference/audio/createSpeech
 *
 * @returns A new instance of {@link OpenAISpeechModel}.
 */
declare function SpeechGenerator(settings: OpenAISpeechModelSettings): OpenAISpeechModel;
/**
 * Create a transcription model that calls the OpenAI transcription API.
 *
 * @see https://platform.openai.com/docs/api-reference/audio/create
 *
 * @example
 * const data = await fs.promises.readFile("data/test.mp3");
 *
 * const transcription = await transcribe({
 *   model: openai.Transcriber({ model: "whisper-1" }),
 *   data: {
 *     type: "mp3",
 *     data,
 *   }
 * });
 *
 * @returns A new instance of {@link OpenAITranscriptionModel}.
 */
declare function Transcriber$1(settings: OpenAITranscriptionModelSettings): OpenAITranscriptionModel;
/**
 * Create an image generation model that calls the OpenAI AI image creation API.
 *
 * @see https://platform.openai.com/docs/api-reference/images/create
 *
 * @example
 * const image = await generateImage({
 *   model: new OpenAIImageGenerationModel({ size: "512x512" }),
 *   prompt: "the wicked witch of the west in the style of early 19th century painting"
 * });
 *
 * @returns A new instance of {@link OpenAIImageGenerationModel}.
 */
declare function ImageGenerator$1(settings: OpenAIImageGenerationSettings): OpenAIImageGenerationModel;
/**
 * Creates a TikToken tokenizer for OpenAI language models.
 *
 * @see https://github.com/openai/tiktoken
 *
 * @example
 * const tokenizer = openai.Tokenizer({ model: "gpt-4" });
 *
 * const text = "At first, Nox didn't know what to do with the pup.";
 *
 * const tokenCount = await countTokens(tokenizer, text);
 * const tokens = await tokenizer.tokenize(text);
 * const tokensAndTokenTexts = await tokenizer.tokenizeWithTexts(text);
 * const reconstructedText = await tokenizer.detokenize(tokens);
 *
 * @returns A new instance of {@link TikTokenTokenizer}.
 */
declare function Tokenizer(settings: TikTokenTokenizerSettings): TikTokenTokenizer;

declare const OpenAIFacade_AzureApi: typeof AzureApi;
declare const OpenAIFacade_SpeechGenerator: typeof SpeechGenerator;
declare const OpenAIFacade_Tokenizer: typeof Tokenizer;
declare namespace OpenAIFacade {
  export { Api$2 as Api, OpenAIFacade_AzureApi as AzureApi, OpenAIChatMessage as ChatMessage, type OpenAIChatPrompt as ChatPrompt, ChatTextGenerator$1 as ChatTextGenerator, CompletionTextGenerator$1 as CompletionTextGenerator, ImageGenerator$1 as ImageGenerator, OpenAIFacade_SpeechGenerator as SpeechGenerator, TextEmbedder$1 as TextEmbedder, OpenAIFacade_Tokenizer as Tokenizer, Transcriber$1 as Transcriber };
}

/**
 * Prompt tokens that are included automatically for every full
 * chat prompt (several messages) that is sent to OpenAI.
 */
declare const OPENAI_CHAT_PROMPT_BASE_TOKEN_COUNT = 2;
/**
 * Prompt tokens that are included automatically for every
 * message that is sent to OpenAI.
 */
declare const OPENAI_CHAT_MESSAGE_BASE_TOKEN_COUNT = 5;
declare function countOpenAIChatMessageTokens({ message, model, }: {
    message: OpenAIChatMessage;
    model: OpenAIChatModelType;
}): Promise<number>;
declare function countOpenAIChatPromptTokens({ messages, model, }: {
    messages: OpenAIChatMessage[];
    model: OpenAIChatModelType;
}): Promise<number>;

type OpenAICompatibleProviderName = `openaicompatible` | `openaicompatible-${string}`;
interface OpenAICompatibleApiConfiguration extends ApiConfiguration {
    provider?: OpenAICompatibleProviderName;
}

/**
 * Configuration for the Fireworks.ai API.
 *
 * It calls the API at https://api.fireworks.ai/inference/v1 and uses the `FIREWORKS_API_KEY` api key environment variable.
 *
 * @see https://readme.fireworks.ai/docs/openai-compatibility
 */
declare class FireworksAIApiConfiguration extends BaseUrlApiConfigurationWithDefaults implements OpenAICompatibleApiConfiguration {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
    readonly provider = "openaicompatible-fireworksai";
}

interface OpenAICompatibleChatSettings extends AbstractOpenAIChatSettings {
    api: OpenAICompatibleApiConfiguration;
    provider?: OpenAICompatibleProviderName;
}
/**
 * Create a text generation model that calls an API that is compatible with OpenAI's chat API.
 *
 * Please note that many providers implement the API with slight differences, which can cause
 * unexpected errors and different behavior in less common scenarios.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 */
declare class OpenAICompatibleChatModel extends AbstractOpenAIChatModel<OpenAICompatibleChatSettings> implements TextStreamingBaseModel<OpenAIChatPrompt, OpenAICompatibleChatSettings>, ToolCallGenerationModel<OpenAIChatPrompt, OpenAICompatibleChatSettings>, ToolCallsGenerationModel<OpenAIChatPrompt, OpenAICompatibleChatSettings> {
    constructor(settings: OpenAICompatibleChatSettings);
    get provider(): OpenAICompatibleProviderName;
    get modelName(): string;
    readonly contextWindowSize: undefined;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    get settingsForEvent(): Partial<OpenAICompatibleChatSettings>;
    asObjectGenerationModel<INPUT_PROMPT, OpenAIChatPrompt>(promptTemplate: ObjectFromTextPromptTemplate<INPUT_PROMPT, OpenAIChatPrompt> | FlexibleObjectFromTextPromptTemplate<INPUT_PROMPT, unknown>): ObjectFromTextStreamingModel<INPUT_PROMPT, unknown, TextStreamingModel<unknown, TextGenerationModelSettings>> | ObjectFromTextStreamingModel<INPUT_PROMPT, OpenAIChatPrompt, TextStreamingModel<OpenAIChatPrompt, TextGenerationModelSettings>>;
    withTextPrompt(): PromptTemplateFullTextModel<string, OpenAIChatPrompt, OpenAICompatibleChatSettings, this>;
    withInstructionPrompt(): PromptTemplateFullTextModel<InstructionPrompt, OpenAIChatPrompt, OpenAICompatibleChatSettings, this>;
    withChatPrompt(): PromptTemplateFullTextModel<ChatPrompt, OpenAIChatPrompt, OpenAICompatibleChatSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, OpenAIChatPrompt>): PromptTemplateFullTextModel<INPUT_PROMPT, OpenAIChatPrompt, OpenAICompatibleChatSettings, this>;
    withJsonOutput(): this;
    withSettings(additionalSettings: Partial<OpenAICompatibleChatSettings>): this;
}

interface OpenAICompatibleCompletionModelSettings extends AbstractOpenAICompletionModelSettings {
    api: OpenAICompatibleApiConfiguration;
    provider?: OpenAICompatibleProviderName;
}
/**
 * Create a text generation model that calls an API that is compatible with OpenAI's completion API.
 *
 * Please note that many providers implement the API with slight differences, which can cause
 * unexpected errors and different behavior in less common scenarios.
 *
 * @see https://platform.openai.com/docs/api-reference/completions/create
 */
declare class OpenAICompatibleCompletionModel extends AbstractOpenAICompletionModel<OpenAICompatibleCompletionModelSettings> implements TextStreamingBaseModel<string, OpenAICompatibleCompletionModelSettings> {
    constructor(settings: OpenAICompatibleCompletionModelSettings);
    get provider(): OpenAICompatibleProviderName;
    get modelName(): string;
    readonly contextWindowSize: undefined;
    readonly tokenizer: undefined;
    readonly countPromptTokens: undefined;
    get settingsForEvent(): Partial<OpenAICompatibleCompletionModelSettings>;
    withTextPrompt(): PromptTemplateTextStreamingModel<string, string, OpenAICompatibleCompletionModelSettings, this>;
    withInstructionPrompt(): PromptTemplateTextStreamingModel<InstructionPrompt, string, OpenAICompatibleCompletionModelSettings, this>;
    withChatPrompt(options?: {
        user?: string;
        assistant?: string;
    }): PromptTemplateTextStreamingModel<ChatPrompt, string, OpenAICompatibleCompletionModelSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: TextGenerationPromptTemplate<INPUT_PROMPT, string>): PromptTemplateTextStreamingModel<INPUT_PROMPT, string, OpenAICompatibleCompletionModelSettings, this>;
    withSettings(additionalSettings: Partial<OpenAICompatibleCompletionModelSettings>): this;
}

interface OpenAICompatibleTextEmbeddingModelSettings extends AbstractOpenAITextEmbeddingModelSettings {
    api: OpenAICompatibleApiConfiguration;
    provider?: OpenAICompatibleProviderName;
    model: string;
    dimensions?: number;
}
declare class OpenAICompatibleTextEmbeddingModel extends AbstractOpenAITextEmbeddingModel<OpenAICompatibleTextEmbeddingModelSettings> implements EmbeddingModel<string, OpenAICompatibleTextEmbeddingModelSettings> {
    constructor(settings: OpenAICompatibleTextEmbeddingModelSettings);
    get provider(): OpenAICompatibleProviderName;
    get modelName(): string;
    get dimensions(): number | undefined;
    get settingsForEvent(): Partial<OpenAICompatibleTextEmbeddingModelSettings>;
    withSettings(additionalSettings: OpenAICompatibleTextEmbeddingModelSettings): this;
}

/**
 * Configuration for the Perplexity API.
 *
 * It calls the API at https://api.perplexity.ai/ and uses the `PERPLEXITY_API_KEY` api key environment variable.
 *
 * @see https://docs.perplexity.ai/reference/post_chat_completions
 */
declare class PerplexityApiConfiguration extends BaseUrlApiConfigurationWithDefaults implements OpenAICompatibleApiConfiguration {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
    readonly provider = "openaicompatible-perplexity";
}

/**
 * Configuration for the Together.ai API.
 *
 * It calls the API at https://api.together.xyz/v1 and uses the `TOGETHER_API_KEY` api key environment variable.
 *
 * @see https://docs.together.ai/docs/openai-api-compatibility
 */
declare class TogetherAIApiConfiguration extends BaseUrlApiConfigurationWithDefaults implements OpenAICompatibleApiConfiguration {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
    readonly provider = "openaicompatible-togetherai";
}

/**
 * Configuration for the Fireworks.ai API.
 *
 * It calls the API at https://api.fireworks.ai/inference/v1 and uses the `FIREWORKS_API_KEY` api key environment variable.
 *
 * @see https://readme.fireworks.ai/docs/openai-compatibility
 */
declare function FireworksAIApi(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): FireworksAIApiConfiguration;
/**
 * Configuration for the Perplexity API.
 *
 * It calls the API at https://api.perplexity.ai/ and uses the `PERPLEXITY_API_KEY` api key environment variable.
 *
 * @see https://docs.perplexity.ai/reference/post_chat_completions
 */
declare function PerplexityApi(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): PerplexityApiConfiguration;
/**
 * Configuration for the Together.ai API.
 *
 * It calls the API at https://api.together.xyz/v1 and uses the `TOGETHER_API_KEY` api key environment variable.
 *
 * @see https://docs.together.ai/docs/openai-api-compatibility
 */
declare function TogetherAIApi(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
    apiKey?: string;
}): TogetherAIApiConfiguration;
/**
 * Create a text generation model that calls an API that is compatible with OpenAI's completion API.
 *
 * Please note that many providers implement the API with slight differences, which can cause
 * unexpected errors and different behavior in less common scenarios.
 *
 * @see https://platform.openai.com/docs/api-reference/completions/create
 *
 * @example
 * ```ts
 * const model = openaicompatible.CompletionTextGenerator({
 *   model: "provider-specific-model-name",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 * });
 *
 * const text = await generateText({
 *   model,
 *   prompt: "Write a short story about a robot learning to love:"
 * });
 * ```
 */
declare function CompletionTextGenerator(settings: OpenAICompatibleChatSettings): OpenAICompatibleCompletionModel;
/**
 * Create a text generation model that calls an API that is compatible with OpenAI's chat API.
 *
 * Please note that many providers implement the API with slight differences, which can cause
 * unexpected errors and different behavior in less common scenarios.
 *
 * @see https://platform.openai.com/docs/api-reference/chat/create
 *
 * @example
 * ```ts
 * const model = openaicompatible.ChatTextGenerator({
 *   model: "provider-specific-model-name",
 *   temperature: 0.7,
 *   maxGenerationTokens: 500,
 * });
 *
 * const text = await generateText({
 *   model,
 *   prompt: [
 *     openai.ChatMessage.user(
 *       "Write a short story about a robot learning to love:"
 *     ),
 *   ]
 * });
 * ```
 */
declare function ChatTextGenerator(settings: OpenAICompatibleChatSettings): OpenAICompatibleChatModel;
/**
 * Create a text embedding model that calls the OpenAI embedding API.
 *
 * @see https://platform.openai.com/docs/api-reference/embeddings
 *
 * @example
 * const embeddings = await embedMany({
 *   model: openaicompatible.TextEmbedder({ model: "provider-specific-model-name" }),
 *   values: [
 *     "At first, Nox didn't know what to do with the pup.",
 *     "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
 *   ]
 * });
 *
 * @returns A new instance of {@link OpenAITextEmbeddingModel}.
 */
declare function TextEmbedder(settings: OpenAICompatibleTextEmbeddingModelSettings): OpenAICompatibleTextEmbeddingModel;

declare const OpenAICompatibleFacade_ChatTextGenerator: typeof ChatTextGenerator;
declare const OpenAICompatibleFacade_CompletionTextGenerator: typeof CompletionTextGenerator;
declare const OpenAICompatibleFacade_FireworksAIApi: typeof FireworksAIApi;
declare const OpenAICompatibleFacade_PerplexityApi: typeof PerplexityApi;
declare const OpenAICompatibleFacade_TextEmbedder: typeof TextEmbedder;
declare const OpenAICompatibleFacade_TogetherAIApi: typeof TogetherAIApi;
declare namespace OpenAICompatibleFacade {
  export { OpenAICompatibleFacade_ChatTextGenerator as ChatTextGenerator, OpenAICompatibleFacade_CompletionTextGenerator as CompletionTextGenerator, OpenAICompatibleFacade_FireworksAIApi as FireworksAIApi, OpenAICompatibleFacade_PerplexityApi as PerplexityApi, OpenAICompatibleFacade_TextEmbedder as TextEmbedder, OpenAICompatibleFacade_TogetherAIApi as TogetherAIApi };
}

/**
 * Creates an API configuration for the Stability AI API.
 * It calls the API at https://api.stability.ai/v1 by default and uses the `STABILITY_API_KEY` environment variable.
 */
declare class StabilityApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions & {
        apiKey?: string;
    });
}

declare const stabilityErrorDataSchema: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
type StabilityErrorData = z.infer<typeof stabilityErrorDataSchema>;

type StabilityImageGenerationPrompt = Array<{
    text: string;
    weight?: number;
}>;
/**
 * Formats a basic text prompt as a Stability prompt.
 */
declare function mapBasicPromptToStabilityFormat(): PromptTemplate<string, StabilityImageGenerationPrompt>;

declare const stabilityImageGenerationModels: readonly ["stable-diffusion-v1-6", "stable-diffusion-xl-1024-v1-0"];
type StabilityImageGenerationModelType = (typeof stabilityImageGenerationModels)[number] | (string & {});
type StabilityImageGenerationStylePreset = "3d-model" | "analog-film" | "anime" | "cinematic" | "comic-book" | "digital-art" | "enhance" | "fantasy-art" | "isometric" | "line-art" | "low-poly" | "modeling-compound" | "neon-punk" | "origami" | "photographic" | "pixel-art" | "tile-texture";
type StabilityImageGenerationSampler = "DDIM" | "DDPM" | "K_DPMPP_2M" | "K_DPMPP_2S_ANCESTRAL" | "K_DPM_2" | "K_DPM_2_ANCESTRAL" | "K_EULER" | "K_EULER_ANCESTRAL" | "K_HEUN" | "K_LMS";
type StabilityClipGuidancePreset = "FAST_BLUE" | "FAST_GREEN" | "NONE" | "SIMPLE" | "SLOW" | "SLOWER" | "SLOWEST";
interface StabilityImageGenerationSettings extends ImageGenerationModelSettings {
    api?: ApiConfiguration;
    model: StabilityImageGenerationModelType;
    height?: number;
    width?: number;
    /**
     * How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)
     */
    cfgScale?: number;
    clipGuidancePreset?: StabilityClipGuidancePreset;
    /**
     * Which sampler to use for the diffusion process.
     * If this value is omitted we'll automatically select an appropriate sampler for you.
     */
    sampler?: StabilityImageGenerationSampler;
    /**
     * Random noise seed (omit this option or use 0 for a random seed).
     */
    seed?: number;
    /**
     * Number of diffusion steps to run.
     */
    steps?: number;
    /**
     * Pass in a style preset to guide the image model towards a particular style.
     */
    stylePreset?: StabilityImageGenerationStylePreset;
}
/**
 * Create an image generation model that calls the Stability AI image generation API.
 *
 * @see https://api.stability.ai/docs#tag/v1generation/operation/textToImage
 *
 * @example
 * const image = await generateImage(
 *   stability.ImageGenerator({
 *     model: "stable-diffusion-v1-6",
 *     cfgScale: 7,
 *     clipGuidancePreset: "FAST_BLUE",
 *     height: 512,
 *     width: 512,
 *     steps: 30,
 *   })
 *   [
 *     { text: "the wicked witch of the west" },
 *     { text: "style of early 19th century painting", weight: 0.5 },
 *   ]
 * );
 */
declare class StabilityImageGenerationModel extends AbstractModel<StabilityImageGenerationSettings> implements ImageGenerationModel<StabilityImageGenerationPrompt, StabilityImageGenerationSettings> {
    constructor(settings: StabilityImageGenerationSettings);
    readonly provider: "stability";
    get modelName(): StabilityImageGenerationModelType;
    callAPI(input: StabilityImageGenerationPrompt, callOptions: FunctionCallOptions): Promise<StabilityImageGenerationResponse>;
    get settingsForEvent(): Partial<StabilityImageGenerationSettings>;
    doGenerateImages(prompt: StabilityImageGenerationPrompt, callOptions: FunctionCallOptions): Promise<{
        rawResponse: {
            artifacts: {
                base64: string;
                finishReason: "ERROR" | "SUCCESS" | "CONTENT_FILTERED";
                seed: number;
            }[];
        };
        base64Images: string[];
    }>;
    withTextPrompt(): PromptTemplateImageGenerationModel<string, StabilityImageGenerationPrompt, StabilityImageGenerationSettings, this>;
    withPromptTemplate<INPUT_PROMPT>(promptTemplate: PromptTemplate<INPUT_PROMPT, StabilityImageGenerationPrompt>): PromptTemplateImageGenerationModel<INPUT_PROMPT, StabilityImageGenerationPrompt, StabilityImageGenerationSettings, this>;
    withSettings(additionalSettings: Partial<StabilityImageGenerationSettings>): this;
}
declare const stabilityImageGenerationResponseSchema: z.ZodObject<{
    artifacts: z.ZodArray<z.ZodObject<{
        base64: z.ZodString;
        seed: z.ZodNumber;
        finishReason: z.ZodEnum<["SUCCESS", "ERROR", "CONTENT_FILTERED"]>;
    }, "strip", z.ZodTypeAny, {
        base64: string;
        finishReason: "ERROR" | "SUCCESS" | "CONTENT_FILTERED";
        seed: number;
    }, {
        base64: string;
        finishReason: "ERROR" | "SUCCESS" | "CONTENT_FILTERED";
        seed: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    artifacts: {
        base64: string;
        finishReason: "ERROR" | "SUCCESS" | "CONTENT_FILTERED";
        seed: number;
    }[];
}, {
    artifacts: {
        base64: string;
        finishReason: "ERROR" | "SUCCESS" | "CONTENT_FILTERED";
        seed: number;
    }[];
}>;
type StabilityImageGenerationResponse = z.infer<typeof stabilityImageGenerationResponseSchema>;

/**
 * Creates an API configuration for the Stability AI API.
 * It calls the API at https://api.stability.ai/v1 by default and uses the `STABILITY_API_KEY` environment variable.
 */
declare function Api$1(settings: Partial<BaseUrlPartsApiConfigurationOptions> & {
    apiKey?: string;
}): StabilityApiConfiguration;
/**
 * Create an image generation model that calls the Stability AI image generation API.
 *
 * @see https://api.stability.ai/docs#tag/v1generation/operation/textToImage
 *
 * @example
 * const image = await generateImage(
 *   stability.ImageGenerator({
 *     model: "stable-diffusion-v1-6",
 *     cfgScale: 7,
 *     clipGuidancePreset: "FAST_BLUE",
 *     height: 512,
 *     width: 512,
 *     steps: 30,
 *   })
 *   [
 *     { text: "the wicked witch of the west" },
 *     { text: "style of early 19th century painting", weight: 0.5 },
 *   ]
 * );
 *
 * @returns A new instance of {@link StabilityImageGenerationModel}.
 */
declare function ImageGenerator(settings: StabilityImageGenerationSettings): StabilityImageGenerationModel;

declare const StabilityFacade_ImageGenerator: typeof ImageGenerator;
declare namespace StabilityFacade {
  export { Api$1 as Api, StabilityFacade_ImageGenerator as ImageGenerator };
}

/**
 * Creates an API configuration for the Whisper.cpp server.
 * It calls the API at http://127.0.0.1:8080 by default.
 */
declare class WhisperCppApiConfiguration extends BaseUrlApiConfigurationWithDefaults {
    constructor(settings?: PartialBaseUrlPartsApiConfigurationOptions);
}

interface WhisperCppTranscriptionModelSettings extends TranscriptionModelSettings {
    api?: ApiConfiguration;
    temperature?: number;
}
declare class WhisperCppTranscriptionModel extends AbstractModel<WhisperCppTranscriptionModelSettings> implements TranscriptionModel<WhisperCppTranscriptionModelSettings> {
    constructor(settings: WhisperCppTranscriptionModelSettings);
    readonly provider: "whispercpp";
    readonly modelName: null;
    doTranscribe({ audioData, mimeType, }: {
        audioData: DataContent;
        mimeType: string;
    }, options: FunctionCallOptions): Promise<{
        rawResponse: {
            text: string;
        };
        transcription: string;
    }>;
    callAPI(input: {
        fileExtension: string;
        audioData: Uint8Array;
    }, callOptions: FunctionCallOptions): Promise<{
        text: string;
    }>;
    get settingsForEvent(): Partial<WhisperCppTranscriptionModelSettings>;
    withSettings(additionalSettings: WhisperCppTranscriptionModelSettings): this;
}

/**
 * Creates an API configuration for the Whisper.cpp server.
 * It calls the API at http://127.0.0.1:8080 by default.
 */
declare function Api(settings: PartialBaseUrlPartsApiConfigurationOptions): WhisperCppApiConfiguration;
declare function Transcriber(settings?: WhisperCppTranscriptionModelSettings): WhisperCppTranscriptionModel;

declare const WhisperCppFacade_Api: typeof Api;
declare const WhisperCppFacade_Transcriber: typeof Transcriber;
declare namespace WhisperCppFacade {
  export { WhisperCppFacade_Api as Api, WhisperCppFacade_Transcriber as Transcriber };
}

declare class HeliconeOpenAIApiConfiguration extends BaseUrlApiConfiguration {
    constructor({ baseUrl, openAIApiKey, heliconeApiKey, retry, throttle, customCallHeaders, }?: {
        baseUrl?: string;
        openAIApiKey?: string;
        heliconeApiKey?: string;
        retry?: RetryFunction;
        throttle?: ThrottleFunction;
        customCallHeaders?: CustomHeaderProvider;
    });
}

interface Retriever<OBJECT, QUERY> {
    retrieve(query: QUERY, options?: FunctionOptions): Promise<OBJECT[]>;
}

declare function retrieve<OBJECT, QUERY>(retriever: Retriever<OBJECT, QUERY>, query: QUERY, options?: FunctionOptions): Promise<OBJECT[]>;

type TextChunk = {
    text: string;
};

type SplitFunction = (input: {
    text: string;
}, options?: FunctionOptions) => PromiseLike<Array<string>>;

/**
 * Splits text on a separator string.
 */
declare function splitOnSeparator({ separator, }: {
    separator: string;
}): SplitFunction;

/**
 * Splits text recursively until the resulting chunks are smaller than the `maxCharactersPerChunk`.
 * The text is recursively split in the middle, so that all chunks are roughtly the same size.
 */
declare const splitAtCharacter: ({ maxCharactersPerChunk, }: {
    maxCharactersPerChunk: number;
}) => SplitFunction;
/**
 * Splits text recursively until the resulting chunks are smaller than the `maxTokensPerChunk`,
 * while respecting the token boundaries.
 * The text is recursively split in the middle, so that all chunks are roughtly the same size.
 */
declare const splitAtToken: ({ tokenizer, maxTokensPerChunk, }: {
    tokenizer: FullTokenizer;
    maxTokensPerChunk: number;
}) => SplitFunction;

declare function splitTextChunks<CHUNK extends TextChunk>(splitFunction: SplitFunction, inputs: CHUNK[]): Promise<CHUNK[]>;
declare function splitTextChunk<CHUNK extends TextChunk>(splitFunction: SplitFunction, input: CHUNK): Promise<CHUNK[]>;

declare class NoSuchToolDefinitionError extends Error {
    readonly toolName: string;
    readonly cause: unknown;
    readonly parameters: unknown;
    constructor({ toolName, parameters, }: {
        toolName: string;
        parameters: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        toolName: string;
        parameter: unknown;
    };
}

/**
 * A tool is a function with a name, description and defined inputs that can be used
 * by agents and chatbots.
 */
declare class Tool<NAME extends string, PARAMETERS, RESULT> implements ToolDefinition<NAME, PARAMETERS> {
    /**
     * The name of the tool.
     * Should be understandable for language models and unique among the tools that they know.
     */
    readonly name: NAME;
    /**
     * A optional description of what the tool does. Will be used by the language model to decide whether to use the tool.
     */
    readonly description?: string;
    /**
     * The schema of the input that the tool expects. The language model will use this to generate the input.
     * Use descriptions to make the input understandable for the language model.
     */
    readonly parameters: Schema<PARAMETERS> & JsonSchemaProducer;
    /**
     * An optional schema of the output that the tool produces. This will be used to validate the output.
     */
    readonly returnType?: Schema<RESULT>;
    /**
     * The actual execution function of the tool.
     */
    readonly execute: (args: PARAMETERS, options: FunctionCallOptions) => PromiseLike<RESULT>;
    constructor({ name, description, parameters, returnType, execute, }: {
        name: NAME;
        description?: string;
        parameters: Schema<PARAMETERS> & JsonSchemaProducer;
        returnType?: Schema<RESULT>;
        execute(args: PARAMETERS, options?: FunctionOptions): PromiseLike<RESULT>;
    });
}

/**
 * A tool that generates an object. You can configure it with a model, an input, an output schema, and a prompt.
 */
declare class ObjectGeneratorTool<NAME extends string, PROMPT, PARAMETERS, OBJECT> extends Tool<NAME, PARAMETERS, OBJECT> {
    constructor({ name, // eslint-disable-line @typescript-eslint/no-explicit-any
    description, model, parameters, objectSchema, prompt, }: {
        name?: NAME;
        description?: string;
        model: ObjectGenerationModel<PROMPT, ObjectGenerationModelSettings>;
        parameters: Schema<PARAMETERS> & JsonSchemaProducer;
        objectSchema: Schema<OBJECT> & JsonSchemaProducer;
        prompt: (input: PARAMETERS) => PromptFunction<PARAMETERS, PROMPT>;
    });
}

/**
 * Thrown when the arguments of a tool call are invalid.
 *
 * This typically means they don't match the parameters schema that is expected the tool.
 */
declare class ToolCallArgumentsValidationError extends Error {
    readonly toolName: string;
    readonly cause: unknown;
    readonly args: unknown;
    constructor({ toolName, args, cause, }: {
        toolName: string;
        args: unknown;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        toolName: string;
        args: unknown;
    };
}

declare class ToolCallGenerationError extends Error {
    readonly toolName: string;
    readonly cause: unknown;
    constructor({ toolName, cause }: {
        toolName: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        toolName: string;
    };
}

declare class ToolExecutionError extends Error {
    readonly toolName: string;
    readonly input: unknown;
    readonly cause: unknown;
    constructor({ toolName, input, cause, message, }: {
        toolName: string;
        input: unknown;
        cause: unknown | undefined;
        message?: string;
    });
    toJSON(): {
        name: string;
        cause: unknown;
        message: string;
        stack: string | undefined;
        toolName: string;
        input: unknown;
    };
}

declare const RETURN_TYPE_SCHEMA: ZodSchema<{
    results: {
        link: string;
        title: string;
        snippet: string;
    }[];
}>;
type WebSearchToolInput = {
    query: string;
};
type WebSearchToolOutput = {
    results: {
        title: string;
        link: string;
        snippet: string;
    }[];
};
/**
 * A tool for searching the web.
 *
 * The input schema takes a query string.
 * ```ts
 * {
 *   query: "How many people live in Berlin?"
 * }
 * ```
 *
 * The output schema is an array of search results with title, link and snippet.
 * ```ts
 * {
 *  results:
 *   [
 *     {
 *       title: "Berlin - Wikipedia",
 *       link: "https://en.wikipedia.org/wiki/Berlin",
 *       snippet: "Berlin is the capital and largest city of Germany by...",
 *     },
 *     ...
 *   ]
 * }
 * ```
 */
declare class WebSearchTool<NAME extends string> extends Tool<NAME, WebSearchToolInput, WebSearchToolOutput> {
    readonly returnType: typeof RETURN_TYPE_SCHEMA;
    constructor({ name, description, queryDescription, execute, }: {
        name: NAME;
        description?: string;
        queryDescription?: string;
        execute(input: WebSearchToolInput, options?: FunctionOptions): PromiseLike<WebSearchToolOutput>;
    });
}

type ExecuteToolMetadata = {
    callId: string;
    runId?: string;
    sessionId?: string;
    userId?: string;
    functionId?: string;
    startTimestamp: Date;
    finishTimestamp: Date;
    durationInMs: number;
};
/**
 * `executeTool` executes a tool with the given parameters.
 */
declare function executeTool<TOOL extends Tool<any, any, any>>(// eslint-disable-line @typescript-eslint/no-explicit-any
params: {
    tool: TOOL;
    args: TOOL["parameters"]["_type"];
    fullResponse?: false;
} & FunctionOptions): Promise<ReturnType<TOOL["execute"]>>;
declare function executeTool<TOOL extends Tool<any, any, any>>(// eslint-disable-line @typescript-eslint/no-explicit-any
params: {
    tool: TOOL;
    args: TOOL["parameters"]["_type"];
    fullResponse: true;
} & FunctionOptions): Promise<{
    output: Awaited<ReturnType<TOOL["execute"]>>;
    metadata: ExecuteToolMetadata;
}>;

declare class ToolCallParseError extends Error {
    readonly toolName: string;
    readonly valueText: string;
    readonly cause: unknown;
    constructor({ toolName, valueText, cause, }: {
        toolName: string;
        valueText: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        cause: unknown;
        message: string;
        stack: string | undefined;
        toolName: string;
        valueText: string;
    };
}

declare function generateToolCall<PARAMETERS, PROMPT, NAME extends string, SETTINGS extends ToolCallGenerationModelSettings>(params: {
    model: ToolCallGenerationModel<PROMPT, SETTINGS>;
    tool: ToolDefinition<NAME, PARAMETERS>;
    prompt: PROMPT | ((tool: ToolDefinition<NAME, PARAMETERS>) => PROMPT);
    fullResponse?: false;
} & FunctionOptions): Promise<ToolCall<NAME, PARAMETERS>>;
declare function generateToolCall<PARAMETERS, PROMPT, NAME extends string, SETTINGS extends ToolCallGenerationModelSettings>(params: {
    model: ToolCallGenerationModel<PROMPT, SETTINGS>;
    tool: ToolDefinition<NAME, PARAMETERS>;
    prompt: PROMPT | ((tool: ToolDefinition<NAME, PARAMETERS>) => PROMPT);
    fullResponse: true;
} & FunctionOptions): Promise<{
    toolCall: ToolCall<NAME, PARAMETERS>;
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;

declare const jsonToolCallPrompt: {
    text({ toolPrompt, }?: {
        toolPrompt?: ((tool: ToolDefinition<string, unknown>) => string) | undefined;
    }): ToolCallPromptTemplate<string, InstructionPrompt>;
    instruction({ toolPrompt, }?: {
        toolPrompt?: ((tool: ToolDefinition<string, unknown>) => string) | undefined;
    }): ToolCallPromptTemplate<InstructionPrompt, InstructionPrompt>;
};

declare class ToolCallsParseError extends Error {
    readonly valueText: string;
    readonly cause: unknown;
    constructor({ valueText, cause }: {
        valueText: string;
        cause: unknown;
    });
    toJSON(): {
        name: string;
        cause: unknown;
        message: string;
        stack: string | undefined;
        valueText: string;
    };
}

type ToolCallDefinitionArray<T extends ToolDefinition<any, any>[]> = T;
type ToToolCallDefinitionMap<T extends ToolCallDefinitionArray<ToolDefinition<any, any>[]>> = {
    [K in T[number]["name"]]: Extract<T[number], ToolDefinition<K, any>>;
};
type ToToolCallUnion$1<T> = {
    [KEY in keyof T]: T[KEY] extends ToolDefinition<any, infer PARAMETERS> ? {
        id: string;
        name: KEY;
        args: PARAMETERS;
    } : never;
}[keyof T];
type ToOutputValue$1<TOOL_CALLS extends ToolCallDefinitionArray<ToolDefinition<any, any>[]>> = ToToolCallUnion$1<ToToolCallDefinitionMap<TOOL_CALLS>>;
declare function generateToolCalls<TOOLS extends Array<ToolDefinition<any, any>>, PROMPT>(params: {
    model: ToolCallsGenerationModel<PROMPT, ToolCallsGenerationModelSettings>;
    tools: TOOLS;
    prompt: PROMPT | ((tools: TOOLS) => PROMPT);
    fullResponse?: false;
} & FunctionOptions): Promise<{
    text: string | null;
    toolCalls: Array<ToOutputValue$1<TOOLS>> | null;
}>;
declare function generateToolCalls<TOOLS extends ToolDefinition<any, any>[], PROMPT>(params: {
    model: ToolCallsGenerationModel<PROMPT, ToolCallsGenerationModelSettings>;
    tools: TOOLS;
    prompt: PROMPT | ((tools: TOOLS) => PROMPT);
    fullResponse: true;
} & FunctionOptions): Promise<{
    value: {
        text: string | null;
        toolCalls: Array<ToOutputValue$1<TOOLS>>;
    };
    rawResponse: unknown;
    metadata: ModelCallMetadata;
}>;

/**
 * `runTool` uses `generateToolCall` to generate parameters for a tool and
 * then executes the tool with the parameters using `executeTool`.
 *
 * @returns The result contains the name of the tool (`tool` property),
 * the parameters (`parameters` property, typed),
 * and the result of the tool execution (`result` property, typed).
 *
 * @see {@link generateToolCall}
 * @see {@link executeTool}
 */
declare function runTool<PROMPT, TOOL extends Tool<string, any, any>>({ model, tool, prompt, ...options }: {
    model: ToolCallGenerationModel<PROMPT, ToolCallGenerationModelSettings>;
    tool: TOOL;
    prompt: PROMPT | ((tool: TOOL) => PROMPT);
} & FunctionOptions): Promise<ToolCallResult<TOOL["name"], TOOL["parameters"], Awaited<ReturnType<TOOL["execute"]>>>>;

type ToolArray<T extends Tool<any, any, any>[]> = T;
type ToToolMap<T extends ToolArray<Tool<any, any, any>[]>> = {
    [K in T[number]["name"]]: Extract<T[number], Tool<K, any, any>>;
};
type StringKeys<T> = Extract<keyof T, string>;
type ToToolCallUnion<T> = {
    [KEY in StringKeys<T>]: T[KEY] extends Tool<any, infer PARAMETERS, infer OUTPUT> ? ToolCallResult<KEY, PARAMETERS, OUTPUT> : never;
}[StringKeys<T>];
type ToOutputValue<TOOLS extends ToolArray<Tool<any, any, any>[]>> = ToToolCallUnion<ToToolMap<TOOLS>>;
declare function runTools<PROMPT, TOOLS extends Array<Tool<any, any, any>>>({ model, tools, prompt, ...options }: {
    model: ToolCallsGenerationModel<PROMPT, ToolCallsGenerationModelSettings>;
    tools: TOOLS;
    prompt: PROMPT | ((tools: TOOLS) => PROMPT);
} & FunctionOptions): Promise<{
    text: string | null;
    toolResults: Array<ToOutputValue<TOOLS>> | null;
}>;

declare function getAudioFileExtension(mimeType: string): "mp3" | "flac" | "webm" | "wav" | "mp4" | "mpeg" | "ogg" | "m4a";

/**
 * Calculates the cosine similarity between two vectors. They must have the same length.
 *
 * @param a The first vector.
 * @param b The second vector.
 *
 * @returns The cosine similarity between the two vectors.
 *
 * @see https://en.wikipedia.org/wiki/Cosine_similarity
 */
declare function cosineSimilarity(a: number[], b: number[]): number;

declare function delay(delayInMs: number): Promise<void>;

declare function createEventSourceStream(events: AsyncIterable<unknown>): ReadableStream<any>;

interface VectorIndex<DATA, INDEX, FILTER> {
    upsertMany(data: Array<{
        id: string;
        vector: Vector;
        data: DATA;
    }>): Promise<void>;
    queryByVector(options: {
        queryVector: Vector;
        maxResults: number;
        similarityThreshold?: number;
        filter?: FILTER;
    }): Promise<Array<{
        id: string;
        data: DATA;
        similarity?: number;
    }>>;
    asIndex(): INDEX;
}

interface VectorIndexRetrieverSettings<FILTER> {
    maxResults?: number;
    similarityThreshold?: number;
    filter?: FILTER;
}
declare class VectorIndexRetriever<OBJECT, VALUE, INDEX, FILTER> implements Retriever<OBJECT, VALUE> {
    private readonly vectorIndex;
    private readonly embeddingModel;
    private readonly settings;
    constructor({ vectorIndex, embeddingModel, maxResults, similarityThreshold, filter, }: {
        vectorIndex: VectorIndex<OBJECT, INDEX, FILTER>;
        embeddingModel: EmbeddingModel<VALUE, EmbeddingModelSettings>;
    } & VectorIndexRetrieverSettings<FILTER>);
    retrieve(query: VALUE, options?: FunctionOptions): Promise<OBJECT[]>;
    withSettings(additionalSettings: Partial<VectorIndexRetrieverSettings<FILTER>>): this;
}

/**
 * A very simple vector index that stores all entries in memory. Useful when you only have
 * a small number of entries and don't want to set up a real database, e.g. for conversational memory
 * that does not need to be persisted.
 */
declare class MemoryVectorIndex<DATA> implements VectorIndex<DATA, MemoryVectorIndex<DATA>, (value: DATA) => boolean> {
    static deserialize<DATA>({ serializedData, schema, }: {
        serializedData: string;
        schema?: Schema<DATA>;
    }): Promise<MemoryVectorIndex<DATA>>;
    private readonly entries;
    upsertMany(data: Array<{
        id: string;
        vector: Vector;
        data: DATA;
    }>): Promise<void>;
    queryByVector({ queryVector, similarityThreshold, maxResults, filter, }: {
        queryVector: Vector;
        maxResults: number;
        similarityThreshold?: number;
        filter?: (value: DATA) => boolean;
    }): Promise<Array<{
        id: string;
        data: DATA;
        similarity?: number;
    }>>;
    serialize(): string;
    asIndex(): MemoryVectorIndex<DATA>;
}

declare function upsertIntoVectorIndex<VALUE, OBJECT>({ vectorIndex, embeddingModel, generateId, objects, getValueToEmbed, getId, }: {
    vectorIndex: VectorIndex<OBJECT, unknown, unknown>;
    embeddingModel: EmbeddingModel<VALUE, EmbeddingModelSettings>;
    generateId?: () => string;
    objects: OBJECT[];
    getValueToEmbed: (object: OBJECT, index: number) => VALUE;
    getId?: (object: OBJECT, index: number) => string | undefined;
}, options?: FunctionOptions): Promise<void>;

export { AbortError, AbstractOpenAIChatModel, type AbstractOpenAIChatSettings, AbstractOpenAICompletionModel, type AbstractOpenAICompletionModelSettings, AbstractOpenAITextEmbeddingModel, type AbstractOpenAITextEmbeddingModelSettings, AlpacaPromptTemplate as AlpacaPrompt, ApiCallError, type ApiConfiguration, type AssistantContent, AsyncQueue, type AudioMimeType, Automatic1111ApiConfiguration, type Automatic1111ErrorData, Automatic1111ImageGenerationModel, type Automatic1111ImageGenerationPrompt, type Automatic1111ImageGenerationResponse, type Automatic1111ImageGenerationSettings, AzureOpenAIApiConfiguration, type AzureOpenAIApiConfigurationOptions, type BaseFunctionEvent, type BaseFunctionFinishedEvent, type BaseFunctionFinishedEventResult, type BaseFunctionStartedEvent, type BaseModelCallFinishedEvent, type BaseModelCallFinishedEventResult, type BaseModelCallStartedEvent, BaseUrlApiConfiguration, BaseUrlApiConfigurationWithDefaults, type BaseUrlPartsApiConfigurationOptions, type BasicTokenizer, CHAT_MODEL_CONTEXT_WINDOW_SIZES, COHERE_TEXT_EMBEDDING_MODELS, COHERE_TEXT_GENERATION_MODELS, type Cache, ChatMLPromptTemplate as ChatMLPrompt, ChatMessage, type ChatPrompt, type Classifier, type ClassifierSettings, type ClassifyFinishedEvent, type ClassifyFinishedEventResult, type ClassifyStartedEvent, CohereApiConfiguration, type CohereDetokenizationResponse, type CohereErrorData, CohereTextEmbeddingModel, type CohereTextEmbeddingModelSettings, type CohereTextEmbeddingModelType, type CohereTextEmbeddingResponse, CohereTextGenerationModel, type CohereTextGenerationModelSettings, type CohereTextGenerationModelType, type CohereTextGenerationResponse, CohereTextGenerationResponseFormat, type CohereTextGenerationResponseFormatType, type CohereTextStreamChunk, type CohereTokenizationResponse, CohereTokenizer, type CohereTokenizerModelType, type CohereTokenizerSettings, type CustomHeaderProvider, type DataContent, DefaultRun, type Delta, ElevenLabsApiConfiguration, ElevenLabsSpeechModel, type ElevenLabsSpeechModelSettings, type EmbeddingFinishedEvent, type EmbeddingFinishedEventResult, type EmbeddingModel, type EmbeddingModelSettings, EmbeddingSimilarityClassifier, type EmbeddingSimilarityClassifierSettings, type EmbeddingStartedEvent, type ExecuteFunctionFinishedEvent, type ExecuteFunctionStartedEvent, type ExecuteToolFinishedEvent, type ExecuteToolMetadata, type ExecuteToolStartedEvent, FireworksAIApiConfiguration, type FlexibleObjectFromTextPromptTemplate, type FullTokenizer, type FunctionCallOptions, type FunctionEvent, FunctionEventSource, type FunctionObserver, type FunctionOptions, type HasContextWindowSize, type HasTokenizer, type HeaderParameters, HeliconeOpenAIApiConfiguration, HuggingFaceApiConfiguration, type HuggingFaceErrorData, HuggingFaceTextEmbeddingModel, type HuggingFaceTextEmbeddingModelSettings, type HuggingFaceTextEmbeddingResponse, HuggingFaceTextGenerationModel, type HuggingFaceTextGenerationModelSettings, type HuggingFaceTextGenerationResponse, type ImageGenerationFinishedEvent, type ImageGenerationFinishedEventResult, type ImageGenerationModel, type ImageGenerationModelSettings, type ImageGenerationStartedEvent, type ImagePart, type InstructionContent, type InstructionPrompt, InvalidPromptError, JSONParseError, type JsonSchemaProducer, Llama2PromptTemplate as Llama2Prompt, LlamaCppApiConfiguration, LlamaCppCompletionModel, type LlamaCppCompletionModelSettings, type LlamaCppCompletionPrompt, LlamaCppCompletionResponseFormat, type LlamaCppCompletionResponseFormatType, type LlamaCppErrorData, LlamaCppTextEmbeddingModel, type LlamaCppTextEmbeddingModelSettings, type LlamaCppTextEmbeddingResponse, type LlamaCppTextGenerationResponse, type LlamaCppTextStreamChunk, type LlamaCppTokenizationResponse, LlamaCppTokenizer, LmntApiConfiguration, LmntSpeechModel, type LmntSpeechModelSettings, type LmntSpeechResponse, type LogFormat, MemoryCache, MemoryVectorIndex, MistralApiConfiguration, type MistralChatMessage, MistralChatModel, type MistralChatModelSettings, type MistralChatPrompt, type MistralChatResponse, MistralChatResponseFormat, type MistralChatResponseFormatType, type MistralChatStreamChunk, type MistralErrorData, MistralInstructPromptTemplate as MistralInstructPrompt, MistralTextEmbeddingModel, type MistralTextEmbeddingModelSettings, type MistralTextEmbeddingResponse, type Model, type ModelCallFinishedEvent, type ModelCallMetadata, type ModelCallStartedEvent, type ModelInformation, type ModelSettings, NeuralChatPromptTemplate as NeuralChatPrompt, NoSuchToolDefinitionError, OPENAI_CHAT_MESSAGE_BASE_TOKEN_COUNT, OPENAI_CHAT_PROMPT_BASE_TOKEN_COUNT, OPENAI_TEXT_EMBEDDING_MODELS, OPENAI_TEXT_GENERATION_MODELS, ObjectFromTextGenerationModel, type ObjectFromTextPromptTemplate, ObjectFromTextStreamingModel, type ObjectGenerationFinishedEvent, type ObjectGenerationFinishedEventResult, type ObjectGenerationModel, type ObjectGenerationModelSettings, type ObjectGenerationStartedEvent, ObjectGeneratorTool, ObjectParseError, type ObjectStream, ObjectStreamFromResponse, ObjectStreamResponse, type ObjectStreamingFinishedEvent, type ObjectStreamingModel, type ObjectStreamingStartedEvent, ObjectValidationError, OllamaApiConfiguration, type OllamaChatMessage, OllamaChatModel, type OllamaChatModelSettings, type OllamaChatPrompt, type OllamaChatResponse, OllamaChatResponseFormat, type OllamaChatResponseFormatType, type OllamaChatStreamChunk, OllamaCompletionModel, type OllamaCompletionModelSettings, type OllamaCompletionPrompt$1 as OllamaCompletionPrompt, type OllamaCompletionResponse, OllamaCompletionResponseFormat, type OllamaCompletionResponseFormatType, type OllamaCompletionStreamChunk, type OllamaErrorData, OllamaTextEmbeddingModel, type OllamaTextEmbeddingModelSettings, type OllamaTextEmbeddingResponse, type OllamaTextGenerationSettings, OpenAIApiConfiguration, type OpenAIChatBaseModelType, type OpenAIChatChunk, OpenAIChatMessage, OpenAIChatModel, type OpenAIChatModelType, type OpenAIChatPrompt, type OpenAIChatResponse, OpenAIChatResponseFormat, type OpenAIChatResponseFormatType, type OpenAIChatSettings, type OpenAICompatibleApiConfiguration, OpenAICompatibleChatModel, type OpenAICompatibleChatSettings, OpenAICompatibleCompletionModel, type OpenAICompatibleCompletionModelSettings, type OpenAICompatibleProviderName, OpenAICompatibleTextEmbeddingModel, type OpenAICompatibleTextEmbeddingModelSettings, OpenAICompletionModel, type OpenAICompletionModelSettings, type OpenAICompletionModelType, type OpenAICompletionResponse, type OpenAIErrorData, type OpenAIImageGenerationBase64JsonResponse, type OpenAIImageGenerationCallSettings, OpenAIImageGenerationModel, OpenAIImageGenerationResponseFormat, type OpenAIImageGenerationResponseFormatType, type OpenAIImageGenerationSettings, type OpenAIImageGenerationUrlResponse, OpenAISpeechModel, type OpenAISpeechModelSettings, type OpenAISpeechModelType, type OpenAISpeechVoice, OpenAITextEmbeddingModel, type OpenAITextEmbeddingModelSettings, type OpenAITextEmbeddingModelType, type OpenAITextEmbeddingResponse, OpenAITextResponseFormat, type OpenAITextResponseFormatType, type OpenAITranscriptionJsonResponse, OpenAITranscriptionModel, type OpenAITranscriptionModelSettings, OpenAITranscriptionResponseFormat, type OpenAITranscriptionResponseFormatType, type OpenAITranscriptionVerboseJsonResponse, type PartialBaseUrlPartsApiConfigurationOptions, PerplexityApiConfiguration, type PromptFunction, type PromptTemplate, PromptTemplateFullTextModel, PromptTemplateImageGenerationModel, PromptTemplateTextGenerationModel, PromptTemplateTextStreamingModel, type Retriever, RetryError, type RetryErrorReason, type RetryFunction, type Run, type Schema, type SpeechGenerationFinishedEvent, type SpeechGenerationFinishedEventResult, type SpeechGenerationModel, type SpeechGenerationModelSettings, type SpeechGenerationStartedEvent, type SpeechStreamingFinishedEvent, type SpeechStreamingStartedEvent, type SplitFunction, StabilityApiConfiguration, type StabilityClipGuidancePreset, type StabilityErrorData, StabilityImageGenerationModel, type StabilityImageGenerationModelType, type StabilityImageGenerationPrompt, type StabilityImageGenerationResponse, type StabilityImageGenerationSampler, type StabilityImageGenerationSettings, type StabilityImageGenerationStylePreset, type StreamingSpeechGenerationModel, SynthiaPromptTemplate as SynthiaPrompt, type TextChunk, type TextGenerationBaseModel, type TextGenerationFinishReason, type TextGenerationFinishedEvent, type TextGenerationFinishedEventResult, type TextGenerationModel, type TextGenerationModelSettings, type TextGenerationPromptTemplate, type TextGenerationPromptTemplateProvider, type TextGenerationResult, type TextGenerationStartedEvent, TextGenerationToolCallModel, TextGenerationToolCallsModel, type TextPart, TextPromptTemplate as TextPrompt, type TextStreamingBaseModel, type TextStreamingFinishedEvent, type TextStreamingModel, type TextStreamingStartedEvent, type ThrottleFunction, TikTokenTokenizer, type TikTokenTokenizerSettings, TogetherAIApiConfiguration, Tool, type ToolCall, ToolCallArgumentsValidationError, ToolCallError, ToolCallGenerationError, type ToolCallGenerationFinishedEvent, type ToolCallGenerationFinishedEventResult, type ToolCallGenerationModel, type ToolCallGenerationModelSettings, type ToolCallGenerationStartedEvent, ToolCallParseError, type ToolCallPart, type ToolCallPromptTemplate, type ToolCallResult, type ToolCallsGenerationFinishedEvent, type ToolCallsGenerationFinishedEventResult, type ToolCallsGenerationModel, type ToolCallsGenerationModelSettings, type ToolCallsGenerationStartedEvent, ToolCallsParseError, type ToolCallsPromptTemplate, type ToolContent, type ToolDefinition, ToolExecutionError, type ToolResponsePart, type TranscriptionFinishedEvent, type TranscriptionFinishedEventResult, type TranscriptionModel, type TranscriptionModelSettings, type TranscriptionStartedEvent, TypeValidationError, UncheckedSchema, type UpsertIntoVectorIndexFinishedEvent, type UpsertIntoVectorIndexStartedEvent, type UrlParts, type UserContent, type ValueCluster, type Vector, type VectorIndex, VectorIndexRetriever, type VectorIndexRetrieverSettings, VicunaPromptTemplate as VicunaPrompt, WebSearchTool, type WebSearchToolInput, type WebSearchToolOutput, WhisperCppApiConfiguration, WhisperCppTranscriptionModel, type WhisperCppTranscriptionModelSettings, ZodSchema, ApiFacade as api, Automatic1111Facade as automatic1111, classify, CohereFacade as cohere, convertDataContentToBase64String, convertDataContentToUint8Array, cosineSimilarity, countOpenAIChatMessageTokens, countOpenAIChatPromptTokens, countTokens, createChatPrompt, createEventSourceStream, createInstructionPrompt, createTextPrompt, delay, ElevenLabsFacade as elevenlabs, embed, embedMany, executeFunction, executeTool, generateImage, generateObject, generateSpeech, generateText, generateToolCall, generateToolCalls, generateTranscription, getAudioFileExtension, getOpenAIChatModelInformation, getOpenAICompletionModelInformation, getRun, HuggingFaceFacade as huggingface, isPromptFunction, jsonObjectPrompt, jsonToolCallPrompt, LlamaCppFacade as llamacpp, LmntFacade as lmnt, mapBasicPromptToAutomatic1111Format, mapBasicPromptToStabilityFormat, markAsPromptFunction, MistralFacade as mistral, ModelFusionConfiguration as modelfusion, OllamaFacade as ollama, openAITextEmbeddingResponseSchema, OpenAIFacade as openai, OpenAICompatibleFacade as openaicompatible, parseJSON, retrieve, retryNever, retryWithExponentialBackoff, runTool, type runToolFinishedEvent, type runToolStartedEvent, runTools, type runToolsFinishedEvent, type runToolsStartedEvent, safeParseJSON, safeValidateTypes, splitAtCharacter, splitAtToken, splitOnSeparator, splitTextChunk, splitTextChunks, StabilityFacade as stability, streamObject, streamSpeech, streamText, textGenerationModelProperties, throttleMaxConcurrency, throttleOff, trimChatPrompt, uncheckedSchema, upsertIntoVectorIndex, validateContentIsString, validateTypes, WhisperCppFacade as whispercpp, withRun, zodSchema };
