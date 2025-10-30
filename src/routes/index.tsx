import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { Component, createSignal, onMount, Show } from "solid-js";
import initWasm, { Processor } from "json-replacer";

import ParseSection from "~/components/ParseSection";

type StatusType = "info" | "success" | "error";
type ProcessMethod = "payload" | "response" | "entity";

type StatusMessage = {
  message: string;
  type: StatusType;
};

const StatusMessage: Component<StatusMessage> = (props) => {
  const statusClasses: Record<StatusType, string> = {
    info: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/50 dark:text-blue-900",
    success:
      "bg-green-50 border-green-200 text-green-700 dark:bg-green-900 dark:text-green-700",
    error:
      "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-900",
  };

  return (
    <Show when={props.message}>
      <div
        class={`p-4 rounded-md font-medium mb-6 ${statusClasses[props.type || "info"]}`}
      >
        {props.message}
      </div>
    </Show>
  );
};

/**
 * Formatter for JSON.stringify.
 */
const jsonReplacer = (_key: string, value: any) => {
  if (value instanceof Map) {
    return Object.fromEntries(value);
  } else {
    return value;
  }
};

export default function Home() {
  const [status, setStatus] = createSignal<StatusMessage>({
    type: "info",
    message: "Loading wasm module...",
  });
  const [isWASMReady, setIsWASMReady] = createSignal(false);
  const [processor, setProcessor] = createSignal<Processor | null>(null);

  const [reference, setReference] = createSignal("");
  const [payload, setPayload] = createSignal("");
  const [response, setResponse] = createSignal("");
  const [objectEntityAttributes, setObjectEntityAttributes] = createSignal("");
  const [result, setResult] = createSignal("");

  onMount(async () => {
    try {
      await initWasm();
      setStatus({
        type: "success",
        message: "WASM module loaded, can initialize processor now",
      });
      setIsWASMReady(true);
    } catch (e: any) {
      setStatus({
        type: "error",
        message: `Failed to load wasm module: ${e.message}`,
      });
      setIsWASMReady(false);
    }
  });

  const handleInit = () => {
    try {
      const data = JSON.parse(reference());
      setProcessor(new Processor(data));
      setStatus({ type: "success", message: "Processor initialized" });
      setResult("Processor initialized");
    } catch (e: any) {
      setStatus({
        type: "error",
        message: `Failed to initialize processor: ${e.message}`,
      });
    }
  };

  const handleProcess = (method: ProcessMethod) => {
    const proc = processor();
    if (!proc) {
      setStatus({ type: "error", message: "Processor is not initialized yet" });
      return;
    }

    let inputJson: string;
    switch (method) {
      case "payload":
        inputJson = payload();
        break;
      case "response":
        inputJson = response();
        break;
      case "entity":
        inputJson = objectEntityAttributes();
        break;
    }

    try {
      const inputData = JSON.parse(inputJson);
      const resultData = proc[method](inputData);

      console.log(resultData);
      setResult(JSON.stringify(resultData, jsonReplacer, 2));
      setStatus({ type: "success", message: `Executed '${method}'` });
    } catch (e: any) {
      setStatus({
        type: "error",
        message: `Failed to execute '${method}': ${e.message}`,
      });
    }
  };

  const onTextAreaInput =
    (setter: (v: string) => void) =>
    (e: Event & { currentTarget: HTMLTextAreaElement; target: Element }) => {
      setter(e.currentTarget.value);
    };

  return (
    <>
      <Title>WASM</Title>
      <main class="text-center mx-auto text-gray-700 p-4">
        <header>
          <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
            WASM processor
          </h1>
        </header>

        <div class="p-6 md:p-8">
          <StatusMessage message={status().message} type={status().type} />

          <Show when={isWASMReady()}>
            <section class="mb-8">
              <label
                for="reference-input"
                class="block text-lg font-semibold mb-3"
              >
                Reference Data
              </label>
              <textarea
                id="reference-input"
                rows="5"
                class="block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm dark:text-gray-200 dark:bg-gray-800"
                placeholder="object_attributes api response"
                value={reference()}
                onInput={onTextAreaInput(setReference)}
              />
              <button
                onClick={handleInit}
                class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {processor() ? "Reload" : "Initialize"} Processor
              </button>
            </section>

            <Show when={processor()}>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ParseSection
                  label="Payload"
                  id="payload-input"
                  value={payload()}
                  onValueChange={setPayload}
                  onParseClick={() => handleProcess("payload")}
                />

                <ParseSection
                  label="Response"
                  id="response-input"
                  value={response()}
                  onValueChange={setResponse}
                  onParseClick={() => handleProcess("response")}
                />

                <ParseSection
                  label="Entity"
                  id="entity-input"
                  value={objectEntityAttributes()}
                  onValueChange={setObjectEntityAttributes}
                  onParseClick={() => handleProcess("entity")}
                />
              </div>
            </Show>

            <section class="mt-8">
              <h2 class="text-xl font-semibold mb-4">Result</h2>
              <div class="bg-gray-900 rounded-lg overflow-hidden">
                <pre class="p-4 text-sm text-left text-gray-200 overflow-x-auto min-h-25">
                  {result()}
                </pre>
              </div>
            </section>
          </Show>
        </div>

        <p class="my-4">
          <span>Home</span>
          {" - "}
          <A href="/about" class="text-sky-600 hover:underline">
            About
          </A>{" "}
        </p>
      </main>
    </>
  );
}
