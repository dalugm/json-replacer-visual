import type { Component } from "solid-js";

interface ParseSectionProps {
  label: string;
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  onParseClick: () => void;
}

const ParseSection: Component<ParseSectionProps> = (props) => {
  const handleInput = (
    e: Event & { currentTarget: HTMLTextAreaElement; target: Element },
  ) => {
    props.onValueChange(e.currentTarget.value);
  };

  return (
    <section class="p-4 border border-gray-200 rounded-lg">
      <label
        for={props.id}
        class="block text-base font-semibold mb-2 text-gray-700"
      >
        {props.label}
      </label>
      <textarea
        id={props.id}
        rows="3"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm dark:text-gray-200 dark:bg-gray-800"
        value={props.value}
        onInput={handleInput}
      />
      <button
        onClick={props.onParseClick}
        class="mt-3 w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Parse {props.label}
      </button>
    </section>
  );
};

export default ParseSection;
